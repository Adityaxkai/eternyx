import { razorpay } from '@/lib/razorpay';
import { orderService } from '@/services/orderService';
import { customerService } from '@/services/customerService';
import { v4 as uuidv4 } from 'uuid';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, address, items, discountCode, total, phone } = body;

    if (!email || !name || !address || !items || !Array.isArray(items) || items.length === 0) {
      return Response.json({ error: 'Missing required checkout fields' }, { status: 400 });
    }

    // 1. Process/Ensure Customer Profile exists
    const customer = await customerService.createOrUpdate(email, name, 0, phone); // Start with 0 spend; increment after payment confirms
    if (!customer) {
      return Response.json({ error: 'Failed to process customer profile' }, { status: 500 });
    }

    // 2. Call Razorpay API to create checkout order
    // Note: Razorpay amount must be in paise (smallest currency unit, e.g. INR 1.00 = 100 paise)
    const amountInPaise = Math.round(Number(total) * 100);
    const options = {
      amount: amountInPaise,
      currency: 'INR',
      receipt: `rcpt_${uuidv4().slice(0, 8).toUpperCase()}`,
    };

    const rzpOrder = await razorpay.orders.create(options);
    if (!rzpOrder) {
      return Response.json({ error: 'Failed to create payment order at Razorpay gateway' }, { status: 500 });
    }

    // 3. Create the order in ETERNYX MySQL database in 'Pending' status
    const orderId = `ORD-${uuidv4().slice(0, 8).toUpperCase()}`;
    const localOrder = await orderService.create({
      id: orderId,
      customer_id: customer.id,
      customer_name: name.trim(),
      customer_email: email.toLowerCase().trim(),
      total: Number(total),
      status: 'Pending',
      payment_status: 'Pending',
      razorpay_order_id: rzpOrder.id,
      items,
      shipping_address: address,
      discount_code: discountCode || null,
    });

    if (!localOrder) {
      return Response.json({ error: 'Failed to create database order record' }, { status: 500 });
    }

    // Return Razorpay metadata and local order references to the frontend checkout
    return Response.json({
      success: true,
      key: process.env.RAZORPAY_KEY_ID || 'rzp_test_dummykeyid123',
      amount: rzpOrder.amount,
      currency: rzpOrder.currency,
      order_id: rzpOrder.id,
      local_order_id: orderId,
    });
  } catch (error) {
    console.error('Create Razorpay checkout order error:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
