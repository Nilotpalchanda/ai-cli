import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { createInterface } from 'readline';
import { upgradeTailwind } from './upgrade';
import { createComponents } from './create-component';

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
      await upgradeTailwind(options.path);
      spinner.succeed(chalk.green('✅ Tailwind CSS upgrade completed successfully!'));
    } catch (error) {
      spinner.fail(chalk.red('❌ Upgrade failed:'));
      console.error(chalk.red(error instanceof Error ? error.message : String(error)));
      process.exit(1);
    }
  });

program
  .command('create')
  .description('Create a new Shadcn UI component in your Next.js project')
  .option('-p, --path <path>', 'Project path (defaults to current directory)', process.cwd())
  .action(async (options) => {
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout
    });

    try {
      console.log(chalk.blue('🎨 Creating a new Shadcn UI component...\n'));
      
      const componentInput = await new Promise<string>((resolve) => {
        rl.question(chalk.cyan('Enter component name(s) (comma-separated): '), (answer) => {
          resolve(answer.trim());
        });
      });

      rl.close();

      if (!componentInput) {
        console.error(chalk.red('❌ Component name is required'));
        process.exit(1);
      }

      // Parse multiple component names
      const componentNames = componentInput
        .split(',')
        .map(name => name.trim())
        .filter(name => name.length > 0);

      if (componentNames.length === 0) {
        console.error(chalk.red('❌ At least one valid component name is required'));
        process.exit(1);
      }

      const spinner = ora(`Creating ${componentNames.length} component(s)...`).start();
      
      await createComponents({
        names: componentNames,
        projectPath: options.path
      });
      
      spinner.succeed(chalk.green(`✅ Component creation completed!`));
      console.log(chalk.gray('\n💡 Don\'t forget to install required dependencies if needed:'));
      console.log(chalk.gray('   npm install @radix-ui/react-slot class-variance-authority'));
      
    } catch (error) {
      rl.close();
      console.error(chalk.red('❌ Component creation failed:'));
      console.error(chalk.red(error instanceof Error ? error.message : String(error)));
      process.exit(1);
    }
  });

program.parse();
