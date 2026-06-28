import { query } from '@/lib/db';
import { Review } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

export const reviewService = {
  getAll: async (): Promise<Review[]> => {
    try {
      const reviews = await query<any[]>('SELECT * FROM reviews ORDER BY created_at DESC');
      return reviews.map((r) => ({
        id: r.id,
        product_id: r.product_id,
        product_name: r.product_name,
        customer: r.customer,
        rating: Number(r.rating),
        comment: r.comment || '',
        status: r.status,
        created_at: r.created_at,
        date: r.date,
      }));
    } catch (e) {
      console.error('Failed to get reviews:', e);
      return [];
    }
  },

  getById: async (id: string): Promise<Review | null> => {
    try {
      const results = await query<any[]>('SELECT * FROM reviews WHERE id = ?', [id]);
      if (results.length === 0) return null;
      const r = results[0];
      return {
        id: r.id,
        product_id: r.product_id,
        product_name: r.product_name,
        customer: r.customer,
        rating: Number(r.rating),
        comment: r.comment || '',
        status: r.status,
        created_at: r.created_at,
        date: r.date,
      };
    } catch (e) {
      console.error(`Failed to get review ${id}:`, e);
      return null;
    }
  },

  getByProduct: async (productName: string): Promise<Review[]> => {
    try {
      const reviews = await query<any[]>('SELECT * FROM reviews WHERE product_name = ? AND status = "Published" ORDER BY created_at DESC', [productName]);
      return reviews.map((r) => ({
        id: r.id,
        product_id: r.product_id,
        product_name: r.product_name,
        customer: r.customer,
        rating: Number(r.rating),
        comment: r.comment || '',
        status: r.status,
        created_at: r.created_at,
        date: r.date,
      }));
    } catch (e) {
      console.error(`Failed to get reviews for product ${productName}:`, e);
      return [];
    }
  },

  create: async (data: Omit<Review, 'id' | 'status' | 'created_at' | 'date'>): Promise<Review | null> => {
    const id = `REV-${uuidv4().slice(0, 8).toUpperCase()}`;
    const now = new Date().toISOString();
    const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    try {
      await query(
        `INSERT INTO reviews (id, product_id, product_name, customer, rating, comment, status, created_at, date)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id,
          data.product_id || null,
          data.product_name,
          data.customer,
          data.rating || 5,
          data.comment || '',
          'Pending',
          now,
          dateStr
        ]
      );
      return await reviewService.getById(id);
    } catch (e) {
      console.error('Failed to create review:', e);
      return null;
    }
  },

  update: async (id: string, data: Partial<Review>): Promise<Review | null> => {
    const fields: string[] = [];
    const values: any[] = [];

    for (const [key, value] of Object.entries(data)) {
      if (key !== 'id' && key !== 'created_at') {
        const dbKey = key === 'productName' ? 'product_name' : key;
        fields.push(`${dbKey} = ?`);
        values.push(value);
      }
    }

    if (fields.length > 0) {
      values.push(id);
      try {
        await query(`UPDATE reviews SET ${fields.join(', ')} WHERE id = ?`, values);
      } catch (e) {
        console.error(`Failed to update review ${id}:`, e);
        return null;
      }
    }

    return await reviewService.getById(id);
  },

  delete: async (id: string): Promise<boolean> => {
    try {
      const res = await query<any>('DELETE FROM reviews WHERE id = ?', [id]);
      return res.affectedRows > 0;
    } catch (e) {
      console.error(`Failed to delete review ${id}:`, e);
      return false;
    }
  }
};
