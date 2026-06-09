import { NextResponse } from 'next/server';
import { productService } from '@/services/productService';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const products = await productService.getAll();
    // Filter to show only visible products on the homepage
    const visibleProducts = products.filter(p => p.visible);
    return NextResponse.json(visibleProducts);
  } catch (error) {
    console.error('Public products fetch failed:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
