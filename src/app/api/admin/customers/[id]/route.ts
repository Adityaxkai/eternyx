import { customerService } from '@/services/customerService';

export const dynamic = 'force-dynamic';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const customer = await customerService.getById(id);
    if (!customer) {
      return Response.json({ error: 'Customer profile not found' }, { status: 404 });
    }
    return Response.json(customer);
  } catch (error) {
    console.error('Failed to get customer profile:', error);
    return Response.json({ error: 'Failed to retrieve profile' }, { status: 500 });
  }
}
