import { query } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

export interface Customer {
  id: string;
  name: string;
  email: string;
  spent: number;
  orders: number;
  lastActive: string;
  password_hash?: string;
  phone?: string;
  order_count?: number;
  total_spend?: number;
}

export const customerService = {
  getAll: async (): Promise<Customer[]> => {
    try {
      const customers = await query<any[]>('SELECT * FROM customers ORDER BY name ASC');
      return customers.map((c) => ({
        id: c.id,
        name: c.name,
        email: c.email,
        spent: Number(c.spent),
        orders: Number(c.orders),
        lastActive: c.last_active || '',
        password_hash: c.password_hash || undefined,
        phone: c.phone || undefined,
        order_count: Number(c.orders),
        total_spend: Number(c.spent),
      }));
    } catch (e) {
      console.error('Failed to get all customers:', e);
      return [];
    }
  },

  getById: async (id: string): Promise<any | null> => {
    try {
      const results = await query<any[]>('SELECT * FROM customers WHERE id = ?', [id]);
      if (results.length === 0) return null;
      const c = results[0];

      // Get orders for this customer
      const orders = await query<any[]>('SELECT * FROM orders WHERE customer_id = ?', [id]);
      const enrichedOrders = await Promise.all(
        orders.map(async (o) => {
          const items = await query<any[]>('SELECT * FROM order_items WHERE order_id = ?', [o.id]);
          return {
            ...o,
            shipping_address: typeof o.shipping_address === 'string' ? JSON.parse(o.shipping_address) : o.shipping_address,
            items,
            items_count: items.reduce((acc, curr) => acc + curr.quantity, 0),
          };
        })
      );

      const totalSpend = enrichedOrders.reduce((sum, o) => sum + Number(o.total), 0);

      return {
        id: c.id,
        name: c.name,
        email: c.email,
        spent: Number(c.spent),
        orders: enrichedOrders,
        lastActive: c.last_active || '',
        password_hash: c.password_hash || undefined,
        phone: c.phone || undefined,
        total_spend: totalSpend,
      };
    } catch (e) {
      console.error(`Failed to get customer profile ${id}:`, e);
      return null;
    }
  },

  hashPassword: async (password: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const salt = crypto.randomBytes(16).toString('hex');
      crypto.scrypt(password, salt, 64, (err, derivedKey) => {
        if (err) reject(err);
        resolve(`${salt}:${derivedKey.toString('hex')}`);
      });
    });
  },

  verifyPassword: async (password: string, hash: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      const [salt, key] = hash.split(':');
      if (!salt || !key) resolve(false);
      crypto.scrypt(password, salt, 64, (err, derivedKey) => {
        if (err) reject(err);
        resolve(key === derivedKey.toString('hex'));
      });
    });
  },

  registerPassword: async (email: string, password: string, name: string, phone: string): Promise<Customer | null> => {
    try {
      const emailLower = email.toLowerCase().trim();
      const phoneTrimmed = phone.trim();
      const nameTrimmed = name.trim();
      const hash = await customerService.hashPassword(password);
      
      const existing = await query<any[]>('SELECT * FROM customers WHERE email = ?', [emailLower]);
      
      if (existing.length === 0) {
        const id = `cust-${uuidv4().slice(0, 8)}`;
        await query(
          `INSERT INTO customers (id, name, email, spent, orders, last_active, password_hash, phone)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [id, nameTrimmed, emailLower, 0.00, 0, 'Today', hash, phoneTrimmed]
        );
        return {
          id,
          name: nameTrimmed,
          email: emailLower,
          spent: 0,
          orders: 0,
          lastActive: 'Today',
          password_hash: hash,
          phone: phoneTrimmed
        };
      } else {
        const c = existing[0];
        await query(
          `UPDATE customers SET password_hash = ?, phone = ?, name = ? WHERE email = ?`,
          [hash, phoneTrimmed, nameTrimmed, emailLower]
        );
        return {
          id: c.id,
          name: nameTrimmed,
          email: emailLower,
          spent: Number(c.spent),
          orders: Number(c.orders),
          lastActive: 'Today',
          password_hash: hash,
          phone: phoneTrimmed
        };
      }
    } catch (e) {
      console.error('Failed to register customer password:', e);
      return null;
    }
  },

  getByEmail: async (email: string): Promise<Customer | null> => {
    try {
      const emailLower = email.toLowerCase().trim();
      const results = await query<any[]>('SELECT * FROM customers WHERE email = ?', [emailLower]);
      if (results.length === 0) return null;
      const c = results[0];
      return {
        id: c.id,
        name: c.name,
        email: c.email,
        spent: Number(c.spent),
        orders: Number(c.orders),
        lastActive: c.last_active || '',
        password_hash: c.password_hash || undefined,
        phone: c.phone || undefined,
        order_count: Number(c.orders),
        total_spend: Number(c.spent),
      };
    } catch (e) {
      console.error(`Failed to get customer by email ${email}:`, e);
      return null;
    }
  },

  createOrUpdate: async (email: string, name: string, totalAmount: number, phone?: string): Promise<Customer | null> => {
    try {
      const emailLower = email.toLowerCase().trim();
      const nameTrimmed = name.trim();
      const phoneVal = phone ? phone.trim() : null;
      
      const existing = await query<any[]>('SELECT * FROM customers WHERE email = ?', [emailLower]);
      
      if (existing.length === 0) {
        const id = `cust-${uuidv4().slice(0, 8)}`;
        await query(
          `INSERT INTO customers (id, name, email, spent, orders, last_active, phone)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [id, nameTrimmed, emailLower, totalAmount, 1, 'Today', phoneVal]
        );
        return {
          id,
          name: nameTrimmed,
          email: emailLower,
          spent: totalAmount,
          orders: 1,
          lastActive: 'Today',
          phone: phoneVal || undefined
        };
      } else {
        const c = existing[0];
        const newSpent = Number((Number(c.spent) + totalAmount).toFixed(2));
        const newOrders = Number(c.orders) + 1;
        
        const finalPhone = phoneVal || c.phone;

        await query(
          `UPDATE customers SET spent = ?, orders = ?, last_active = ?, name = ?, phone = ? WHERE email = ?`,
          [newSpent, newOrders, 'Today', nameTrimmed, finalPhone, emailLower]
        );
        
        return {
          id: c.id,
          name: nameTrimmed,
          email: emailLower,
          spent: newSpent,
          orders: newOrders,
          lastActive: 'Today',
          phone: finalPhone || undefined,
          password_hash: c.password_hash || undefined
        };
      }
    } catch (e) {
      console.error('Failed to create or update customer:', e);
      return null;
    }
  }
};
