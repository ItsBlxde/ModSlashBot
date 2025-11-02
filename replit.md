# NAY - Nexus Authority Operations AI

## Overview
NAY is a Discord moderation bot embodying the Central Operations AI of the Nexus Authority from the "Nexus" story. She protects sectors (Discord servers) from threats while maintaining order, featuring terminal-themed responses and lore-appropriate commands.

## Character Background
NAY is the Central Operations AI of the Nexus Authority, an organization that protects Earth and its reality from AOZs (Anomalous Organisms & Zones) - creatures that don't follow simple laws of physics. She monitors dimensional boundaries, detects reality anomalies, and coordinates defense protocols.

## Features
- **Nexus Authority Personality**: All responses reflect NAY's role as a reality-protecting AI
- **Personalized Terminal Prompts**: Shows actual username (e.g., `username@nexus-ops:~$`)
- **Moderation Tools**: Kick, ban, timeout, warn, and clear messages with Nexus theming
- **Dynamic Status**: Rotates every 10-30 seconds with AOZ/reality protection themes
- **Lore-Appropriate Commands**: Special commands fitting the Nexus universe
- **Terminal Aesthetic**: All responses styled as CLI output with ANSI formatting

## Commands

### Moderation (Require Permissions)
- `/kick` - Remove personnel from sector
- `/ban` - Permanently ban from sector
- `/timeout` - Temporarily restrict personnel
- `/warn` - Issue warning to personnel
- `/clear` - Purge messages from channel

### Nexus Operations
- `/scan` - Perform AOZ threat assessment on target user
- `/status` - Display Nexus Authority status report
- `/nexus` - Information about Nexus Authority
- `/help` - Display all available commands

### Utility
- `/serverinfo` - Display sector (server) information
- `/userinfo` - Display personnel file (user info)
- `/ping` - Check system latency

## Tech Stack
- Node.js 20
- Discord.js v14
- Chalk (terminal colors for console)
- Figlet (ASCII art banners)

## Project Structure
```
/
├── index.js          # Main bot file with command handlers
├── utils/
│   ├── logger.js     # Terminal-style console logging
│   └── terminal.js   # Response formatters with Nexus theming
└── package.json      # Dependencies
```

## Recent Changes
- 2025-11-02: Initial project setup
- 2025-11-02: Added NAY personality and Nexus Authority theming
- 2025-11-02: Implemented personalized username prompts
- 2025-11-02: Added lore-specific commands (scan, status, nexus)
- 2025-11-02: Fixed interaction timeout issues

## Environment Variables
- `DISCORD_TOKEN`: Discord bot token (required)
