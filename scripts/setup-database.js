#!/usr/bin/env node

/**
 * Automatic Database Setup Script for MAMP
 * This script runs automatically after npm/pnpm install
 */

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Database configuration
const DB_CONFIG = {
  host: '127.0.0.1',
  port: 8889,
  user: 'root',
  password: 'root',
  database: 'bus_tracking_system'
};

// MAMP MySQL path
const MYSQL_PATH = 'mysql';

// Check if MySQL executable exists
function checkMySQLExists() {
  return true;
}

// Test MySQL connection
function testConnection() {
  return new Promise((resolve, reject) => {
    const testCmd = `"${MYSQL_PATH}" -h ${DB_CONFIG.host} -P ${DB_CONFIG.port} -u ${DB_CONFIG.user} -p${DB_CONFIG.password} -e "SELECT 1;" 2>&1`;

    exec(testCmd, (error, stdout, stderr) => {
      if (error) {
        reject(new Error('Cannot connect to MySQL. Please ensure MAMP is running.'));
      } else {
        resolve(true);
      }
    });
  });
}

// Import SQL file
function importSQL(filePath) {
  return new Promise((resolve, reject) => {
    const absolutePath = path.resolve(__dirname, '..', filePath);

    if (!fs.existsSync(absolutePath)) {
      reject(new Error(`SQL file not found: ${absolutePath}`));
      return;
    }

    const cmd = `"${MYSQL_PATH}" -h ${DB_CONFIG.host} -P ${DB_CONFIG.port} -u ${DB_CONFIG.user} -p${DB_CONFIG.password} < "${absolutePath}" 2>&1`;

    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        // Check if error is just a warning about password on command line
        if (stderr.includes('Using a password on the command line')) {
          resolve(stdout);
        } else {
          reject(new Error(`Failed to import ${filePath}: ${stderr || error.message}`));
        }
      } else {
        resolve(stdout);
      }
    });
  });
}

// Main setup function
async function setupDatabase() {
  console.log('\n🚀 Bus Tracking System - Database Setup\n');
  console.log('========================================\n');

  try {
    // Check if MAMP MySQL exists
    if (!checkMySQLExists()) {
      console.log('❌ MAMP MySQL not found at:', MYSQL_PATH);
      console.log('📝 Please install MAMP or update the MySQL path in scripts/setup-database.js');
      console.log('ℹ️  You can manually import the database files from the database/ folder\n');
      return;
    }

    console.log('✓ MySQL executable found');

    // Test connection
    try {
      await testConnection();
      console.log('✓ Connected to MySQL successfully');
    } catch (error) {
      console.log('❌ ' + error.message);
      console.log('📝 Please start MAMP and ensure MySQL is running on port 8889\n');
      return;
    }

    // Import schema
    console.log('\n📦 Creating database schema...');
    try {
      await importSQL('database/schema.sql');
      console.log('✓ Database schema created successfully');
    } catch (error) {
      console.log('❌ ' + error.message);
      console.log('ℹ️  The database might already exist, continuing...\n');
    }

    // Import seed data
    console.log('\n🌱 Importing seed data...');
    try {
      await importSQL('database/seed.sql');
      console.log('✓ Seed data imported successfully');
    } catch (error) {
      console.log('⚠️  Warning: ' + error.message);
      console.log('ℹ️  Seed data might already exist or there was an error\n');
    }

    console.log('\n✅ Database setup completed successfully!');
    console.log('\n📊 Database Details:');
    console.log('   • Host: ' + DB_CONFIG.host);
    console.log('   • Port: ' + DB_CONFIG.port);
    console.log('   • Database: ' + DB_CONFIG.database);
    console.log('   • Username: ' + DB_CONFIG.user);
    console.log('\n🌐 Access phpMyAdmin: http://localhost:8888/phpMyAdmin/');
    console.log('\n');

  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    console.log('\n📝 Manual Setup Instructions:');
    console.log('   1. Start MAMP');
    console.log('   2. Open phpMyAdmin: http://localhost:8888/phpMyAdmin/');
    console.log('   3. Import database/schema.sql');
    console.log('   4. Import database/seed.sql\n');
  }
}

// Ask user if they want to run setup
function promptSetup() {
  rl.question('\n🔧 Would you like to setup the database now? (y/N): ', (answer) => {
    rl.close();

    if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
      setupDatabase();
    } else {
      console.log('\n⏭️  Skipping database setup.');
      console.log('📝 You can run database setup later with: npm run setup:db\n');
    }
  });
}

// Check if this is being run automatically or manually
if (process.env.npm_lifecycle_event === 'postinstall') {
  // Running automatically after install
  console.log('\n📦 Post-install: Database setup available');
  console.log('   Run "npm run setup:db" to setup the database automatically\n');
} else {
  // Running manually
  promptSetup();
}
