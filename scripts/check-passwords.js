const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');

async function checkPasswords() {
  const pool = mysql.createPool({
    host: 'localhost',
    port: 8889,
    user: 'root',
    password: 'root',
    database: 'bus_tracking_system',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

  try {
    console.log('🔍 Checking user passwords...\n');

    const [users] = await pool.query('SELECT id, email, password, is_active FROM users LIMIT 10');

    for (const user of users) {
      console.log(`\n📧 Email: ${user.email}`);
      console.log(`   Active: ${user.is_active ? '✅ Yes' : '❌ No'}`);
      
      // Test passwords
      const passwords = ['admin123', 'driver123', 'client123', 'password123'];
      let matched = false;
      
      for (const pwd of passwords) {
        try {
          const isMatch = await bcrypt.compare(pwd, user.password);
          if (isMatch) {
            console.log(`   Password: ✅ ${pwd}`);
            matched = true;
            break;
          }
        } catch (e) {
          // Password might not be hashed
        }
      }
      
      if (!matched) {
        console.log(`   Password: ❓ Unknown (hash: ${user.password.substring(0, 20)}...)`);
      }
    }

    console.log('\n✅ Check complete!\n');
    await pool.end();

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkPasswords();
