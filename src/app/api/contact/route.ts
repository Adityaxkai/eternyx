import { readJSON, writeJSON } from '@/lib/dataStore';
import { v4 as uuidv4 } from 'uuid';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, inquiryType, message } = body;

    if (!name || !email || !message) {
      return Response.json({ error: 'Missing required inquiry fields' }, { status: 400 });
    }

    const inquiries = readJSON<any[]>('inquiries.json');
    const newInquiry = {
      id: `INQ-${uuidv4().slice(0, 8).toUpperCase()}`,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      inquiryType: inquiryType || 'General',
      message: message.trim(),
      status: 'New',
      created_at: new Date().toISOString(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    };

    inquiries.push(newInquiry);
    writeJSON('inquiries.json', inquiries);

    return Response.json(newInquiry, { status: 201 });
  } catch (error) {
    console.error('Contact inquiry submission error:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
