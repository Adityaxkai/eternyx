import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const dataFilePath = path.join(process.cwd(), 'src/data/products.json');

// Define types
export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  badge: string | null;
  description: string;
  image_url: string;
  visible: boolean;
  position: number;
  scent_notes: {
    top: string[];
    mid: string[];
    base: string[];
  };
  sizes: { size: string; stock: number }[];
  created_at: string;
}

export const productService = {
  getAll: (): Product[] => {
    try {
      const data = fs.readFileSync(dataFilePath, 'utf-8');
      const products: Product[] = JSON.parse(data);
      return products.sort((a, b) => a.position - b.position);
    } catch (error) {
      console.error('Error reading products data:', error);
      return [];
    }
  },

  getById: (id: string): Product | undefined => {
    const products = productService.getAll();
    return products.find(p => p.id === id);
  },

  create: (productData: Omit<Product, 'id' | 'created_at' | 'position'>): Product => {
    const products = productService.getAll();
    const newProduct: Product = {
      ...productData,
      id: uuidv4(),
      position: products.length, // Add to end
      created_at: new Date().toISOString()
    };
    
    products.push(newProduct);
    fs.writeFileSync(dataFilePath, JSON.stringify(products, null, 2));
    return newProduct;
  },

  update: (id: string, productData: Partial<Product>): Product | null => {
    const products = productService.getAll();
    const index = products.findIndex(p => p.id === id);
    
    if (index === -1) return null;
    
    products[index] = { ...products[index], ...productData };
    fs.writeFileSync(dataFilePath, JSON.stringify(products, null, 2));
    return products[index];
  },

  delete: (id: string): boolean => {
    const products = productService.getAll();
    const filteredProducts = products.filter(p => p.id !== id);
    
    if (products.length === filteredProducts.length) return false;
    
    fs.writeFileSync(dataFilePath, JSON.stringify(filteredProducts, null, 2));
    return true;
  },
  
  reorder: (updates: { id: string, position: number }[]): boolean => {
    const products = productService.getAll();
    
    const updatedProducts = products.map(product => {
      const update = updates.find(u => u.id === product.id);
      if (update) {
        return { ...product, position: update.position };
      }
      return product;
    });
    
    fs.writeFileSync(dataFilePath, JSON.stringify(updatedProducts, null, 2));
    return true;
  }
};
