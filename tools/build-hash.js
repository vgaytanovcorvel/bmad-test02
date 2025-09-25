#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

/**
 * Build hash injection script for environment configuration
 * Replaces BUILD_HASH_PLACEHOLDER in production environment with actual hash
 */

function generateBuildHash() {
  // Use current timestamp and git commit hash if available
  const timestamp = new Date().toISOString();
  const randomBytes = crypto.randomBytes(8).toString('hex');
  return `${timestamp.slice(0, 10)}-${randomBytes}`;
}

function injectBuildHash() {
  const buildHash = process.env.BUILD_HASH || generateBuildHash();
  const envProdPath = path.join(__dirname, '..', 'apps', 'ui', 'src', 'environments', 'environment.prod.ts');
  
  console.log(`🔨 Injecting build hash: ${buildHash}`);
  
  if (!fs.existsSync(envProdPath)) {
    console.error(`❌ Environment file not found: ${envProdPath}`);
    process.exit(1);
  }
  
  let content = fs.readFileSync(envProdPath, 'utf8');
  
  // Replace placeholder with actual build hash
  content = content.replace('BUILD_HASH_PLACEHOLDER', buildHash);
  
  fs.writeFileSync(envProdPath, content);
  
  console.log(`✅ Build hash injected successfully into ${envProdPath}`);
}

function restoreEnvironment() {
  const envProdPath = path.join(__dirname, '..', 'apps', 'ui', 'src', 'environments', 'environment.prod.ts');
  
  if (!fs.existsSync(envProdPath)) {
    return;
  }
  
  let content = fs.readFileSync(envProdPath, 'utf8');
  
  // Restore placeholder if it was replaced
  content = content.replace(/buildHash: '[^']*'/, "buildHash: 'BUILD_HASH_PLACEHOLDER'");
  
  fs.writeFileSync(envProdPath, content);
  
  console.log(`🔄 Environment file restored to template state`);
}

const command = process.argv[2];

switch (command) {
  case 'inject':
    injectBuildHash();
    break;
  case 'restore':
    restoreEnvironment();
    break;
  default:
    console.log('Usage: node build-hash.js [inject|restore]');
    console.log('  inject  - Replace BUILD_HASH_PLACEHOLDER with actual hash');
    console.log('  restore - Restore placeholder for development');
    process.exit(1);
}