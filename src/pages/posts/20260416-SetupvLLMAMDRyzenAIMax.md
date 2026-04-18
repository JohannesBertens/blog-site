---
title: 'Running vLLM on AMD Ryzen AI Max+ 395 (Strix Halo) with ROCm'
pubDate: 2026-04-16
description: 'Complete guide to setting up vLLM on the AMD Ryzen AI Max+ 395 with unified memory, using the Strix Halo toolbox and TheRock ROCm nightly builds'
author: 'Johannes'
tags: ['vllm', 'llm', 'amd', 'rocm', 'strix-halo', 'ryzen-ai', 'local-ai', 'linux']
layout: '../../layouts/MarkdownPostLayout.astro'
---

## Introduction

Following my previous guides on [vLLM setup](/posts/20260207-SetupvLLMOnLinux) and [SGLang with MiniMax M2](/posts/20260331-SetupSGLangBlackwellMiniMax), this guide covers a very different kind of hardware: the **AMD Ryzen AI Max+ 395** — codenamed "Strix Halo."

Unlike discrete NVIDIA GPUs, this is an APU with up to **128GB of unified memory**, meaning the integrated Radeon 8060S GPU can access a massive memory pool. This makes it possible to run large models locally without needing a dedicated GPU with massive VRAM. With the right kernel parameters, you can allocate up to 124GB of unified memory to the GPU.

In this guide, I'll walk through setting up vLLM on Fedora using the [amd-strix-halo-vllm-toolboxes](https://github.com/kyuz0/amd-strix-halo-vllm-toolboxes) project by [kyuz0](https://github.com/kyuz0), which provides a pre-configured Toolbx container built on TheRock nightly ROCm builds for the `gfx1151` architecture.

### Why Strix Halo for LLMs?

The Ryzen AI Max+ 395 is a unique chip:

| Specification | Value |
|---|---|
| CPU Cores | 16 Zen 5 cores, up to 5.1 GHz |
| GPU | Radeon 8060S (40 RDNA 3.5 CUs, 2560 shaders) |
| NPU | XDNA 2 (50 TOPS) |
| Memory | Up to 128GB LPDDR5X-8000 unified |
| GPU Allocatable | Up to ~124GB via kernel parameters |
| Architecture | gfx1151 (Strix Halo) |

The key advantage is **unified memory**: unlike discrete GPUs with fixed VRAM, the GPU shares system RAM. With 128GB total, you can allocate 124GB to the GPU and still have 4GB reserved for the OS. This is enough to run models that would otherwise require multiple high-end GPUs.

---

## Prerequisites

### Hardware

- AMD Ryzen AI Max+ 395 (Strix Halo) machine
- 128GB RAM (LPDDR5X-8000)
- Fedora 42/43 installed

### Software

- Fedora Linux with `toolbox` package
- Podman (comes with Fedora)
- SSH access to the machine

---

## Step 1: Configure Kernel Parameters

The most critical step is configuring the kernel to allocate enough unified memory to the GPU. By default, the GPU only gets a small fraction of system RAM. These parameters tell the AMD GPU driver to reserve up to 124GB.

Edit `/etc/default/grub` and add these parameters to `GRUB_CMDLINE_LINUX`:

```
iommu=pt amdgpu.gttsize=126976 ttm.pages_limit=32505856
```

| Parameter | Purpose |
|---|---|
| `iommu=pt` | Sets IOMMU to "Pass-Through" mode, reducing overhead for iGPU unified memory access |
| `amdgpu.gttsize=126976` | Caps GPU unified memory to 124 GiB (126976 MiB ÷ 1024 = 124 GiB) |
| `ttm.pages_limit=32505856` | Caps pinned memory to 124 GiB (32505856 × 4 KiB = 126976 MiB = 124 GiB) |

Apply and reboot:

```bash
sudo grub2-mkconfig -o /boot/grub2/grub.cfg
sudo reboot
```

> **Source**: These parameters come from community findings on [Reddit r/LocalLLaMA](https://www.reddit.com/r/LocalLLaMA/comments/1m9wcdc/comment/n5gf53d/) and are documented in the [amd-strix-halo-vllm-toolboxes](https://github.com/kyuz0/amd-strix-halo-vllm-toolboxes) repository.

---

## Step 2: Connect and Update

SSH into your Strix Halo machine:

```bash
ssh-copy-id johannes@mini-ai
ssh johannes@mini-ai
```

Update the system and install prerequisites:

```bash
sudo dnf update
sudo dnf install git
sudo dnf install toolbox
```

---

## Step 3: Clone the Toolbox Repository

The [amd-strix-halo-vllm-toolboxes](https://github.com/kyuz0/amd-strix-halo-vllm-toolboxes) project provides a pre-built Fedora Toolbx container with vLLM and ROCm pre-installed, built on TheRock nightly builds:

```bash
git clone https://github.com/kyuz0/amd-strix-halo-vllm-toolboxes.git
cd amd-strix-halo-vllm-toolboxes/
```

### What is Toolbx?

[Toolbx](https://containertoolbx.org/) is a tool for using containerized CLI environments on Fedora. It shares your `HOME` directory and user, so models and configs persist on the host. This means:

- Downloaded models stay in `~/.cache/huggingface` on the host
- No need to manage volumes or mounts
- Easy to iterate while keeping the host system clean

### What is TheRock?

[TheRock](https://github.com/ROCm/TheRock) is AMD's open-source project providing nightly builds of the ROCm stack. The toolbox uses TheRock builds specifically compiled for the `gfx1151` (Strix Halo) architecture, ensuring you get the latest ROCm support without waiting for official releases.

---

## Step 4: Create the vLLM Toolbox

Run the included script to pull the latest image and create the toolbox:

```bash
./refresh_toolbox.sh
```

This outputs:

```
ℹ️  No InfiniBand devices detected.
🔄 Refreshing vllm (image: docker.io/kyuz0/vllm-therock-gfx1151:latest)
⬇️ Pulling latest image: docker.io/kyuz0/vllm-therock-gfx1151:latest
Trying to pull docker.io/kyuz0/vllm-therock-gfx1151:latest...
Getting image source signatures
Copying blob 08b1c086214c done   |
Copying blob 4fe0fbde88ef done   |
...
Copying config 86d3955926 done   |
Writing manifest to image destination
86d39559264a71e316215bbfce11b14e027ebe923185873220476f766235eca4
📦 Recreating toolbox: vllm
   Options: --device /dev/dri --device /dev/kfd --group-add video --group-add render --security-opt seccomp=unconfined
Created container: vllm
Enter with: toolbox enter vllm
✅ vllm refreshed
```

### What the Script Does

| Action | Purpose |
|---|---|
| Pulls `kyuz0/vllm-therock-gfx1151:latest` | Gets the latest vLLM + ROCm container for gfx1151 |
| Creates toolbox with `--device /dev/dri --device /dev/kfd` | Passes GPU devices into the container |
| `--group-add video --group-add render` | Grants GPU access permissions |
| `--security-opt seccomp=unconfined` | Relaxes security for ROCm compute operations |
| Auto-detects InfiniBand | If IB devices are present, exposes them for RDMA clustering |

> **Manual Creation**: If you prefer to create the toolbox manually:
> ```bash
> toolbox create vllm \
>   --image docker.io/kyuz0/vllm-therock-gfx1151:latest \
>   -- --device /dev/dri --device /dev/kfd \
>   --group-add video --group-add render --security-opt seccomp=unconfined
> ```

---

## Step 5: Enter the Toolbox

```bash
toolbox enter vllm
```

You'll be greeted with the vLLM splash screen:

```
███████╗████████╗██████╗ ██╗██╗  ██╗      ██╗  ██╗ █████╗ ██╗      ██████╗
██╔════╝╚══██╔══╝██╔══██╗██║╚██╗██╔╝      ██║  ██║██╔══██╗██║     ██╔═══██╗
███████╗   ██║   ██████╔╝██║ ╚███╔╝       ███████║███████║██║     ██║   ██║
╚════██║   ██║   ██╔══██╗██║ ██╔██╗       ██╔══██║██╔══██║██║     ██║   ██║
███████║   ██║   ██║  ██║██║██╔╝ ██╗      ██║  ██║██║  ██║███████╗╚██████╔╝
╚══════╝   ╚═╝   ╚═╝  ╚═╝╚═╝╚═╝  ╚═╝      ╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝ ╚═════╝

                               v L L M

AMD STRIX HALO — vLLM Toolbox (gfx1151, ROCm via TheRock)
ROCm nightly: 7.13.60800

Machine: Default string H1
GPU    : AMD RYZEN AI MAX+ 395 w/ Radeon 8060S

Repo   : https://github.com/kyuz0/amd-strix-halo-vllm-toolboxes
Image  : docker.io/kyuz0/vllm-therock-gfx1151:latest

Included:
  - start-vllm (TUI) → Interactive launcher: Model select, Multi-GPU & Cache handling
  - start-vllm-cluster → Cluster launcher: Setup Ray Head/Worker & Launch vLLM RCCL
  - vllm-cluster-bench → Cluster Benchmark: TP=2, Auto-detected Env, JSON Results
  - vLLM server      → vllm serve meta-llama/Meta-Llama-3.1-8B-Instruct
  - API test         → curl localhost:8000/v1/chat/completions

SSH tip: ssh -L 8000:localhost:8000 user@host
```

### Included Tools

| Tool | Description |
|---|---|
| `start-vllm` | Interactive TUI wizard for launching models with pre-configured options |
| `start-vllm-cluster` | Cluster launcher for multi-node setups with Ray and RCCL |
| `vllm-cluster-bench` | Automated cluster benchmarking with JSON results |

---

## Step 6: Serve a Model

### Option A: Using the TUI Wizard (Easiest)

The toolbox includes a TUI wizard called `start-vllm` with pre-configured models and flags:

```bash
start-vllm
```

This presents an interactive menu for model selection, cache handling, and launch configuration.

### Option B: Manual Launch

For full control, launch vLLM directly. Here I'm serving **Qwen3.6-35B-A3B** — a Mixture-of-Experts model with 35B total parameters but only 3B active per forward pass, making it extremely efficient for the unified memory architecture:

```bash
vllm serve Qwen/Qwen3.6-35B-A3B \
  --host 0.0.0.0 \
  --port 8000 \
  --tensor-parallel-size 1 \
  --max-num-seqs 1 \
  --max-model-len 32768 \
  --gpu-memory-utilization 0.95 \
  --dtype auto \
  --trust-remote-code \
  --attention-backend TRITON_ATTN
```

### Launch Parameters Explained

| Parameter | Value | Description |
|---|---|---|
| `--host 0.0.0.0` | | Listen on all interfaces for remote access |
| `--port 8000` | | Standard OpenAI-compatible API port |
| `--tensor-parallel-size 1` | | Single GPU (unified memory, no TP needed) |
| `--max-num-seqs 1` | | One concurrent request (optimal for iGPU) |
| `--max-model-len 32768` | | 32K context window |
| `--gpu-memory-utilization 0.95` | | Use 95% of GPU memory for model + KV cache |
| `--dtype auto` | | Auto-detect best dtype for the model |
| `--trust-remote-code` | | Required for Qwen models with custom code |
| `--attention-backend TRITON_ATTN` | | Use Triton attention backend (optimized for ROCm) |

### Why Qwen3.6-35B-A3B?

| Feature | Detail |
|---|---|
| Architecture | Mixture-of-Experts (MoE) |
| Total Parameters | 35B |
| Active Parameters | 3B per forward pass |
| Context Length | Up to 262,144 tokens native |
| Model Size | ~24GB (BF16) |
| Capabilities | Multimodal (vision + language), reasoning, coding, agents |

The MoE architecture is ideal for the Strix Halo: the full 35B model fits comfortably in unified memory, but only 3B parameters are active during inference. This means you get near-large-model quality at small-model inference speed.

---

## Step 7: Test the API

Once the server is running, test it with a curl request:

```bash
curl -X POST http://localhost:8000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "Qwen/Qwen3.6-35B-A3B",
    "messages": [
      {"role": "user", "content": "Hello! Test the performance."}
    ]
  }'
```

### Remote Access via SSH

If the Strix Halo machine is remote, forward port 8000 via SSH:

```bash
ssh -L 8000:localhost:8000 johannes@mini-ai
```

Then access the API at `http://localhost:8000` from your local machine.

### Auto-detect the Active Model

If you don't want to specify the model name:

```bash
MODEL=$(curl -s http://localhost:8000/v1/models | jq -r '.data[0].id')
curl -X POST http://localhost:8000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d "{
    \"model\": \"$MODEL\",
    \"messages\": [{\"role\": \"user\", \"content\": \"Hello!\"}]
  }"
```

---

## Step 8: Add a Web UI (Optional)

For a chat interface, use HuggingFace ChatUI with port forwarding:

```bash
# On your local machine (with SSH tunnel active)
docker run -p 3000:3000 \
  --add-host=host.docker.internal:host-gateway \
  -e OPENAI_BASE_URL=http://host.docker.internal:8000/v1 \
  -e OPENAI_API_KEY=dummy \
  -v chat-ui-data:/data \
  ghcr.io/huggingface/chat-ui-db
```

Then open `http://localhost:3000` in your browser.

---

## Tested Models

The [amd-strix-halo-vllm-toolboxes](https://github.com/kyuz0/amd-strix-halo-vllm-toolboxes) project maintains a benchmark table of tested models. Here are some highlights:

| Model | TP | Max Context | GPU Util |
|---|---|---|---|
| `meta-llama/Meta-Llama-3.1-8B-Instruct` | 1 | 128K | 0.95 |
| `google/gemma-3-12b-it` | 1 | 128K | 0.95 |
| `Qwen/Qwen3-14B-AWQ` | 1 | 40K | 0.95 |
| `Qwen/Qwen3.6-35B-A3B` | 1 | 32K+ | 0.95 |
| `openai/gpt-oss-120b` | 1 | 128K | 0.95 |

Full benchmarks are available at [kyuz0.github.io/amd-strix-halo-vllm-toolboxes](https://kyuz0.github.io/amd-strix-halo-vllm-toolboxes/).

---

## Distributed Clustering (RDMA/RoCE)

The toolbox also supports clustering multiple Strix Halo nodes using InfiniBand or RoCE v2 (e.g., Intel E810). This enables **Tensor Parallelism across machines** with extremely low latency (~5µs), effectively creating a single 256GB unified memory GPU from two nodes.

Key features:
- Custom-built `librccl.so` for RDMA on gfx1151
- `refresh_toolbox.sh` auto-detects and exposes RDMA devices
- `start-vllm-cluster` TUI for managing Ray and vLLM

See the [RDMA Cluster Setup Guide](https://github.com/kyuz0/amd-strix-halo-vllm-toolboxes) in the repository for details.

---

## Troubleshooting

### GPU Not Detected

Verify the GPU is visible inside the toolbox:

```bash
rocm-smi
```

If it fails, check:
1. Kernel parameters are applied: `cat /proc/cmdline | grep amdgpu.gttsize`
2. The toolbox was created with `--device /dev/dri --device /dev/kfd`
3. Your user is in the `video` and `render` groups

### Out of Memory

If vLLM crashes with OOM:
- Reduce `--gpu-memory-utilization` to `0.90` or `0.85`
- Reduce `--max-model-len` to `16384` or `8192`
- Verify kernel parameters: `amdgpu.gttsize=126976 ttm.pages_limit=32505856`

### Slow First Inference

The first inference is slow because vLLM compiles Triton kernels. Compiled kernels are cached in `~/.cache/vllm/` and subsequent runs will be faster.

---

## Summary

Here's the complete setup:

```bash
# 1. Configure kernel parameters
# Edit /etc/default/grub, add to GRUB_CMDLINE_LINUX:
#   iommu=pt amdgpu.gttsize=126976 ttm.pages_limit=32505856
sudo grub2-mkconfig -o /boot/grub2/grub.cfg
sudo reboot

# 2. Install prerequisites
sudo dnf update
sudo dnf install git toolbox

# 3. Clone and create toolbox
git clone https://github.com/kyuz0/amd-strix-halo-vllm-toolboxes.git
cd amd-strix-halo-vllm-toolboxes/
./refresh_toolbox.sh

# 4. Enter toolbox and serve
toolbox enter vllm
vllm serve Qwen/Qwen3.6-35B-A3B \
  --host 0.0.0.0 --port 8000 \
  --tensor-parallel-size 1 \
  --max-num-seqs 1 \
  --max-model-len 32768 \
  --gpu-memory-utilization 0.95 \
  --dtype auto \
  --trust-remote-code \
  --attention-backend TRITON_ATTN
```

The AMD Ryzen AI Max+ 395 with unified memory is a compelling platform for local LLM inference. With 124GB of GPU-accessible memory, you can run models that would otherwise require expensive multi-GPU setups — all in a single machine.

Key takeaways:
- Configure **kernel parameters** to unlock unified memory for the GPU
- Use the **Strix Halo toolbox** for a pre-configured vLLM + ROCm environment
- **MoE models** like Qwen3.6-35B-A3B are ideal — large total params, small active params
- Use **TRITON_ATTN** backend for best ROCm performance
- For remote access, use **SSH port forwarding**

Happy serving!

---

## References

- [amd-strix-halo-vllm-toolboxes](https://github.com/kyuz0/amd-strix-halo-vllm-toolboxes) - The toolbox repository by kyuz0
- [TheRock Project](https://github.com/ROCm/TheRock) - AMD's open-source ROCm nightly builds
- [AMD Ryzen AI Max+ 395](https://www.amd.com/en/products/processors/laptop/ryzen/ai-300-series/amd-ryzen-ai-max-plus-395.html) - Official product page
- [Toolbx](https://containertoolbx.org/) - Containerized CLI environments on Fedora
- [vLLM Documentation](https://docs.vllm.ai/)
