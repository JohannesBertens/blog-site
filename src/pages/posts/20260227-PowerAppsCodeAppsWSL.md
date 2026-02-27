---
title: 'Getting Power Apps Code Apps working on WSL'
pubDate: 2026-02-27
description: 'How to install and configure .NET SDK 10.0, PAC CLI, and the secret service backend needed for Power Apps Code Apps on WSL.'
author: 'Johannes'
image:
    url: 'https://imgs.search.brave.com/zo5ZWYCz2rzRPqGats8es3JLe3fkB_yc5ASL0rUg1bQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/cHJvZC53ZWJzaXRl/LWZpbGVzLmNvLzY3/Y2UyOGNmZWM2MjRl/MmI3MzNmOGE1NS82/ODI2YTYyMjdiMWZi/ZDQ3MDM0ZDE5MzZf/Y2xhdWRlLWNvZGUu/d2VicA'
    alt: 'Power Apps Code Apps development in WSL terminal.'
tags: ["power apps", "wsl", "dotnet", "pac cli"]
layout: '../../layouts/MarkdownPostLayout.astro'
---
# Getting Power Apps Code Apps working on WSL

If you're developing Power Apps Code Apps on WSL, you'll run into a pesky persistence error if you don't have a proper secret service backend configured. This guide walks through installing .NET SDK 10.0, the PAC CLI, and the essential secret service setup that makes everything work.

## The Problem

Without the secret service backend properly configured, running `npm run pa:run` will fail with this error:

```
Error during CLI execution: PersistenceError: CachePersistenceError: Verifing persistence failed with the error: Error: The name org.freedesktop.secrets was not provided by any .service files
```

**Important:** Disabling the keyring or keychain does NOT work. You need a proper secret service backend.

## Install .NET SDK 10.0

First, add the .NET backports repository and install the SDK:

```bash
sudo add-apt-repository ppa:dotnet/backports
sudo apt update
sudo apt install dotnet-sdk-10.0
```

## Install PAC CLI

Install the Power Apps CLI globally using dotnet:

```bash
dotnet tool install --global Microsoft.PowerApps.CLI.Tool
```

Add the tools directory to your PATH if needed (add to `~/.bashrc` or `~/.zshrc`):

```bash
export PATH="$PATH:$HOME/.dotnet/tools"
```

## Login with Device Code

Authenticate using the device code flow (perfect for WSL where browser auth can be tricky):

```bash
pac auth create --deviceCode
```

Follow the instructions to complete the login in your browser.

## Install Secret Service Backend

This is the critical step that prevents the persistence error. Install `dbus-user-session` and `gnome-keyring`:

```bash
sudo apt update
sudo apt install dbus-user-session gnome-keyring
```

## Configure the Secret Service

Add the following to your `~/.bashrc` or `~/.zshrc`:

```bash
export XDG_RUNTIME_DIR=/tmp/runtime-$USER
mkdir -p $XDG_RUNTIME_DIR
chmod 700 $XDG_RUNTIME_DIR
```

Then start the services:

```bash
eval "$(dbus-launch --sh-syntax)"
eval "$(gnome-keyring-daemon --start)"
export SSH_AUTH_SOCK
```

You'll be prompted to set a keyring password on first run. Choose something you'll remember (or leave it empty for no password, though that's less secure).

## Make it Permanent

To have these services start automatically, add the eval commands to your shell profile as well. Your complete `~/.bashrc` or `~/.zshrc` additions should look like:

```bash
# Dotnet tools
export PATH="$PATH:$HOME/.dotnet/tools"

# Secret service for PAC CLI
export XDG_RUNTIME_DIR=/tmp/runtime-$USER
mkdir -p $XDG_RUNTIME_DIR
chmod 700 $XDG_RUNTIME_DIR

# Start dbus and gnome-keyring
if [ -z "$DBUS_SESSION_BUS_ADDRESS" ]; then
    eval "$(dbus-launch --sh-syntax)"
    eval "$(gnome-keyring-daemon --start)"
    export SSH_AUTH_SOCK
fi
```

The conditional check prevents dbus from launching multiple times if you open multiple terminal sessions.

## Verify Everything Works

After restarting your shell or sourcing your profile:

```bash
source ~/.bashrc  # or source ~/.zshrc
```

Run your Power Apps Code App:

```bash
npm run pa:run
```

It should now work without the persistence error!
