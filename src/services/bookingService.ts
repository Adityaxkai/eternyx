import { query } from '@/lib/db';
import { Booking } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

export const bookingService = {
  getAll: async (): Promise<Booking[]> => {
    try {
      const bookings = await query<Booking[]>('SELECT * FROM bookings ORDER BY created_at DESC');
      return bookings;
    } catch (e) {
      console.error('Failed to get bookings:', e);
      return [];
    }
  },

  getById: async (id: string): Promise<Booking | null> => {
    try {
      const results = await query<Booking[]>('SELECT * FROM bookings WHERE id = ?', [id]);
      if (results.length === 0) return null;
      return results[0];
    } catch (e) {
      console.error(`Failed to get booking ${id}:`, e);
      return null;
    }
  },

  create: async (data: Omit<Booking, 'id' | 'status' | 'created_at' | 'date'>): Promise<Booking | null> => {
    const id = `BKG-${uuidv4().slice(0, 8).toUpperCase()}`;
    const now = new Date().toISOString();
    const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    try {
      await query(
        `INSERT INTO bookings (id, name, email, location, message, status, created_at, date)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id,
          data.name.trim(),
          data.email.toLowerCase().trim(),
          data.location,
          data.message?.trim() || '',
          'Pending',
          now,
          dateStr
        ]
      );
      return await bookingService.getById(id);
    } catch (e) {
      console.error('Failed to create booking:', e);
      return null;
    }
  },

  update: async (id: string, data: Partial<Booking>): Promise<Booking | null> => {
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
        await query(`UPDATE bookings SET ${fields.join(', ')} WHERE id = ?`, values);
      } catch (e) {
        console.error(`Failed to update booking ${id}:`, e);
        return null;
      }
    }

    return await bookingService.getById(id);
  },

  delete: async (id: string): Promise<boolean> => {
    try {
      const res = await query<any>('DELETE FROM bookings WHERE id = ?', [id]);
      return res.affectedRows > 0;
    } catch (e) {
      console.error(`Failed to delete booking ${id}:`, e);
      return false;
    }
  }
};
