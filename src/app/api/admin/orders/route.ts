import { readJSON, writeJSON } from '@/lib/dataStore';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  let orders = readJSON<any[]>('orders.json');
  if (status && status !== 'all') {
    orders = orders.filter((o) => o.status === status);
  }
  // Enrich with customer names
  const customers = readJSON<any[]>('customers.json');
  orders = orders.map((o) => ({
    ...o,
    customer: customers.find((c) => c.id === o.customer_id) || null,
  }));
  return Response.json(orders);
}
