const mysql = require('mysql2/promise');

async function updateUsers() {
  const connection = await mysql.createConnection({
    socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock',
    user: 'root',
    password: 'root',
    database: 'bus_tracking_system'
  });

  try {
    console.log('Connected to database...');

    // Delete old users
    await connection.query('DELETE FROM users');
    console.log('Deleted old users');

    // Insert new users with correct credentials
    // Note: include the `name` column to satisfy NOT NULL constraint in current schema
    await connection.query(`
      INSERT INTO users (email, password, role, first_name, last_name, phone, name) VALUES
      ('admin@bustrack.com', '$2b$10$veZ0rVQYxKZfREzajt0JJe/okGAJXpf5uU4WitvBPQGQdXsoy2hKq', 'admin', 'John', 'Admin', '+1234567890', 'John Admin'),
      ('driver@bustrack.com', '$2b$10$717ZB1aaCQd1iGsIHpTFPukuhMDL.UleFF0Th0sGPbxSYjNp3Bmuq', 'driver', 'Mike', 'Johnson', '+1234567891', 'Mike Johnson'),
      ('driver2@bustrack.com', '$2b$10$717ZB1aaCQd1iGsIHpTFPukuhMDL.UleFF0Th0sGPbxSYjNp3Bmuq', 'driver', 'Sarah', 'Williams', '+1234567892', 'Sarah Williams'),
      ('client@bustrack.com', '$2b$10$er/7RaiQ07yfC34q0xLzYeq4JccfUwhNnihva/BMk8XQ.DMyAG6we', 'client', 'Alice', 'Smith', '+1234567893', 'Alice Smith'),
      ('client2@bustrack.com', '$2b$10$er/7RaiQ07yfC34q0xLzYeq4JccfUwhNnihva/BMk8XQ.DMyAG6we', 'client', 'Bob', 'Brown', '+1234567894', 'Bob Brown')
    `);
    console.log('Inserted new users successfully!');

    // Verify the users
    const [users] = await connection.query('SELECT id, email, role, first_name, last_name FROM users');
    console.log('\nUsers in database:');
    console.table(users);

    console.log('\n✅ Database updated successfully!');
    console.log('\nLogin credentials:');
    console.log('Admin: admin@bustrack.com / admin123');
    console.log('Driver: driver@bustrack.com / driver123');
    console.log('Client: client@bustrack.com / client123');

  } catch (error) {
    console.error('Error updating users:', error);
  } finally {
    await connection.end();
  }
}

updateUsers();
