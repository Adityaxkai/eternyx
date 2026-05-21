import fs from 'fs';
import path from 'path';

export function readJSON<T>(filename: string): T {
  try {
    const dataPath = path.join(process.cwd(), 'src/data', filename);
    if (!fs.existsSync(dataPath)) {
      return [] as any as T; // Return empty array or object as fallback
    }
    const fileContents = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(fileContents) as T;
  } catch (error) {
    console.error(`Error reading JSON file ${filename}:`, error);
    return [] as any as T;
  }
}

export function writeJSON(filename: string, data: any): void {
  try {
    const dataPath = path.join(process.cwd(), 'src/data', filename);
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error(`Error writing JSON file ${filename}:`, error);
  }
}
