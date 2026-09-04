const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

async function checkReels() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  const [rows] = await connection.execute('SELECT id, video_url, thumbnail_url, product_tag, active FROM reels');
  console.log('Reels in Database:', rows);
  await connection.end();
}

checkReels().catch(console.error);
