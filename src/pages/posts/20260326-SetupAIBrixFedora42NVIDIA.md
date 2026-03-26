---
title: 'AIBrix Setup Guide: Fedora 42 + NVIDIA GPUs'
pubDate: 2026-03-26
description: 'Set up AIBrix on Fedora 42 with NVIDIA GPUs using Minikube None driver for local LLM inference at scale'
author: 'Johannes'
tags: ['aibrix', 'kubernetes', 'minikube', 'nvidia', 'gpu', 'fedora', 'vllm', 'llm']
layout: '../../layouts/MarkdownPostLayout.astro'
---

## Why AIBrix Over Running vLLM Directly?

You've got a fresh Fedora 42 box with NVIDIA GPUs and you want to serve LLMs. The obvious path is `pip install vllm` or spinning up a Docker container. Both work well — vLLM supports multi-GPU inference via `--tensor-parallel-size` regardless of how you run it, and for a single model on a single server, either approach is perfectly fine.

Where AIBrix pulls ahead is when you move beyond "one model, one server." It gives you intelligent request routing across multiple model replicas, automatic autoscaling based on load, GPU sharing policies, multi-model management, and observability — all through standard Kubernetes resources with an OpenAI-compatible API. You're not just running a model; you're running an inference platform that can grow with your needs.

### The KV Cache Advantage

One of AIBrix's most compelling features is its **distributed KV cache**. In a standard vLLM setup, each engine instance maintains its own isolated KV cache — meaning shared prompt prefixes get recomputed independently across replicas, wasting GPU cycles and HBM bandwidth. AIBrix solves this with a tiered caching architecture:

- **L1 DRAM-based caching** — offloads GPU memory pressure to CPU RAM with minimal latency overhead, significantly expanding effective cache capacity.
- **L2 distributed caching** — a shared KV cache layer that spans multiple nodes, enabling **cross-engine KV reuse** so that common prompt prefixes computed by one engine are available to all others.
- **KV event synchronization** — real-time coordination of cache states across distributed nodes to maximize prefix cache hit rates.

In practice, combining AIBrix's distributed KV cache with vLLM's built-in prefix caching has been shown to improve peak throughput by ~50%, reduce average TTFT by ~60% and P99 TTFT by ~70%, and lower inter-token latency by up to 70%. This is something you simply cannot get from a standalone vLLM deployment, whether via pip or Docker.

## Why the Minikube None Driver?

Minikube's default driver (Docker or KVM2) runs Kubernetes inside a nested VM. That's an extra layer of abstraction between your pods and your GPUs — and it costs you performance, memory, and complicates GPU passthrough. The `--driver=none` flag tells Minikube to run Kubernetes directly on the host, no VM involved. Combined with `--container-runtime=containerd`, this means your vLLM pods talk to the NVIDIA GPUs on bare metal with zero overhead. This is the setup you want on a dedicated server where you control the host.

## Install Prerequisites

```bash
# Kubernetes tools
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube

curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl

# Helm
sudo dnf install -y helm

# Kubernetes dependencies
sudo dnf install -y conntrack containernetworking-plugins

# NVIDIA container toolkit
sudo dnf install -y nvidia-container-toolkit
```

## Disable Swap & SELinux

```bash
sudo swapoff -a
sudo sed -i '/ swap / s/^\(.*\)$/#\1/g' /etc/fstab
sudo setenforce 0
```

## Start Minikube (None Driver)

```bash
sudo -E minikube start --driver=none --container-runtime=containerd
```

## Configure kubectl

```bash
mkdir -p ~/.kube
sudo cp /etc/kubernetes/admin.conf ~/.kube/config
sudo chown $(id -u):$(id -g) ~/.kube/config
chmod 600 ~/.kube/config
```

## Configure Containerd for NVIDIA

```bash
sudo nvidia-ctk runtime configure --runtime=containerd --set-as-default
sudo systemctl restart containerd
```

## Install NVIDIA Device Plugin

```bash
helm repo add nvidia https://helm.ngc.nvidia.com/nvidia
helm repo update
helm install nvidia-device-plugin nvidia/nvidia-device-plugin \
  --namespace nvidia-device-plugin --create-namespace \
  --set gpuSharingStrategy=none
```

## Verify GPUs

```bash
kubectl describe node | grep -A 15 "Capacity"
# Should show: nvidia.com/gpu: 2
```

## Install AIBrix

```bash
kubectl create -f https://github.com/vllm-project/aibrix/releases/download/v0.6.0/aibrix-dependency-v0.6.0.yaml
kubectl create -f https://github.com/vllm-project/aibrix/releases/download/v0.6.0/aibrix-core-v0.6.0.yaml

# Wait for pods
kubectl get pods -n aibrix-system -w
```

## Deploy a vLLM Model

Save as `model.yaml`:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    model.aibrix.ai/name: my-model
    model.aibrix.ai/port: "8000"
  name: my-model
  namespace: default
spec:
  replicas: 1
  selector:
    matchLabels:
      model.aibrix.ai/name: my-model
  template:
    metadata:
      labels:
        model.aibrix.ai/name: my-model
        model.aibrix.ai/port: "8000"
    spec:
      containers:
      - name: vllm-openai
        image: vllm/vllm-openai:latest
        command:
        - vllm
        - serve
        - --model
        - "meta-llama/Llama-3.2-3B-Instruct"
        - --served-model-name
        - my-model
        - --port
        - "8000"
        resources:
          limits:
            nvidia.com/gpu: "1"
          requests:
            nvidia.com/gpu: "1"
---
apiVersion: v1
kind: Service
metadata:
  name: my-model
  namespace: default
spec:
  ports:
  - port: 8000
    targetPort: 8000
  selector:
    model.aibrix.ai/name: my-model
```

```bash
kubectl apply -f model.yaml
```

---

That's it! Your AIBrix cluster with GPU support is ready.
