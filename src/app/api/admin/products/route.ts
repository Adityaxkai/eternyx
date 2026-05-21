import { NextRequest, NextResponse } from 'next/server';
import { productService } from '@/services/productService';
import { getIronSession } from 'iron-session';
import { sessionOptions, SessionData } from '@/lib/session';

export async function GET(request: NextRequest) {
  const res = NextResponse.json({ ok: true });
  const session = await getIronSession<SessionData>(request, res, sessionOptions);
  
  if (!session.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const products = productService.getAll();
  return NextResponse.json(products);
}

export async function POST(request: NextRequest) {
  const res = NextResponse.json({ ok: true });
  const session = await getIronSession<SessionData>(request, res, sessionOptions);
  
  if (!session.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();
    const newProduct = productService.create(data);
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create product' }, { status: 400 });
  }
}

export async function PUT(request: NextRequest) {
  const res = NextResponse.json({ ok: true });
  const session = await getIronSession<SessionData>(request, res, sessionOptions);
  
  if (!session.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { updates } = await request.json();
    if (updates && Array.isArray(updates)) {
      productService.reorder(updates);
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update' }, { status: 400 });
  }
}
