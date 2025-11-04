---
title: 'My 2025 Homelab (re)organization'
pubDate: 2025-11-03
description: 'Work in progress on my Homelab'
author: 'Johannes'
tags: ["homelab", "proxmox", "local ai"]
layout: '../../layouts/MarkdownPostLayout.astro'
---
# My 2025 Homelab (re)organization
I have a plan.

## Hardware
Been rearranging my PC hardware a bit to setup a multi-tiered "homelab" getting it ready for offline, local AI agent coding, workflow running, testing, etc.
```
                                   ┌────────────────────────────┐
                                   │       Developer (ME)       │
                                   │        Laptop / PC         │
                                   └──────────────┬─────────────┘
                                                  │
                                                  │  SSH / Coding agent
                                                  ▼
                         ┌──────────────────────────────────────────┐
                         │            Raspberry Pi 5                │
                         │──────────────────────────────────────────│
                         │  • PVE voter                             │
                         │  • Gitea Repository                      │
                         │  • Orchestration & Job Scheduler         │
                         │  • Coordinator Node                      │
                         └──────────────┬──────────────┬────────────┘
                                        │              │
                                        │              │
                                        ▼              ▼
        ┌────────────────────────────────────┐   ┌────────────────────────────────────┐
        │      Small Server (Light Tasks)    │   │      Big Server (Heavy Lifting)    │
        │────────────────────────────────────│   │────────────────────────────────────│
        │  • Proxmox                         │   │  • Proxmox                         │
        │  • AMD Ryzen 395+                  │   │  • Dual CPUs                       │
        │  • Low-power Processing            │   │  • Massive RAM                     │
        │  • Lightweight Containers          │   │  • nVidia GPU (Compute)            │
        │  • Background Services             │   │  • AI / Rendering / Storage        │
        └────────────────────────────────────┘   └────────────────────────────────────┘
                                        ▲              ▲
                                        │              │
                                        └──────────────┘
                                       Data / Results Sync 

```

## Software
I'm still fleshing out the details, but so far Proxmox with VMs running Ubuntu have made it in. And I'm looking at Gitea for offline GIT, PRs, CI/CD etc. Tailscale seems awesome for access on the move.

## Considerations
Any alternatives I should look at? Gitlab?

