export function createTerminalEmbed(title, description, type = 'info') {
  const symbols = {
    info: '[ INFO ]',
    success: '[ OK ]',
    error: '[ ERR ]',
    warn: '[ WARN ]',
    command: '[ $ ]'
  };

  const colors = {
    info: 0x00FFFF,
    success: 0x00FF00,
    error: 0xFF0000,
    warn: 0xFFFF00,
    command: 0xFF00FF
  };

  const timestamp = new Date().toISOString().replace('T', ' ').split('.')[0];

  return {
    color: colors[type] || colors.info,
    title: `\`${symbols[type] || symbols.info}\` ${title}`,
    description: description ? `\`\`\`ansi\n${description}\n\`\`\`` : null,
    footer: {
      text: `system@moderator | ${timestamp}`
    }
  };
}

export function formatTerminalResponse(command, output, success = true) {
  const prompt = `user@moderator:~$`;
  const statusSymbol = success ? '✓' : '✗';
  const statusCode = success ? 0 : 1;
  
  let response = `\`\`\`ansi\n`;
  response += `\x1b[32m${prompt}\x1b[0m ${command}\n`;
  response += `${output}\n`;
  response += `\x1b[${success ? '32' : '31'}m[${statusSymbol}]\x1b[0m Process exited with code ${statusCode}\n`;
  response += `\`\`\``;
  
  return response;
}

export function formatModAction(action, target, reason, executor) {
  const lines = [
    `╔════════════════════════════════════════╗`,
    `║  MODERATION ACTION LOGGED              ║`,
    `╠════════════════════════════════════════╣`,
    `║ Action    : ${action.toUpperCase().padEnd(28)}║`,
    `║ Target    : ${target.padEnd(28)}║`,
    `║ Executor  : ${executor.padEnd(28)}║`,
    `║ Reason    : ${(reason || 'No reason provided').substring(0, 28).padEnd(28)}║`,
    `║ Timestamp : ${new Date().toISOString().padEnd(28)}║`,
    `╚════════════════════════════════════════╝`
  ];
  
  return lines.join('\n');
}

export function formatList(title, items) {
  let output = `${title}\n${'─'.repeat(40)}\n`;
  items.forEach((item, index) => {
    output += `${index + 1}. ${item}\n`;
  });
  output += `${'─'.repeat(40)}\n`;
  output += `Total: ${items.length} item(s)`;
  return output;
}

export function createLoadingAnimation(text) {
  const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
  return `${frames[Math.floor(Math.random() * frames.length)]} ${text}...`;
}

export function formatServerInfo(guild) {
  const created = Math.floor(guild.createdTimestamp / 1000);
  
  return [
    `╔════════════════════════════════════════╗`,
    `║  SERVER INFORMATION                    ║`,
    `╠════════════════════════════════════════╣`,
    `║ Name      : ${guild.name.substring(0, 28).padEnd(28)}║`,
    `║ ID        : ${guild.id.padEnd(28)}║`,
    `║ Owner     : <@${guild.ownerId}>`.padEnd(43) + `║`,
    `║ Members   : ${String(guild.memberCount).padEnd(28)}║`,
    `║ Created   : <t:${created}:F>`.padEnd(43) + `║`,
    `║ Boost Lvl : Tier ${guild.premiumTier}`.padEnd(43) + `║`,
    `╚════════════════════════════════════════╝`
  ].join('\n');
}

export function formatUserInfo(member) {
  const joined = Math.floor(member.joinedTimestamp / 1000);
  const created = Math.floor(member.user.createdTimestamp / 1000);
  
  return [
    `╔════════════════════════════════════════╗`,
    `║  USER INFORMATION                      ║`,
    `╠════════════════════════════════════════╣`,
    `║ Username  : ${member.user.tag.substring(0, 28).padEnd(28)}║`,
    `║ ID        : ${member.id.padEnd(28)}║`,
    `║ Nickname  : ${(member.nickname || 'None').substring(0, 28).padEnd(28)}║`,
    `║ Joined    : <t:${joined}:R>`.padEnd(43) + `║`,
    `║ Created   : <t:${created}:R>`.padEnd(43) + `║`,
    `║ Roles     : ${member.roles.cache.size - 1}`.padEnd(43) + `║`,
    `╚════════════════════════════════════════╝`
  ].join('\n');
}
