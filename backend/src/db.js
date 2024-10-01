const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function connect() {
  try {
    await pool.getConnection();
    console.log('Connected to MySQL database');
  } catch (err) {
    console.error('Error connecting to MySQL database:', err);
    throw err;
  }
}

module.exports = {
  connect,
  pool
};