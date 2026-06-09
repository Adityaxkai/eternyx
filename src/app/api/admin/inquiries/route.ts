import { readJSON, writeJSON } from '@/lib/dataStore';

export const dynamic = 'force-dynamic';

export async function GET() {
  const inquiries = readJSON<any[]>('inquiries.json');
  // Sort newest first
  return Response.json(
    [...inquiries].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  );
}
