import { query } from '@/lib/db';
import { JournalEntry } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

export const journalService = {
  getAll: async (includeDrafts = false): Promise<JournalEntry[]> => {
    try {
      let sql = 'SELECT * FROM journal';
      const params: any[] = [];
      if (!includeDrafts) {
        sql += ' WHERE status = ?';
        params.push('Published');
      }
      sql += ' ORDER BY created_at DESC';

      const entries = await query<JournalEntry[]>(sql, params);
      return entries;
    } catch (e) {
      console.error('Failed to get journal entries:', e);
      return [];
    }
  },

  getById: async (id: string): Promise<JournalEntry | null> => {
    try {
      const results = await query<JournalEntry[]>('SELECT * FROM journal WHERE id = ?', [id]);
      if (results.length === 0) return null;
      return results[0];
    } catch (e) {
      console.error(`Failed to get journal entry ${id}:`, e);
      return null;
    }
  },

  create: async (data: Omit<JournalEntry, 'id' | 'created_at'>): Promise<JournalEntry | null> => {
    const id = `JRN-${uuidv4().slice(0, 8).toUpperCase()}`;
    try {
      await query(
        `INSERT INTO journal (id, title, author, date, excerpt, content, category, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id,
          data.title,
          data.author,
          data.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          data.excerpt || '',
          data.content,
          data.category || '',
          data.status || 'Draft'
        ]
      );
      return await journalService.getById(id);
    } catch (e) {
      console.error('Failed to create journal entry:', e);
      return null;
    }
  },

  update: async (id: string, data: Partial<JournalEntry>): Promise<JournalEntry | null> => {
    const fields: string[] = [];
    const values: any[] = [];

    for (const [key, value] of Object.entries(data)) {
      if (key !== 'id' && key !== 'created_at') {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    }

    if (fields.length > 0) {
      values.push(id);
      try {
        await query(`UPDATE journal SET ${fields.join(', ')} WHERE id = ?`, values);
      } catch (e) {
        console.error(`Failed to update journal entry ${id}:`, e);
        return null;
      }
    }

    return await journalService.getById(id);
  },

  delete: async (id: string): Promise<boolean> => {
    try {
      const res = await query<any>('DELETE FROM journal WHERE id = ?', [id]);
      return res.affectedRows > 0;
    } catch (e) {
      console.error(`Failed to delete journal entry ${id}:`, e);
      return false;
    }
  }
};
