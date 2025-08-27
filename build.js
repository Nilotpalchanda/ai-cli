#!/usr/bin/env node

import { build } from 'esbuild';
import { readFileSync, writeFileSync } from 'fs';

async function buildCLI() {
  try {
    // Build the CLI with esbuild
    await build({
      entryPoints: ['src/index.ts'],
      bundle: true,
      platform: 'node',
      target: 'node18',
      format: 'esm',
      outfile: 'dist/index.js',
      external: ['fs-extra', 'chalk', 'ora', 'commander', 'glob'],
      banner: {
        js: '#!/usr/bin/env node',
      },
      sourcemap: true,
      minify: false,
    });

    // Make the output executable
    const content = readFileSync('dist/index.js', 'utf8');
    writeFileSync('dist/index.js', content, { mode: 0o755 });

    console.log('✅ Build completed successfully');
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

buildCLI();
