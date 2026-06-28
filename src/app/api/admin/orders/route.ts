import { orderService } from '@/services/orderService';
import { customerService } from '@/services/customerService';
import { discountService } from '@/services/discountService';
import { v4 as uuidv4 } from 'uuid';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || undefined;
    const orders = await orderService.getAll(status);
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
    const customer = await customerService.createOrUpdate(email, name, Number(total));
    if (!customer) {
      return Response.json({ error: 'Failed to process customer profile' }, { status: 500 });
    }

    // 2. Process Discount Code increment
    if (discountCode) {
      const discount = await discountService.getByCode(discountCode);
      if (discount) {
        await discountService.incrementUsage(discountCode);
      }
    }

    // 3. Process Order creation
    const orderId = `ORD-${uuidv4().slice(0, 8).toUpperCase()}`;
    const newOrder = await orderService.create({
      id: orderId,
      customer_id: customer.id,
      customer_name: name.trim(),
      customer_email: email.toLowerCase().trim(),
      total: Number(total),
      status: 'Pending',
      items,
      shipping_address: address,
      discount_code: discountCode || null,
    });

    if (!newOrder) {
      return Response.json({ error: 'Failed to create order record' }, { status: 500 });
    }

    return Response.json(newOrder, { status: 201 });
  } catch (error) {
    console.error('Process order checkout failed:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
