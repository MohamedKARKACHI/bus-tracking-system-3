import mysql from 'mysql2/promise'

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '8889', 10),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'bus_tracking_system',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
})

export async function connectDatabase() {
  try {
    const connection = await pool.getConnection()
    console.log('✅ Database connected successfully')
    connection.release()
  } catch (error) {
    console.error('❌ Database connection failed:', error)
    throw error
  }
}

export default pool
