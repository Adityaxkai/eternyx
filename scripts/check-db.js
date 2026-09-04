const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

async function checkDB() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  const [rows] = await connection.execute('SELECT id, name, visible FROM products ORDER BY position ASC');
  console.log('Products in Database:', rows);
  await connection.end();
}

checkDB().catch(console.error);
