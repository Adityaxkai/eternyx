import { inquiryService } from '@/services/inquiryService';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, inquiryType, message } = body;

    if (!name || !email || !message) {
      return Response.json({ error: 'Missing required inquiry fields' }, { status: 400 });
    }

    const newInquiry = await inquiryService.create({
      name,
      email,
      inquiryType: inquiryType || 'General',
      message
    });

    if (!newInquiry) {
      return Response.json({ error: 'Failed to record inquiry' }, { status: 500 });
    }

    return Response.json(newInquiry, { status: 201 });
  } catch (error) {
    console.error('Contact inquiry submission error:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
