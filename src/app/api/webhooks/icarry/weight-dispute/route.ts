import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    console.log('[iCarry Weight Dispute Webhook Received]:', payload);

    return NextResponse.json({
      success: true,
      message: 'Weight dispute logged successfully',
      receivedAt: new Date().toISOString()
    }, { status: 200 });
  } catch (error: any) {
    console.error('[iCarry Weight Dispute Webhook Error]:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ status: 'Active', endpoint: 'iCarry Weight Dispute Webhook' });
}
