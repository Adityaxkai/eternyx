const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

async function resetDemoData() {
  console.log('Connecting to database:', process.env.DB_HOST);
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    console.log('Clearing demo data from MySQL tables...');
    await connection.execute('DELETE FROM order_items');
    await connection.execute('DELETE FROM orders');
    await connection.execute('DELETE FROM customers');
    await connection.execute('DELETE FROM bookings');
    await connection.execute('DELETE FROM inquiries');
    await connection.execute('DELETE FROM reviews');
    console.log('✓ MySQL demo rows deleted successfully.');

    // Clear JSON files
    const dataDir = path.join(__dirname, '../src/data');
    const jsonFiles = ['orders.json', 'customers.json', 'bookings.json', 'inquiries.json', 'reviews.json'];
    for (const f of jsonFiles) {
      const p = path.join(dataDir, f);
      fs.writeFileSync(p, '[]\n', 'utf8');
      console.log(`✓ Cleared ${f}`);
    }

    console.log('\nAll demo data has been wiped clean!');
  } catch (err) {
    console.error('Reset error:', err);
  } finally {
    await connection.end();
  }
}

resetDemoData();
