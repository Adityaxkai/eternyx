import { query } from '@/lib/db';
import { Order, OrderItem } from '@/lib/types';

export const orderService = {
  getAll: async (status?: string): Promise<Order[]> => {
    try {
      let sql = `
        SELECT o.*, c.phone as customer_phone 
        FROM orders o 
        LEFT JOIN customers c ON (o.customer_id = c.id OR (o.customer_id IS NULL AND o.customer_email = c.email AND o.customer_email != ''))
      `;
      const params: any[] = [];
      if (status && status !== 'all') {
        sql += ' WHERE o.status = ?';
        params.push(status);
      }
      sql += ' ORDER BY o.created_at DESC';

      const orders = await query<any[]>(sql, params);
      
      // Fetch items for each order
      const ordersWithItems = await Promise.all(
        orders.map(async (o) => {
          const items = await query<OrderItem[]>('SELECT * FROM order_items WHERE order_id = ?', [o.id]);
          return {
            ...o,
            customer: {
              id: o.customer_id || '',
              name: o.customer_name || '',
              email: o.customer_email || '',
              phone: o.customer_phone || '',
              spent: 0, // Mock/derived fields
              orders: 0,
              lastActive: '',
            },
            shipping_address: typeof o.shipping_address === 'string' ? JSON.parse(o.shipping_address) : o.shipping_address,
            items,
            items_count: items.reduce((acc, curr) => acc + curr.quantity, 0),
          };
        })
      );
      
      return ordersWithItems;
    } catch (e) {
      console.error('Failed to get all orders:', e);
      return [];
    }
  },

  getById: async (id: string): Promise<Order | null> => {
    try {
      const orders = await query<any[]>(`
        SELECT o.*, c.phone as customer_phone 
        FROM orders o 
        LEFT JOIN customers c ON (o.customer_id = c.id OR (o.customer_id IS NULL AND o.customer_email = c.email AND o.customer_email != ''))
        WHERE o.id = ?
      `, [id]);
      if (orders.length === 0) return null;
      
      const o = orders[0];
      const items = await query<OrderItem[]>('SELECT * FROM order_items WHERE order_id = ?', [o.id]);
      
      return {
        ...o,
        customer: {
          id: o.customer_id || '',
          name: o.customer_name || '',
          email: o.customer_email || '',
          phone: o.customer_phone || '',
          spent: 0,
          orders: 0,
          lastActive: '',
        },
        shipping_address: typeof o.shipping_address === 'string' ? JSON.parse(o.shipping_address) : o.shipping_address,
        items,
        items_count: items.reduce((acc, curr) => acc + curr.quantity, 0),
      };
    } catch (e) {
      console.error(`Failed to get order ${id}:`, e);
      return null;
    }
  },

  getByRazorpayOrderId: async (razorpayOrderId: string): Promise<Order | null> => {
    try {
      const orders = await query<any[]>('SELECT id FROM orders WHERE razorpay_order_id = ?', [razorpayOrderId]);
      if (orders.length === 0) return null;
      return await orderService.getById(orders[0].id);
    } catch (e) {
      console.error(`Failed to get order by Razorpay Order ID ${razorpayOrderId}:`, e);
      return null;
    }
  },

  create: async (o: Omit<Order, 'items_count'>): Promise<Order | null> => {
    try {
      const address = JSON.stringify(o.shipping_address);
      const now = new Date().toISOString();
      const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

      await query(
        `INSERT INTO orders (id, customer_id, customer_name, customer_email, total, status, payment_status, razorpay_order_id, razorpay_payment_id, razorpay_signature, shipping_address, discount_code, created_at, date)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          o.id,
          o.customer_id || null,
          o.customer_name || '',
          o.customer_email || '',
          o.total,
          o.status || 'Pending',
          o.payment_status || 'Pending',
          o.razorpay_order_id || null,
          o.razorpay_payment_id || null,
          o.razorpay_signature || null,
          address,
          o.discount_code || null,
          o.created_at || now,
          o.date || dateStr
        ]
      );

      if (Array.isArray(o.items)) {
        for (const item of o.items) {
          await query(
            `INSERT INTO order_items (order_id, product_id, name, size, price, quantity, image)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
              o.id,
              null, // product_id optional
              item.name,
              item.size || '',
              item.price,
              item.quantity || 1,
              item.image || ''
            ]
          );
        }
      }

      return await orderService.getById(o.id);
    } catch (e) {
      console.error('Failed to create order:', e);
      return null;
    }
  },

  updateStatus: async (id: string, status: string): Promise<Order | null> => {
    try {
      await query('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
      return await orderService.getById(id);
    } catch (e) {
      console.error(`Failed to update order status ${id}:`, e);
      return null;
    }
  },

  confirmPayment: async (
    id: string, 
    paymentStatus: string, 
    metadata: { razorpayPaymentId: string; razorpaySignature: string }
  ): Promise<Order | null> => {
    try {
      await query(
        `UPDATE orders 
         SET payment_status = ?, 
             razorpay_payment_id = ?, 
             razorpay_signature = ?, 
             status = ? 
         WHERE id = ?`,
        [
          paymentStatus, 
          metadata.razorpayPaymentId, 
          metadata.razorpaySignature, 
          paymentStatus === 'Paid' ? 'Processing' : 'Pending', 
          id
        ]
      );
      return await orderService.getById(id);
    } catch (e) {
      console.error(`Failed to confirm payment for order ${id}:`, e);
      return null;
    }
  },

  updateShippingInfo: async (
    id: string,
    carrier: string,
    trackingId: string,
    labelUrl: string,
    cost: number
  ): Promise<Order | null> => {
    try {
      await query(
        `UPDATE orders 
         SET shipping_carrier = ?, 
             shipping_tracking_id = ?, 
             shipping_label_url = ?, 
             shipping_cost = ?, 
             status = 'Shipped' 
         WHERE id = ?`,
        [carrier, trackingId, labelUrl, cost, id]
      );
      return await orderService.getById(id);
    } catch (e) {
      console.error(`Failed to update shipping info for order ${id}:`, e);
      return null;
    }
  }
};
