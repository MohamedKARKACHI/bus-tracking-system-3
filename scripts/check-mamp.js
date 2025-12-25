#!/usr/bin/env node

/**
 * Quick script to check if MAMP is running
 */

const { exec } = require('child_process');

const MYSQL_PATH = '/Applications/MAMP/Library/bin/mysql';

exec(`"${MYSQL_PATH}" -h localhost -P 8889 -u root -proot -e "SELECT VERSION();" 2>&1`, (error, stdout, stderr) => {
  if (error) {
    console.log('❌ MAMP MySQL is not running or not accessible');
    console.log('📝 Please start MAMP and try again\n');
    process.exit(1);
  } else {
    const versionMatch = stdout.match(/(\d+\.\d+\.\d+)/);
    console.log('✅ MAMP MySQL is running');
    if (versionMatch) {
      console.log('📊 MySQL Version:', versionMatch[1]);
    }
    console.log('🌐 phpMyAdmin: http://localhost:8888/phpMyAdmin/\n');
    process.exit(0);
  }
});
