import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const dataFilePath = path.join(process.cwd(), 'src/data/reels.json');

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
  getAll: (): Reel[] => {
    try {
      const data = fs.readFileSync(dataFilePath, 'utf-8');
      const reels: Reel[] = JSON.parse(data);
      return reels.sort((a, b) => a.position - b.position);
    } catch (error) {
      console.error('Error reading reels data:', error);
      return [];
    }
  },

  create: (reelData: Omit<Reel, 'id' | 'position'>): Reel => {
    const reels = reelService.getAll();
    const newReel: Reel = {
      ...reelData,
      id: uuidv4(),
      position: reels.length, // Add to end
    };
    
    reels.push(newReel);
    fs.writeFileSync(dataFilePath, JSON.stringify(reels, null, 2));
    return newReel;
  },

  update: (id: string, reelData: Partial<Reel>): Reel | null => {
    const reels = reelService.getAll();
    const index = reels.findIndex(r => r.id === id);
    
    if (index === -1) return null;
    
    reels[index] = { ...reels[index], ...reelData };
    fs.writeFileSync(dataFilePath, JSON.stringify(reels, null, 2));
    return reels[index];
  },

  delete: (id: string): boolean => {
    const reels = reelService.getAll();
    const filteredReels = reels.filter(r => r.id !== id);
    
    if (reels.length === filteredReels.length) return false;
    
    fs.writeFileSync(dataFilePath, JSON.stringify(filteredReels, null, 2));
    return true;
  },

  reorder: (updates: { id: string, position: number }[]): boolean => {
    const reels = reelService.getAll();
    
    const updatedReels = reels.map(reel => {
      const update = updates.find(u => u.id === reel.id);
      if (update) {
        return { ...reel, position: update.position };
      }
      return reel;
    });
    
    fs.writeFileSync(dataFilePath, JSON.stringify(updatedReels, null, 2));
    return true;
  }
};
