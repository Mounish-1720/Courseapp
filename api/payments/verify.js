import crypto from 'crypto';
import { executeQuery } from '../../utils/snowflakeClient.js';
import { success, error } from '../../utils/response.js';

export default async (req, res) => {
  if (req.method !== 'POST') {
    return error(res, 405, 'Method not allowed');
  }

  try {
    const { paymentId, orderId, signature } = req.body;

    if (!paymentId || !orderId || !signature) {
      return error(res, 400, 'Missing required fields');
    }

    // 1. Verify signature
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    if (generatedSignature !== signature) {
      return error(res, 400, 'Invalid signature');
    }

    // 2. Update database
    await executeQuery(
      `
      UPDATE payments 
      SET status = 'captured', 
          captured_at = CURRENT_TIMESTAMP()
      WHERE id = ?
      `,
      [orderId]
    );

    success(res, { verified: true });
  } catch (err) {
    error(res, 500, 'Verification failed', err.message);
  }
};
