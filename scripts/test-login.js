const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');

const dbConfig = {
  host: 'localhost',
  port: 8889,
  user: 'root',
  password: 'root',
  database: 'bus_tracking_system',
  socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock'
};

async function testLogin() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    
    // Test credentials
    const testEmail = 'admin@bustrack.com';
    const testPassword = 'admin123';
    
    console.log('\n🔍 Testing login for:', testEmail);
    console.log('📝 Password attempt:', testPassword);
    
    // Get user from database
    const [users] = await connection.execute(
      'SELECT id, email, password, role, first_name, last_name, is_active FROM users WHERE email = ?',
      [testEmail]
    );
    
    if (users.length === 0) {
      console.log('❌ User not found');
      await connection.end();
      return;
    }
    
    const user = users[0];
    console.log('\n✅ User found:');
    console.log('   ID:', user.id);
    console.log('   Email:', user.email);
    console.log('   Role:', user.role);
    console.log('   Active:', user.is_active);
    console.log('   Password Hash:', user.password.substring(0, 20) + '...');
    
    // Test password comparison
    console.log('\n🔐 Testing password comparison...');
    const isMatch = await bcrypt.compare(testPassword, user.password);
    
    if (isMatch) {
      console.log('✅ PASSWORD MATCH! Login should work.');
    } else {
      console.log('❌ PASSWORD MISMATCH! Login will fail.');
      
      // Try to create the correct hash
      const correctHash = await bcrypt.hash(testPassword, 10);
      console.log('\n🔧 Correct hash would be:', correctHash.substring(0, 20) + '...');
      
      // Test if the new hash works
      const testNewHash = await bcrypt.compare(testPassword, correctHash);
      console.log('🧪 New hash test:', testNewHash ? 'WORKS' : 'FAILS');
    }
    
    await connection.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testLogin();
