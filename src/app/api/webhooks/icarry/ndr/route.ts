import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    console.log('[iCarry NDR Webhook Received]:', payload);

    return NextResponse.json({
      success: true,
      message: 'NDR event logged successfully',
      receivedAt: new Date().toISOString()
    }, { status: 200 });
  } catch (error: any) {
    console.error('[iCarry NDR Webhook Error]:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ status: 'Active', endpoint: 'iCarry NDR Webhook' });
}
