# Usage Examples

## Install the CLI globally
```bash
npm install -g @abc/tailwind-upgrade-cli
```

## Run on current project
```bash
tailwind-upgrade upgrade
```

## Run on specific project
```bash
tailwind-upgrade upgrade --path /path/to/your/project
```

## What happens during upgrade:

1. ✅ Checks `package.json` and removes `@abc/tailwind-config`, `@abc/typescript-utils`
2. ✅ Installs `@tailwindcss/postcss` as dev dependency
3. ✅ Updates/adds `@abc/design-system` (2.0.0-beta.0 if exists, latest if new)
4. ✅ Removes `tailwind.config.js`
5. ✅ Creates `postcss.config.mjs` with v4 configuration
6. ✅ Updates `globals.css` files with new imports

## Example Output:
```
✨ Starting Tailwind CSS upgrade...
📦 Removed @abc/tailwind-config from dependencies
📦 Removed @abc/typescript-utils from devDependencies
✅ Installed @tailwindcss/postcss
✅ Updated @abc/design-system to 2.0.0-beta.0
🗑️  Removed tailwind.config.js
✅ Created postcss.config.mjs with Tailwind v4 configuration
✅ Updated src/styles/globals.css
✅ Tailwind CSS upgrade completed successfully!
```
