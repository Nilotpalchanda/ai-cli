# Tailwind CSS Upgrade CLI

[![CI/CD Pipeline](https://github.com/Nilotpalchanda/ai-cli/actions/workflows/ci.yml/badge.svg)](https://github.com/Nilotpalchanda/ai-cli/actions/workflows/ci.yml)
[![npm version](https://badge.fury.io/js/%40abc%2Ftailwind-upgrade-cli.svg)](https://badge.fury.io/js/%40abc%2Ftailwind-upgrade-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

An industry-standard CLI tool to seamlessly upgrade Tailwind CSS from v3 to v4 across multiple projects with zero configuration.

## ✨ Features
# or
pnpm install -g @abc/tailwind-upgrade-cli
```

### Local Development
```bash
pnpm install
pnpm build
```

## Usage

### Upgrade Current Project
```bash
tailwind-upgrade upgrade
```

### Upgrade Specific Project
```bash
tailwind-upgrade upgrade --path /path/to/your/project
```

## What This Tool Does

The CLI automatically performs the following upgrade steps:

### 1. Package Management
- **Removes** deprecated packages:
  - `@abc/tailwind-config`
  - `@abc/typescript-utils`
- **Installs** `@tailwindcss/postcss` as dev dependency
- **Updates/Adds** `@abc/design-system`:
  - If exists: updates to `2.0.0-beta.0`
  - If not exists: installs latest version

### 2. Configuration Files
- **Removes** `tailwind.config.js`
- **Creates** `postcss.config.mjs` with Tailwind v4 configuration:
  ```javascript
  /** @type {import('postcss-load-config').Config} */
  const config = {
    plugins: {
      '@tailwindcss/postcss': {},
      autoprefixer: {},
    },
  }
  export default config;
  ```

### 3. CSS Updates
- **Removes** old Tailwind imports from `globals.css`:
  ```css
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
  ```
- **Adds** new Tailwind v4 imports:
  ```css
  @import 'tailwindcss';
  @import '../../node_modules/@abc/design-system/dist/globals.css';
  ```

## Requirements

- Node.js 16+
- pnpm package manager
- Projects must use pnpm for package management

## Error Handling

The CLI includes comprehensive error handling and will:
- Skip operations if files don't exist
- Provide clear feedback on each step
- Stop execution on critical errors
- Show progress with visual indicators

## Development

```bash
# Install dependencies
pnpm install

# Run in development mode
pnpm dev

# Build for production
pnpm build

# Test the CLI locally
node dist/index.js upgrade --path ./test-project
```

## License

MIT
