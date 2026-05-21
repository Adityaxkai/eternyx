import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'src/data/banners.json');

export interface Banner {
  id: string;
  image_url: string;
  mobile_image_url: string;
  alt_text: string;
  position: number;
  active: boolean;
  is_mobile_first: boolean;
}

export const bannerService = {
  getAll: (): Banner[] => {
    try {
      const data = fs.readFileSync(dataFilePath, 'utf-8');
      const banners: Banner[] = JSON.parse(data);
      return banners.sort((a, b) => a.position - b.position);
    } catch (error) {
      console.error('Error reading banners data:', error);
      return [];
    }
  },

  update: (id: string, bannerData: Partial<Banner>): Banner | null => {
    const banners = bannerService.getAll();
    const index = banners.findIndex(b => b.id === id);
    
    if (index === -1) return null;
    
    banners[index] = { ...banners[index], ...bannerData };
    fs.writeFileSync(dataFilePath, JSON.stringify(banners, null, 2));
    return banners[index];
  },

  reorder: (updates: { id: string, position: number }[]): boolean => {
    const banners = bannerService.getAll();
    
    const updatedBanners = banners.map(banner => {
      const update = updates.find(u => u.id === banner.id);
      if (update) {
        return { ...banner, position: update.position };
      }
      return banner;
    });
    
    fs.writeFileSync(dataFilePath, JSON.stringify(updatedBanners, null, 2));
    return true;
  }
};
