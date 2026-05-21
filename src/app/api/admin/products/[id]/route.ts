import { NextRequest, NextResponse } from 'next/server';
import { productService } from '@/services/productService';
import { getIronSession } from 'iron-session';
import { sessionOptions, SessionData } from '@/lib/session';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const res = NextResponse.json({ ok: true });
  const session = await getIronSession<SessionData>(request, res, sessionOptions);
  
  if (!session.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const product = productService.getById(params.id);
  if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(product);
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const res = NextResponse.json({ ok: true });
  const session = await getIronSession<SessionData>(request, res, sessionOptions);
  
  if (!session.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();
    const updatedProduct = productService.update(params.id, data);
    if (!updatedProduct) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(updatedProduct);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update' }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const res = NextResponse.json({ ok: true });
  const session = await getIronSession<SessionData>(request, res, sessionOptions);
  
  if (!session.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const success = productService.delete(params.id);
  if (!success) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ success: true });
}
