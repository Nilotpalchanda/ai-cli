import fs from 'fs-extra';
import path from 'path';
import { execSync } from 'child_process';
import chalk from 'chalk';
import { Ora } from 'ora';
import { glob } from 'glob';

export async function upgradeTailwind(projectPath: string, spinner: Ora): Promise<void> {
  const packageJsonPath = path.join(projectPath, 'package.json');
  
  // Step 1: Check and modify package.json
  spinner.text = 'Checking package.json...';
  if (await fs.pathExists(packageJsonPath)) {
    await modifyPackageJson(packageJsonPath, spinner);
  } else {
    spinner.info(chalk.yellow('⚠️  package.json not found, skipping package modifications'));
  }

  // Step 2: Install @tailwindcss/postcss
  spinner.text = 'Installing @tailwindcss/postcss...';
  await installPostcssPackage(projectPath, spinner);

  // Step 3: Handle design-system package
  spinner.text = 'Updating design-system package...';
  await handleDesignSystemPackage(packageJsonPath, projectPath, spinner);

  // Step 4: Remove tailwind.config.js
  spinner.text = 'Removing tailwind.config.js...';
  await removeTailwindConfig(projectPath, spinner);

  // Step 5: Rename and update postcss config
  spinner.text = 'Updating PostCSS configuration...';
  await updatePostcssConfig(projectPath, spinner);

  // Step 6: Update globals.css
  spinner.text = 'Updating globals.css...';
  await updateGlobalsCss(projectPath, spinner);
}

async function modifyPackageJson(
  packageJsonPath: string,
  spinner: Ora
): Promise<void> {
  try {
    const packageJson = await fs.readJson(packageJsonPath);
    let modified = false;

    // Remove @abc/tailwind-config and @abc/typescript-utils
    const packagesToRemove = ['@abc/tailwind-config', '@abc/typescript-utils'];
    
    for (const packageName of packagesToRemove) {
      if (packageJson.dependencies?.[packageName]) {
        delete packageJson.dependencies[packageName];
        modified = true;
        spinner.info(chalk.blue(`📦 Removed ${packageName} from dependencies`));
      }
      if (packageJson.devDependencies?.[packageName]) {
        delete packageJson.devDependencies[packageName];
        modified = true;
        spinner.info(chalk.blue(`📦 Removed ${packageName} from devDependencies`));
      }
    }

    if (modified) {
      await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
    }
  } catch (error) {
    throw new Error(`Failed to modify package.json: ${error}`);
  }
}

async function installPostcssPackage(
  projectPath: string,
  spinner: Ora
): Promise<void> {
  try {
    execSync('pnpm install @tailwindcss/postcss --save-dev', {
      cwd: projectPath,
      stdio: 'pipe',
      shell: true
    } as any);
    spinner.info(chalk.green('✅ Installed @tailwindcss/postcss'));
  } catch (error) {
    throw new Error(`Failed to install @tailwindcss/postcss: ${error}`);
  }
}

async function handleDesignSystemPackage(packageJsonPath: string, projectPath: string, spinner: Ora): Promise<void> {
  try {
    if (await fs.pathExists(packageJsonPath)) {
      const packageJson = await fs.readJson(packageJsonPath);
      const hasDesignSystem = packageJson.dependencies?.['design-system'] || 
                             packageJson.devDependencies?.['design-system'];

      if (hasDesignSystem) {
        execSync('pnpm install design-system@2.5.0 --save', {
          cwd: projectPath,
          stdio: 'pipe',
          shell: true
        } as any);
        spinner.info(chalk.green('✅ Updated design-system to 2.5.0'));
      } else {
        execSync('pnpm install design-system@latest --save', {
          cwd: projectPath,
          stdio: 'pipe',
          shell: true
        } as any);
        spinner.info(chalk.green('✅ Added design-system@latest'));
      }
    }
  } catch (error) {
    throw new Error(`Failed to handle design-system package: ${error}`);
  }
}

async function removeTailwindConfig(projectPath: string, spinner: Ora): Promise<void> {
  const tailwindConfigPath = path.join(projectPath, 'tailwind.config.js');
  
  try {
    if (await fs.pathExists(tailwindConfigPath)) {
      await fs.remove(tailwindConfigPath);
      spinner.info(chalk.green('🗑️  Removed tailwind.config.js'));
    } else {
      spinner.info(chalk.yellow('⚠️  tailwind.config.js not found, skipping removal'));
    }
  } catch (error) {
    throw new Error(`Failed to remove tailwind.config.js: ${error}`);
  }
}

async function updatePostcssConfig(projectPath: string, spinner: Ora): Promise<void> {
  const oldConfigPath = path.join(projectPath, 'postcss.config.js');
  const newConfigPath = path.join(projectPath, 'postcss.config.mjs');

  const postcssContent = `/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
}
export default config;`;

  try {
    // Check if old config exists and rename it
    if (await fs.pathExists(oldConfigPath)) {
      await fs.remove(oldConfigPath);
      spinner.info(chalk.green('🔄 Removed old postcss.config.js'));
    }

    // Create new config file
    await fs.writeFile(newConfigPath, postcssContent);
    spinner.info(chalk.green('✅ Created postcss.config.mjs with Tailwind v4 configuration'));
  } catch (error) {
    throw new Error(`Failed to update PostCSS configuration: ${error}`);
  }
}

async function updateGlobalsCss(projectPath: string, spinner: Ora): Promise<void> {
  try {
    // Find globals.css files using glob pattern
    const globalsFiles = await glob('**/globals.css', {
      cwd: projectPath,
      ignore: ['node_modules/**', 'dist/**', 'build/**']
    });

    if (globalsFiles.length === 0) {
      spinner.info(chalk.yellow('⚠️  No globals.css files found'));
      return;
    }

    for (const globalsFile of globalsFiles) {
      const globalsPath = path.join(projectPath, globalsFile);
      await updateSingleGlobalsCss(globalsPath, spinner);
    }
  } catch (error) {
    throw new Error(`Failed to update globals.css: ${error}`);
  }
}

async function updateSingleGlobalsCss(globalsPath: string, spinner: Ora): Promise<void> {
  try {
    let content = await fs.readFile(globalsPath, 'utf-8');
    
    // Remove old Tailwind imports
    const oldImports = [
      '@tailwind base;',
      '@tailwind components;',
      '@tailwind utilities;'
    ];

    let modified = false;
    for (const oldImport of oldImports) {
      if (content.includes(oldImport)) {
        content = content.replace(new RegExp(oldImport.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), '');
        modified = true;
      }
    }

    // Add new imports at the top
    const newImports = `@import 'tailwindcss';
@import '../../node_modules/design-system/dist/globals.css';

`;

    // Check if new imports already exist
    if (!content.includes("@import 'tailwindcss';")) {
      content = newImports + content.trim();
      modified = true;
    }

    if (modified) {
      await fs.writeFile(globalsPath, content);
      spinner.info(chalk.green(`✅ Updated ${path.relative(process.cwd(), globalsPath)}`));
    } else {
      spinner.info(chalk.yellow(`⚠️  ${path.relative(process.cwd(), globalsPath)} already up to date`));
    }
  } catch (error) {
    throw new Error(`Failed to update ${globalsPath}: ${error}`);
  }
}
