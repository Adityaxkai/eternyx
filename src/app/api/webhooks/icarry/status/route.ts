import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    console.log('[iCarry Status Webhook Received]:', payload);

    const orderId = payload.order_id || payload.order_reference_id;
    const newStatus = payload.status || payload.shipment_status;
    const trackingId = payload.tracking_id || payload.awb || payload.awb_number;

    if (orderId && newStatus) {
      let orderStatus = 'Processing';
      const s = String(newStatus).toLowerCase();
      if (s.includes('deliver')) orderStatus = 'Delivered';
      else if (s.includes('transit') || s.includes('shipped') || s.includes('dispatch') || s.includes('pickup')) orderStatus = 'Shipped';
      else if (s.includes('cancel')) orderStatus = 'Cancelled';

      try {
        await query(
          `UPDATE orders SET status = ?, tracking_id = COALESCE(?, tracking_id) WHERE id = ?`,
          [orderStatus, trackingId || null, orderId]
        );
      } catch (dbErr) {
        console.error('[iCarry Webhook DB Update Error]:', dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Status processed successfully',
      receivedAt: new Date().toISOString()
    }, { status: 200 });
  } catch (error: any) {
    console.error('[iCarry Status Webhook Error]:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ status: 'Active', endpoint: 'iCarry Shipment Status Webhook' });
}
