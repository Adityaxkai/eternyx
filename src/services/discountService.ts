import { query } from '@/lib/db';
import { Discount } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

export const discountService = {
  getAll: async (): Promise<Discount[]> => {
    try {
      const discounts = await query<any[]>('SELECT * FROM discounts ORDER BY created_at DESC');
      return discounts.map((d) => ({
        ...d,
        value: Number(d.value),
        active: Boolean(d.active),
      }));
    } catch (e) {
      console.error('Failed to get discounts:', e);
      return [];
    }
  },

  getById: async (id: string): Promise<Discount | null> => {
    try {
      const results = await query<any[]>('SELECT * FROM discounts WHERE id = ?', [id]);
      if (results.length === 0) return null;
      const d = results[0];
      return {
        ...d,
        value: Number(d.value),
        active: Boolean(d.active),
      };
    } catch (e) {
      console.error(`Failed to get discount ${id}:`, e);
      return null;
    }
  },

  getByCode: async (code: string): Promise<Discount | null> => {
    try {
      const results = await query<any[]>('SELECT * FROM discounts WHERE code = ?', [code.toUpperCase().trim()]);
      if (results.length === 0) return null;
      const d = results[0];
      return {
        ...d,
        value: Number(d.value),
        active: Boolean(d.active),
      };
    } catch (e) {
      console.error(`Failed to get discount code ${code}:`, e);
      return null;
    }
  },

  create: async (data: Omit<Discount, 'id' | 'usage_count' | 'created_at'>): Promise<Discount | null> => {
    const id = `disc-${uuidv4().slice(0, 8)}`;
    const now = new Date().toISOString();
    try {
      await query(
        `INSERT INTO discounts (id, code, type, value, usage_count, active, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          id,
          data.code.toUpperCase().trim(),
          data.type,
          data.value || 0,
          0,
          data.active ? 1 : 0,
          now
        ]
      );
      return await discountService.getById(id);
    } catch (e) {
      console.error('Failed to create discount:', e);
      return null;
    }
  },

  update: async (id: string, data: Partial<Discount>): Promise<Discount | null> => {
    const fields: string[] = [];
    const values: any[] = [];

    for (const [key, value] of Object.entries(data)) {
      if (key !== 'id' && key !== 'created_at') {
        fields.push(`${key} = ?`);
        values.push(typeof value === 'boolean' ? (value ? 1 : 0) : value);
      }
    }

    if (fields.length > 0) {
      values.push(id);
      try {
        await query(`UPDATE discounts SET ${fields.join(', ')} WHERE id = ?`, values);
      } catch (e) {
        console.error(`Failed to update discount ${id}:`, e);
        return null;
      }
    }

    return await discountService.getById(id);
  },

  incrementUsage: async (code: string): Promise<boolean> => {
    try {
      const res = await query<any>('UPDATE discounts SET usage_count = usage_count + 1 WHERE code = ?', [code.toUpperCase().trim()]);
      return res.affectedRows > 0;
    } catch (e) {
      console.error(`Failed to increment discount usage for code ${code}:`, e);
      return false;
    }
  },

  delete: async (id: string): Promise<boolean> => {
    try {
      const res = await query<any>('DELETE FROM discounts WHERE id = ?', [id]);
      return res.affectedRows > 0;
    } catch (e) {
      console.error(`Failed to delete discount ${id}:`, e);
      return false;
    }
  }
};
