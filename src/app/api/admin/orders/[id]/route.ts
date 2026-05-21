import { readJSON, writeJSON } from '@/lib/dataStore';

export const dynamic = 'force-dynamic';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const orders = readJSON<any[]>('orders.json');
  const order = orders.find((o) => o.id === id);
  if (!order) return Response.json({ error: 'Not found' }, { status: 404 });
  const customers = readJSON<any[]>('customers.json');
  return Response.json({ ...order, customer: customers.find((c) => c.id === order.customer_id) || null });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const orders = readJSON<any[]>('orders.json');
  const idx = orders.findIndex((o) => o.id === id);
  if (idx === -1) return Response.json({ error: 'Not found' }, { status: 404 });
  orders[idx] = { ...orders[idx], ...body };
  writeJSON('orders.json', orders);
  return Response.json(orders[idx]);
}
