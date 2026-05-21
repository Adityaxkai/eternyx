const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

async function initDB() {
  console.log('Connecting to database...', process.env.DB_HOST);
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  console.log('Connected! Creating tables...');

  // Create Products Table
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS products (
      id VARCHAR(255) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      price DECIMAL(10, 2) NOT NULL,
      category VARCHAR(100),
      volume VARCHAR(50),
      image_url VARCHAR(255),
      position INT DEFAULT 0,
      visible BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('✓ Products table ready');

  // Create Banners Table
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS banners (
      id VARCHAR(255) PRIMARY KEY,
      image_url VARCHAR(255) NOT NULL,
      mobile_image_url VARCHAR(255),
      position INT DEFAULT 0,
      active BOOLEAN DEFAULT true
    )
  `);
  console.log('✓ Banners table ready');

  // Create Reels Table
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS reels (
      id VARCHAR(255) PRIMARY KEY,
      video_url VARCHAR(255) NOT NULL,
      thumbnail_url VARCHAR(255),
      handle VARCHAR(100),
      likes VARCHAR(50),
      product_tag VARCHAR(100),
      position INT DEFAULT 0,
      active BOOLEAN DEFAULT true
    )
  `);
  console.log('✓ Reels table ready');

  console.log('Database initialization complete!');
  await connection.end();
}

initDB().catch(console.error);
