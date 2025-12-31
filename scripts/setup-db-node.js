const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// Database configuration
const DB_CONFIG = {
    host: '127.0.0.1',
    port: 8889,
    user: 'root',
    password: 'root',
    multipleStatements: true // Required for running SQL scripts
};

async function setup() {
    console.log('🚀 Starting Database Setup via MySQL2...');

    let connection;
    try {
        // 1. Connect without Database to Create it
        console.log('🔌 Connecting to MySQL Server...');
        connection = await mysql.createConnection({
            host: DB_CONFIG.host,
            port: DB_CONFIG.port,
            user: DB_CONFIG.user,
            password: DB_CONFIG.password
        });
        console.log('✅ Connected!');

        // 2. Create Database
        console.log('📦 Creating/Selecting Database...');
        await connection.query(`DROP DATABASE IF EXISTS bus_tracking_system`);
        await connection.query(`CREATE DATABASE bus_tracking_system`);
        await connection.query(`USE bus_tracking_system`);
        console.log('✅ Database created and selected!');

        // 3. Read and Execute Schema
        console.log('📝 Executing Schema...');
        let schemaSql = fs.readFileSync(path.join(__dirname, '../database/schema.sql'), 'utf8');

        // Remove CREATE DATABASE/USE
        schemaSql = schemaSql.replace(/CREATE DATABASE IF NOT EXISTS bus_tracking_system;/i, '')
            .replace(/USE bus_tracking_system;/i, '');

        // Split by semicolon and execute
        const statements = schemaSql.split(';')
            .map(s => s.trim())
            .filter(s => s.length > 0);

        for (const statement of statements) {
            if (!statement) continue;
            try {
                await connection.query(statement);
            } catch (err) {
                console.error('⚠️  Error executing statement:', statement.substring(0, 50) + '...');
                console.error(err.message);
                // Continue despite errors (e.g. if table exists) or throw?
                // For schema creation, we generally want it to succeed. 
                // But throwing is better to know what failed.
                throw err;
            }
        }
        console.log(`✅ Schema imported! (${statements.length} statements executed)`);

        // 4. Read and Execute Seed
        console.log('🌱 Executing Seeding...');
        let seedSql = fs.readFileSync(path.join(__dirname, '../database/seed.sql'), 'utf8');

        const seedStatements = seedSql.split(';')
            .map(s => s.trim())
            .filter(s => s.length > 0);

        for (const statement of seedStatements) {
            if (!statement) continue;
            try {
                await connection.query(statement);
            } catch (err) {
                console.error('⚠️  Error executing seed statement:', statement.substring(0, 50) + '...');
                // Duplicate entry errors are common in seeding, maybe ignore?
                if (err.code === 'ER_DUP_ENTRY') {
                    console.log('   -> Skipping duplicate entry');
                } else {
                    throw err;
                }
            }
        }
        console.log(`✅ Data seeded! (${seedStatements.length} statements executed)`);

    } catch (err) {
        console.error('❌ Error:', err);
        process.exit(1);
    } finally {
        if (connection) await connection.end();
    }
}

setup();
