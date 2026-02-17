# create-velist-app

> Create a new Velist application in seconds.

## Usage

### With Bun (recommended)

```bash
bun create velist my-app
```

### With npx

```bash
npx create-velist-app my-app
```

### Interactive Mode

```bash
bun create velist
# or
npx create-velist-app
```

## Options

The CLI will ask you:

1. **Project name** — Name of your new project (directory)
2. **Install dependencies** — Run `bun install` automatically
3. **Setup database** — Run migrations and seeders

## What It Does

1. Clones the [velist](https://github.com/velist-framework/velist) repository
2. Removes the `.git` folder for a fresh start
3. Generates a secure JWT secret in `.env`
4. Updates `package.json` with your project name
5. Installs dependencies (if selected)
6. Sets up the database (if selected)

## Requirements

- [Bun](https://bun.sh) >= 1.0.0

## After Creation

```bash
cd my-app
bun run dev
```

Then open http://localhost:3000

Default credentials:
- Email: `admin@example.com`
- Password: `password123`

## Documentation

Visit [velist.dev](https://velist.dev) for full documentation.

## License

MIT
