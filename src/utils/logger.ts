import chalk from 'chalk';
import { Ora } from 'ora';

export interface Logger {
  info(message: string): void;
  success(message: string): void;
  warn(message: string): void;
  error(message: string): void;
  debug(message: string): void;
}

export class SpinnerLogger implements Logger {
  constructor(private spinner: Ora) {}

  info(message: string): void {
    this.spinner.info(chalk.blue(message));
  }

  success(message: string): void {
    this.spinner.info(chalk.green(message));
  }

  warn(message: string): void {
    this.spinner.info(chalk.yellow(message));
  }

  error(message: string): void {
    this.spinner.fail(chalk.red(message));
  }

  debug(message: string): void {
    if (process.env.DEBUG) {
      this.spinner.info(chalk.gray(`[DEBUG] ${message}`));
    }
  }
}

export class ConsoleLogger implements Logger {
  info(message: string): void {
    console.log(chalk.blue(`ℹ ${message}`));
  }

  success(message: string): void {
    console.log(chalk.green(`✅ ${message}`));
  }

  warn(message: string): void {
    console.log(chalk.yellow(`⚠️ ${message}`));
  }

  error(message: string): void {
    console.error(chalk.red(`❌ ${message}`));
  }

  debug(message: string): void {
    if (process.env.DEBUG) {
      console.log(chalk.gray(`[DEBUG] ${message}`));
    }
  }
}
