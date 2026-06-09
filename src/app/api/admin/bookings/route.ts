import { readJSON, writeJSON } from '@/lib/dataStore';

export const dynamic = 'force-dynamic';

export async function GET() {
  const bookings = readJSON<any[]>('bookings.json');
  // Sort newest first
  return Response.json(
    [...bookings].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  );
}
