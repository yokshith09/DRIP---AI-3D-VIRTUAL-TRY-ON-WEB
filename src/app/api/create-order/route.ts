import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(req: Request) {
  try {
    const { amount, receipt } = await req.json();

    if (amount === undefined || amount === null || isNaN(Number(amount))) {
      return NextResponse.json(
        { error: 'Valid transaction amount is required.' },
        { status: 400 }
      );
    }

    const amountInPaise = Math.round(Number(amount) * 100);
    if (amountInPaise < 100) {
      return NextResponse.json(
        { error: 'Minimum transaction amount is 100 paise (₹1.00).' },
        { status: 400 }
      );
    }

    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    const isMockMode = !keyId || !keySecret || keyId === 'rzp_test_xxxx' || keyId.trim() === '';

    if (isMockMode) {
      console.log('[RAZORPAY CREATE-ORDER] Running in checkout simulation mode...');
      await new Promise((resolve) => setTimeout(resolve, 800));

      const mockOrderId = `order_mock_${Math.random().toString(36).substring(2, 10)}`;
      return NextResponse.json({
        id: mockOrderId,
        order_id: mockOrderId,
        amount: amountInPaise,
        currency: 'INR',
        receipt: receipt || `rcpt_mock_${Date.now()}`,
        isMock: true
      });
    }

    console.log('[RAZORPAY CREATE-ORDER] Initializing SDK and dispatching order request...');
    const rzp = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const options = {
      amount: amountInPaise,
      currency: 'INR',
      receipt: receipt || `rcpt_order_${Date.now()}`
    };

    const order = await rzp.orders.create(options);
    console.log(`[RAZORPAY CREATE-ORDER] Order generated successfully. ID: ${order.id}`);

    return NextResponse.json({
      id: order.id,
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      isMock: false
    });

  } catch (error: any) {
    console.error('[RAZORPAY CREATE-ORDER] Route error:', error);
    
    if (error.statusCode === 401 || (error.message && error.message.toLowerCase().includes('auth'))) {
      return NextResponse.json(
        { error: 'Razorpay authentication failed. Invalid API credentials.' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { error: error.message || 'Something went wrong during order creation' },
      { status: 500 }
    );
  }
}
