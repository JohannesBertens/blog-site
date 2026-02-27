---
title: 'How to develop Power App Code Apps in WSL in Windows'
pubDate: 2025-11-03
description: 'Basic instructions for developing Power Apps Code Apps in WSL (superseded by newer post)'
author: 'Johannes'
image:
    url: 'https://imgs.search.brave.com/zo5ZWYCz2rzRPqGats8es3JLe3fkB_yc5ASL0rUg1bQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/cHJvZC53ZWJzaXRl/LWZpbGVzLmNvbS82/N2NlMjhjZmVjNjI0/ZTJiNzMzZjhhNTIv/NjgyNmE2MjI3YjFm/YmQ0NzAzNGQxOTM2/X2NsYXVkZS1jb2Rl/LndlYnA'
    alt: 'Claude Code terminal.'
tags: ["power apps", "wsl", "dotnet", "pac cli"]
layout: '../../layouts/MarkdownPostLayout.astro'
---
# How to develop Power App Code Apps in WSL in Windows

> **⚠️ This post is outdated!** Check out the updated guide: [Getting Power Apps Code Apps working on WSL](/posts/20260227-PowerAppsCodeAppsWSL) which covers .NET SDK 10.0 and the essential secret service backend configuration.

Steps needed to develop Power Apps Code Apps in Windows WSL (my coding place of choice). This is a note to myself for when I re-install WSL or Windows 😊 

## Install WSL2
```bash
wsl --list --online (to see if there's anything fun)
wsl --install Ubuntu
```

## Install git, build-essential, gh
```bash
sudo apt install libcurl4-openssl-dev (to fix git over https)
```

## Install dotnet
```bash
sudo add-apt-repository ppa:dotnet/backports
sudo apt-get update && sudo apt-get install -y dotnet-sdk-9.0 (I also did 8)
```

## Install pac
```bash
dotnet tool install --global Microsoft.PowerApps.CLI.Tool
pac auth create --deviceCode
```

Ready to go!