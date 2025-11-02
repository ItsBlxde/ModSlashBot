# Discord Moderation Bot

## Overview
A Discord moderation bot featuring slash commands, dynamic status rotation, and terminal-themed message responses. The bot provides basic moderation capabilities with a unique hacker/terminal aesthetic for all interactions.

## Features
- **Slash Commands**: Modern Discord slash commands for all interactions
- **Moderation Tools**: Kick, ban, timeout (mute), warn, and clear messages
- **Dynamic Status**: Bot status rotates every 10-30 seconds
- **Terminal Aesthetic**: All bot responses styled like CLI terminal output
- **Utility Commands**: Server info, user info with terminal formatting

## Tech Stack
- Node.js 20
- Discord.js v14
- Chalk (terminal colors for console)
- Figlet (ASCII art)

## Project Structure
```
/
├── index.js          # Main bot file
├── commands/         # Slash command handlers
├── utils/            # Helper functions
└── package.json      # Dependencies
```

## Recent Changes
- 2025-11-02: Initial project setup

## Environment Variables
- `DISCORD_TOKEN`: Discord bot token (required)
