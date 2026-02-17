#!/usr/bin/env bun

import { input, confirm, select } from '@inquirer/prompts'
import chalk from 'chalk'
import ora from 'ora'
import { execSync } from 'child_process'
import { existsSync, renameSync, copyFileSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

const VELIST_REPO = 'https://github.com/velist-framework/velist.git'

async function main() {
  console.log()
  console.log(chalk.bold.cyan('  ⚡ Velist'))
  console.log(chalk.gray('  Features-first fullstack framework'))
  console.log()

  // Get project name
  let projectName = process.argv[2]
  
  if (!projectName) {
    projectName = await input({
      message: 'Project name:',
      default: 'my-velist-app',
      validate: (value) => {
        if (value.trim().length === 0) return 'Project name is required'
        if (existsSync(value)) return 'Directory already exists'
        return true
      }
    })
  }

  const projectPath = join(process.cwd(), projectName)

  if (existsSync(projectPath)) {
    console.error(chalk.red(`\n  Error: Directory "${projectName}" already exists\n`))
    process.exit(1)
  }

  // Ask for options
  const installDeps = await confirm({
    message: 'Install dependencies?',
    default: true
  })

  const setupDatabase = await confirm({
    message: 'Setup database (migrate & seed)?',
    default: true
  })

  console.log()

  // Clone repository
  const cloneSpinner = ora(`Cloning Velist into ${projectName}...`).start()
  
  try {
    execSync(`git clone --depth 1 ${VELIST_REPO} "${projectPath}"`, {
      stdio: 'pipe'
    })
    
    // Remove .git folder
    execSync(`rm -rf "${join(projectPath, '.git')}"`)
    
    cloneSpinner.succeed(`Created ${projectName}`)
  } catch (error) {
    cloneSpinner.fail('Failed to clone repository')
    console.error(chalk.red('\n  Please check your internet connection and try again.\n'))
    process.exit(1)
  }

  // Initialize git repository
  const gitSpinner = ora('Initializing git repository...').start()
  try {
    execSync('git init', { cwd: projectPath, stdio: 'pipe' })
    execSync('git add .', { cwd: projectPath, stdio: 'pipe' })
    execSync('git commit -m "Initial commit"', { cwd: projectPath, stdio: 'pipe' })
    gitSpinner.succeed('Git repository initialized')
  } catch (error) {
    gitSpinner.warn('Git initialization skipped')
  }

  // Setup .env file
  const envSpinner = ora('Setting up environment...').start()
  try {
    const envExamplePath = join(projectPath, '.env.example')
    const envPath = join(projectPath, '.env')
    
    if (existsSync(envExamplePath)) {
      copyFileSync(envExamplePath, envPath)
      
      // Generate random JWT secret
      const jwtSecret = cryptoRandomString(32)
      let envContent = readFileSync(envPath, 'utf-8')
      envContent = envContent.replace('change-this-in-production', jwtSecret)
      writeFileSync(envPath, envContent)
    }
    
    // Update package.json name
    const pkgPath = join(projectPath, 'package.json')
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'))
    pkg.name = projectName
    writeFileSync(pkgPath, JSON.stringify(pkg, null, 2))
    
    envSpinner.succeed('Environment configured')
  } catch (error) {
    envSpinner.warn('Environment setup incomplete (non-critical)')
  }

  // Install dependencies
  if (installDeps) {
    const installSpinner = ora('Installing dependencies...').start()
    
    try {
      execSync('bun install', {
        cwd: projectPath,
        stdio: 'pipe'
      })
      installSpinner.succeed('Dependencies installed')
    } catch (error) {
      installSpinner.fail('Failed to install dependencies')
      console.log(chalk.yellow('  Run "bun install" manually to complete setup.\n'))
    }
  }

  // Setup database
  if (setupDatabase && installDeps) {
    const dbSpinner = ora('Setting up database...').start()
    
    try {
      execSync('bun run db:migrate', {
        cwd: projectPath,
        stdio: 'pipe'
      })
      
      execSync('bun run db:seed', {
        cwd: projectPath,
        stdio: 'pipe'
      })
      
      dbSpinner.succeed('Database ready')
    } catch (error) {
      dbSpinner.warn('Database setup incomplete (run "bun run db:migrate && bun run db:seed" manually)')
    }
  }

  // Print success message
  console.log()
  console.log(chalk.green.bold('  ✓ Project created successfully!\n'))
  
  console.log(chalk.bold('  Next steps:\n'))
  console.log(`    cd ${projectName}`)
  
  if (!installDeps) {
    console.log('    bun install')
  }
  
  if (!setupDatabase && installDeps) {
    console.log('    bun run db:migrate')
    console.log('    bun run db:seed')
  }
  
  console.log('    bun run dev\n')
  
  console.log(chalk.gray('  Default credentials:'))
  console.log(chalk.gray('    Email: admin@example.com'))
  console.log(chalk.gray('    Password: password123\n'))
  
  console.log(chalk.cyan('  Documentation: https://velist.dev\n'))
}

function cryptoRandomString(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

main().catch((error) => {
  console.error(chalk.red('\n  Unexpected error:'), error.message)
  process.exit(1)
})
