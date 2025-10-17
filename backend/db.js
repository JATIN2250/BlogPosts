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
  password: process.env.DB_PASSWORD || 'yourStrongPassword123',
  port: process.env.DB_PORT || 5432,
});

module.exports = pool;
