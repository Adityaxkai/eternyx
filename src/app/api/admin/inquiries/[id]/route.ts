import { inquiryService } from '@/services/inquiryService';

export const dynamic = 'force-dynamic';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updated = await inquiryService.update(id, body);
    if (!updated) {
      return Response.json({ error: 'Inquiry not found' }, { status: 404 });
    }
    return Response.json(updated);
  } catch (error) {
    console.error(`Failed to update inquiry:`, error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const deleted = await inquiryService.delete(id);
    if (!deleted) {
      return Response.json({ error: 'Inquiry not found' }, { status: 404 });
    }
    return Response.json({ success: true });
  } catch (error) {
    console.error(`Failed to delete inquiry:`, error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
