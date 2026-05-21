import { readJSON, writeJSON } from '@/lib/dataStore';

export const dynamic = 'force-dynamic';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const discounts = readJSON<any[]>('discounts.json');
  const idx = discounts.findIndex((d) => d.id === id);
  if (idx === -1) return Response.json({ error: 'Not found' }, { status: 404 });
  discounts[idx] = { ...discounts[idx], ...body };
  writeJSON('discounts.json', discounts);
  return Response.json(discounts[idx]);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const discounts = readJSON<any[]>('discounts.json');
  writeJSON('discounts.json', discounts.filter((d) => d.id !== id));
  return Response.json({ success: true });
}
