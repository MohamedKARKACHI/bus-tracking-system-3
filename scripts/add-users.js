const mysql = require('mysql2/promise');

async function addUsers() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    port: 8889,
    user: 'root',
    password: 'root',
    database: 'bus_tracking_system'
  });

  try {
    console.log('🔄 Adding users with pre-hashed passwords...');
    
    // These are bcrypt hashes for: admin123, driver123, client123
    const users = [
      ['abdellah.h@bustrack.com', '$2b$10$veZ0rVQYxKZfREzajt0JJe/okGAJXpf5uU4WitvBPQGQdXsoy2hKq', 'admin', 'Abdellah Halmaoui', 'Abdellah', 'Halmaoui', '+212 600 100 200'],
      ['mohamed.k@bustrack.com', '$2b$10$717ZB1aaCQd1iGsIHpTFPukuhMDL.UleFF0Th0sGPbxSYjNp3Bmuq', 'driver', 'Mohamed Karkachi', 'Mohamed', 'Karkachi', '+212 600 000 000'],
      ['youssef.b@bustrack.com', '$2b$10$717ZB1aaCQd1iGsIHpTFPukuhMDL.UleFF0Th0sGPbxSYjNp3Bmuq', 'driver', 'Youssef Benali', 'Youssef', 'Benali', '+212 661 234 567'],
      ['fatima.a@bustrack.com', '$2b$10$er/7RaiQ07yfC34q0xLzYeq4JccfUwhNnihva/BMk8XQ.DMyAG6we', 'client', 'Fatima Zahra Amrani', 'Fatima Zahra', 'Amrani', '+212 662 345 678'],
      ['khalid.m@bustrack.com', '$2b$10$er/7RaiQ07yfC34q0xLzYeq4JccfUwhNnihva/BMk8XQ.DMyAG6we', 'client', 'Khalid El Mansouri', 'Khalid', 'El Mansouri', '+212 663 456 789'],
    ];

    for (const user of users) {
      await connection.query(
        `INSERT INTO users (email, password, role, name, first_name, last_name, phone) 
         VALUES (?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE password = VALUES(password)`,
        user
      );
    }

    console.log('✅ Successfully added users!');
    
    const [result] = await connection.query('SELECT email, role FROM users');
    console.log('📊 Users in database:');
    result.forEach(u => console.log(`  - ${u.email} (${u.role})`));
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await connection.end();
  }
}

addUsers();
