import { orderService } from '@/services/orderService';
import { customerService } from '@/services/customerService';
import { discountService } from '@/services/discountService';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, local_order_id } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return Response.json({ error: 'Missing required Razorpay validation parameters' }, { status: 400 });
    }

    // 1. Verify payment signature integrity
    // Signature pattern: HMAC-SHA256(razorpay_order_id + "|" + razorpay_payment_id, secret)
    const secret = process.env.RAZORPAY_KEY_SECRET || 'dummysecretkeyid456';
    const generatedSignature = crypto
      .createHmac('sha256', secret)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');

    const isVerified = generatedSignature === razorpay_signature;

    // Fetch order references
    const order = local_order_id 
      ? await orderService.getById(local_order_id) 
      : await orderService.getByRazorpayOrderId(razorpay_order_id);

    if (!order) {
      return Response.json({ error: 'Matching database order record not found' }, { status: 404 });
    }

    if (!isVerified) {
      // Record failed payment status to database
      await orderService.confirmPayment(order.id, 'Failed', {
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
      });
      return Response.json({ error: 'Payment signature validation failed (possible tampering)' }, { status: 400 });
    }

    // 2. Success: Update order payment properties in MySQL
    await orderService.confirmPayment(order.id, 'Paid', {
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
    });

    // 3. Post-Payment Fulfillment logic
    // A. Increment customer lifetime spent
    if (order.customer_email) {
      await customerService.createOrUpdate(order.customer_email, order.customer_name || 'Verified Customer', order.total);
    }

    // B. Record discount coupon usage
    if (order.discount_code) {
      await discountService.incrementUsage(order.discount_code);
    }

    return Response.json({ success: true, order_id: order.id });
  } catch (error) {
    console.error('Verify payment signature error:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
