import { readJSON, writeJSON } from '@/lib/dataStore';
import { v4 as uuidv4 } from 'uuid';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    let orders = readJSON<any[]>('orders.json');
    
    if (status && status !== 'all') {
      orders = orders.filter((o) => o.status.toLowerCase() === status.toLowerCase());
    }
    
    // Enrich with customer names
    const customers = readJSON<any[]>('customers.json');
    orders = orders.map((o) => ({
      ...o,
      customer: customers.find((c) => c.id === o.customer_id) || null,
    }));
    
    return Response.json(orders);
  } catch (e) {
    console.error('Failed to get orders:', e);
    return Response.json({ error: 'Failed to retrieve orders' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, address, items, discountCode, total } = body;

    if (!email || !name || !address || !items || !Array.isArray(items) || items.length === 0) {
      return Response.json({ error: 'Missing required checkout fields' }, { status: 400 });
    }

    // 1. Process Customer profile
    const customers = readJSON<any[]>('customers.json');
    let customer = customers.find((c) => c.email.toLowerCase() === email.toLowerCase().trim());

    if (!customer) {
      customer = {
        id: `cust-${uuidv4().slice(0, 8)}`,
        name: name.trim(),
        email: email.toLowerCase().trim(),
        spent: Number(total),
        orders: 1,
        lastActive: 'Today'
      };
      customers.push(customer);
    } else {
      customer.spent = Number((customer.spent + Number(total)).toFixed(2));
      customer.orders += 1;
      customer.lastActive = 'Today';
    }
    writeJSON('customers.json', customers);

    // 2. Process Discount Code increment
    if (discountCode) {
      const discounts = readJSON<any[]>('discounts.json');
      const discount = discounts.find(d => d.code === discountCode.toUpperCase().trim());
      if (discount) {
        discount.usage_count = (discount.usage_count || 0) + 1;
        writeJSON('discounts.json', discounts);
      }
    }

    // 3. Process Order creation
    const orders = readJSON<any[]>('orders.json');
    const orderId = `ORD-${uuidv4().slice(0, 8).toUpperCase()}`;
    const newOrder = {
      id: orderId,
      customer_id: customer.id,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      total: Number(total),
      status: 'Pending',
      items_count: items.reduce((sum, item) => sum + item.quantity, 0),
      items,
      shipping_address: address,
      discount_code: discountCode || null,
      created_at: new Date().toISOString()
    };

    orders.push(newOrder);
    writeJSON('orders.json', orders);

    return Response.json(newOrder, { status: 201 });
  } catch (error) {
    console.error('Process order checkout failed:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
