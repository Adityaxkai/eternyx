import { bookingService } from '@/services/bookingService';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const bookings = await bookingService.getAll();
    return Response.json(bookings);
  } catch (error) {
    console.error('Failed to get bookings:', error);
    return Response.json({ error: 'Failed to retrieve bookings' }, { status: 500 });
  }
}
