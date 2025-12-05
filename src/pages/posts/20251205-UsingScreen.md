---
title: 'Using Screen in the Terminal'
pubDate: 2025-12-05
description: 'Short but sweet introduction to "screen"'
author: 'Johannes'
tags: ["terminal", "screen", "learning in public"]
layout: '../../layouts/MarkdownPostLayout.astro'
---

## What is Screen?

Screen is a terminal multiplexer that allows you to run multiple terminal sessions within a single window. It's particularly useful for:

- Running long-running processes that need to survive disconnections
- Managing multiple terminal sessions from a single SSH connection
- Detaching and reattaching to sessions later

## Basic Commands

- `screen` - Start a new session
- `screen -S name` - Start a named session
- `screen -ls` - List all sessions
- `screen -r` - Reattach to a session
- `screen -d -r` - Detach and reattach to a session

## Detaching

Use `CTRL + A`, then `D` to detach from a screen session, then you can use `screen -r` to reattach later

## Multiple screens

Use `CTRL + A`, then `C` to create another screen.
Use `CTRL + A`, then `A` to switch between screens.
Use `CTRL + A`, then `W` to show which screens are active.

## Scrolling in Screen

By default, scrolling with your mouse or Page Up/Down doesn't work in screen. Here are two ways to scroll:

### Method 1: Copy Mode

Use `CTRL + A`, then `Escape` to enter "Copy mode". After that, you can move your cursor around using the arrow keys or Page Up/Down. To exit copy mode, press `Escape` again.

### Method 2: Enable Mouse Scrollwheel

Add this to your `~/.screenrc` to enable mouse wheel scrolling:

```bash
echo 'termcapinfo xterm* ti@:te@' >> ~/.screenrc
```

This configures screen to allow your terminal's native scrolling behavior.
