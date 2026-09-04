const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

async function syncProducts() {
  console.log('Connecting to database host:', process.env.DB_HOST);
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  console.log('Connected! Syncing products table...');

  // 1. Delete all current products
  await connection.execute('DELETE FROM products');
  console.log('Cleared existing products in database.');

  // 2. Read products from local products.json
  const productsPath = path.join(__dirname, '../src/data/products.json');
  const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

  // 3. Insert products into database
  for (const p of products) {
    const top = p.scent_notes ? JSON.stringify(p.scent_notes.top || []) : '[]';
    const heart = p.scent_notes ? JSON.stringify(p.scent_notes.mid || p.scent_notes.heart || []) : '[]';
    const base = p.scent_notes ? JSON.stringify(p.scent_notes.base || []) : '[]';
    const sizes = p.sizes ? JSON.stringify(p.sizes) : '[]';
    const additionalImages = p.additional_images ? JSON.stringify(p.additional_images) : '[]';

    await connection.execute(
      `INSERT INTO products (id, name, description, price, category, volume, image_url, position, visible, badge, top_notes, heart_notes, base_notes, sizes, additional_images)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        p.id,
        p.name,
        p.description || '',
        p.price || 0,
        p.category || '',
        p.volume || '',
        p.image_url || '',
        p.position || 0,
        p.visible ? 1 : 0,
        p.badge || null,
        top,
        heart,
        base,
        sizes,
        additionalImages
      ]
    );
    console.log(`Synced product: ${p.name}`);
  }

  console.log('✓ Database products synchronized successfully with products.json!');
  await connection.end();
}

syncProducts().catch((err) => {
  console.error('Failed to sync products in database:', err);
  process.exit(1);
});
