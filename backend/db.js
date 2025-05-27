const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'mysql',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'speedometer',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function initialize() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS speeds (
        id INT AUTO_INCREMENT PRIMARY KEY,
        speed FLOAT NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Database initialized');
  } catch (err) {
    console.error('Database initialization failed:', err);
  }
}

async function insertSpeed(speed) {
  try {
    await pool.query('INSERT INTO speeds (speed) VALUES (?)', [speed]);
  } catch (err) {
    console.error('Error inserting speed:', err);
  }
}

async function getLatestSpeed(callback) {
  try {
    const [rows] = await pool.query('SELECT speed, timestamp FROM speeds ORDER BY timestamp DESC LIMIT 1');
    callback(null, rows[0]);
  } catch (err) {
    callback(err, null);
  }
}

async function getSpeedHistory() {
  try {
    const [rows] = await pool.query('SELECT speed, timestamp FROM speeds ORDER BY timestamp DESC LIMIT 100');
    return rows;
  } catch (err) {
    throw err;
  }
}

module.exports = {
  initialize,
  insertSpeed,
  getLatestSpeed,
  getSpeedHistory
};