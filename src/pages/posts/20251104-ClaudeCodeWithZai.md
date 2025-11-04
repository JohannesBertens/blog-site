---
title: 'Using Claude Code with z.ai GLM 4.6'
pubDate: 2025-11-03
description: 'Short but sweet instructions on how to install Claude Code and setup integration with GLM 4.6'
author: 'Johannes'
image:
    url: 'https://imgs.search.brave.com/zo5ZWYCz2rzRPqGats8es3JLe3fkB_yc5ASL0rUg1bQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/cHJvZC53ZWJzaXRl/LWZpbGVzLmNvbS82/N2NlMjhjZmVjNjI0/ZTJiNzMzZjhhNTIv/NjgyNmE2MjI3YjFm/YmQ0NzAzNGQxOTM2/X2NsYXVkZS1jb2Rl/LndlYnA'
    alt: 'Claude Code terminal.'
tags: ["claude code", "z.ai", "learning in public"]
layout: '../../layouts/MarkdownPostLayout.astro'
---
# Using Claude Code with z.ai's GLM 4.6
"GLM Coding Plan — built for devs: 3× usage, 1/7 cost"
It's actually working for me pretty decent without any limits (November 2025)

## Install Claude Code
```bash
curl -fsSL https://claude.ai/install.sh | bash
```

## Install zai config for Claude
```bash
curl -O "https://cdn.bigmodel.cn/install/claude_code_zai_env.sh" && bash ./claude_code_zai_env.sh
```

This will ask you for your zai API key and add it to `~/.claude/settings.json`
```
{
    "env": {
        "ANTHROPIC_AUTH_TOKEN": "your_zai_api_key",
        "ANTHROPIC_BASE_URL": "https://api.z.ai/api/anthropic",
        "API_TIMEOUT_MS": "3000000"
    }
}
```

## Setup 4.6 by adding these to the ~/.claude.settings "env" block:
```
"ANTHROPIC_DEFAULT_HAIKU_MODEL": "glm-4.5-air",
"ANTHROPIC_DEFAULT_SONNET_MODEL": "glm-4.6",
"ANTHROPIC_DEFAULT_OPUS_MODEL": "glm-4.6"
```

## Optional, but very handy, add the two zai MCP servers for search and vision
```bash
claude mcp add -s user zai-mcp-server --env Z_AI_API_KEY=your_api_key Z_AI_MODE=ZAI -- npx -y "@z_ai/mcp-server"
claude mcp add -s user -t http web-search-prime https://api.z.ai/api/mcp/web_search_prime/mcp --header "Authorization: Bearer your_api_key"
```

There we go!

I'm using the "GLM Coding Pro-Quarterly Plan", haven't run into hard limits yet. Do get some slowdowns now and then, ymmv.
Refferal link (with 10% off): https://z.ai/subscribe?ic=H8GEDJSBCH