import { readJSON, writeJSON } from '@/lib/dataStore';
import { v4 as uuidv4 } from 'uuid';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, location, message } = body;

    if (!name || !email || !location) {
      return Response.json({ error: 'Missing required booking fields' }, { status: 400 });
    }

    const bookings = readJSON<any[]>('bookings.json');
    const newBooking = {
      id: `BKG-${uuidv4().slice(0, 8).toUpperCase()}`,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      location,
      message: message?.trim() || '',
      status: 'Pending',
      created_at: new Date().toISOString(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    };

    bookings.push(newBooking);
    writeJSON('bookings.json', bookings);

    return Response.json(newBooking, { status: 201 });
  } catch (error) {
    console.error('Booking submission error:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
