---
title: Complete Raspberry Pi 4 Setup and USB SSD Boot Guide
pubDate: 2025-11-05
description: A comprehensive guide to setting up and upgrading a Raspberry Pi 4, including network discovery for SSH access and booting from USB SSD for better performance.
author: 'Johannes'
tags:
  - raspberry-pi
  - linux
  - homelab
  - tutorial
  - ssd
layout: "../../layouts/MarkdownPostLayout.astro"
---

# Complete Raspberry Pi 4 Setup and USB SSD Boot Guide

The Raspberry Pi 4 is an incredibly versatile single-board computer that can serve as everything from a media server to a development workstation. One of the most significant upgrades you can make is booting from a USB SSD instead of a traditional SD card, which dramatically improves performance and reliability.

## Why Boot from USB SSD?

- **Performance**: SSDs offer significantly faster read/write speeds than SD cards
- **Reliability**: No more SD card corruption issues
- **Longevity**: SSDs have much longer lifespans than SD cards
- **Consistency**: Better performance under load and multiple simultaneous operations

## What You'll Need

#### Hardware
- Raspberry Pi 4 (any RAM configuration)
- USB 3.0 SSD or NVMe drive with USB adapter
- High-quality USB-C power supply (5V/3A minimum)
- MicroSD card (for initial setup)
- USB keyboard and mouse (or SSH access)
- Ethernet cable or Wi-Fi

#### Software
- Raspberry Pi Imager
- Another computer for initial setup

## Step 1: Initial SD Card Setup

First, we need to set up the Raspberry Pi with an SD card to enable USB boot.

#### Flash the OS
1. Download and install [Raspberry Pi Imager](https://www.raspberrypi.com/software/)
2. Insert your microSD card into your computer
3. Open Raspberry Pi Imager and select:
   - Device: Raspberry Pi 4
   - OS: Raspberry Pi OS (64-bit recommended)
   - Storage: Your microSD card

#### Configure Headless Setup
Before writing, click the gear icon to configure advanced options:
- Set hostname (e.g., `raspberrypi.local`)
- Enable SSH
- Set username and password
- Configure Wi-Fi (if not using ethernet)
- Set locale settings

## Step 2: Enable USB Boot

Once you've booted your Pi from the SD card, you need to enable USB boot capability.

#### Method 1: Using raspi-config
```bash
sudo raspi-config
```
Navigate to:
- Advanced Options → Boot Order → NVMe/USB boot
- Save and reboot

#### Method 2: Command Line
```bash
# Update the bootloader EEPROM
sudo rpi-eeprom-update -a

# Check if USB boot is enabled
vcgencmd bootloader_config | grep BOOT_ORDER
```

## Step 3: Prepare Your SSD

Now it's time to set up your USB SSD.

#### Flash OS to SSD
1. Connect your SSD to your computer via USB adapter
2. Use Raspberry Pi Imager to flash the same OS to the SSD (same configuration as before)
3. Alternatively, use `dd` on Linux/macOS:
```bash
sudo dd if=raspios-image.img of=/dev/sdX bs=4M status=progress
```

#### Boot from SSD
1. Safely eject the SSD and connect it to your Raspberry Pi 4
2. Remove the microSD card
3. Power on the Raspberry Pi

Your Pi should now boot from the USB SSD. The first boot may take longer than subsequent boots.

## Step 4: Finding Your Raspberry Pi on the Network

#### Using mDNS (Avahi)
If you set a hostname during configuration, you can access your Pi using:
```bash
ssh username@raspberrypi.local
```

#### Using Network Scanning
You can use nmap on a different Linux system (like WSL on Windows, or Ubuntu) to scan the local network for the IP address
```bash
nmap -sP 192.168.1.0/24
```

For me, I get this output:
```
Starting Nmap 7.94SVN ( https://nmap.org ) at 2025-11-05 13:16 CET
--<snip>--
Nmap scan report for rp4.home (192.168.1.92)
Host is up (0.00080s latency).
--<snip>--
Nmap done: 256 IP addresses (12 hosts up) scanned in 2.69 seconds
```

Now I know I can logon using:
```bash
ssh johannes@192.168.1.92
```

## Step 5: Post-Setup Optimization

#### Update System
```bash
sudo apt update && sudo apt upgrade -y
```

#### Overclock (Optional)
> IN PROGRESS -- I did not get these options in my config <br />
> (Raspberry Pi 4)

For better performance, you can safely overclock:
```bash
sudo raspi-config
# Performance Options → Overclock → Moderate (1.5GHz)
# Disable GPU memory splitting (for headless use)
# Advanced Options → Memory Split → 16

# Set performance governor
echo 'performance' | sudo tee /sys/devices/system/cpu/cpu0/cpufreq/scaling_governor
```

## Step 6: SSH Key Authentication

For secure access, set up SSH keys:

```bash
# On your client machine
ssh-keygen -t ed25519 -C "your_email@example.com"

# Copy the key to the Pi
ssh-copy-id username@raspberrypi.local

# Test the connection
ssh username@raspberrypi.local
```

## Step 7: Install Docker
Docker has made this process incredibly quick and straightforward by providing a bash script that installs everything for you.


You can download and run the official Docker setup script by running the following command.
```bash
curl -sSL https://get.docker.com | sh
```

Which gives me this output:
```
curl -sSL https://get.docker.com | sh
# Executing docker install script, commit: 21ac930799ead7539270df8a220d0505ed0e660f
+ sudo -E sh -c apt-get -qq update >/dev/null
+ sudo -E sh -c DEBIAN_FRONTEND=noninteractive apt-get -y -qq install ca-certificates curl >/dev/null
+ sudo -E sh -c install -m 0755 -d /etc/apt/keyrings
+ sudo -E sh -c curl -fsSL "https://download.docker.com/linux/debian/gpg" -o /etc/apt/keyrings/docker.asc
+ sudo -E sh -c chmod a+r /etc/apt/keyrings/docker.asc
+ sudo -E sh -c echo "deb [arch=arm64 signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/debian trixie stable" > /etc/apt/sources.list.d/docker.list
+ sudo -E sh -c apt-get -qq update >/dev/null
+ sudo -E sh -c DEBIAN_FRONTEND=noninteractive apt-get -y -qq install docker-ce docker-ce-cli containerd.io docker-compose-plugin docker-ce-rootless-extras docker-buildx-plugin docker-model-plugin >/dev/null
+ sudo -E sh -c docker version
Client: Docker Engine - Community
 Version:           28.5.1
 API version:       1.51
 Go version:        go1.24.8
 Git commit:        e180ab8
 Built:             Wed Oct  8 12:18:30 2025
 OS/Arch:           linux/arm64
 Context:           default

Server: Docker Engine - Community
 Engine:
  Version:          28.5.1
  API version:      1.51 (minimum version 1.24)
  Go version:       go1.24.8
  Git commit:       f8215cc
  Built:            Wed Oct  8 12:18:30 2025
  OS/Arch:          linux/arm64
  Experimental:     false
 containerd:
  Version:          v1.7.28
  GitCommit:        b98a3aace656320842a23f4a392a33f46af97866
 runc:
  Version:          1.3.0
  GitCommit:        v1.3.0-0-g4ca628d1
 docker-init:
  Version:          0.19.0
  GitCommit:        de40ad0

================================================================================

To run Docker as a non-privileged user, consider setting up the
Docker daemon in rootless mode for your user:

    dockerd-rootless-setuptool.sh install

Visit https://docs.docker.com/go/rootless/ to learn about rootless mode.


To run the Docker daemon as a fully privileged service, but granting non-root
users access, refer to https://docs.docker.com/go/daemon-access/

WARNING: Access to the remote API on a privileged Docker daemon is equivalent
         to root access on the host. Refer to the 'Docker daemon attack surface'
         documentation for details: https://docs.docker.com/go/attack-surface/

================================================================================

johannes@rp4:~ $
```

I'm pretty much ignoring that last info, just adding my user to the Docker group:
```bash
sudo usermod -aG docker $USER
```

After logging out and in again, I can run Docker!
```bash
johannes@rp4:~ $ docker run -it hello-world
Unable to find image 'hello-world:latest' locally
latest: Pulling from library/hello-world
198f93fd5094: Pull complete
Digest: sha256:56433a6be3fda188089fb548eae3d91df3ed0d6589f7c2656121b911198df065
Status: Downloaded newer image for hello-world:latest

Hello from Docker!
This message shows that your installation appears to be working correctly.

To generate this message, Docker took the following steps:
 1. The Docker client contacted the Docker daemon.
 2. The Docker daemon pulled the "hello-world" image from the Docker Hub.
    (arm64v8)
 3. The Docker daemon created a new container from that image which runs the
    executable that produces the output you are currently reading.
 4. The Docker daemon streamed that output to the Docker client, which sent it
    to your terminal.

To try something more ambitious, you can run an Ubuntu container with:
 $ docker run -it ubuntu bash

Share images, automate workflows, and more with a free Docker ID:
 https://hub.docker.com/

For more examples and ideas, visit:
 https://docs.docker.com/get-started/
 ```

#### Disable Password Authentication
Edit `/etc/ssh/sshd_config`:
```bash
sudo nano /etc/ssh/sshd_config
```
Set:
```
PasswordAuthentication no
PubkeyAuthentication yes
```
Restart SSH:
```bash
sudo systemctl restart ssh
```

## Troubleshooting

#### Pi Won't Boot from USB SSD
1. **Check power supply**: Ensure you're using a 3A power supply
2. **USB compatibility**: Some USB adapters aren't compatible
3. **Boot order**: Verify USB boot is enabled in the EEPROM
4. **Firmware update**: Update the bootloader EEPROM

#### Network Issues
1. **Check cables**: Ensure Ethernet cable is properly connected
2. **Restart networking**: `sudo systemctl restart networking`
3. **Check IP**: Use `ip addr show` to verify network configuration

#### Performance Issues
1. **USB 2.0 limitation**: Some SSDs only work in USB 2.0 mode on Pi 4
2. **Power delivery**: Ensure adequate power to both Pi and SSD
3. **Thermal throttling**: Monitor CPU temperature with `vcgencmd measure_temp`

## SSD Recommendations

#### Best Compatible SSDs
- **Samsung T7/T5**: Excellent compatibility and performance
- **Crucial X6/X8**: Good value and reliability
- **SanDisk Extreme**: Solid performance with durable casing

#### USB Adapters
- **Ugreen NVMe to USB adapters**: Generally reliable
- **ORICO USB-C enclosures**: Good build quality
- Avoid cheap adapters - they often cause boot issues

## Performance Benchmarks

With a proper USB SSD setup, you can expect:
- **Boot time**: 15-20 seconds (vs 45+ seconds on SD)
- **Package installation**: 3-4x faster
- **File operations**: 10x faster read/write speeds
- **System responsiveness**: Noticeably better under load

## Conclusion

Setting up your Raspberry Pi 4 to boot from a USB SSD transforms the device from a hobbyist board into a capable server. The improved performance, reliability, and longevity make it well worth the effort, especially for any project requiring consistent performance or 24/7 operation.

Whether you're running Home Assistant, a media server with Plex/Jellyfin, a development environment, or just want a more responsive desktop experience, USB SSD booting is the way to go for Raspberry Pi 4.