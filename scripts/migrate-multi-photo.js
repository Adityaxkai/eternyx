const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

async function migrate() {
  console.log('Connecting to database host:', process.env.DB_HOST);
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });
  
  try {
    console.log('Adding column "additional_images" to "products" table...');
    await connection.execute(`
      ALTER TABLE products ADD COLUMN additional_images TEXT DEFAULT NULL;
    `);
    console.log('✓ Migration successful: added additional_images column.');
  } catch (err) {
    if (err.code === 'ER_DUP_COLUMN_NAME') {
      console.log('✓ Migration note: Column "additional_images" already exists.');
    } else {
      console.error('Migration failed:', err);
    }
  } finally {
    await connection.end();
  }
}

migrate().catch(err => {
  console.error('Fatal migration error:', err);
  process.exit(1);
});
