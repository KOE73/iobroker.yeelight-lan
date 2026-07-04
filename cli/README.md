# Yeelight CLI

This folder contains command-line tools to interact with Yeelight devices on the local network. 

## Design Philosophy
- **Minimum custom code**: Rely heavily on `core/` modules.
- **Node.js**: Written in JavaScript for execution via Node.
- **Wrappers**: Each script should have a corresponding `.cmd` wrapper to easily pass arguments and run on Windows.
- **Beautiful Output**: The CLI should format core results beautifully into the terminal, suppressing verbose logging if needed.

## Commands

### `scan.cmd`
Scans the local network for Yeelight/Mi devices using SSDP and outputs a beautifully formatted result.

**Usage:**
```bash
scan.cmd [--timeout <milliseconds>] [--interface <local-ip>]
```

**Example:**
```bash
scan.cmd -t 5000
```

### `local-scan.cmd`
Runs the same scanner with the local LAN interface preselected.

**Example:**
```bash
local-scan.cmd -t 5000
```

### Group control commands
Each command first scans the network, then applies the action to all discovered devices.

```bash
all-off.cmd
all-on.cmd
all-ct5600-max.cmd
all-ct2700-min.cmd
```

Local-interface variants use `192.168.199.2` for discovery:

```bash
local-all-off.cmd
local-all-on.cmd
local-all-ct5600-max.cmd
local-all-ct2700-min.cmd
```
