import { customerService } from '@/services/customerService';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const enriched = await customerService.getAll();
    return Response.json(enriched);
  } catch (error) {
    console.error('Failed to get customers:', error);
    return Response.json({ error: 'Failed to retrieve customers' }, { status: 500 });
  }
}
