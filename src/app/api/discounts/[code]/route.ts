import { readJSON } from '@/lib/dataStore';

export const dynamic = 'force-dynamic';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    const cleanCode = code.toUpperCase().trim();

    // Read discounts from JSON data store
    const discounts = readJSON<any[]>('discounts.json');
    const discount = discounts.find((d) => d.code === cleanCode);

    if (!discount) {
      return Response.json({ error: 'Invalid promo code' }, { status: 404 });
    }

    if (!discount.active) {
      return Response.json({ error: 'This promo code has expired' }, { status: 400 });
    }

    // Return key discount info
    return Response.json({
      id: discount.id,
      code: discount.code,
      type: discount.type,
      value: discount.value,
    });
  } catch (error) {
    console.error('Validate discount error:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
