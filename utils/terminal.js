export function createTerminalEmbed(title, description, type = 'info') {
  const symbols = {
    info: '[ NAY-INFO ]',
    success: '[ NAY-OK ]',
    error: '[ NAY-ERR ]',
    warn: '[ NAY-WARN ]',
    command: '[ NEXUS-CMD ]',
    threat: '[ THREAT ]',
    secure: '[ SECURE ]'
  };

  const colors = {
    info: 0x00FFFF,
    success: 0x00FF00,
    error: 0xFF0000,
    warn: 0xFFFF00,
    command: 0xFF00FF,
    threat: 0xFF6600,
    secure: 0x0099FF
  };

  const timestamp = new Date().toISOString().replace('T', ' ').split('.')[0];

  return {
    color: colors[type] || colors.info,
    title: `\`${symbols[type] || symbols.info}\` ${title}`,
    description: description ? `\`\`\`ansi\n${description}\n\`\`\`` : null,
    footer: {
      text: `NAY@NEXUS-AUTHORITY | ${timestamp}`
    }
  };
}

export function formatTerminalResponse(username, command, output, success = true) {
  const sanitizedUser = username.substring(0, 20).toLowerCase().replace(/[^a-z0-9_]/g, '_');
  const prompt = `${sanitizedUser}@nexus-ops:~$`;
  const statusSymbol = success ? '✓' : '✗';
  const statusCode = success ? 0 : 1;
  
  let response = `\`\`\`ansi\n`;
  response += `\x1b[36m${prompt}\x1b[0m ${command}\n`;
  response += `${output}\n`;
  response += `\x1b[${success ? '32' : '31'}m[${statusSymbol}]\x1b[0m Process exited with code ${statusCode}\n`;
  response += `\`\`\``;
  
  return response;
}

export function formatModAction(action, target, reason, executor) {
  const lines = [
    `╔════════════════════════════════════════╗`,
    `║  NEXUS AUTHORITY - MOD ACTION LOG      ║`,
    `╠════════════════════════════════════════╣`,
    `║ Action    : ${action.toUpperCase().padEnd(28)}║`,
    `║ Target    : ${target.substring(0, 28).padEnd(28)}║`,
    `║ Operator  : ${executor.substring(0, 28).padEnd(28)}║`,
    `║ Reason    : ${(reason || 'Protocol enforcement').substring(0, 28).padEnd(28)}║`,
    `║ Timestamp : ${new Date().toISOString().substring(0, 28).padEnd(28)}║`,
    `║ Auth Code : NAY-${Math.random().toString(36).substring(2, 8).toUpperCase()}`.padEnd(43) + `║`,
    `╚════════════════════════════════════════╝`,
    `\n[NAY]: Action logged and archived in Nexus database.`
  ];
  
  return lines.join('\n');
}

export function formatServerInfo(guild) {
  const created = Math.floor(guild.createdTimestamp / 1000);
  
  return [
    `╔════════════════════════════════════════╗`,
    `║  NEXUS SECTOR SCAN REPORT              ║`,
    `╠════════════════════════════════════════╣`,
    `║ Sector    : ${guild.name.substring(0, 28).padEnd(28)}║`,
    `║ Sector ID : ${guild.id.substring(0, 28).padEnd(28)}║`,
    `║ Admin     : <@${guild.ownerId}>`.padEnd(43) + `║`,
    `║ Personnel : ${String(guild.memberCount).padEnd(28)}║`,
    `║ Estab.    : <t:${created}:F>`.padEnd(43) + `║`,
    `║ Boost Lvl : Tier ${guild.premiumTier}`.padEnd(43) + `║`,
    `║ Status    : PROTECTED`.padEnd(43) + `║`,
    `╚════════════════════════════════════════╝`,
    `\n[NAY]: Sector operating within normal parameters.`
  ].join('\n');
}

export function formatUserInfo(member) {
  const joined = Math.floor(member.joinedTimestamp / 1000);
  const created = Math.floor(member.user.createdTimestamp / 1000);
  
  return [
    `╔════════════════════════════════════════╗`,
    `║  NEXUS PERSONNEL FILE                  ║`,
    `╠════════════════════════════════════════╣`,
    `║ Username  : ${member.user.tag.substring(0, 28).padEnd(28)}║`,
    `║ User ID   : ${member.id.substring(0, 28).padEnd(28)}║`,
    `║ Callsign  : ${(member.nickname || 'UNASSIGNED').substring(0, 28).padEnd(28)}║`,
    `║ Joined    : <t:${joined}:R>`.padEnd(43) + `║`,
    `║ Reg. Date : <t:${created}:R>`.padEnd(43) + `║`,
    `║ Clearance : Level ${member.roles.cache.size - 1}`.padEnd(43) + `║`,
    `║ Status    : ACTIVE`.padEnd(43) + `║`,
    `╚════════════════════════════════════════╝`,
    `\n[NAY]: Personnel file retrieved from Nexus database.`
  ].join('\n');
}

export function formatThreatScan(target, threatLevel) {
  const threats = ['MINIMAL', 'LOW', 'MODERATE', 'ELEVATED', 'HIGH', 'CRITICAL'];
  const level = Math.min(threatLevel, threats.length - 1);
  const color = level < 2 ? 'GREEN' : level < 4 ? 'YELLOW' : 'RED';
  
  return [
    `╔════════════════════════════════════════╗`,
    `║  AOZ THREAT ASSESSMENT                 ║`,
    `╠════════════════════════════════════════╣`,
    `║ Target    : ${target.substring(0, 28).padEnd(28)}║`,
    `║ Scan Type : REALITY INTEGRITY CHECK`.padEnd(43) + `║`,
    `║ Status    : ${color}`.padEnd(43) + `║`,
    `║ Threat Lvl: ${threats[level]}`.padEnd(43) + `║`,
    `║ AOZ Detect: ${level > 2 ? 'ANOMALY DETECTED' : 'NONE DETECTED'}`.padEnd(43) + `║`,
    `║ Action Req: ${level > 3 ? 'IMMEDIATE' : 'NONE'}`.padEnd(43) + `║`,
    `╚════════════════════════════════════════╝`,
    `\n[NAY]: ${level > 3 ? 'Alert! Reality anomaly detected. Containment protocols recommended.' : 'Scan complete. Reality remains stable.'}`
  ].join('\n');
}

export function formatStatusReport() {
  const uptime = process.uptime();
  const hours = Math.floor(uptime / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  
  return [
    `╔════════════════════════════════════════╗`,
    `║  NEXUS AUTHORITY STATUS REPORT         ║`,
    `╠════════════════════════════════════════╣`,
    `║ AI Unit   : NAY (v3.7.2)`.padEnd(43) + `║`,
    `║ Role      : Central Operations AI`.padEnd(43) + `║`,
    `║ Uptime    : ${hours}h ${minutes}m`.padEnd(43) + `║`,
    `║ Sys Load  : ${Math.floor(Math.random() * 30 + 20)}%`.padEnd(43) + `║`,
    `║ AOZ Watch : ACTIVE`.padEnd(43) + `║`,
    `║ Defenses  : ONLINE`.padEnd(43) + `║`,
    `║ Reality   : STABLE`.padEnd(43) + `║`,
    `╚════════════════════════════════════════╝`,
    `\n[NAY]: All systems operational. Earth's reality remains protected.`
  ].join('\n');
}

export function formatNexusHelp() {
  return [
    `╔════════════════════════════════════════╗`,
    `║  NEXUS AUTHORITY COMMAND INTERFACE     ║`,
    `╠════════════════════════════════════════╣`,
    `║ MODERATION PROTOCOLS                   ║`,
    `║  /kick      - Remove personnel         ║`,
    `║  /ban       - Permanent removal        ║`,
    `║  /timeout   - Temporary restriction    ║`,
    `║  /warn      - Issue warning            ║`,
    `║  /clear     - Purge messages           ║`,
    `╠════════════════════════════════════════╣`,
    `║ NEXUS OPERATIONS                       ║`,
    `║  /scan      - AOZ threat assessment    ║`,
    `║  /status    - Nexus status report      ║`,
    `║  /nexus     - About Nexus Authority    ║`,
    `╠════════════════════════════════════════╣`,
    `║ INFORMATION                            ║`,
    `║  /serverinfo - Sector information      ║`,
    `║  /userinfo   - Personnel file          ║`,
    `║  /ping       - System latency          ║`,
    `╚════════════════════════════════════════╝`,
    `\n[NAY]: I'm here to protect this sector from AOZ threats and maintain order.`
  ].join('\n');
}
