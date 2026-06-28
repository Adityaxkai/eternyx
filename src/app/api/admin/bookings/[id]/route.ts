import { bookingService } from '@/services/bookingService';

export const dynamic = 'force-dynamic';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body = await request.json();
    const updated = await bookingService.update(id, body);
    if (!updated) {
      return Response.json({ error: 'Booking not found' }, { status: 404 });
    }
    return Response.json(updated);
  } catch (error) {
    console.error(`Failed to update booking ${id}:`, error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const deleted = await bookingService.delete(id);
    if (!deleted) {
      return Response.json({ error: 'Booking not found' }, { status: 404 });
    }
    return Response.json({ success: true });
  } catch (error) {
    console.error(`Failed to delete booking ${id}:`, error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
