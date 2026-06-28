import { query } from '@/lib/db';
import { Product } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

function parseProduct(p: any): Product {
  return {
    ...p,
    visible: Boolean(p.visible),
    price: Number(p.price),
    top_notes: typeof p.top_notes === 'string' ? JSON.parse(p.top_notes) : (p.top_notes || []),
    heart_notes: typeof p.heart_notes === 'string' ? JSON.parse(p.heart_notes) : (p.heart_notes || []),
    base_notes: typeof p.base_notes === 'string' ? JSON.parse(p.base_notes) : (p.base_notes || []),
    sizes: typeof p.sizes === 'string' ? JSON.parse(p.sizes) : (p.sizes || []),
    additional_images: typeof p.additional_images === 'string' ? JSON.parse(p.additional_images) : (p.additional_images || []),
  };
}

export const productService = {
  getAll: async (): Promise<Product[]> => {
    try {
      const products = await query<any[]>('SELECT * FROM products ORDER BY position ASC');
      return products.map(parseProduct);
    } catch (e) {
      console.error('Failed to get all products:', e);
      return [];
    }
  },

  getById: async (id: string): Promise<Product | null> => {
    try {
      const products = await query<any[]>('SELECT * FROM products WHERE id = ?', [id]);
      if (products.length === 0) return null;
      return parseProduct(products[0]);
    } catch (e) {
      console.error(`Failed to get product ${id}:`, e);
      return null;
    }
  },

  create: async (data: Omit<Product, 'id' | 'position' | 'created_at'>): Promise<Product | null> => {
    const id = uuidv4();
    try {
      const countRes = await query<any[]>('SELECT COUNT(*) as count FROM products');
      const position = countRes[0].count;
      
      const top = JSON.stringify(data.top_notes || []);
      const heart = JSON.stringify(data.heart_notes || []);
      const base = JSON.stringify(data.base_notes || []);
      const sizes = JSON.stringify(data.sizes || []);
      const additionalImages = JSON.stringify(data.additional_images || []);

      await query(
        `INSERT INTO products (id, name, description, price, category, volume, image_url, position, visible, badge, top_notes, heart_notes, base_notes, sizes, additional_images)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id,
          data.name,
          data.description,
          data.price,
          data.category,
          data.volume,
          data.image_url,
          position,
          data.visible ? 1 : 0,
          data.badge || null,
          top,
          heart,
          base,
          sizes,
          additionalImages
        ]
      );
      return await productService.getById(id);
    } catch (e) {
      console.error('Failed to create product:', e);
      return null;
    }
  },

  update: async (id: string, data: Partial<Product>): Promise<Product | null> => {
    const fields: string[] = [];
    const values: any[] = [];
    
    for (const [key, value] of Object.entries(data)) {
      if (key !== 'id' && key !== 'created_at') {
        fields.push(`${key} = ?`);
        if (key === 'visible') {
          values.push(value ? 1 : 0);
        } else if (['top_notes', 'heart_notes', 'base_notes', 'sizes', 'additional_images'].includes(key)) {
          values.push(JSON.stringify(value));
        } else {
          values.push(value);
        }
      }
    }
    
    if (fields.length > 0) {
      values.push(id);
      try {
        await query(`UPDATE products SET ${fields.join(', ')} WHERE id = ?`, values);
      } catch (e) {
        console.error(`Failed to update product ${id}:`, e);
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
      console.error(`Failed to delete product ${id}:`, e);
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
      console.error('Failed to reorder products:', e);
      return false;
    }
  }
};
