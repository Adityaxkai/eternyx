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
    console.log('Altering "orders" table to add "shipping_carrier", "shipping_tracking_id", "shipping_label_url", and "shipping_cost" columns...');
    
    // shipping_carrier
    try {
      await connection.execute(`
        ALTER TABLE orders ADD COLUMN shipping_carrier VARCHAR(100) DEFAULT NULL;
      `);
      console.log('✓ Added column "shipping_carrier".');
    } catch (err) {
      if (err.code === 'ER_DUP_COLUMN_NAME') {
        console.log('✓ Column "shipping_carrier" already exists.');
      } else {
        throw err;
      }
    }

    // shipping_tracking_id
    try {
      await connection.execute(`
        ALTER TABLE orders ADD COLUMN shipping_tracking_id VARCHAR(255) DEFAULT NULL;
      `);
      console.log('✓ Added column "shipping_tracking_id".');
    } catch (err) {
      if (err.code === 'ER_DUP_COLUMN_NAME') {
        console.log('✓ Column "shipping_tracking_id" already exists.');
      } else {
        throw err;
      }
    }

    // shipping_label_url
    try {
      await connection.execute(`
        ALTER TABLE orders ADD COLUMN shipping_label_url VARCHAR(512) DEFAULT NULL;
      `);
      console.log('✓ Added column "shipping_label_url".');
    } catch (err) {
      if (err.code === 'ER_DUP_COLUMN_NAME') {
        console.log('✓ Column "shipping_label_url" already exists.');
      } else {
        throw err;
      }
    }

    // shipping_cost
    try {
      await connection.execute(`
        ALTER TABLE orders ADD COLUMN shipping_cost DECIMAL(10, 2) DEFAULT NULL;
      `);
      console.log('✓ Added column "shipping_cost".');
    } catch (err) {
      if (err.code === 'ER_DUP_COLUMN_NAME') {
        console.log('✓ Column "shipping_cost" already exists.');
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
