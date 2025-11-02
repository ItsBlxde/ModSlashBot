import { Client, GatewayIntentBits, Collection, REST, Routes, PermissionFlagsBits, EmbedBuilder } from 'discord.js';
import chalk from 'chalk';
import logger from './utils/logger.js';
import { createTerminalEmbed, formatTerminalResponse, formatModAction, formatServerInfo, formatUserInfo } from './utils/terminal.js';

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
    description: '[ADMIN] Kick a member from the server',
    options: [
      {
        name: 'user',
        description: 'The user to kick',
        type: 6,
        required: true
      },
      {
        name: 'reason',
        description: 'Reason for kicking',
        type: 3,
        required: false
      }
    ]
  },
  {
    name: 'ban',
    description: '[ADMIN] Ban a member from the server',
    options: [
      {
        name: 'user',
        description: 'The user to ban',
        type: 6,
        required: true
      },
      {
        name: 'reason',
        description: 'Reason for banning',
        type: 3,
        required: false
      }
    ]
  },
  {
    name: 'timeout',
    description: '[ADMIN] Timeout a member',
    options: [
      {
        name: 'user',
        description: 'The user to timeout',
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
        description: 'Reason for timeout',
        type: 3,
        required: false
      }
    ]
  },
  {
    name: 'warn',
    description: '[ADMIN] Warn a member',
    options: [
      {
        name: 'user',
        description: 'The user to warn',
        type: 6,
        required: true
      },
      {
        name: 'reason',
        description: 'Reason for warning',
        type: 3,
        required: true
      }
    ]
  },
  {
    name: 'clear',
    description: '[ADMIN] Clear messages from a channel',
    options: [
      {
        name: 'amount',
        description: 'Number of messages to delete (1-100)',
        type: 4,
        required: true
      }
    ]
  },
  {
    name: 'serverinfo',
    description: 'Display server information',
    options: []
  },
  {
    name: 'userinfo',
    description: 'Display user information',
    options: [
      {
        name: 'user',
        description: 'The user to get info about',
        type: 6,
        required: false
      }
    ]
  },
  {
    name: 'ping',
    description: 'Check bot latency',
    options: []
  }
];

client.once('ready', async () => {
  logger.banner();
  logger.success('Bot initialized successfully');
  logger.info('Logged in as', chalk.cyan(client.user.tag));
  logger.info('Client ID', client.user.id);
  logger.system('Registering slash commands...');

  const rest = new REST({ version: '10' }).setToken(DISCORD_TOKEN);

  try {
    await rest.put(
      Routes.applicationCommands(client.user.id),
      { body: commands }
    );
    logger.success('Slash commands registered globally');
  } catch (error) {
    logger.error('Failed to register commands', error);
  }

  logger.info('Servers', `Connected to ${client.guilds.cache.size} server(s)`);
  client.guilds.cache.forEach(guild => {
    logger.system(`  └─ ${guild.name} (${guild.memberCount} members)`);
  });

  startStatusRotation();
  logger.system('Status rotation started');
  logger.success('All systems operational');
  console.log();
});

const statuses = [
  { name: 'the server', type: 3 },
  { name: 'for rule breakers', type: 3 },
  { name: 'moderation logs', type: 3 },
  { name: '/help for commands', type: 2 },
  { name: 'server activity', type: 3 },
  { name: 'with the ban hammer', type: 0 },
  { name: 'terminal commands', type: 2 },
  { name: 'security protocols', type: 0 }
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
      case 'serverinfo':
        await handleServerInfo(interaction);
        break;
      case 'userinfo':
        await handleUserInfo(interaction);
        break;
      default:
        await interaction.reply({
          embeds: [createTerminalEmbed('Unknown Command', 'Command not found in registry', 'error')],
          ephemeral: true
        });
    }
  } catch (error) {
    logger.error(`Error executing /${commandName}`, error);
    
    const errorEmbed = createTerminalEmbed(
      'Execution Error',
      `Failed to execute command\nError: ${error.message}`,
      'error'
    );
    
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ embeds: [errorEmbed], ephemeral: true });
    } else {
      await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }
  }
});

async function handlePing(interaction) {
  const latency = Date.now() - interaction.createdTimestamp;
  const apiLatency = Math.round(client.ws.ping);
  
  const output = formatTerminalResponse(
    'ping',
    `Pong! 🏓\nBot Latency    : ${latency}ms\nAPI Latency    : ${apiLatency}ms\nStatus         : ${apiLatency < 200 ? 'Optimal' : 'Degraded'}`,
    true
  );
  
  await interaction.reply({
    content: output
  });
}

async function handleKick(interaction) {
  if (!interaction.member.permissions.has(PermissionFlagsBits.KickMembers)) {
    return interaction.reply({
      embeds: [createTerminalEmbed('Permission Denied', 'You lack KICK_MEMBERS permission', 'error')],
      ephemeral: true
    });
  }

  const target = interaction.options.getMember('user');
  const reason = interaction.options.getString('reason') || 'No reason provided';

  if (!target) {
    return interaction.reply({
      embeds: [createTerminalEmbed('Invalid Target', 'User not found in server', 'error')],
      ephemeral: true
    });
  }

  if (!target.kickable) {
    return interaction.reply({
      embeds: [createTerminalEmbed('Action Failed', 'Cannot kick this user (role hierarchy)', 'error')],
      ephemeral: true
    });
  }

  await target.kick(reason);
  
  const actionLog = formatModAction('KICK', target.user.tag, reason, interaction.user.tag);
  
  await interaction.reply({
    content: formatTerminalResponse(
      `mod-kick ${target.user.tag}`,
      actionLog,
      true
    )
  });
}

async function handleBan(interaction) {
  if (!interaction.member.permissions.has(PermissionFlagsBits.BanMembers)) {
    return interaction.reply({
      embeds: [createTerminalEmbed('Permission Denied', 'You lack BAN_MEMBERS permission', 'error')],
      ephemeral: true
    });
  }

  const target = interaction.options.getMember('user');
  const reason = interaction.options.getString('reason') || 'No reason provided';

  if (!target) {
    return interaction.reply({
      embeds: [createTerminalEmbed('Invalid Target', 'User not found in server', 'error')],
      ephemeral: true
    });
  }

  if (!target.bannable) {
    return interaction.reply({
      embeds: [createTerminalEmbed('Action Failed', 'Cannot ban this user (role hierarchy)', 'error')],
      ephemeral: true
    });
  }

  await target.ban({ reason });
  
  const actionLog = formatModAction('BAN', target.user.tag, reason, interaction.user.tag);
  
  await interaction.reply({
    content: formatTerminalResponse(
      `mod-ban ${target.user.tag}`,
      actionLog,
      true
    )
  });
}

async function handleTimeout(interaction) {
  if (!interaction.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
    return interaction.reply({
      embeds: [createTerminalEmbed('Permission Denied', 'You lack MODERATE_MEMBERS permission', 'error')],
      ephemeral: true
    });
  }

  const target = interaction.options.getMember('user');
  const duration = interaction.options.getInteger('duration');
  const reason = interaction.options.getString('reason') || 'No reason provided';

  if (!target) {
    return interaction.reply({
      embeds: [createTerminalEmbed('Invalid Target', 'User not found in server', 'error')],
      ephemeral: true
    });
  }

  if (duration < 1 || duration > 10080) {
    return interaction.reply({
      embeds: [createTerminalEmbed('Invalid Duration', 'Duration must be between 1-10080 minutes', 'error')],
      ephemeral: true
    });
  }

  if (!target.moderatable) {
    return interaction.reply({
      embeds: [createTerminalEmbed('Action Failed', 'Cannot timeout this user (role hierarchy)', 'error')],
      ephemeral: true
    });
  }

  await target.timeout(duration * 60 * 1000, reason);
  
  const actionLog = formatModAction(`TIMEOUT (${duration}m)`, target.user.tag, reason, interaction.user.tag);
  
  await interaction.reply({
    content: formatTerminalResponse(
      `mod-timeout ${target.user.tag} ${duration}m`,
      actionLog,
      true
    )
  });
}

async function handleWarn(interaction) {
  if (!interaction.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
    return interaction.reply({
      embeds: [createTerminalEmbed('Permission Denied', 'You lack MODERATE_MEMBERS permission', 'error')],
      ephemeral: true
    });
  }

  const target = interaction.options.getMember('user');
  const reason = interaction.options.getString('reason');

  if (!target) {
    return interaction.reply({
      embeds: [createTerminalEmbed('Invalid Target', 'User not found in server', 'error')],
      ephemeral: true
    });
  }

  try {
    await target.send({
      content: formatTerminalResponse(
        'mod-warn',
        `You have been warned in ${interaction.guild.name}\nReason: ${reason}\nIssued by: ${interaction.user.tag}`,
        false
      )
    });
  } catch (error) {
    logger.warn('Could not DM user', target.user.tag);
  }
  
  const actionLog = formatModAction('WARN', target.user.tag, reason, interaction.user.tag);
  
  await interaction.reply({
    content: formatTerminalResponse(
      `mod-warn ${target.user.tag}`,
      actionLog,
      true
    )
  });
}

async function handleClear(interaction) {
  if (!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
    return interaction.reply({
      embeds: [createTerminalEmbed('Permission Denied', 'You lack MANAGE_MESSAGES permission', 'error')],
      ephemeral: true
    });
  }

  const amount = interaction.options.getInteger('amount');

  if (amount < 1 || amount > 100) {
    return interaction.reply({
      embeds: [createTerminalEmbed('Invalid Amount', 'Amount must be between 1-100', 'error')],
      ephemeral: true
    });
  }

  const deleted = await interaction.channel.bulkDelete(amount, true);
  
  await interaction.reply({
    content: formatTerminalResponse(
      `clear ${amount}`,
      `Successfully purged ${deleted.size} message(s)\nChannel: ${interaction.channel.name}`,
      true
    ),
    ephemeral: true
  });
}

async function handleServerInfo(interaction) {
  const guild = interaction.guild;
  const info = formatServerInfo(guild);
  
  await interaction.reply({
    content: formatTerminalResponse(
      'serverinfo',
      info,
      true
    )
  });
}

async function handleUserInfo(interaction) {
  const target = interaction.options.getMember('user') || interaction.member;
  const info = formatUserInfo(target);
  
  await interaction.reply({
    content: formatTerminalResponse(
      `userinfo ${target.user.tag}`,
      info,
      true
    )
  });
}

client.login(DISCORD_TOKEN).catch(error => {
  logger.error('Failed to login', error);
  process.exit(1);
});
