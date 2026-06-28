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
    console.log('Altering "customers" table to add "password_hash" and "phone" columns...');
    
    // Add password_hash column if not exists
    try {
      await connection.execute(`
        ALTER TABLE customers ADD COLUMN password_hash VARCHAR(255) DEFAULT NULL;
      `);
      console.log('✓ Added column "password_hash".');
    } catch (err) {
      if (err.code === 'ER_DUP_COLUMN_NAME') {
        console.log('✓ Column "password_hash" already exists.');
      } else {
        throw err;
      }
    }

    // Add phone column if not exists
    try {
      await connection.execute(`
        ALTER TABLE customers ADD COLUMN phone VARCHAR(50) DEFAULT NULL;
      `);
      console.log('✓ Added column "phone".');
    } catch (err) {
      if (err.code === 'ER_DUP_COLUMN_NAME') {
        console.log('✓ Column "phone" already exists.');
      } else {
        throw err;
      }
    }

    console.log('✓ Migration successful!');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await connection.end();
  }
}

migrate().catch(err => {
  console.error('Fatal migration error:', err);
  process.exit(1);
});
