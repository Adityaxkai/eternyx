import { query } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export interface Banner {
  id: string;
  image_url: string;
  mobile_image_url: string;
  position: number;
  active: boolean;
  is_mobile_first?: boolean;
}

export const bannerService = {
  getAll: async (): Promise<Banner[]> => {
    try {
      const banners = await query<Banner[]>('SELECT * FROM banners ORDER BY position ASC');
      return banners.map(b => ({ ...b, active: Boolean(b.active) }));
    } catch (e) {
      console.error(e);
      return [];
    }
  },

  getById: async (id: string): Promise<Banner | null> => {
    try {
      const banners = await query<Banner[]>('SELECT * FROM banners WHERE id = ?', [id]);
      if (banners.length === 0) return null;
      return { ...banners[0], active: Boolean(banners[0].active) };
    } catch (e) {
      console.error(e);
      return null;
    }
  },

  create: async (data: Omit<Banner, 'id' | 'position'>): Promise<Banner | null> => {
    const id = uuidv4();
    try {
      const countRes = await query<any[]>('SELECT COUNT(*) as count FROM banners');
      const position = countRes[0].count;
      
      await query(
        'INSERT INTO banners (id, image_url, mobile_image_url, position, active) VALUES (?, ?, ?, ?, ?)',
        [id, data.image_url, data.mobile_image_url, position, data.active ? 1 : 0]
      );
      return await bannerService.getById(id);
    } catch (e) {
      console.error(e);
      return null;
    }
  },

  update: async (id: string, data: Partial<Banner>): Promise<Banner | null> => {
    const fields: string[] = [];
    const values: any[] = [];
    
    for (const [key, value] of Object.entries(data)) {
      if (key !== 'id') {
        fields.push(`${key} = ?`);
        values.push(typeof value === 'boolean' ? (value ? 1 : 0) : value);
      }
    }
    
    if (fields.length > 0) {
      values.push(id);
      try {
        await query(`UPDATE banners SET ${fields.join(', ')} WHERE id = ?`, values);
      } catch (e) {
        console.error(e);
        return null;
      }
    }
    
    return await bannerService.getById(id);
  },

  delete: async (id: string): Promise<boolean> => {
    try {
      const result = await query<any>('DELETE FROM banners WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (e) {
      console.error(e);
      return false;
    }
  },

  reorder: async (updates: { id: string, position: number }[]): Promise<boolean> => {
    try {
      for (const update of updates) {
        await query('UPDATE banners SET position = ? WHERE id = ?', [update.position, update.id]);
      }
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }
};
