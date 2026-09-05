const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

async function clean() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  await conn.execute("UPDATE products SET image_url = '', additional_images = '[]' WHERE id = '2'");
  const [rows] = await conn.execute("SELECT id, name, image_url, additional_images FROM products");
  console.log("Database products clean:", rows);
  await conn.end();
}

clean().catch(console.error);
