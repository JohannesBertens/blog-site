---
title: 'GPU Passthrough in Proxmox with Fedora Server VM'
pubDate: 2026-03-30
description: 'Complete guide to setting up NVIDIA GPU passthrough in Proxmox VE 9.1 with a Fedora Server 43 VM for local AI inference'
author: 'Johannes'
tags: ["proxmox", "gpu passthrough", "nvidia", "fedora", "vllm", "homelab", "virtualization"]
layout: '../../layouts/MarkdownPostLayout.astro'
---

## Introduction

This guide walks through setting up NVIDIA GPU passthrough in Proxmox VE 9.1 with a Fedora Server 43 virtual machine. This is ideal for running local AI workloads (vLLM, llama.cpp, etc.) with near-native GPU performance.

> **Note**: This setup is for non-commercial, non-enterprise use. NVIDIA's EULA for consumer GPUs restricts datacenter/virtualized use. For enterprise/ datacenter use, consider NVIDIA A100/H100 cards or vGPU licensing.

## What You'll Need

- Proxmox VE 9.1 installed on your host
- NVIDIA GPU (GTX/RTX series or newer)
- Fedora Server 43 ISO
- SSH access to Proxmox host

---

## Special Notes for NVIDIA RTX PRO 6000 Blackwell

If you're using the **RTX PRO 6000 Blackwell** (Server Edition or Workstation Edition), please note:

| Requirement | Value |
|-------------|-------|
| Architecture | Blackwell (GB202) |
| Compute Capability | 12.2 (SM122) |
| Minimum CUDA | 12.8 |
| Minimum Driver | 570+ (575+ recommended) |
| Driver Type | **Open-source kernel modules required** |

### Critical Requirements for RTX PRO 6000 Blackwell:

1. **Resizable BAR (ReBAR) must be enabled** in BIOS - This is critical for GPU passthrough to work
2. **Use open-source driver** - The proprietary driver will NOT work. Use:
   - Fedora: `akmod-nvidia-open` (NOT `akmod-nvidia`)
   - Or install from RPM Fusion: `xorg-x11-drv-nvidia-open`
3. **CUDA 12.8+ required** - CUDA 12.8 is the minimum for Blackwell support
4. **VM Memory** - Ensure VM has enough memory to properly address the GPU (disable ballooning)

> **Important**: The RTX PRO 6000 Blackwell requires the open-source `nvidia-open` kernel modules. The proprietary `nvidia` driver will fail to detect the GPU. This is a firmware requirement.

**Documentation**: [NVIDIA RTX PRO 6000 Blackwell Driver Support](https://forums.developer.nvidia.com/t/rtx-pro-6000-blackwell-workstation-edition-driver-support/332701)

---

## Step 1: Download Proxmox VE 9.1 ISO

Download the latest Proxmox VE ISO from the official downloads page.

**Download URL**: [https://www.proxmox.com/en/downloads/proxmox-virtual-environment](https://www.proxmox.com/en/downloads/proxmox-virtual-environment)

**Direct ISO link**: [Proxmox VE 9.1-1 ISO Installer](https://download.proxmox.com/iso/proxmox-ve_9.1-1.iso)

**Documentation**: [Proxmox VE Installation](https://pve.proxmox.com/wiki/Installation)

---

## Step 2: Download Fedora Server 43 ISO

Download the Fedora Server ISO for your VM.

**Download URL**: [https://fedoraproject.org/server/download/](https://fedoraproject.org/server/download/)

**Direct Downloads**:
- DVD ISO: [Fedora-Server-dvd-x86_64-43-1.0.iso](https://download.fedoraproject.org/pub/fedora/linux/releases/43/Server/x86_64/iso/Fedora-Server-dvd-x86_64-43-1.0.iso)
- NetInst ISO: [Fedora-Server-netinst-x86_64-43-1.0.iso](https://download.fedoraproject.org/pub/fedora/linux/releases/43/Server/x86_64/iso/Fedora-Server-netinst-x86_64-43-1.0.iso)

**Documentation**: [Fedora Server Installation Guide](https://docs.fedoraproject.org/en-US/fedora/fedora-user-guide-documentation/)

---

## Step 3: Enable IOMMU in Proxmox Host BIOS/UEFI

Before configuring Proxmox, ensure your motherboard's BIOS has virtualization and IOMMU enabled.

### Required BIOS Settings

| Setting | Value | Notes |
|---------|-------|-------|
| Intel VT-d / AMD-V | Enabled | Essential for IOMMU |
| Above 4G Decoding | Enabled | Required for GPUs with large VRAM |
| Resizable BAR | **Enabled** | **Required for RTX PRO 6000 Blackwell** |
| CSM/Legacy Boot | Disabled | Use UEFI only |

> **Note on Resizable BAR**: 
> - For **RTX PRO 6000 Blackwell**: Must be **Enabled** (required for 96GB VRAM)
> - For other NVIDIA GPUs: Can be Disabled

**Documentation**: [Proxmox PCI Passthrough Requirements](https://pve.proxmox.com/wiki/PCI_Passthrough#Requirements)

---

## Step 4: Configure GRUB for IOMMU

Edit the Proxmox host's GRUB configuration to enable IOMMU.

```bash
# Edit GRUB config
nano /etc/default/grub
```

Add the IOMMU parameter to `GRUB_CMDLINE_LINUX_DEFAULT`:

**For Intel CPUs:**
```bash
GRUB_CMDLINE_LINUX_DEFAULT="quiet intel_iommu=on iommu=pt"
```

**For AMD CPUs:**
```bash
GRUB_CMDLINE_LINUX_DEFAULT="quiet amd_iommu=on iommu=pt"
```

Optional: Add ACS override if you have IOMMU group issues:
```bash
GRUB_CMDLINE_LINUX_DEFAULT="quiet intel_iommu=on iommu=pt pcie_acs_override=downstream,multifunction"
```

Update GRUB:
```bash
update-grub
```

**Documentation**: [Proxmox IOMMU Configuration](https://pve.proxmox.com/wiki/PCI_Passthrough#Verify_IOMMU_parameters)

---

## Step 5: Verify IOMMU is Working

Reboot the Proxmox host, then verify IOMMU is enabled:

```bash
dmesg | grep -e DMAR -e IOMMU
```

You should see:
```
DMAR: IOMMU enabled
AMD-Vi: Interrupt remapping enabled  # AMD only
DMAR-IR: Enabled IRQ remapping in x2apic mode  # Intel only
```

Check IOMMU groups:
```bash
pvesh get /nodes/pve/hardware/pci --pci-class-blacklist ""
```

Look for your GPU (e.g., `01:00.0` for NVIDIA).

**Documentation**: [Verify IOMMU](https://pve.proxmox.com/wiki/PCI_Passthrough#Verify_IOMMU_is_enabled)

---

## Step 6: Blacklist Host GPU Drivers

Prevent Proxmox from claiming the GPU.

```bash
# Create blacklist config
nano /etc/modprobe.d/blacklist.conf
```

Add:
```bash
blacklist nouveau
blacklist nvidia
blacklist nvidiafb
blacklist rivafb
```

**Documentation**: [Blacklisting Drivers](https://pve.proxmox.com/wiki/PCI_Passthrough#Blacklisting_drivers)

---

## Step 7: Bind GPU to VFIO

Find your GPU's Vendor and Device IDs:

```bash
lspci -nn | grep -E "VGA|3D"
```

Output example:
```
01:00.0 VGA compatible controller [0300]: NVIDIA Corporation GA102 [GeForce RTX 3080] [10de:1d01] (rev a1)
```

- Vendor ID: `10de` (NVIDIA)
- Device ID: `1d01` (RTX 3080)

Bind to VFIO:
```bash
nano /etc/modprobe.d/vfio.conf
```

Add:
```bash
options vfio-pci ids=10de:1d01
```

> **Note**: If you have multiple GPUs, add them all: `options vfio-pci ids=10de:1d01,10de:1d02`

Update initramfs:
```bash
update-initramfs -u -k all
```

Reboot:
```bash
reboot
```

**Documentation**: [VFIO Configuration](https://pve.proxmox.com/wiki/PCI_Passthrough)

---

## Step 8: Verify GPU is Using VFIO

After reboot, verify the GPU is bound to vfio-pci:

```bash
lspci -k | grep -A 2 -E "VGA|3D"
```

Output should show:
```
Kernel driver in use: vfio-pci
```

---

## Step 9: Create Fedora Server VM

In Proxmox web UI:

1. **Create VM** → Click "Create VM"
2. **General**: Set VM ID (e.g., 100) and Name
3. **OS**: Select "Do not use any media" (we'll install via ISO)
4. **System**: 
   - Machine: `q35`
   - BIOS: `OVMF` (UEFI)
   - Add EFI disk
5. **Hard Disk**: Create a disk (100GB+ for AI workloads)
6. **CPU**: 
   - Type: `host` (important for passthrough)
   - Cores: Allocate as needed
7. **Memory**: Allocate RAM (16GB+ recommended for AI)
8. **Network**: VirtIO
9. **Finish**: Don't start yet

**Documentation**: [Creating VMs in Proxmox](https://pve.proxmox.com/wiki/Quick_Start#create_first_vm)

---

## Step 10: Add GPU Passthrough to VM

### Option A: Via Proxmox Web UI

1. Select your VM → **Hardware** → **Add** → **PCI Device**
2. Select your GPU (e.g., `0000:01:00.0`)
3. Check options:
   - [x] All Functions
   - [x] Primary GPU (only if using GPU for display)
   - [x] PCI-Express
4. Click **Add**

### Option B: Via Command Line

Edit the VM config file:
```bash
nano /etc/pve/qemu-server/100.conf
```

Add the GPU passthrough line:
```bash
hostpci0: 01:00,x-vga=on,pcie=1
```

> **Note**: Remove `x-vga=on` if you don't need the GPU to drive a display.

**Documentation**: [GPU Passthrough Configuration](https://pve.proxmox.com/wiki/PCI_Passthrough#GPU_passthrough)

---

## Step 11: Mount Fedora ISO and Install

1. In Proxmox UI, select VM → **Hardware** → **Add** → **CD/DVD Drive**
2. Select the Fedora Server ISO
3. Start the VM
4. Install Fedora Server normally
5. Create a user and set root password

---

## Step 12: Install NVIDIA Drivers in Fedora VM

After installation, SSH into your Fedora VM and install NVIDIA drivers.

> **Important**: Choose the correct driver based on your GPU:
> - **RTX PRO 6000 Blackwell**: Use `akmod-nvidia-open` (open-source driver required)
> - **All other NVIDIA GPUs**: Use `akmod-nvidia` (proprietary driver)

### For RTX PRO 6000 Blackwell (Open-Source Driver Required)

```bash
sudo dnf update
sudo dnf install akmod-nvidia-open
```

### For Standard NVIDIA GPUs (GTX/RTX Ada and older)

```bash
sudo dnf update
sudo dnf install akmod-nvidia
```

### Install CUDA Drivers (For vLLM/AI)

```bash
sudo dnf install xorg-x11-drv-nvidia-cuda
```

### Enable RPM Fusion (Recommended for NVIDIA Drivers)

```bash
sudo dnf install https://download1.rpmfusion.org/free/fedora/rpmfusion-free-release-$(rpm -E %fedora).noarch.rpm
sudo dnf install https://download1.rpmfusion.org/nonfree/fedora/rpmfusion-nonfree-release-$(rpm -E %fedora).noarch.rpm
sudo dnf update
```

Then install the appropriate driver:
```bash
# For Blackwell GPUs
sudo dnf install akmod-nvidia-open

# For older GPUs
sudo dnf install akmod-nvidia
```

### Enable EPEL for additional tools (Optional)

```bash
sudo dnf install epel-release
sudo dnf copr enable zaneb/proxmox  # For qemu-guest-agent
sudo dnf install qemu-guest-agent
```

Reboot the VM:
```bash
sudo reboot
```

**Documentation**:
- [NVIDIA Driver Installation on Fedora](https://docs.fedoraproject.org/en-US/fedora/fedora-user-guide-documentation/sect-nvidia_driver/)
- [RPM Fusion NVIDIA Drivers](https://docs.fedoraproject.org/en-US/fedora/fedora-user-guide-documentation/sect-nvidia_driver/#sect-nvidia_driver Installation)

---

## Step 13: Verify GPU is Working

Check GPU detection:
```bash
nvidia-smi
```

Expected output:
```
+---------------------------------------------------------------------------------------+
| NVIDIA-SMI 535.216.03   Driver Version: 535.216.03   CUDA Version: 13.0             |
|-------------------------------+----------------------+----------------------+
| GPU  Name        Persistence-M| Bus-Id        Disp.A | Volatile Uncorr. ECC |
| Fan  Temp  Perf  Pwr:Usage/Cap|         Memory-Usage | GPU-Util  Compute M. |
|===============================+======================+======================|
|   0  NVIDIA GeForce ...  Off  | 00000000:01:00.0 N/A |                  N/A |
+-------------------------------+----------------------+----------------------+
```

**Documentation**: [NVIDIA System Management Interface](https://docs.nvidia.com/deploy/nvidia-smi/index.html)

---

## Step 14: Install vLLM (Optional)

Now your GPU passthrough is working. Install vLLM for local AI inference:

```bash
# Install UV
curl -LsSf https://astral.sh/uv/install.sh | sh
source $HOME/.bashrc

# Create vllm environment
mkdir vllm && cd vllm
uv venv --python 3.12
source .venv/bin/activate

# Install vLLM with CUDA 13.0 (recommended for Blackwell GPUs)
export CUDA_VERSION=130
uv pip install vllm --extra-index-url https://download.pytorch.org/whl/cu${CUDA_VERSION}
```

> **Note**: For NVIDIA Blackwell GPUs (B200, GB200, B300), CUDA 13 is required. For older GPUs (Ada Lovelace, Ampere), CUDA 12.8 or 12.9 also works fine.
>
> The latest CUDA Toolkit is [CUDA 13.2](https://developer.nvidia.com/cuda-downloads) (January 2026).

**Documentation**: [vLLM Installation](https://docs.vllm.ai/en/stable/getting_started/installation/gpu/)

---

## Troubleshooting

### Error: "BAR0 is 0M" in VM

This is common with high-VRAM GPUs like RTX PRO 6000 (96GB). Increase MMIO window:

```bash
# For 96GB GPUs, increase to 128GB
qm set 100 --args '-fw_cfg name=opt/ovmf/X-PciMmio64Mb,string=131072'
```

Or use host CPU type:
```bash
qm set 100 --cpu host
```

### RTX PRO 6000 Blackwell - GPU Not Detected

If using RTX PRO 6000 Blackwell and GPU is not detected:

1. **Verify you're using open-source driver**:
   ```bash
   # Must use akmod-nvidia-open, NOT akmod-nvidia
   sudo dnf install akmod-nvidia-open
   ```

2. **Check driver loading**:
   ```bash
   lsmod | grep nvidia
   # Should show nvidia_open if using open driver
   ```

3. **Check dmesg for errors**:
   ```bash
   dmesg | grep -i nvidia
   ```

4. **Verify Resizable BAR is enabled in BIOS**:
   - Enter BIOS/UEFI
   - Find "Resizable BAR" or "Above 4G Decoding"
   - Enable both settings

### GPU Not Showing in VM

- Verify `lspci` in VM shows the GPU
- Check Proxmox host `dmesg` for VFIO errors
- Ensure IOMMU groups are separate
- For RTX PRO 6000 Blackwell: Ensure you're using open-source driver

**Documentation**: [PCI Passthrough Troubleshooting](https://pve.proxmox.com/wiki/PCI_Passthrough#Troubleshooting)

---

## Summary

You're now running Fedora Server 43 in Proxmox with NVIDIA GPU passthrough! This gives you near-native GPU performance for:

- vLLM inference
- llama.cpp
- Stable Diffusion
- Other GPU-accelerated workloads

**VM Config Example** (`/etc/pve/qemu-server/100.conf`):
```bash
agent: 1
balloon: 0  # Disabled - required for RTX PRO 6000 with 96GB VRAM
boot: order=scsi0;ide2;net0
cores: 8
cpu: host
hostpci0: 01:00,x-vga=on,pcie=1
machine: q35
memory: 65536  # 64GB recommended for large VRAM GPUs
meta: creation-qemu=8.1.5,ctime=1743350400
name: ai-vm
net0: virtio=XX:XX:XX:XX:XX:XX,bridge=vmbr0
numa: 0
ostype: l26
scsi0: local-lvm:vm-100-disk-0,backup=0,size=200G
scsihw: virtio-scsi-pci
sockets: 1
vga: virtio
```

> **Note**: For RTX PRO 6000 Blackwell with 96GB VRAM, balloon is set to 0 (disabled) and memory increased to 64GB to properly address the GPU.

---

## References

- [Proxmox PCI Passthrough Documentation](https://pve.proxmox.com/wiki/PCI_Passthrough)
- [Proxmox VE Downloads](https://www.proxmox.com/en/downloads)
- [Fedora Server Download](https://fedoraproject.org/server/download/)
- [NVIDIA Driver Installation on Fedora](https://docs.fedoraproject.org/en-US/fedora/fedora-user-guide-documentation/sect-nvidia_driver/)
- [vLLM Documentation](https://docs.vllm.ai/)
