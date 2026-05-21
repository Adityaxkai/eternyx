import { readJSON, writeJSON } from '@/lib/dataStore';

export const dynamic = 'force-dynamic';

export async function GET() {
  return Response.json(readJSON('settings.json'));
}

export async function PATCH(request: Request) {
  const body = await request.json();
  const settings = readJSON<any>('settings.json');
  const updated = { ...settings, ...body };
  writeJSON('settings.json', updated);
  return Response.json(updated);
}
