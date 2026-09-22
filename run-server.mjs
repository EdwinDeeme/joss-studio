#!/usr/bin/env node
// Wrapper to load .env variables before running Astro preview

import dotenv from 'dotenv';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load .env file
dotenv.config({ path: path.join(__dirname, '.env') });

// Spawn npm run preview with inherited env vars
const child = spawn('npm', ['run', 'preview'], {
  stdio: 'inherit',
  cwd: __dirname,
  env: {
    ...process.env,
    DATABASE_URL: process.env.DATABASE_URL,
    ADMIN_TOKEN: process.env.ADMIN_TOKEN,
    PUBLIC_SITE_URL: process.env.PUBLIC_SITE_URL,
  }
});

child.on('exit', (code) => {
  process.exit(code);
});
