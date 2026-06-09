import { readJSON, writeJSON } from '@/lib/dataStore';

export const dynamic = 'force-dynamic';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const inquiries = readJSON<any[]>('inquiries.json');
  const idx = inquiries.findIndex((i) => i.id === id);
  if (idx === -1) return Response.json({ error: 'Not found' }, { status: 404 });
  inquiries[idx] = { ...inquiries[idx], ...body };
  writeJSON('inquiries.json', inquiries);
  return Response.json(inquiries[idx]);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const inquiries = readJSON<any[]>('inquiries.json');
  const filtered = inquiries.filter((i) => i.id !== id);
  if (filtered.length === inquiries.length) return Response.json({ error: 'Not found' }, { status: 404 });
  writeJSON('inquiries.json', filtered);
  return Response.json({ success: true });
}
