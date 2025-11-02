import chalk from 'chalk';
import figlet from 'figlet';

class TerminalLogger {
  constructor() {
    this.startTime = Date.now();
  }

  getTimestamp() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const ms = String(now.getMilliseconds()).padStart(3, '0');
    return `${hours}:${minutes}:${seconds}.${ms}`;
  }

  getUptime() {
    const uptime = Date.now() - this.startTime;
    const seconds = Math.floor(uptime / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
  }

  banner() {
    console.clear();
    const banner = figlet.textSync('N A Y', {
      font: 'ANSI Shadow',
      horizontalLayout: 'default',
      verticalLayout: 'default'
    });
    console.log(chalk.cyan(banner));
    console.log(chalk.gray('═'.repeat(80)));
    console.log(chalk.green('  NEXUS AUTHORITY - Central Operations AI'));
    console.log(chalk.cyan('  NAY v3.7.2 | Reality Protection System'));
    console.log(chalk.gray('  Mission: Protect Earth from AOZ threats'));
    console.log(chalk.gray('═'.repeat(80)));
    console.log();
  }

  info(message, data = null) {
    const timestamp = chalk.gray(`[${this.getTimestamp()}]`);
    const tag = chalk.blue('[INFO]');
    console.log(`${timestamp} ${tag} ${message}`);
    if (data) console.log(chalk.gray('  └─'), data);
  }

  success(message, data = null) {
    const timestamp = chalk.gray(`[${this.getTimestamp()}]`);
    const tag = chalk.green('[✓]');
    console.log(`${timestamp} ${tag} ${chalk.green(message)}`);
    if (data) console.log(chalk.gray('  └─'), data);
  }

  warn(message, data = null) {
    const timestamp = chalk.gray(`[${this.getTimestamp()}]`);
    const tag = chalk.yellow('[WARN]');
    console.log(`${timestamp} ${tag} ${chalk.yellow(message)}`);
    if (data) console.log(chalk.gray('  └─'), data);
  }

  error(message, error = null) {
    const timestamp = chalk.gray(`[${this.getTimestamp()}]`);
    const tag = chalk.red('[ERROR]');
    console.log(`${timestamp} ${tag} ${chalk.red(message)}`);
    if (error) {
      console.log(chalk.gray('  └─'), chalk.red(error.message || error));
      if (error.stack) {
        console.log(chalk.gray(error.stack.split('\n').slice(1, 4).join('\n')));
      }
    }
  }

  command(user, command, guild) {
    const timestamp = chalk.gray(`[${this.getTimestamp()}]`);
    const tag = chalk.magenta('[CMD]');
    const userTag = chalk.cyan(`${user}`);
    const cmdTag = chalk.yellow(`/${command}`);
    const guildTag = chalk.gray(`@ ${guild}`);
    console.log(`${timestamp} ${tag} ${userTag} executed ${cmdTag} ${guildTag}`);
  }

  system(message) {
    const timestamp = chalk.gray(`[${this.getTimestamp()}]`);
    const tag = chalk.cyan('[SYS]');
    console.log(`${timestamp} ${tag} ${message}`);
  }

  status(statusText) {
    const timestamp = chalk.gray(`[${this.getTimestamp()}]`);
    const tag = chalk.magenta('[STATUS]');
    console.log(`${timestamp} ${tag} Status updated: ${chalk.cyan(statusText)}`);
  }
}

export default new TerminalLogger();
