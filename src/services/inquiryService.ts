import { query } from '@/lib/db';
import { Inquiry } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

export const inquiryService = {
  getAll: async (): Promise<Inquiry[]> => {
    try {
      const inquiries = await query<any[]>('SELECT * FROM inquiries ORDER BY created_at DESC');
      // Normalize casing
      return inquiries.map((inq) => ({
        id: inq.id,
        name: inq.name,
        email: inq.email,
        inquiryType: inq.inquiry_type || 'General',
        message: inq.message,
        status: inq.status,
        created_at: inq.created_at,
        date: inq.date,
      }));
    } catch (e) {
      console.error('Failed to get inquiries:', e);
      return [];
    }
  },

  getById: async (id: string): Promise<Inquiry | null> => {
    try {
      const results = await query<any[]>('SELECT * FROM inquiries WHERE id = ?', [id]);
      if (results.length === 0) return null;
      const inq = results[0];
      return {
        id: inq.id,
        name: inq.name,
        email: inq.email,
        inquiryType: inq.inquiry_type || 'General',
        message: inq.message,
        status: inq.status,
        created_at: inq.created_at,
        date: inq.date,
      };
    } catch (e) {
      console.error(`Failed to get inquiry ${id}:`, e);
      return null;
    }
  },

  create: async (data: Omit<Inquiry, 'id' | 'status' | 'created_at' | 'date'>): Promise<Inquiry | null> => {
    const id = `INQ-${uuidv4().slice(0, 8).toUpperCase()}`;
    const now = new Date().toISOString();
    const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    try {
      await query(
        `INSERT INTO inquiries (id, name, email, inquiry_type, message, status, created_at, date)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id,
          data.name.trim(),
          data.email.toLowerCase().trim(),
          data.inquiryType || 'General',
          data.message.trim(),
          'New',
          now,
          dateStr
        ]
      );
      return await inquiryService.getById(id);
    } catch (e) {
      console.error('Failed to create inquiry:', e);
      return null;
    }
  },

  update: async (id: string, data: Partial<Inquiry>): Promise<Inquiry | null> => {
    const fields: string[] = [];
    const values: any[] = [];

    for (const [key, value] of Object.entries(data)) {
      if (key !== 'id' && key !== 'created_at') {
        const dbKey = key === 'inquiryType' ? 'inquiry_type' : key;
        fields.push(`${dbKey} = ?`);
        values.push(value);
      }
    }

    if (fields.length > 0) {
      values.push(id);
      try {
        await query(`UPDATE inquiries SET ${fields.join(', ')} WHERE id = ?`, values);
      } catch (e) {
        console.error(`Failed to update inquiry ${id}:`, e);
        return null;
      }
    }

    return await inquiryService.getById(id);
  },

  delete: async (id: string): Promise<boolean> => {
    try {
      const res = await query<any>('DELETE FROM inquiries WHERE id = ?', [id]);
      return res.affectedRows > 0;
    } catch (e) {
      console.error(`Failed to delete inquiry ${id}:`, e);
      return false;
    }
  }
};
