import { discountService } from '@/services/discountService';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const discounts = await discountService.getAll();
    return Response.json(discounts);
  } catch (error) {
    console.error('Failed to get discounts:', error);
    return Response.json({ error: 'Failed to retrieve discounts' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.code || !body.type) {
      return Response.json({ error: 'Missing code or type' }, { status: 400 });
    }
    
    const newDiscount = await discountService.create({
      code: body.code,
      type: body.type,
      value: Number(body.value || 0),
      active: body.active !== undefined ? body.active : true
    });

    if (!newDiscount) {
      return Response.json({ error: 'Failed to create discount record' }, { status: 500 });
    }

    return Response.json(newDiscount, { status: 201 });
  } catch (error) {
    console.error('Failed to create discount:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
