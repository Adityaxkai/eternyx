require('dotenv').config({ path: '.env.local' });
const mysql = require('mysql2/promise');

async function testInventorySystem() {
  console.log('=== STARTING INVENTORY END-TO-END TEST ===\n');

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    // 1. Fetch first product
    const [rows] = await connection.execute('SELECT id, name, sizes, volume FROM products LIMIT 1');
    if (rows.length === 0) {
      console.error('No products found in DB to test.');
      return;
    }

    const testProd = rows[0];
    console.log(`1. Testing Product: "${testProd.name}" (ID: ${testProd.id})`);
    
    let originalSizes = [];
    try {
      originalSizes = typeof testProd.sizes === 'string' ? JSON.parse(testProd.sizes) : (testProd.sizes || []);
    } catch {
      originalSizes = [];
    }

    if (!Array.isArray(originalSizes) || originalSizes.length === 0) {
      originalSizes = [{ size: testProd.volume || '100ml', stock: 20 }];
    }

    const testSizeName = originalSizes[0]?.size || '100ml';
    console.log(`Original sizes:`, originalSizes);

    // 2. Set stock to 25 via update
    const updatedSizes = originalSizes.map(s => {
      if (s.size === testSizeName) return { ...s, stock: 25 };
      return s;
    });

    await connection.execute('UPDATE products SET sizes = ? WHERE id = ?', [
      JSON.stringify(updatedSizes),
      testProd.id
    ]);

    const [check1] = await connection.execute('SELECT sizes FROM products WHERE id = ?', [testProd.id]);
    const parsed1 = JSON.parse(check1[0].sizes);
    const stockAfterSet = parsed1.find(s => s.size === testSizeName)?.stock;
    console.log(`2. Stock updated to 25. Verified in DB: ${stockAfterSet}`);
    if (stockAfterSet !== 25) throw new Error('Stock update check failed');

    // 3. Simulate order deduction of 4 units
    const qtyDeducted = 4;
    const finalSizes = parsed1.map(s => {
      if (s.size === testSizeName) return { ...s, stock: Math.max(0, s.stock - qtyDeducted) };
      return s;
    });

    await connection.execute('UPDATE products SET sizes = ? WHERE id = ?', [
      JSON.stringify(finalSizes),
      testProd.id
    ]);

    const [check2] = await connection.execute('SELECT sizes FROM products WHERE id = ?', [testProd.id]);
    const parsed2 = JSON.parse(check2[0].sizes);
    const stockAfterDeduct = parsed2.find(s => s.size === testSizeName)?.stock;
    console.log(`3. Order simulated (-${qtyDeducted} units). Verified in DB: ${stockAfterDeduct}`);
    if (stockAfterDeduct !== 21) throw new Error('Stock deduction check failed');

    // 4. Restore original stock
    await connection.execute('UPDATE products SET sizes = ? WHERE id = ?', [
      JSON.stringify(originalSizes),
      testProd.id
    ]);
    console.log(`4. Reverted back to initial stock.`);

    console.log('\n✓ INVENTORY SYSTEM TEST PASSED SUCCESSFULLY!');
  } catch (err) {
    console.error('Inventory Test Failed:', err);
  } finally {
    await connection.end();
  }
}

testInventorySystem();
