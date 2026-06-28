import { inquiryService } from '@/services/inquiryService';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const inquiries = await inquiryService.getAll();
    return Response.json(inquiries);
  } catch (error) {
    console.error('Failed to get inquiries:', error);
    return Response.json({ error: 'Failed to retrieve inquiries' }, { status: 500 });
  }
}
