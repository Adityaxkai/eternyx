import { readJSON } from '@/lib/dataStore';

export const dynamic = 'force-dynamic';

export async function GET() {
  const customers = readJSON<any[]>('customers.json');
  const orders = readJSON<any[]>('orders.json');
  const enriched = customers.map((c) => {
    const customerOrders = orders.filter((o) => o.customer_id === c.id);
    const totalSpend = customerOrders.reduce((sum, o) => sum + o.total, 0);
    return { ...c, order_count: customerOrders.length, total_spend: totalSpend };
  });
  return Response.json(enriched);
}
