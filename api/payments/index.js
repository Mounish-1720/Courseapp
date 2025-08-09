import { getRazorpayClient } from '../../utils/razorpayClient.js';
import { executeQuery } from '../../utils/snowflakeClient.js';
import { success, error } from '../../utils/response.js';

export default async (req, res) => {
  if (req.method !== 'POST') {
    return error(res, 405, 'Method not allowed');
  }

  try {
    const { courseId, amount, currency = 'INR' } = req.body;
    if (!courseId || !amount) {
      return error(res, 400, 'Missing required fields');
    }

    // 1. Validate course exists
    const courseResult = await executeQuery(
      'SELECT name FROM courses WHERE id = ?',
      [courseId]
    );

    if (!courseResult || courseResult.length === 0) {
      return error(res, 404, 'Course not found');
    }

    // 2. Create Razorpay order
    const razorpay = getRazorpayClient();
    const order = await razorpay.orders.create({
      amount: amount * 100, // in paise
      currency,
      receipt: `course_${courseId}_${Date.now()}`,
      notes: { courseId }
    });

    success(res, order);
  } catch (err) {
    error(res, 500, 'Payment failed', err.message);
  }
};
