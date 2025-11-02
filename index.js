import { Client, GatewayIntentBits, REST, Routes, PermissionFlagsBits } from 'discord.js';
import chalk from 'chalk';
import logger from './utils/logger.js';
import { createTerminalEmbed, formatTerminalResponse, formatModAction, formatServerInfo, formatUserInfo, formatThreatScan, formatStatusReport, formatNexusHelp } from './utils/terminal.js';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildModeration
  ]
});

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;

if (!DISCORD_TOKEN) {
  console.error('ERROR: DISCORD_TOKEN environment variable is not set!');
  console.error('Please add your Discord bot token as DISCORD_TOKEN in the Secrets tab.');
  process.exit(1);
}

const commands = [
  {
    name: 'kick',
    description: '[NEXUS] Remove personnel from sector',
    options: [
      {
        name: 'user',
        description: 'Target personnel',
        type: 6,
        required: true
      },
      {
        name: 'reason',
        description: 'Reason for removal',
        type: 3,
        required: false
      }
    ]
  },
  {
    name: 'ban',
    description: '[NEXUS] Permanently ban from sector',
    options: [
      {
        name: 'user',
        description: 'Target personnel',
        type: 6,
        required: true
      },
      {
        name: 'reason',
        description: 'Reason for ban',
        type: 3,
        required: false
      }
    ]
  },
  {
    name: 'timeout',
    description: '[NEXUS] Temporarily restrict personnel',
    options: [
      {
        name: 'user',
        description: 'Target personnel',
        type: 6,
        required: true
      },
      {
        name: 'duration',
        description: 'Duration in minutes (1-10080)',
        type: 4,
        required: true
      },
      {
        name: 'reason',
        description: 'Reason for restriction',
        type: 3,
        required: false
      }
    ]
  },
  {
    name: 'warn',
    description: '[NEXUS] Issue warning to personnel',
    options: [
      {
        name: 'user',
        description: 'Target personnel',
        type: 6,
        required: true
      },
      {
        name: 'reason',
        description: 'Warning reason',
        type: 3,
        required: true
      }
    ]
  },
  {
    name: 'clear',
    description: '[NEXUS] Purge messages from channel',
    options: [
      {
        name: 'amount',
        description: 'Number of messages (1-100)',
        type: 4,
        required: true
      }
    ]
  },
  {
    name: 'scan',
    description: '[NAY] Perform AOZ threat assessment on target',
    options: [
      {
        name: 'target',
        description: 'User to scan for anomalies',
        type: 6,
        required: true
      }
    ]
  },
  {
    name: 'status',
    description: '[NAY] Display Nexus Authority status report',
    options: []
  },
  {
    name: 'nexus',
    description: '[NAY] Information about Nexus Authority',
    options: []
  },
  {
    name: 'help',
    description: '[NAY] Display all available commands',
    options: []
  },
  {
    name: 'serverinfo',
    description: 'Display sector information',
    options: []
  },
  {
    name: 'userinfo',
    description: 'Display personnel file',
    options: [
      {
        name: 'user',
        description: 'Target personnel',
        type: 6,
        required: false
      }
    ]
  },
  {
    name: 'ping',
    description: 'Check system latency',
    options: []
  }
];

client.once('ready', async () => {
  logger.banner();
  logger.success('NAY AI System initialized');
  logger.info('Logged in as', chalk.cyan(client.user.tag));
  logger.info('Client ID', client.user.id);
  logger.system('Initializing Nexus Authority protocols...');

  const rest = new REST({ version: '10' }).setToken(DISCORD_TOKEN);

  try {
    await rest.put(
      Routes.applicationCommands(client.user.id),
      { body: commands }
    );
    logger.success('Command interface registered');
  } catch (error) {
    logger.error('Failed to register commands', error);
  }

  logger.info('Protected Sectors', `${client.guilds.cache.size} sector(s) under protection`);
  client.guilds.cache.forEach(guild => {
    logger.system(`  └─ ${guild.name} (${guild.memberCount} personnel)`);
  });

  startStatusRotation();
  logger.system('Status broadcast initiated');
  logger.success('All Nexus systems operational - Reality protection active');
  console.log();
});

const statuses = [
  { name: 'for AOZ threats', type: 3 },
  { name: 'reality integrity', type: 3 },
  { name: 'dimensional boundaries', type: 3 },
  { name: 'Nexus protocols', type: 0 },
  { name: 'sector activity', type: 3 },
  { name: 'anomaly detection systems', type: 0 },
  { name: 'Earth\'s defenses', type: 3 },
  { name: 'reality stabilizers', type: 2 }
];

function startStatusRotation() {
  let currentIndex = 0;
  
  const updateStatus = () => {
    const status = statuses[currentIndex];
    client.user.setPresence({
      activities: [{
        name: status.name,
        type: status.type
      }],
      status: 'online'
    });
    
    logger.status(`${['Playing', 'Streaming', 'Listening to', 'Watching'][status.type]} ${status.name}`);
    
    currentIndex = (currentIndex + 1) % statuses.length;
    
    const nextDelay = Math.floor(Math.random() * 20000) + 10000;
    setTimeout(updateStatus, nextDelay);
  };
  
  updateStatus();
}

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName, user, guild } = interaction;
  
  logger.command(user.tag, commandName, guild.name);

  await interaction.deferReply().catch(() => {});

  try {
    switch (commandName) {
      case 'ping':
        await handlePing(interaction);
        break;
      case 'kick':
        await handleKick(interaction);
        break;
      case 'ban':
        await handleBan(interaction);
        break;
      case 'timeout':
        await handleTimeout(interaction);
        break;
      case 'warn':
        await handleWarn(interaction);
        break;
      case 'clear':
        await handleClear(interaction);
        break;
      case 'scan':
        await handleScan(interaction);
        break;
      case 'status':
        await handleStatus(interaction);
        break;
      case 'nexus':
        await handleNexus(interaction);
        break;
      case 'help':
        await handleHelp(interaction);
        break;
      case 'serverinfo':
        await handleServerInfo(interaction);
        break;
      case 'userinfo':
        await handleUserInfo(interaction);
        break;
      default:
        await interaction.editReply({
          embeds: [createTerminalEmbed('Unknown Command', 'Command not found in Nexus registry', 'error')]
        });
    }
  } catch (error) {
    logger.error(`Error executing /${commandName}`, error);
    
    const errorEmbed = createTerminalEmbed(
      'Execution Error',
      `Failed to execute command\nError: ${error.message}`,
      'error'
    );
    
    try {
      if (interaction.deferred) {
        await interaction.editReply({ embeds: [errorEmbed] });
      } else {
        await interaction.reply({ embeds: [errorEmbed] });
      }
    } catch (e) {
      logger.error('Could not send error message', e);
    }
  }
});

async function handlePing(interaction) {
  const latency = Date.now() - interaction.createdTimestamp;
  const apiLatency = Math.round(client.ws.ping);
  
  const output = formatTerminalResponse(
    interaction.user.username,
    'nexus-ping',
    `Connection Status: ACTIVE\nBot Latency    : ${latency}ms\nAPI Latency    : ${apiLatency}ms\nConnection     : ${apiLatency < 200 ? 'OPTIMAL' : 'DEGRADED'}\n\n[NAY]: Systems responding normally.`,
    true
  );
  
  await interaction.editReply({ content: output });
}

async function handleKick(interaction) {
  if (!interaction.member.permissions.has(PermissionFlagsBits.KickMembers)) {
    return interaction.editReply({
      embeds: [createTerminalEmbed('Access Denied', 'Insufficient clearance level - KICK_MEMBERS required', 'error')]
    });
  }

  const target = interaction.options.getMember('user');
  const reason = interaction.options.getString('reason') || 'Protocol violation';

  if (!target) {
    return interaction.editReply({
      embeds: [createTerminalEmbed('Invalid Target', 'Personnel not found in sector', 'error')]
    });
  }

  if (!target.kickable) {
    return interaction.editReply({
      embeds: [createTerminalEmbed('Action Failed', 'Cannot remove this personnel (insufficient authority)', 'error')]
    });
  }

  await target.kick(reason);
  
  const actionLog = formatModAction('KICK', target.user.tag, reason, interaction.user.tag);
  
  await interaction.editReply({
    content: formatTerminalResponse(
      interaction.user.username,
      `nexus-kick ${target.user.username}`,
      actionLog,
      true
    )
  });
}

async function handleBan(interaction) {
  if (!interaction.member.permissions.has(PermissionFlagsBits.BanMembers)) {
    return interaction.editReply({
      embeds: [createTerminalEmbed('Access Denied', 'Insufficient clearance level - BAN_MEMBERS required', 'error')]
    });
  }

  const target = interaction.options.getMember('user');
  const reason = interaction.options.getString('reason') || 'Severe protocol violation';

  if (!target) {
    return interaction.editReply({
      embeds: [createTerminalEmbed('Invalid Target', 'Personnel not found in sector', 'error')]
    });
  }

  if (!target.bannable) {
    return interaction.editReply({
      embeds: [createTerminalEmbed('Action Failed', 'Cannot ban this personnel (insufficient authority)', 'error')]
    });
  }

  await target.ban({ reason });
  
  const actionLog = formatModAction('BAN', target.user.tag, reason, interaction.user.tag);
  
  await interaction.editReply({
    content: formatTerminalResponse(
      interaction.user.username,
      `nexus-ban ${target.user.username}`,
      actionLog,
      true
    )
  });
}

async function handleTimeout(interaction) {
  if (!interaction.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
    return interaction.editReply({
      embeds: [createTerminalEmbed('Access Denied', 'Insufficient clearance level - MODERATE_MEMBERS required', 'error')]
    });
  }

  const target = interaction.options.getMember('user');
  const duration = interaction.options.getInteger('duration');
  const reason = interaction.options.getString('reason') || 'Temporary restriction';

  if (!target) {
    return interaction.editReply({
      embeds: [createTerminalEmbed('Invalid Target', 'Personnel not found in sector', 'error')]
    });
  }

  if (duration < 1 || duration > 10080) {
    return interaction.editReply({
      embeds: [createTerminalEmbed('Invalid Duration', 'Duration must be between 1-10080 minutes', 'error')]
    });
  }

  if (!target.moderatable) {
    return interaction.editReply({
      embeds: [createTerminalEmbed('Action Failed', 'Cannot restrict this personnel (insufficient authority)', 'error')]
    });
  }

  await target.timeout(duration * 60 * 1000, reason);
  
  const actionLog = formatModAction(`TIMEOUT (${duration}m)`, target.user.tag, reason, interaction.user.tag);
  
  await interaction.editReply({
    content: formatTerminalResponse(
      interaction.user.username,
      `nexus-timeout ${target.user.username} ${duration}m`,
      actionLog,
      true
    )
  });
}

async function handleWarn(interaction) {
  if (!interaction.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
    return interaction.editReply({
      embeds: [createTerminalEmbed('Access Denied', 'Insufficient clearance level - MODERATE_MEMBERS required', 'error')]
    });
  }

  const target = interaction.options.getMember('user');
  const reason = interaction.options.getString('reason');

  if (!target) {
    return interaction.editReply({
      embeds: [createTerminalEmbed('Invalid Target', 'Personnel not found in sector', 'error')]
    });
  }

  try {
    await target.send({
      content: formatTerminalResponse(
        target.user.username,
        'nexus-warning',
        `[NAY]: Official warning issued in ${interaction.guild.name}\n\nReason: ${reason}\nIssued by: ${interaction.user.tag}\n\nPlease review Nexus protocols to avoid further action.`,
        false
      )
    });
  } catch (error) {
    logger.warn('Could not DM user', target.user.tag);
  }
  
  const actionLog = formatModAction('WARN', target.user.tag, reason, interaction.user.tag);
  
  await interaction.editReply({
    content: formatTerminalResponse(
      interaction.user.username,
      `nexus-warn ${target.user.username}`,
      actionLog,
      true
    )
  });
}

async function handleClear(interaction) {
  if (!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
    return interaction.editReply({
      embeds: [createTerminalEmbed('Access Denied', 'Insufficient clearance level - MANAGE_MESSAGES required', 'error')]
    });
  }

  const amount = interaction.options.getInteger('amount');

  if (amount < 1 || amount > 100) {
    return interaction.editReply({
      embeds: [createTerminalEmbed('Invalid Amount', 'Amount must be between 1-100', 'error')]
    });
  }

  const deleted = await interaction.channel.bulkDelete(amount, true);
  
  await interaction.editReply({
    content: formatTerminalResponse(
      interaction.user.username,
      `nexus-purge ${amount}`,
      `Message purge complete\nDeleted: ${deleted.size} message(s)\nChannel: ${interaction.channel.name}\n\n[NAY]: Communications purged from records.`,
      true
    )
  });
}

async function handleScan(interaction) {
  const target = interaction.options.getMember('target');

  if (!target) {
    return interaction.editReply({
      embeds: [createTerminalEmbed('Invalid Target', 'Personnel not found in sector', 'error')]
    });
  }

  const accountAge = Date.now() - target.user.createdTimestamp;
  const joinAge = Date.now() - target.joinedTimestamp;
  const roleCount = target.roles.cache.size;
  
  let threatLevel = 0;
  if (accountAge < 7 * 24 * 60 * 60 * 1000) threatLevel += 2;
  if (joinAge < 24 * 60 * 60 * 1000) threatLevel += 1;
  if (roleCount < 2) threatLevel += 1;
  if (Math.random() > 0.7) threatLevel += Math.floor(Math.random() * 2);
  
  const scanResult = formatThreatScan(target.user.tag, threatLevel);
  
  await interaction.editReply({
    content: formatTerminalResponse(
      interaction.user.username,
      `nexus-scan ${target.user.username}`,
      scanResult,
      true
    )
  });
}

async function handleStatus(interaction) {
  const statusReport = formatStatusReport();
  
  await interaction.editReply({
    content: formatTerminalResponse(
      interaction.user.username,
      'nexus-status',
      statusReport,
      true
    )
  });
}

async function handleNexus(interaction) {
  const about = [
    `╔════════════════════════════════════════╗`,
    `║  NEXUS AUTHORITY                       ║`,
    `╠════════════════════════════════════════╣`,
    `║                                        ║`,
    `║  The Nexus Authority is Earth's        ║`,
    `║  primary defense against AOZs -        ║`,
    `║  Anomalous Organisms & Zones that      ║`,
    `║  defy conventional physics.            ║`,
    `║                                        ║`,
    `║  I am NAY, Central Operations AI,      ║`,
    `║  responsible for coordination,         ║`,
    `║  threat detection, and protocol        ║`,
    `║  enforcement across all sectors.       ║`,
    `║                                        ║`,
    `║  Mission: Protect Earth's reality      ║`,
    `║  from dimensional incursions and       ║`,
    `║  physics-defying threats.              ║`,
    `║                                        ║`,
    `╚════════════════════════════════════════╝`,
    `\n[NAY]: Together, we maintain the barriers between worlds.`
  ].join('\n');
  
  await interaction.editReply({
    content: formatTerminalResponse(
      interaction.user.username,
      'about-nexus',
      about,
      true
    )
  });
}

async function handleHelp(interaction) {
  const help = formatNexusHelp();
  
  await interaction.editReply({
    content: formatTerminalResponse(
      interaction.user.username,
      'help',
      help,
      true
    )
  });
}

async function handleServerInfo(interaction) {
  const guild = interaction.guild;
  const info = formatServerInfo(guild);
  
  await interaction.editReply({
    content: formatTerminalResponse(
      interaction.user.username,
      'nexus-sector-scan',
      info,
      true
    )
  });
}

async function handleUserInfo(interaction) {
  const target = interaction.options.getMember('user') || interaction.member;
  const info = formatUserInfo(target);
  
  await interaction.editReply({
    content: formatTerminalResponse(
      interaction.user.username,
      `nexus-personnel ${target.user.username}`,
      info,
      true
    )
  });
}

client.login(DISCORD_TOKEN).catch(error => {
  logger.error('Failed to login', error);
  process.exit(1);
});
