import { bookingService } from '@/services/bookingService';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, location, message } = body;

    if (!name || !email || !location) {
      return Response.json({ error: 'Missing required booking fields' }, { status: 400 });
    }

    const newBooking = await bookingService.create({
      name,
      email,
      location,
      message: message || ''
    });

    if (!newBooking) {
      return Response.json({ error: 'Failed to record booking' }, { status: 500 });
    }

    return Response.json(newBooking, { status: 201 });
  } catch (error) {
    console.error('Booking submission error:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
