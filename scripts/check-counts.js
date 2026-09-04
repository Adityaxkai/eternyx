const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

async function checkCounts() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  const [[orders]] = await connection.execute('SELECT COUNT(*) as count FROM orders');
  const [[customers]] = await connection.execute('SELECT COUNT(*) as count FROM customers');
  const [[products]] = await connection.execute('SELECT COUNT(*) as count FROM products');
  
  console.log('Database Counts:');
  console.log('- Products:', products.count);
  console.log('- Orders:', orders.count);
  console.log('- Customers:', customers.count);
  
  await connection.end();
}

checkCounts().catch(console.error);
