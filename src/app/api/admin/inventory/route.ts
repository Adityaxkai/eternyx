import { NextRequest, NextResponse } from 'next/server';
import { inventoryService } from '@/services/inventoryService';
import { getIronSession } from 'iron-session';
import { sessionOptions, SessionData } from '@/lib/session';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const res = NextResponse.json({ ok: true });
  const session = await getIronSession<SessionData>(request, res, sessionOptions);

  if (!session.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await inventoryService.getAll();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Inventory GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch inventory' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const res = NextResponse.json({ ok: true });
  const session = await getIronSession<SessionData>(request, res, sessionOptions);

  if (!session.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { productId, size, newStock } = await request.json();

    if (!productId || typeof newStock !== 'number') {
      return NextResponse.json({ error: 'Missing productId or numeric newStock' }, { status: 400 });
    }

    const success = await inventoryService.updateStock(productId, size, newStock);
    if (success) {
      return NextResponse.json({ success: true, newStock });
    } else {
      return NextResponse.json({ error: 'Failed to update stock' }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Inventory PATCH error:', error);
    return NextResponse.json({ error: 'Failed to update stock' }, { status: 500 });
  }
}
