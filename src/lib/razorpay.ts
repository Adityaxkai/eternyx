import Razorpay from 'razorpay';

if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.warn('WARNING: Razorpay credentials are not defined in environment variables. Using fallback values.');
}

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_dummykeyid123',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummysecretkeyid456',
});
