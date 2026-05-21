import { readJSON, writeJSON } from '@/lib/dataStore';
import { v4 as uuidv4 } from 'uuid';

export const dynamic = 'force-dynamic';

export async function GET() {
  return Response.json(readJSON('discounts.json'));
}

export async function POST(request: Request) {
  const body = await request.json();
  const discounts = readJSON<any[]>('discounts.json');
  const newDiscount = {
    id: `disc-${uuidv4().slice(0, 8)}`,
    ...body,
    usage_count: 0,
    active: true,
    created_at: new Date().toISOString(),
  };
  discounts.push(newDiscount);
  writeJSON('discounts.json', discounts);
  return Response.json(newDiscount, { status: 201 });
}
