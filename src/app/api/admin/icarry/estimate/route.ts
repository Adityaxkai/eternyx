import { NextRequest, NextResponse } from 'next/server';
import { icarryService } from '@/services/icarryService';
import { orderService } from '@/services/orderService';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { orderId, weightGrams, shipmentMode } = await request.json();

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    const order = await orderService.getById(orderId);
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Default weight calculations: 100ml = 250g, 50ml = 150g, others = 200g
    let calculatedWeight = 0;
    if (order.items && Array.isArray(order.items)) {
      for (const item of order.items) {
        const qty = item.quantity || 1;
        const sizeLower = (item.size || '').toLowerCase();
        if (sizeLower.includes('100ml') || sizeLower.includes('100 ml')) {
          calculatedWeight += 250 * qty;
        } else if (sizeLower.includes('50ml') || sizeLower.includes('50 ml')) {
          calculatedWeight += 150 * qty;
        } else {
          calculatedWeight += 200 * qty;
        }
      }
    }

    const finalWeight = weightGrams || calculatedWeight || 250; // fallback to 250g
    const mode = shipmentMode || 'E'; // E = Express/Air, S = Surface

    // Call iCarry service to get shipping rate estimates
    const rates = await icarryService.getEstimate(order.shipping_address.zip, finalWeight, mode);

    return NextResponse.json({
      success: true,
      calculatedWeight,
      finalWeight,
      rates,
    });
  } catch (error) {
    console.error('iCarry Estimate API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
