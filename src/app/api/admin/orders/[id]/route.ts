import { orderService } from '@/services/orderService';

export const dynamic = 'force-dynamic';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const order = await orderService.getById(id);
    if (!order) {
      return Response.json({ error: 'Order not found' }, { status: 404 });
    }
    return Response.json(order);
  } catch (error) {
    console.error('Failed to get order detail:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    if (body.status === undefined) {
      return Response.json({ error: 'Missing status update payload' }, { status: 400 });
    }

    const updated = await orderService.updateStatus(id, body.status);
    if (!updated) {
      return Response.json({ error: 'Order not found or update failed' }, { status: 404 });
    }

    return Response.json(updated);
  } catch (error) {
    console.error('Failed to update order status:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
