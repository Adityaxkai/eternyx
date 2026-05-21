import { query } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  volume: string;
  image_url: string;
  position: number;
  visible: boolean;
  badge?: string;
  created_at?: string;
}

export const productService = {
  getAll: async (): Promise<Product[]> => {
    try {
      const products = await query<Product[]>('SELECT * FROM products ORDER BY position ASC');
      // Convert tinyint (0/1) to boolean for UI compatibility
      return products.map(p => ({ ...p, visible: Boolean(p.visible) }));
    } catch (e) {
      console.error(e);
      return [];
    }
  },

  getById: async (id: string): Promise<Product | null> => {
    try {
      const products = await query<Product[]>('SELECT * FROM products WHERE id = ?', [id]);
      if (products.length === 0) return null;
      return { ...products[0], visible: Boolean(products[0].visible) };
    } catch (e) {
      console.error(e);
      return null;
    }
  },

  create: async (data: Omit<Product, 'id' | 'position' | 'created_at'>): Promise<Product | null> => {
    const id = uuidv4();
    try {
      const countRes = await query<any[]>('SELECT COUNT(*) as count FROM products');
      const position = countRes[0].count;
      
      await query(
        'INSERT INTO products (id, name, description, price, category, volume, image_url, position, visible) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [id, data.name, data.description, data.price, data.category, data.volume, data.image_url, position, data.visible ? 1 : 0]
      );
      return await productService.getById(id);
    } catch (e) {
      console.error(e);
      return null;
    }
  },

  update: async (id: string, data: Partial<Product>): Promise<Product | null> => {
    const fields: string[] = [];
    const values: any[] = [];
    
    for (const [key, value] of Object.entries(data)) {
      if (key !== 'id' && key !== 'created_at') {
        fields.push(`${key} = ?`);
        // Handle boolean conversion for MySQL tinyint
        values.push(typeof value === 'boolean' ? (value ? 1 : 0) : value);
      }
    }
    
    if (fields.length > 0) {
      values.push(id);
      try {
        await query(`UPDATE products SET ${fields.join(', ')} WHERE id = ?`, values);
      } catch (e) {
        console.error(e);
        return null;
      }
    }
    
    return await productService.getById(id);
  },

  delete: async (id: string): Promise<boolean> => {
    try {
      const result = await query<any>('DELETE FROM products WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (e) {
      console.error(e);
      return false;
    }
  },

  reorder: async (updates: { id: string, position: number }[]): Promise<boolean> => {
    try {
      for (const update of updates) {
        await query('UPDATE products SET position = ? WHERE id = ?', [update.position, update.id]);
      }
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }
};
