import { discountService } from '@/services/discountService';

export const dynamic = 'force-dynamic';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body = await request.json();
    const updated = await discountService.update(id, body);
    if (!updated) {
      return Response.json({ error: 'Discount not found' }, { status: 404 });
    }
    return Response.json(updated);
  } catch (error) {
    console.error(`Failed to update discount ${id}:`, error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const deleted = await discountService.delete(id);
    if (!deleted) {
      return Response.json({ error: 'Discount not found' }, { status: 404 });
    }
    return Response.json({ success: true });
  } catch (error) {
    console.error(`Failed to delete discount ${id}:`, error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
