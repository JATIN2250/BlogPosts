const { Pool } = require('pg');
require('dotenv').config();

// Detect if running inside Docker
const isDocker = process.env.DOCKER_ENV === 'true';

// Use 'postgres' as host when running in Docker, otherwise 'localhost'
const host = isDocker ? 'postgres' : (process.env.DB_HOST || 'localhost');

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host,
  database: process.env.DB_NAME || 'BlogDatas',
  password: process.env.DB_PASSWORD || 'J@tin1234',
  port: process.env.DB_PORT || 5432,
});

// Function to initialize DB and create tables with retry logic
async function initDB(retries = 10, delay = 5000) {
  while (retries) {
    const client = await pool.connect();
    try {
      console.log("✅ Connected to PostgreSQL");

      // Table 1: userInfo
      await client.query(`
        CREATE TABLE IF NOT EXISTS userInfo (
          user_id SERIAL PRIMARY KEY,
          username TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          userpass TEXT NOT NULL
          
        );
      `);

      // Table 2: userBlog
      await client.query(`
        CREATE TABLE IF NOT EXISTS userBlog (
          id SERIAL PRIMARY KEY,
          title TEXT NOT NULL,
          description TEXT NOT NULL,
          image_url TEXT,
          user_id INTEGER REFERENCES userInfo(user_id) ON DELETE CASCADE
          
        );
      `);

      console.log("✅ Tables ensured: userInfo, userBlog");
      client.release();
      break;
    } catch (err) {
      console.error("❌ Error initializing DB:", err.message);
      client.release();
      retries -= 1;
      if (retries === 0) {
        console.error("🚨 Could not connect to database after multiple attempts.");
        process.exit(1);
      }
      console.log(`🔁 Retrying DB connection in ${delay / 1000}s...`);
      await new Promise(res => setTimeout(res, delay));
    }
  }
}

// Call the function to create tables on backend start
initDB();

module.exports = pool;
