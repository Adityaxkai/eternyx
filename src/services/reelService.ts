import { query } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export interface Reel {
  id: string;
  video_url: string;
  thumbnail_url: string;
  handle: string;
  likes: string;
  product_tag: string;
  position: number;
  active: boolean;
}

export const reelService = {
  getAll: async (): Promise<Reel[]> => {
    try {
      const reels = await query<Reel[]>('SELECT * FROM reels ORDER BY position ASC');
      return reels.map(r => ({ ...r, active: Boolean(r.active) }));
    } catch (e) {
      console.error(e);
      return [];
    }
  },

  getById: async (id: string): Promise<Reel | null> => {
    try {
      const reels = await query<Reel[]>('SELECT * FROM reels WHERE id = ?', [id]);
      if (reels.length === 0) return null;
      return { ...reels[0], active: Boolean(reels[0].active) };
    } catch (e) {
      console.error(e);
      return null;
    }
  },

  create: async (data: Omit<Reel, 'id' | 'position'>): Promise<Reel | null> => {
    const id = uuidv4();
    try {
      const countRes = await query<any[]>('SELECT COUNT(*) as count FROM reels');
      const position = countRes[0].count;
      
      await query(
        'INSERT INTO reels (id, video_url, thumbnail_url, handle, likes, product_tag, position, active) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [id, data.video_url, data.thumbnail_url, data.handle, data.likes, data.product_tag, position, data.active ? 1 : 0]
      );
      return await reelService.getById(id);
    } catch (e) {
      console.error(e);
      return null;
    }
  },

  update: async (id: string, data: Partial<Reel>): Promise<Reel | null> => {
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
        await query(`UPDATE reels SET ${fields.join(', ')} WHERE id = ?`, values);
      } catch (e) {
        console.error(e);
        return null;
      }
    }
    
    return await reelService.getById(id);
  },

  delete: async (id: string): Promise<boolean> => {
    try {
      const result = await query<any>('DELETE FROM reels WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (e) {
      console.error(e);
      return false;
    }
  },

  reorder: async (updates: { id: string, position: number }[]): Promise<boolean> => {
    try {
      for (const update of updates) {
        await query('UPDATE reels SET position = ? WHERE id = ?', [update.position, update.id]);
      }
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }
};
