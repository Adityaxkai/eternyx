import { readJSON } from '@/lib/dataStore';

export const dynamic = 'force-dynamic';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const customers = readJSON<any[]>('customers.json');
  const customer = customers.find((c) => c.id === id);
  if (!customer) return Response.json({ error: 'Not found' }, { status: 404 });
  const orders = readJSON<any[]>('orders.json').filter((o) => o.customer_id === id);
  const totalSpend = orders.reduce((sum, o) => sum + o.total, 0);
  return Response.json({ ...customer, orders, total_spend: totalSpend });
}
