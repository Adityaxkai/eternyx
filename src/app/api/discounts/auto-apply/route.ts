import { NextResponse } from 'next/server';
import { discountService } from '@/services/discountService';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const discount = await discountService.getAutoApplyDiscount();
    return NextResponse.json({ discount });
  } catch (error) {
    console.error('Auto apply discount error:', error);
    return NextResponse.json({ discount: null }, { status: 500 });
  }
}
