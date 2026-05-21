import { readJSON } from '@/lib/dataStore';

export const dynamic = 'force-dynamic';

export async function GET() {
  const orders = readJSON<any[]>('orders.json');
  const customers = readJSON<any[]>('customers.json');
  const products = readJSON<any[]>('products.json');

  const deliveredOrders = orders.filter((o) => o.status !== 'cancelled');
  const totalRevenue = deliveredOrders.reduce((s, o) => s + o.total, 0);
  const totalOrders = orders.length;
  const avgOrderValue = deliveredOrders.length ? totalRevenue / deliveredOrders.length : 0;

  // Revenue by day (last 30 days)
  const now = new Date();
  const revenueByDay: Record<string, number> = {};
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    revenueByDay[d.toISOString().slice(0, 10)] = 0;
  }
  deliveredOrders.forEach((o) => {
    const day = o.created_at.slice(0, 10);
    if (day in revenueByDay) revenueByDay[day] += o.total;
  });

  const revenueChart = Object.entries(revenueByDay).map(([date, value]) => ({ date, value }));

  // Top products
  const productCounts: Record<string, number> = {};
  orders.forEach((o) => {
    (o.items || []).forEach((item: any) => {
      productCounts[item.product_name] = (productCounts[item.product_name] || 0) + item.quantity;
    });
  });
  const topProducts = Object.entries(productCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => ({ name, count }));

  return Response.json({
    totalRevenue,
    totalOrders,
    totalCustomers: customers.length,
    totalProducts: products.length,
    avgOrderValue: Math.round(avgOrderValue),
    revenueChart,
    topProducts,
  });
}
