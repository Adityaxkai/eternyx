import { NextRequest, NextResponse } from 'next/server';
import { icarryService } from '@/services/icarryService';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const trackingId = searchParams.get('tracking_id');

    if (!trackingId) {
      return NextResponse.json({ error: 'Tracking ID (AWB) is required' }, { status: 400 });
    }

    const tracking = await icarryService.trackShipment(trackingId);

    return NextResponse.json({
      success: true,
      tracking,
    });
  } catch (error) {
    console.error('iCarry Tracking API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
