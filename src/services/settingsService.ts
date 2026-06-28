import { query } from '@/lib/db';

export const settingsService = {
  get: async <T>(key: string, defaultValue: T): Promise<T> => {
    try {
      const results = await query<any[]>('SELECT value FROM settings WHERE key_name = ?', [key]);
      if (results.length === 0) return defaultValue;
      return JSON.parse(results[0].value) as T;
    } catch (e) {
      console.error(`Failed to get setting ${key}:`, e);
      return defaultValue;
    }
  },

  set: async (key: string, value: any): Promise<boolean> => {
    try {
      const valueStr = JSON.stringify(value);
      // Upsert
      await query(
        `INSERT INTO settings (key_name, value) VALUES (?, ?)
         ON DUPLICATE KEY UPDATE value = ?`,
        [key, valueStr, valueStr]
      );
      return true;
    } catch (e) {
      console.error(`Failed to set setting ${key}:`, e);
      return false;
    }
  },

  getAll: async (): Promise<Record<string, any>> => {
    try {
      const rows = await query<any[]>('SELECT * FROM settings');
      const settings: Record<string, any> = {};
      for (const row of rows) {
        settings[row.key_name] = JSON.parse(row.value);
      }
      return settings;
    } catch (e) {
      console.error('Failed to get all settings:', e);
      return {};
    }
  }
};
