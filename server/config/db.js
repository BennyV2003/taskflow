const { Pool } = require('pg')
require('dotenv').config()

// Pool keeps database connections warm and reusable

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false 
  }
})

module.exports = pool
