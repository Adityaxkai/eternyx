import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getIronSession } from 'iron-session';
import { sessionOptions, SessionData } from '@/lib/session';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const res = NextResponse.json({ ok: true });
  const session = await getIronSession<SessionData>(request, res, sessionOptions);

  if (!session.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 1. Clear MySQL Tables
    await query('DELETE FROM order_items');
    await query('DELETE FROM orders');
    await query('DELETE FROM customers');
    await query('DELETE FROM bookings');
    await query('DELETE FROM inquiries');
    await query('DELETE FROM reviews');

    // 2. Clear local JSON fallback files in src/data
    const dataDir = path.join(process.cwd(), 'src/data');
    const jsonFilesToClear = [
      'orders.json',
      'customers.json',
      'bookings.json',
      'inquiries.json',
      'reviews.json',
    ];

    for (const filename of jsonFilesToClear) {
      const filePath = path.join(dataDir, filename);
      try {
        fs.writeFileSync(filePath, JSON.stringify([], null, 2), 'utf8');
      } catch (err) {
        console.warn(`Could not overwrite ${filename}:`, err);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'All demo data (orders, customers, bookings, inquiries, reviews) has been reset to 0.',
    });
  } catch (error: any) {
    console.error('Reset demo data error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to reset demo data' },
      { status: 500 }
    );
  }
}
