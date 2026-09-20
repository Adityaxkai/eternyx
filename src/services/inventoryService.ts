import { query } from '@/lib/db';
import { productService } from './productService';

export interface InventoryVariant {
  productId: string;
  productName: string;
  category: string;
  imageUrl: string;
  price: number;
  size: string;
  stock: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

export interface InventoryStats {
  totalProducts: number;
  totalVariants: number;
  totalUnits: number;
  inStockCount: number;
  lowStockCount: number;
  outOfStockCount: number;
}

export const inventoryService = {
  // Fetch all product inventory variants and summary metrics
  getAll: async (): Promise<{ variants: InventoryVariant[]; stats: InventoryStats }> => {
    try {
      const products = await productService.getAll();

      const variants: InventoryVariant[] = [];
      let totalUnits = 0;
      let inStockCount = 0;
      let lowStockCount = 0;
      let outOfStockCount = 0;

      for (const p of products) {
        let sizes = p.sizes;
        if (typeof sizes === 'string') {
          try {
            sizes = JSON.parse(sizes);
          } catch {
            sizes = [];
          }
        }

        // If product has no sizes array, fallback to main volume
        if (!Array.isArray(sizes) || sizes.length === 0) {
          sizes = [{ size: p.volume || 'Standard', stock: 10 }];
        }

        for (const s of sizes) {
          const stock = Number(s.stock) || 0;
          totalUnits += stock;

          let status: 'In Stock' | 'Low Stock' | 'Out of Stock' = 'In Stock';
          if (stock === 0) {
            status = 'Out of Stock';
            outOfStockCount++;
          } else if (stock <= 5) {
            status = 'Low Stock';
            lowStockCount++;
          } else {
            inStockCount++;
          }

          variants.push({
            productId: p.id,
            productName: p.name,
            category: p.category || 'FRAGRANCE',
            imageUrl: p.image_url || '',
            price: p.price,
            size: s.size || 'Standard',
            stock,
            status,
          });
        }
      }

      const stats: InventoryStats = {
        totalProducts: products.length,
        totalVariants: variants.length,
        totalUnits,
        inStockCount,
        lowStockCount,
        outOfStockCount,
      };

      return { variants, stats };
    } catch (err) {
      console.error('Failed to get inventory:', err);
      return {
        variants: [],
        stats: {
          totalProducts: 0,
          totalVariants: 0,
          totalUnits: 0,
          inStockCount: 0,
          lowStockCount: 0,
          outOfStockCount: 0,
        },
      };
    }
  },

  // Update stock level for a specific product size variant
  updateStock: async (
    productId: string,
    size: string,
    newStock: number
  ): Promise<boolean> => {
    try {
      const product = await productService.getById(productId);
      if (!product) return false;

      let sizes = product.sizes;
      if (typeof sizes === 'string') {
        try {
          sizes = JSON.parse(sizes);
        } catch {
          sizes = [];
        }
      }

      if (!Array.isArray(sizes) || sizes.length === 0) {
        sizes = [{ size: size || product.volume || 'Standard', stock: Math.max(0, newStock) }];
      } else {
        const cleanTarget = (size || '').trim().toLowerCase();
        let matched = false;

        sizes = sizes.map((s: any) => {
          const cleanSize = (s.size || '').trim().toLowerCase();
          if (cleanSize === cleanTarget || (!cleanTarget && cleanSize.includes('100'))) {
            matched = true;
            return { ...s, stock: Math.max(0, newStock) };
          }
          return s;
        });

        if (!matched) {
          sizes.push({ size: size.trim(), stock: Math.max(0, newStock) });
        }
      }

      await query('UPDATE products SET sizes = ? WHERE id = ?', [
        JSON.stringify(sizes),
        productId,
      ]);

      return true;
    } catch (err) {
      console.error(`Failed to update stock for product ${productId}:`, err);
      return false;
    }
  },

  // Deduct inventory when customer order is confirmed/paid
  deductStock: async (
    items: { name: string; size: string; quantity: number }[]
  ): Promise<void> => {
    try {
      for (const item of items) {
        const qtyToDeduct = Number(item.quantity) || 1;
        // Lookup product by name
        const products = await query<any[]>(
          'SELECT id, sizes, volume FROM products WHERE LOWER(name) = LOWER(?)',
          [item.name.trim()]
        );

        if (products.length === 0) continue;

        const p = products[0];
        let sizes = p.sizes;
        if (typeof sizes === 'string') {
          try {
            sizes = JSON.parse(sizes);
          } catch {
            sizes = [];
          }
        }

        if (!Array.isArray(sizes) || sizes.length === 0) {
          sizes = [{ size: item.size || p.volume || 'Standard', stock: 10 }];
        }

        const targetSize = (item.size || '').trim().toLowerCase();

        sizes = sizes.map((s: any) => {
          const sName = (s.size || '').trim().toLowerCase();
          if (sName === targetSize || (!targetSize && sName.includes('100'))) {
            const currentStock = Number(s.stock) || 0;
            return { ...s, stock: Math.max(0, currentStock - qtyToDeduct) };
          }
          return s;
        });

        await query('UPDATE products SET sizes = ? WHERE id = ?', [
          JSON.stringify(sizes),
          p.id,
        ]);
        console.log(`[Inventory] Deducted ${qtyToDeduct} from ${item.name} (${item.size})`);
      }
    } catch (err) {
      console.error('Failed to deduct stock for order items:', err);
    }
  },
};
