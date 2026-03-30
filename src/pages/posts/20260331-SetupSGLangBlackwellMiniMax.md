---
title: 'Setting Up SGLang with MiniMax M2 on Dual RTX PRO 6000 Blackwell'
pubDate: 2026-03-31
description: 'Complete guide to installing and tuning SGLang for 2x NVIDIA RTX PRO 6000 Blackwell GPUs with MiniMax M2 NVFP4 quantization'
author: 'Johannes'
tags: ['sglang', 'llm', 'blackwell', 'minimax', 'nvfp4', 'nvidia', 'inference']
layout: '../../layouts/MarkdownPostLayout.astro'
---

## Introduction

Following my previous guides on [vLLM setup](/posts/20260207-SetupvLLMOnLinux) and [GPU passthrough in Proxmox](/posts/20260330-ProxmoxGPUPassthroughFedora), this guide covers SGLang - the high-performance LLM serving framework that's emerged as the leading alternative to vLLM.

In this guide, I'll walk through setting up SGLang on dual RTX PRO 6000 Blackwell GPUs (192GB total VRAM) and running MiniMax M2 with NVFP4 quantization - a powerful combination that delivers excellent performance for local AI inference.

### Why SGLang?

SGLang offers several advantages over vLLM:

- **RadixAttention**: Superior KV cache management for multi-turn conversations
- **DeepSeek optimizations**: Day-1 support with MLA throughput optimizations
- **Python-first frontend**: Flexible chained generation calls
- **Industry adoption**: Powers 400,000+ GPUs worldwide (xAI, AMD, NVIDIA, Cursor)

### Why MiniMax M2 with NVFP4?

MiniMax M2 is a 230B parameter MoE model with 10B active parameters - excellent for coding and agentic tasks. The NVFP4 quantization:
- Only quantizes MoE expert MLP layers (attention stays in BF16)
- Significant memory savings (~50% reduction)
- Runs on 2x 96GB GPUs instead of requiring 4x H100s

---

## Prerequisites

### Hardware
- 2x NVIDIA RTX PRO 6000 Blackwell (96GB each)
- 192GB total VRAM required for MiniMax M2 NVFP4
- CUDA driver 575+ (580+ recommended)

### Software
- CUDA 12.8 or 13.0
- Python 3.12
- UV package manager

Verify your GPU:
```bash
nvidia-smi
# Expected: Driver Version 580+, CUDA 13.0
```

---

## Step 1: Install SGLang

Create a fresh Python environment and install SGLang with CUDA 13.0 support:

```bash
# Create directory
mkdir sglang-minimax && cd sglang-minimax

# Create venv with Python 3.12
uv venv --python 3.12
source .venv/bin/activate
```

### Installation Script

Here's the working installation and startup script for CUDA 13.x with Blackwell GPUs:

```bash
# Step 1: Install nightly sglang
uv pip install -U sglang --pre \
  --index-url https://sgl-project.github.io/whl/cu129/ \
  --extra-index-url https://pypi.org/simple \
  --extra-index-url https://download.pytorch.org/whl/cu130 \
  --index-strategy unsafe-best-match

# Step 2: Install CUDA 13.0 kernel
uv pip install -U sgl-kernel \
  --extra-index-url https://sgl-project.github.io/whl/cu130/ \
  --extra-index-url https://download.pytorch.org/whl/cu130 \
  --index-strategy unsafe-best-match

source .venv/bin/activate

uv run python3 -m sglang.launch_server \
  --model-path  /home/johannes/models/lukealonso/MiniMax-M2.5-NVFP4/ \
  --fp4-gemm-backend flashinfer_cutlass \
  --attention-backend triton \
  --served-model-name vllm \
  --trust-remote-code \
  --tensor-parallel-size 2 \
  --tool-call-parser minimax-m2 \
  --reasoning-parser minimax-append-think \
  --host 0.0.0.0 \
  --port 8000
```

### Installation Parameters Explained

| Parameter | Value | Description |
|-----------|-------|-------------|
| `uv pip install -U sglang --pre` | | Install latest pre-release (nightly) version |
| `--index-url https://sgl-project.github.io/whl/cu129/` | | Primary index for CUDA 12.9 builds |
| `--extra-index-url https://pypi.org/simple` | | PyPI for non-CUDA dependencies |
| `--extra-index-url https://download.pytorch.org/whl/cu130` | | CUDA 13.0 PyTorch wheels |
| `--index-strategy unsafe-best-match` | | Use highest version across all indexes |

**Why these indexes?**

- **cu129**: SGLang provides CUDA 12.9 wheels with Blackwell-optimized kernels
- **cu130**: PyTorch CUDA 13.0 wheels for runtime
- **unsafe-best-match**: Ensures best version resolution across all indexes

---

## Step 2: Download MiniMax M2 NVFP4

Download the NVFP4-quantized model using rust-hf-downloader - a fast Rust-based alternative to huggingface-cli:

### Install rust-hf-downloader

```bash
# Install Rust if not already installed
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source ~/.cargo/env

# Install rust-hf-downloader
cargo install rust-hf-downloader
```

### Download the Model

```bash
# Set HuggingFace token (required for gated models)
export HF_TOKEN=your_hf_token_here

# Download MiniMax-M2.5-NVFP4
rust-hf-downloader --headless download lukealonso/MiniMax-M2.5-NVFP4 \
    --output ~/models
```

### Key Commands

| Command | Description |
|---------|-------------|
| `--headless` | Run in CLI mode (required for CLI commands) |
| `--output` | Set output directory (default: ~/rust-hf-downloader) |
| `--all` | Download all files (not just recommended) |
| `--dry-run` | Preview what would be downloaded |
| `--json` | JSON output for scripting |
| `resume` | Resume interrupted downloads |

For the NVFP4 model, all files are required, so the default download is sufficient.

---

> **Note**: Expert parallelism (`--ep`) can cause MiniMax M2 NVFP4 to fail to load. Use only `--tp` for this model.

## Step 3: Run SGLang with Your Configuration

### Complete Working Script

Save this as `run.sh`:

```bash
#!/bin/bash
source .venv/bin/activate

uv run sglang serve \
  --model-path /home/johannes/models/lukealonso/MiniMax-M2.5-NVFP4/ \
  --fp4-gemm-backend flashinfer_cutlass \
  --attention-backend triton \
  --served-model-name vllm \
  --trust-remote-code \
  --tensor-parallel-size 2 \
  --tool-call-parser minimax-m2 \
  --reasoning-parser minimax-append-think \
  --host 0.0.0.0 \
  --port 8000
```

### Server Parameters Explained

| Parameter | Value | Description |
|-----------|-------|-------------|
| `--model-path` | `/home/johannes/.../MiniMax-M2.5-NVFP4/` | Path to the NVFP4-quantized model |
| `--fp4-gemm-backend` | `flashinfer_cutlass` | **FP4/FP8 GEMM backend**: Uses FlashInfer CUTLASS kernels for optimized matrix multiplications with quantized weights. The CUTLASS backend is generally more stable on Blackwell GPUs compared to triton. |
| `--attention-backend` | `triton` | **Attention backend**: Triton is more stable than FlashInfer on some Blackwell configurations. FlashInfer can cause crashes on first prompt with certain setups. |
| `--served-model-name` | `vllm` | **API model name**: The name exposed in the OpenAI-compatible API. Set to "vllm" for compatibility with existing clients. |
| `--trust-remote-code` | | **Trust remote code**: Required for MiniMax models as they contain custom code not in standard Transformers library. |
| `--tensor-parallel-size` | `2` | **Tensor parallelism**: Distributes model across 2 GPUs. For dual RTX PRO 6000, this uses both cards. |
| `--tool-call-parser` | `minimax-m2` | **Tool calling parser**: Enables structured tool calls for MiniMax M2 models. Parses tool call syntax in model output. |
| `--reasoning-parser` | `minimax-append-think` | **Reasoning parser**: Handles MiniMax's thinking/reasoning output format. The "append" variant keeps the thinking in the response. |
| `--host` | `0.0.0.0` | **Host binding**: Listens on all network interfaces. |
| `--port` | `8000` | **Port**: Standard port for OpenAI-compatible API. |

### Why These Specific Choices?

**`--fp4-gemm-backend flashinfer_cutlass`**: 
- NVFP4 quantized models require specialized GEMM kernels
- FlashInfer CUTLASS provides the most stable Blackwell support
- Alternative: `triton` if you encounter issues

**`--attention-backend triton`**:
- Triton backend avoids FlashInfer crashes on Blackwell
- Some users report needing `--attention-backend triton --sampling-backend pytorch` to prevent crashes

**`--tensor-parallel-size 2`**:
- Matches your 2x RTX PRO 6000 Blackwell setup
- Each GPU handles half the model layers

**`--tool-call-parser minimax-m2` and `--reasoning-parser minimax-append-think`**:
- MiniMax M2 has custom output formats for tool calling and reasoning
- These parsers handle the special tokens and formatting

### Run the Server

```bash
chmod +x run.sh
./run.sh
```

### Expected Startup Output

```
[2026-03-30 14:21:44 TP1] Fixing v5 tokenizer component mismatch for /home/johannes/models/lukealonso/MiniMax-M2.5-NVFP4/: pre_tokenizer ByteLevel -> Sequence, decoder ByteLevel -> ByteLevel
[2026-03-30 14:21:44 TP0] Fixing v5 tokenizer component mismatch for /home/johannes/models/lukealonso/MiniMax-M2.5-NVFP4/: pre_tokenizer ByteLevel -> Sequence, decoder ByteLevel -> ByteLevel
[2026-03-30 14:21:44 TP0] max_total_num_tokens=181721, chunked_prefill_size=8192, max_prefill_tokens=16384, max_running_requests=2048, context_len=196608, available_gpu_mem=7.74 GB
[2026-03-30 14:21:44] INFO:     Started server process [171156]
[2026-03-30 14:21:44] INFO:     Waiting for application startup.
[2026-03-30 14:21:44] Using default chat sampling params from model generation config: {'repetition_penalty': 1.0, 'temperature': 1.0, 'top_k': 40, 'top_p': 0.95}
[2026-03-30 14:21:44] INFO:     Application startup complete.
[2026-03-30 14:21:44] INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
[2026-03-30 14:21:45] INFO:     127.0.0.1:52234 - "GET /model_info HTTP/1.1" 200 OK
[2026-03-30 14:21:46 TP0] Prefill batch, #new-seq: 1, #new-token: 6, #cached-token: 0, token usage: 0.00, #running-req: 0, #queue-req: 0, cuda graph: True, input throughput (token/s): 0.00
[2026-03-30 14:21:46] INFO:     127.0.0.1:52246 - "POST /generate HTTP/1.1" 200 OK
[2026-03-30 14:21:46] The server is fired up and ready to roll!
```

**Output Explanation:**

| Line | Description |
|------|-------------|
| `Fixing v5 tokenizer component mismatch` | SGLang auto-fixes tokenizer config for HuggingFace v5 compatibility - **normal** |
| `max_total_num_tokens=181721` | Maximum tokens that can be processed (196K context) |
| `available_gpu_mem=7.74 GB` | **Remaining** VRAM available for KV cache and dynamic allocations (~88GB used by model + KV cache pool on each GPU) |
| `chunked_prefill_size=8192` | Prefill is chunked for memory efficiency |
| `cuda graph: True` | CUDA graphs enabled for optimization |
| `Using default chat sampling params` | Model's built-in generation config (temperature=1.0, top_p=0.95) |
| `The server is fired up and ready to roll!` | Server ready for requests |

> **Note on Memory Usage**: With 96GB GPUs, ~88GB is used for model weights and the KV cache pool. The remaining ~7.74GB is reserved for activations, gradients, and dynamic allocations during inference. The `--mem-fraction-static` flag controls how much is reserved for model weights (default ~90%), with the rest available for KV cache.

---

## Step 4: Performance Tuning

### Optimization Flags

For Blackwell GPUs with CUDA 13.x, these flags improve stability and performance:

```bash
# Environment variables for better Blackwell support
export PYTORCH_ALLOC_CONF=expandable_segments:True
export NCCL_IB_DISABLE=1
export NCCL_P2P_LEVEL=PHB
```

### Attention Backend Selection

The user's configuration uses `--attention-backend triton`. Here's why:

| Backend | Pros | Cons |
|---------|------|------|
| `triton` | More stable on Blackwell, less crash-prone | Slightly slower than FlashInfer |
| `flashinfer` | Faster attention computation | Can crash on first prompt with Blackwell |
| `flashinfer_workspace` | Optimized workspace allocation | Requires more tuning |

### FP4 GEMM Backend Selection

| Backend | Pros | Cons |
|---------|------|------|
| `flashinfer_cutlass` | Most stable for NVFP4 | |
| `triton` | Alternative if issues | May have warnings |
| `cutlass` | Fallback option | Less optimized |

### Troubleshooting Common Issues

#### Issue: CUDA Graph Capture Fails

If you see errors during batch capture:
```bash
# Disable CUDA graphs if unstable
--disable-cuda-graph
```

#### Issue: High Idle GPU Usage

If GPUs show 100% utilization when idle:
```bash
# Enable sleep when idle
--enable-sleep-on-idle
# Or
--sleep-when-idle
```

#### Issue: DeepGEMM Warnings

These are typically cosmetic. For reduced warnings:
```bash
# Try alternative MoE backend
--moe-runner-backend triton
```

### Benchmarking

Test with a simple request:

```bash
curl -X POST http://localhost:8000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "vllm",
    "messages": [
      {"role": "user", "content": "Write a Python function to calculate Fibonacci numbers."}
    ],
    "max_tokens": 500,
    "temperature": 0.7
  }'
```

Note: Use `vllm` as the model name since that's what was set with `--served-model-name vllm`.

### Expected Performance

With 2x RTX PRO 6000 Blackwell and MiniMax M2 NVFP4:

| Metric | Expected Value |
|--------|----------------|
| Prompt Throughput | ~8,000-12,000 tokens/s |
| Generation Throughput | ~80-120 tokens/s |
| Latency (first token) | ~100-200ms |
| VRAM Usage | ~87-88GB per GPU |

---

## Monitoring

The metrics endpoint requires the `--enable-metrics` flag to be enabled:

```bash
# Add --enable-metrics to your server launch
uv run sglang serve \
  --model-path ~/models/lukealonso/MiniMax-M2.5-NVFP4/ \
  --fp4-gemm-backend flashinfer_cutlass \
  --attention-backend triton \
  --served-model-name vllm \
  --trust-remote-code \
  --tensor-parallel-size 2 \
  --tool-call-parser minimax-m2 \
  --reasoning-parser minimax-append-think \
  --enable-metrics \
  --host 0.0.0.0 \
  --port 8000
```

### Access Metrics

```bash
# View metrics
curl http://localhost:8000/metrics

# In browser
# Navigate to http://localhost:8000/metrics
```

### Key Metrics

| Metric | Description |
|--------|-------------|
| `sglang_prefill throughput` | Input processing speed (tokens/s) |
| `sglang_decode_throughput` | Output generation speed (tokens/s) |
| `gpu_kv_cache_usage` | KV cache utilization |
| `radix_cache_hit_rate` | Prefix cache efficiency |

---

## Comparing with vLLM

Based on community benchmarks:

| Feature | SGLang | vLLM |
|---------|--------|------|
| Multi-GPU (2x) Performance | +150% better with DP | Baseline |
| RadixAttention | Native | Limited |
| DeepSeek Optimizations | Day-1 | Delayed |
| Blackwell Support | Good | Good |
| NVFP4 Support | Good | Good |

For multi-GPU setups where the model fits in total VRAM, SGLang's data parallelism typically outperforms vLLM's tensor parallelism.

---

## Summary

Here's the working configuration for CUDA 13.x with dual RTX PRO 6000 Blackwell:

```bash
# 1. Setup environment
mkdir sglang-minimax && cd sglang-minimax
uv venv --python 3.12
source .venv/bin/activate

# 2. Install SGLang (nightly with CUDA 13.x support)
uv pip install -U sglang --pre \
  --index-url https://sgl-project.github.io/whl/cu129/ \
  --extra-index-url https://pypi.org/simple \
  --extra-index-url https://download.pytorch.org/whl/cu130 \
  --index-strategy unsafe-best-match

# 3. Install CUDA 13.0 kernel
uv pip install -U sgl-kernel \
  --extra-index-url https://sgl-project.github.io/whl/cu130/ \
  --extra-index-url https://download.pytorch.org/whl/cu130 \
  --index-strategy unsafe-best-match

# 4. Run server
uv run sglang serve \
  --model-path /home/johannes/models/lukealonso/MiniMax-M2.5-NVFP4/ \
  --fp4-gemm-backend flashinfer_cutlass \
  --attention-backend triton \
  --served-model-name vllm \
  --trust-remote-code \
  --tensor-parallel-size 2 \
  --tool-call-parser minimax-m2 \
  --reasoning-parser minimax-append-think \
  --host 0.0.0.0 \
  --port 8000
```

With dual RTX PRO 6000 Blackwell GPUs and MiniMax M2 NVFP4, you have a powerful local inference setup capable of handling demanding coding and agentic workloads.

Key takeaways:
- Use **cu129** index for SGLang wheels with Blackwell support
- Use **triton** attention backend for stability on Blackwell
- Use **flashinfer_cutlass** for FP4 GEMM operations
- Enable **tool-call-parser** and **reasoning-parser** for MiniMax models

Happy serving!
