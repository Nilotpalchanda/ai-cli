#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { upgradeTailwind } from './upgrade.js';

const program = new Command();

program
  .name('tailwind-upgrade')
  .description('CLI tool to upgrade Tailwind CSS from v3 to v4')
  .version('1.0.0');

program
  .command('upgrade')
  .description('Upgrade Tailwind CSS in the current project')
  .option('-p, --path <path>', 'Project path (defaults to current directory)', process.cwd())
  .action(async (options) => {
    const spinner = ora('Starting Tailwind CSS upgrade...').start();
    
    try {
      await upgradeTailwind(options.path, spinner);
      spinner.succeed(chalk.green('✅ Tailwind CSS upgrade completed successfully!'));
    } catch (error) {
      spinner.fail(chalk.red('❌ Upgrade failed:'));
      console.error(chalk.red(error instanceof Error ? error.message : String(error)));
      process.exit(1);
    }
  });

program.parse();
