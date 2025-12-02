const mysql = require('mysql2/promise');

async function updateRoutes() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    port: 8889,
    user: 'root',
    password: 'root',
    database: 'bus_tracking_system'
  });

  try {
    console.log('🔄 Clearing old routes...');
    await connection.query('DELETE FROM route_stops');
    await connection.query('DELETE FROM routes');
    await connection.query('ALTER TABLE routes AUTO_INCREMENT = 1');

    console.log('📍 Inserting Moroccan routes...');
    
    const routes = [
      ['R-01', 'Route 1 - Marrakech Express', 'Palmeraie', 'Jemaa el Fna', 12.5, 35, 'active', 8.00],
      ['R-02', 'Route 2 - Marrakech City', 'Gueliz', 'Hivernage', 8.0, 25, 'active', 6.00],
      ['R-03', 'Route 3 - Marrakech Loop', 'Massira', 'Koutoubia', 10.5, 30, 'active', 7.00],
      ['CL-01', 'Casa Line 1', 'Casa Port', 'Morocco Mall', 15.0, 40, 'active', 10.00],
      ['CL-02', 'Casa Line 2', 'Hassan II Mosque', 'Twin Center', 12.0, 35, 'active', 9.00],
      ['TL-01', 'Tanger Line 1', 'Port Tanger Med', 'Grand Socco', 8.5, 25, 'active', 6.00],
      ['TL-02', 'Tanger Line 2', 'Kasbah', 'Ibn Batouta Mall', 11.0, 30, 'active', 7.50],
      ['IC-01', 'Tanger-Casa Express', 'Port Tanger Med', 'Casa Port', 280.0, 150, 'active', 95.00],
      ['IC-02', 'Casa-Marrakech Express', 'Maarif', 'Gare ONCF Marrakech', 240.0, 105, 'active', 75.00],
      ['IC-03', 'Tanger-Marrakech Direct', 'Grand Socco', 'Koutoubia', 520.0, 255, 'active', 120.00]
    ];

    for (const route of routes) {
      await connection.query(
        `INSERT INTO routes (route_number, name, start_location, end_location, distance_km, estimated_duration_minutes, status, fare) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        route
      );
    }

    console.log('✅ Successfully loaded Moroccan routes!');
    
    const [result] = await connection.query('SELECT COUNT(*) as count FROM routes');
    console.log(`📊 Total routes in database: ${result[0].count}`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await connection.end();
  }
}

updateRoutes();
