#!/usr/bin/env node

/**
 * Script to hash passwords for database users
 */

const bcrypt = require('bcryptjs')
const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function hashPassword() {
  rl.question('Enter password to hash: ', async (password) => {
    if (!password) {
      console.log('❌ Password cannot be empty')
      rl.close()
      return
    }

    try {
      const hash = await bcrypt.hash(password, 10)
      console.log('\n✅ Password hashed successfully!\n')
      console.log('Hash:', hash)
      console.log('\nUse this SQL to update user password:')
      console.log(`UPDATE users SET password = '${hash}' WHERE email = 'your-email@example.com';\n`)
    } catch (error) {
      console.error('❌ Error hashing password:', error.message)
    }
    
    rl.close()
  })
}

hashPassword()
