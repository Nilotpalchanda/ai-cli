#!/usr/bin/env node

import { readdir, readFile, writeFile } from 'fs/promises';
import { join, extname } from 'path';

/**
 * Fix TypeScript imports to use .js extensions for Node16 module resolution
 */
async function fixImports() {
  const distDir = 'dist';
  
  try {
    const files = await getJsFiles(distDir);
    
    for (const file of files) {
      await processFile(file);
    }
    
    console.log('✅ Import extensions fixed successfully');
  } catch (error) {
    console.error('❌ Failed to fix imports:', error);
    process.exit(1);
  }
}

async function getJsFiles(dir) {
  const files = [];
  const entries = await readdir(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    
    if (entry.isDirectory()) {
      files.push(...await getJsFiles(fullPath));
    } else if (extname(entry.name) === '.js') {
      files.push(fullPath);
    }
  }
  
  return files;
}

async function processFile(filePath) {
  const content = await readFile(filePath, 'utf-8');
  
  // Fix relative imports without extensions
  const fixedContent = content.replace(
    /from\s+['"](\.\/.+?)(?<!\.js)['"];?/g,
    "from '$1.js';"
  );
  
  if (content !== fixedContent) {
    await writeFile(filePath, fixedContent);
    console.log(`📝 Fixed imports in ${filePath}`);
  }
}

fixImports();
