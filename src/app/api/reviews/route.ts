import { reviewService } from '@/services/reviewService';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productName = searchParams.get('productName');
    
    if (!productName) {
      return Response.json({ error: 'Missing product name' }, { status: 400 });
    }

    const reviews = await reviewService.getByProduct(productName);
    return Response.json(reviews);
  } catch (error) {
    console.error('Failed to get public reviews:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
