import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [orders, customers, products, orderItems] = await Promise.all([
      query<any[]>('SELECT total, status, payment_status, created_at FROM orders'),
      query<any[]>('SELECT id FROM customers'),
      query<any[]>('SELECT id FROM products'),
      query<any[]>('SELECT name, quantity FROM order_items')
    ]);

    // Only count orders that are PAID or CONFIRMED in revenue and total orders
    const paidOrders = orders.filter((o) => 
      o.payment_status?.toLowerCase() === 'paid' || 
      ['processing', 'shipped', 'delivered'].includes(o.status?.toLowerCase())
    );
    const totalRevenue = paidOrders.reduce((s, o) => s + Number(o.total), 0);
    const totalOrders = paidOrders.length;
    const avgOrderValue = paidOrders.length ? totalRevenue / paidOrders.length : 0;

    // Revenue by day (last 30 days)
    const now = new Date();
    const revenueByDay: Record<string, number> = {};
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      revenueByDay[d.toISOString().slice(0, 10)] = 0;
    }

    paidOrders.forEach((o) => {
      if (o.created_at) {
        const day = o.created_at.slice(0, 10);
        if (day in revenueByDay) revenueByDay[day] += Number(o.total);
      }
    });

    const revenueChart = Object.entries(revenueByDay).map(([date, value]) => ({ date, value }));

    // Calculate top products from fetched order items
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
