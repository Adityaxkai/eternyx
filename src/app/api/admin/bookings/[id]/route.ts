import { readJSON, writeJSON } from '@/lib/dataStore';

export const dynamic = 'force-dynamic';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const bookings = readJSON<any[]>('bookings.json');
  const idx = bookings.findIndex((b) => b.id === id);
  if (idx === -1) return Response.json({ error: 'Not found' }, { status: 404 });
  bookings[idx] = { ...bookings[idx], ...body };
  writeJSON('bookings.json', bookings);
  return Response.json(bookings[idx]);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const bookings = readJSON<any[]>('bookings.json');
  const filtered = bookings.filter((b) => b.id !== id);
  if (filtered.length === bookings.length) return Response.json({ error: 'Not found' }, { status: 404 });
  writeJSON('bookings.json', filtered);
  return Response.json({ success: true });
}
