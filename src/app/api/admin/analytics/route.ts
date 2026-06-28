import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const orders = await query<any[]>('SELECT * FROM orders');
    const customers = await query<any[]>('SELECT * FROM customers');
    const products = await query<any[]>('SELECT * FROM products');

    const deliveredOrders = orders.filter((o) => o.status.toLowerCase() !== 'cancelled');
    const totalRevenue = deliveredOrders.reduce((s, o) => s + Number(o.total), 0);
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
      if (o.created_at) {
        const day = o.created_at.slice(0, 10);
        if (day in revenueByDay) revenueByDay[day] += Number(o.total);
      }
    });

    const revenueChart = Object.entries(revenueByDay).map(([date, value]) => ({ date, value }));

    // Fetch order items to calculate top products
    const orderItems = await query<any[]>('SELECT * FROM order_items');
    const productCounts: Record<string, number> = {};
    orderItems.forEach((item) => {
      productCounts[item.name] = (productCounts[item.name] || 0) + item.quantity;
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
  } catch (error) {
    console.error('Failed to get analytics dashboard stats:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
