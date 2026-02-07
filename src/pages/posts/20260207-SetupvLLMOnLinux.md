---
title: 'Setting up vLLM Locally on Linux'
pubDate: 2026-02-07
description: 'A step-by-step guide to set up vLLM for running local LLMs on Linux with Blackwell architecture support'
author: 'Johannes'
tags: ['vllm', 'llm', 'local-ai', 'linux', 'blackwell']
layout: '../../layouts/MarkdownPostLayout.astro'
---

## Introduction

vLLM is a fast and easy-to-use library for LLM inference and serving. In this guide, I'll walk you through setting up vLLM locally on Linux. I'll also show you how to download and serve the Qwen3-Coder-Next-FP8-Dynamic model.

## Prerequisites

### Install UV

UV is a blazingly fast Python package installer and resolver. Install it with:

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

## Step 1: Create Folder and Initialize Python Environment

```bash
# Create and navigate to a new directory
mkdir vllm-setup
cd vllm-setup

# Initialize Python venv using uv for Python 3.12
uv venv --python 3.12
source .venv/bin/activate
```

## Step 2: Install vLLM

Check the official documentation at [vLLM Installation Guide](https://docs.vllm.ai/en/stable/getting_started/installation/gpu/).

### For Blackwell Architecture

Get the latest vLLM version and install with CUDA 13.0 support:

```bash
# Install vLLM with a specific CUDA version (e.g., 13.0).
export VLLM_VERSION=$(curl -s https://api.github.com/repos/vllm-project/vllm/releases/latest | jq -r .tag_name | sed 's/^v//')
export CUDA_VERSION=130
export CPU_ARCH=$(uname -m) # x86_64 or aarch64
uv pip install https://github.com/vllm-project/vllm/releases/download/v${VLLM_VERSION}/vllm-${VLLM_VERSION}+cu${CUDA_VERSION}-cp38-abi3-manylinux_2_35_${CPU_ARCH}.whl --extra-index-url https://download.pytorch.org/whl/cu${CUDA_VERSION}
```

**Important Note:** As of current releases, vLLM provides pre-compiled binaries for CUDA 12.8 and 12.9. **CUDA 13.0 is not officially supported** in standard vLLM releases. For Blackwell (Compute Capability 10.0) architecture support, you need CUDA driver version 575 or above, but the underlying PyTorch binaries must still be compatible with the installed CUDA version. For most users, CUDA 12.8 is the recommended choice. If you specifically need CUDA 13.0, you would need to [build vLLM from source](https://docs.vllm.ai/en/stable/getting_started/installation/gpu.html#build-from-source).

For Blackwell GPUs, ensure you have **CUDA driver version 575 or above** installed on your system. You can check this with:
```bash
nvidia-smi
# Look for "Driver Version" - should be 575 or higher for Blackwell support
```

## Step 3: Download the Model

For downloading models locally, I use [rust-hf-downloader](https://rust-hf-downloader.jreb.nl/). See the project's documentation and GitHub page for installation and usage details.

**Option A: Local Download**

Download the `Qwen3-Coder-Next-FP8-Dynamic` model to your preferred location (e.g., `/home/johannes/models/unsloth/`).

**Option B: No download**

If you don't want to download the model locally, just specify the Hugging Face model ID in the next step:

```bash
vllm serve unsloth/Qwen3-Coder-Next-FP8-Dynamic \
    --tensor-parallel-size 2 \
    --tool-call-parser qwen3_coder \
    --served-model-name qwen3 \
    --enable-auto-tool-choice \
    --trust-remote-code
```

In this case, vLLM will initiate the download (and complain about no HF_TOKEN set). This is fine.

## Step 4: Create the Run Script

Create `run-qwen3.sh`:

```bash
#!/bin/bash
source .venv/bin/activate
vllm serve /home/johannes/models/unsloth/Qwen3-Coder-Next-FP8-Dynamic \
        --tensor-parallel-size 2 \
        --tool-call-parser qwen3_coder \
        --served-model-name qwen3 \
        --enable-auto-tool-choice \
        --trust-remote-code
```

### Flag Explanations

| Flag | Description |
|------|-------------|
| `--tensor-parallel-size 2` | Distribute the model across 2 GPUs for faster inference, change for your usecase |
| `--tool-call-parser qwen3_coder` | Use the Qwen3 Coder-specific tool calling parser. |
| `--served-model-name qwen3` | Custom name for the served model (appears in API responses and needed in requests) |
| `--enable-auto-tool-choice` | Automatically choose appropriate tools based on the prompt. When enabled, the model can decide whether to generate regular text or call tools based on the input. |
| `--trust-remote-code` | Allow running models with custom code from Hugging Face. Qwen3-Coder models require this because they include custom tokenizer and model code not part of the standard Transformers library. |

## Step 5: Run and Verify

Make the script executable and run:

```bash
chmod +x run-qwen3.sh
./run-qwen3.sh
```

### Expected Output

You should see output like this:

```
(APIServer pid=14594) INFO 02-07 15:33:58 [hf.py:310] Detected the chat template content format to be 'string'. You can set `--chat-template-content-format` to override this.
(APIServer pid=14594) INFO 02-07 15:33:58 [serving.py:212] Chat template warmup completed in 493.6ms
(APIServer pid=14594) INFO 02-07 15:33:58 [serving.py:273] "auto" tool choice has been enabled.
(APIServer pid=14594) INFO 02-07 15:33:58 [api_server.py:946] Starting vLLM API server 0 on http://0.0.0.0:8000
(APIServer pid=14594) INFO 02-07 15:33:58 [launcher.py:38] Available routes are:
(APIServer pid=14594) INFO 02-07 15:33:58 [launcher.py:46] Route: /openapi.json, Methods: HEAD, GET
(APIServer pid=14594) INFO 02-07 15:33:58 [launcher.py:46] Route: /docs, Methods: HEAD, GET
(APIServer pid=14594) INFO 02-07 15:33:58 [launcher.py:46] Route: /docs/oauth2-redirect, Methods: HEAD, GET
(APIServer pid=14594) INFO 02-07 15:33:58 [launcher.py:46] Route: /redoc, Methods: HEAD, GET
(APIServer pid=14594) INFO 02-07 15:33:58 [launcher.py:46] Route: /tokenize, Methods: POST
(APIServer pid=14594) INFO 02-07 15:33:58 [launcher.py:46] Route: /detokenize, Methods: POST
(APIServer pid=14594) INFO 02-07 15:33:58 [launcher.py:46] Route: /inference/v1/generate, Methods: POST
(APIServer pid=14594) INFO 02-07 15:33:58 [launcher.py:46] Route: /pause, Methods: POST
(APIServer pid=14594) INFO 02-07 15:33:58 [launcher.py:46] Route: /resume, Methods: POST
(APIServer pid=14594) INFO 02-07 15:33:58 [launcher.py:46] Route: /is_paused, Methods: GET
(APIServer pid=14594) INFO 02-07 15:33:58 [launcher.py:46] Route: /metrics, Methods: GET
(APIServer pid=14594) INFO 02-07 15:33:58 [launcher.py:46] Route: /health, Methods: GET
(APIServer pid=14594) INFO 02-07 15:33:58 [launcher.py:46] Route: /v1/chat/completions, Methods: POST
(APIServer pid=14594) INFO 02-07 15:33:58 [launcher.py:46] Route: /v1/chat/completions/render, Methods: POST
(APIServer pid=14594) INFO 02-07 15:33:58 [launcher.py:46] Route: /v1/responses, Methods: POST
(APIServer pid=14594) INFO 02-07 15:33:58 [launcher.py:46] Route: /v1/responses/{response_id}, Methods: GET
(APIServer pid=14594) INFO 02-07 15:33:58 [launcher.py:46] Route: /v1/responses/{response_id}/cancel, Methods: POST
(APIServer pid=14594) INFO 02-07 15:33:58 [launcher.py:46] Route: /v1/audio/transcriptions, Methods: POST
(APIServer pid=14594) INFO 02-07 15:33:58 [launcher.py:46] Route: /v1/audio/translations, Methods: POST
(APIServer pid=14594) INFO 02-07 15:33:58 [launcher.py:46] Route: /v1/completions, Methods: POST
(APIServer pid=14594) INFO 02-07 15:33:58 [launcher.py:46] Route: /v1/completions/render, Methods: POST
(APIServer pid=14594) INFO 02-07 15:33:58 [launcher.py:46] Route: /v1/messages, Methods: POST
(APIServer pid=14594) INFO 02-07 15:33:58 [launcher.py:46] Route: /v1/models, Methods: GET
(APIServer pid=14594) INFO 02-07 15:33:58 [launcher.py:46] Route: /load, Methods: GET
(APIServer pid=14594) INFO 02-07 15:33:58 [launcher.py:46] Route: /version, Methods: GET
(APIServer pid=14594) INFO 02-07 15:33:58 [launcher.py:46] Route: /ping, Methods: GET
(APIServer pid=14594) INFO 02-07 15:33:58 [launcher.py:46] Route: /ping, Methods: POST
(APIServer pid=14594) INFO 02-07 15:33:58 [launcher.py:46] Route: /invocations, Methods: POST
(APIServer pid=14594) INFO 02-07 15:33:58 [launcher.py:46] Route: /classify, Methods: POST
(APIServer pid=14594) INFO 02-07 15:33:58 [launcher.py:46] Route: /v1/embeddings, Methods: POST
(APIServer pid=14594) INFO 02-07 15:33:58 [launcher.py:46] Route: /score, Methods: POST
(APIServer pid=14594) INFO 02-07 15:33:58 [launcher.py:46] Route: /v1/score, Methods: POST
(APIServer pid=14594) INFO 02-07 15:33:58 [launcher.py:46] Route: /rerank, Methods: POST
(APIServer pid=14594) INFO 02-07 15:33:58 [launcher.py:46] Route: /v1/rerank, Methods: POST
(APIServer pid=14594) INFO 02-07 15:33:58 [launcher.py:46] Route: /v2/rerank, Methods: POST
(APIServer pid=14594) INFO 02-07 15:33:58 [launcher.py:46] Route: /pooling, Methods: POST
(APIServer pid=14594) INFO:     Started server process [14594]
(APIServer pid=14594) INFO:     Waiting for application startup.
(APIServer pid=14594) INFO:     Application startup complete.
```

## Step 6: Monitor Performance

After startup, you'll see throughput metrics every 10 seconds by default:

```
(APIServer pid=14594) INFO 02-07 15:50:39 [loggers.py:257] Engine 000: Avg prompt throughput: 9794.3 tokens/s, Avg generation throughput: 9.4 tokens/s, Running: 1 reqs, Waiting: 0 reqs, GPU KV cache usage: 0.8%, Prefix cache hit rate: 0.0%
(APIServer pid=14594) INFO 02-07 15:50:49 [loggers.py:257] Engine 000: Avg prompt throughput: 5153.7 tokens/s, Avg generation throughput: 128.4 tokens/s, Running: 1 reqs, Waiting: 0 reqs, GPU KV cache usage: 1.6%, Prefix cache hit rate: 0.0%
(APIServer pid=14594) INFO 02-07 15:50:59 [loggers.py:257] Engine 000: Avg prompt throughput: 0.0 tokens/s, Avg generation throughput: 177.2 tokens/s, Running: 1 reqs, Waiting: 0 reqs, GPU KV cache usage: 1.6%, Prefix cache hit rate: 0.0%
```

**Understanding vLLM Performance Metrics**

| Metric | Description | Why It Matters |
|--------|-------------|----------------|
| **Avg prompt throughput** | Tokens processed per second during the prefill phase (input tokens) | High prompt throughput indicates efficient context processing. This is typically much higher than generation throughput because prefill is compute-bound and can process input tokens in parallel. |
| **Avg generation throughput** | Tokens generated per second (output tokens) | This measures how fast the model produces output tokens. Generation is autoregressive (one token at a time), so throughput varies based on sequence length, KV cache state, and hardware efficiency. |
| **Running** | Number of requests currently being processed | Shows active load on the server. Multiple running requests indicate concurrent inference capability. |
| **Waiting** | Number of requests in the queue | High waiting counts suggest the server is overloaded. Monitor this to scale horizontally or optimize resource allocation. |
| **GPU KV cache usage** | Percentage of GPU memory used for key-value cache | KV cache stores attention keys/values for generated tokens. High usage (e.g., >80%) may indicate context length or concurrency is pushing memory limits. PagedAttention in vLLM minimizes fragmentation, allowing more efficient cache usage. |
| **Prefix cache hit rate** | Percentage of cached prefix segments reused | High prefix hit rates (e.g., >90%) indicate effective caching of common prompt prefixes. This dramatically reduces prefill time for similar prompts, improving throughput and reducing latency. A 0.0% rate initially is normal; it increases as similar requests accumulate. |

**Detailed Metric Explanations**

1. **Prompt Throughput (tokens/s)**: During the prefill phase, vLLM processes all input tokens in parallel using matrix multiplication. This is why throughput can reach thousands of tokens per second—even for models with billions of parameters. The throughput stabilizes after initial warmup as CUDA kernels compile and the GPU reaches full utilization.

2. **Generation Throughput (tokens/s)**: During generation, each output token is produced sequentially because each token depends on previous ones (autoregressive decoding). Throughput varies based on:
   - Sequence length (longer sequences may have different performance characteristics)
   - KV cache size (larger caches can slow attention computations)
   - Hardware-specific optimizations (Tensor Cores, memory bandwidth)
   - Batch size (multiple concurrent requests can improve overall throughput)

3. **Running/Waiting Requests**: These are key capacity planning metrics. The `Running` count includes both prefill and decode phases. If `Waiting` consistently increases, consider:
   - Increasing GPU memory allocation
   - Reducing `--max-model-len` to limit context size
   - Scaling horizontally with multiple vLLM instances

4. **GPU KV Cache Usage**: vLLM uses **PagedAttention** to manage KV cache efficiently, treating GPU memory like virtual memory with fixed-size blocks. This reduces memory waste from ~60-80% to under 4% compared to traditional contiguous allocation. A 0.8-1.6% usage with a single request is expected for the Qwen3-Coder model family.

5. **Prefix Cache Hit Rate**: When you send similar prompts (e.g., chat conversations with shared history), vLLM caches the common prefix. The hit rate improves over time as more requests share prefixes. A high prefix hit rate can provide 10x+ speedup for the prefill phase, making it one of vLLM's most impactful optimizations for production workloads.

**General Request Flow**

For each request, you'll observe these phases:

1. **Prefill Phase**: High prompt throughput, low or zero generation throughput
   - All input tokens are processed in parallel
   - KV cache grows linearly with input length
   - First request may show lower throughput due to kernel warmup

2. **Decode Phase**: Zero prompt throughput, peak generation throughput
   - Tokens generated one at a time
   - KV cache continues growing with each new token
   - Throughput stabilizes as the model settles into optimal performance

3. **Completion**: Metrics update to reflect new requests
   - Previous request completes, freeing KV cache
   - New requests benefit from cached prefixes
   - System reaches steady-state throughput

**Production Monitoring Tips**

- Use the `/metrics` endpoint (Prometheus format) for integration with monitoring systems
- Set up alerts for `Running` count exceeding capacity
- Track `prefix cache hit rate` to identify optimization opportunities for your workload
- Monitor `GPU KV cache usage` to prevent out-of-memory errors
- For consistent throughput, ensure warmup requests have accumulated before measuring

## Testing Your Setup

Test the API with a simple request:

```bash
curl -X POST http://localhost:8000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "qwen3",
    "messages": [
      {"role": "system", "content": "You are a helpful assistant."},
      {"role": "user", "content": "Write a Python function to calculate Fibonacci numbers."}
    ],
    "tool_choice": "auto"
  }'
```

## Summary

Here's a quick overview of the setup:

```bash
# Create folder and setup
mkdir vllm-setup
cd vllm-setup
uv venv --python 3.12
source .venv/bin/activate

# Install vLLM (Blackwell/CUDA 13.0)
export VLLM_VERSION=$(curl -s https://api.github.com/repos/vllm-project/vllm/releases/latest | jq -r .tag_name | sed 's/^v//')
export CUDA_VERSION=130
export CPU_ARCH=$(uname -m)
uv pip install https://github.com/vllm-project/vllm/releases/download/v${VLLM_VERSION}/vllm-${VLLM_VERSION}+cu${CUDA_VERSION}-cp38-abi3-manylinux_2_35_${CPU_ARCH}.whl --extra-index-url https://download.pytorch.org/whl/cu${CUDA_VERSION}

# Create run script (run-qwen3.sh)
cat > run-qwen3.sh << 'EOF'
#!/bin/bash
source .venv/bin/activate
vllm serve /home/johannes/models/unsloth/Qwen3-Coder-Next-FP8-Dynamic \
        --tensor-parallel-size 2 \
        --tool-call-parser qwen3_coder \
        --served-model-name qwen3 \
        --enable-auto-tool-choice \
        --trust-remote-code
EOF
chmod +x run-qwen3.sh

# Run
./run-qwen3.sh
```

Happy serving! 🚀
