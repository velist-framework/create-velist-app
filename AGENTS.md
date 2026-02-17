# AGENTS.md - create-velist-app

> This file contains essential information for AI coding agents working on this project.

## Project Overview

**create-velist-app** is a CLI scaffolding tool for creating new [Velist](https://github.com/velist-framework/velist) applications. It is distributed as an npm package and can be invoked via `bun create velist` or `npx create-velist-app`.

- **Name**: `create-velist-app`
- **Version**: 1.0.0
- **License**: MIT
- **Author**: Velist Framework
- **Repository**: https://github.com/velist-framework/create-velist-app.git

## Technology Stack

- **Runtime**: [Bun](https://bun.sh) (>= 1.0.0)
- **Language**: TypeScript 5.3+
- **Module System**: ESM (`"type": "module"`)
- **Build Tool**: Bun bundler
- **Target Platform**: Node.js

### Dependencies

| Package | Purpose |
|---------|---------|
| `@inquirer/prompts` ^7.0.0 | Interactive CLI prompts (input, confirm, select) |
| `chalk` ^5.3.0 | Terminal string styling and colors |
| `ora` ^8.0.0 | Elegant terminal loading spinners |

### Dev Dependencies

| Package | Purpose |
|---------|---------|
| `@types/bun` | TypeScript types for Bun runtime |
| `typescript` ^5.3.0 | TypeScript compiler |

## Project Structure

```
create-velist-app/
├── src/
│   └── index.ts              # Main CLI entry point (single-file application)
├── dist/
│   └── index.js              # Compiled/bundled output (includes all dependencies)
├── package.json              # Package configuration
├── bun.lock                  # Bun lockfile
├── README.md                 # User documentation
├── LICENSE                   # MIT License
└── .gitignore                # Git ignore rules
```

### Source File (`src/index.ts`)

The CLI is implemented as a single TypeScript file containing:

1. **CLI Banner**: Displays "⚡ Velist" branding with tagline
2. **Argument Parsing**: Accepts optional project name from command line args
3. **Interactive Prompts**:
   - Project name (if not provided as argument)
   - Install dependencies confirmation
   - Database setup confirmation
4. **Scaffolding Process**:
   - Clones the Velist repo (`https://github.com/velist-framework/velist.git`)
   - Removes `.git` folder for fresh history
   - Initializes new Git repository with `git init`
   - Creates initial commit with `git add .` and `git commit -m "Initial commit"`
   - Generates random JWT secret for `.env`
   - Updates `package.json` name field
   - Optionally runs `bun install`
   - Optionally runs `bun run db:migrate` and `bun run db:seed`
5. **Success Message**: Displays next steps and default credentials

## Build and Development Commands

All commands use Bun:

```bash
# Development - run source directly
bun run dev

# Production build - bundle to single file
bun run build

# Publish preparation (runs build automatically)
bun run prepublishOnly
```

### Build Configuration

The build command bundles everything into a single executable:

```bash
bun build ./src/index.ts --outfile ./dist/index.js --target node
```

- **Entry**: `src/index.ts`
- **Output**: `dist/index.js`
- **Target**: Node.js runtime
- **Bundle**: All dependencies are bundled into the output file

## Distribution

The package is published to npm registry with the following configuration:

```json
{
  "bin": {
    "create-velist-app": "./dist/index.js"
  },
  "files": ["dist"]
}
```

Only the `dist/` directory is included in the published package.

## Code Style Guidelines

- Use **single quotes** for strings
- Use **2-space indentation**
- Use **semicolons** (inferred from source)
- Prefer `const` and `let` over `var`
- Use async/await for asynchronous operations
- Use template literals for string interpolation

### Error Handling Pattern

```typescript
const spinner = ora('Doing something...').start()
try {
  // operation
  spinner.succeed('Done')
} catch (error) {
  spinner.fail('Failed')
  process.exit(1)
}
```

### Console Output Pattern

- Use `chalk` for colors: `chalk.bold.cyan()`, `chalk.green.bold()`
- Use `ora` for async operations with spinners
- Prefix messages with 2 spaces for consistent indentation
- Use empty `console.log()` for visual spacing

## Testing

This project does not currently have automated tests. Testing is done manually by:

1. Running `bun run build` to ensure bundling works
2. Running `./dist/index.js` or `bun run dev` to test CLI flow
3. Verifying the generated project structure

## Release Process

1. Update version in `package.json`
2. Run `bun run build` to generate fresh `dist/index.js`
3. Run `npm publish` (or `bun publish`)

The `prepublishOnly` script automatically runs the build before publishing.

## Security Considerations

### JWT Secret Generation

The CLI generates a cryptographically random string for JWT secrets using a simple character pool:

```typescript
function cryptoRandomString(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'
  // ... random selection
}
```

This is used to replace the placeholder `change-this-in-production` in the `.env` file.

### Child Process Execution

The CLI uses `execSync` for:
- `git clone` - Downloads the Velist template
- `rm -rf` - Removes the `.git` folder
- `git init` / `git add` / `git commit` - Initializes fresh Git repository
- `bun install` - Installs dependencies
- `bun run db:migrate` / `bun run db:seed` - Database setup

All paths are properly joined using `path.join()` to handle cross-platform compatibility.

## Dependencies on External Resources

- **Velist Repository**: `https://github.com/velist-framework/velist.git`
- **Bun Runtime**: Required for both development and the scaffolded application
- **Git**: Required for cloning the template repository

## Common Tasks

### Adding a New Prompt

Use `@inquirer/prompts`:

```typescript
import { confirm } from '@inquirer/prompts'

const value = await confirm({
  message: 'Your question?',
  default: true
})
```

### Adding a New CLI Option

Add to the interactive flow in `main()` or parse from `process.argv`.

### Modifying the Template Source

Change the `VELIST_REPO` constant:

```typescript
const VELIST_REPO = 'https://github.com/velist-framework/velist.git'
```

## Troubleshooting

### Build fails

- Ensure Bun is installed: `bun --version`
- Clear `dist/` and rebuild: `rm -rf dist && bun run build`

### CLI fails during scaffolding

- Check internet connection (git clone requires network)
- Ensure git is installed
- Check that the target directory doesn't already exist

## Related Projects

- [create-velist-app](https://github.com/velist-framework/create-velist-app) - This CLI scaffolding tool (current repository)
- [Velist Framework](https://github.com/velist-framework/velist) - The fullstack framework being scaffolded
- [velist.dev](https://velist.dev) - Documentation website
