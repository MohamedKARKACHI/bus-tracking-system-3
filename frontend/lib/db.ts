import mysql from 'mysql2/promise'

const pool = mysql.createPool({
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '8888'),
  user: process.env.DATABASE_USER || 'root',
  password: process.env.DATABASE_PASSWORD || 'root',
  database: process.env.DATABASE_NAME || 'bus_tracking_system',
  socketPath: process.env.DATABASE_SOCKET || '/Applications/MAMP/tmp/mysql/mysql.sock',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
})

// Test connection on startup
pool.getConnection()
  .then(connection => {
    console.log('✅ Database connected successfully')
    connection.release()
  })
  .catch(err => {
    console.error('❌ Database connection failed:', err.message)
    console.error('💡 Make sure MAMP is running and database is setup')
  })

export default pool
