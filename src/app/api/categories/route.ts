import { NextResponse } from 'next/server';
import { settingsService } from '@/services/settingsService';
import { productService } from '@/services/productService';
import { DEFAULT_CATEGORIES } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const saved = await settingsService.get<string[]>('categories', []);
    
    // Also inspect products in database so no in-use category is omitted
    const products = await productService.getAll();
    const productCategories = products
      .map(p => p.category?.trim().toUpperCase())
      .filter(Boolean) as string[];

    const combinedSet = new Set<string>([
      ...(saved && saved.length > 0 ? saved : DEFAULT_CATEGORIES),
      ...productCategories
    ]);

    const categories = Array.from(combinedSet);
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Failed to get categories:', error);
    return NextResponse.json(DEFAULT_CATEGORIES);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (Array.isArray(body.categories)) {
      const clean = Array.from(
        new Set(body.categories.map((c: any) => String(c).trim().toUpperCase()).filter(Boolean))
      );
      await settingsService.set('categories', clean);
      return NextResponse.json({ success: true, categories: clean });
    }
    return NextResponse.json({ error: 'Invalid categories format' }, { status: 400 });
  } catch (error) {
    console.error('Failed to save categories:', error);
    return NextResponse.json({ error: 'Failed to update categories' }, { status: 500 });
  }
}
