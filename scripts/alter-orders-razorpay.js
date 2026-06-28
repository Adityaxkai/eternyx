const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

async function runAlter() {
  console.log('Connecting to database...', process.env.DB_HOST);
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  console.log('Connected! Modifying orders table for Razorpay columns...');

  try {
    // Add payment_status column
    await connection.execute(`
      ALTER TABLE orders 
      ADD COLUMN IF NOT EXISTS payment_status VARCHAR(50) DEFAULT 'Pending' AFTER status
    `);
    console.log('✓ payment_status column added/verified.');

    // Add razorpay_order_id column
    await connection.execute(`
      ALTER TABLE orders 
      ADD COLUMN IF NOT EXISTS razorpay_order_id VARCHAR(255) NULL AFTER payment_status
    `);
    console.log('✓ razorpay_order_id column added/verified.');

    // Add razorpay_payment_id column
    await connection.execute(`
      ALTER TABLE orders 
      ADD COLUMN IF NOT EXISTS razorpay_payment_id VARCHAR(255) NULL AFTER razorpay_order_id
    `);
    console.log('✓ razorpay_payment_id column added/verified.');

    // Add razorpay_signature column
    await connection.execute(`
      ALTER TABLE orders 
      ADD COLUMN IF NOT EXISTS razorpay_signature VARCHAR(255) NULL AFTER razorpay_payment_id
    `);
    console.log('✓ razorpay_signature column added/verified.');

    console.log('Database schema successfully altered for Razorpay integration!');
  } catch (error) {
    console.error('Failed to alter database schema:', error);
  } finally {
    await connection.end();
  }
}

runAlter();
