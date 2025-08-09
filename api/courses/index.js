import { executeQuery } from '../../utils/snowflakeClient';
import { success, error } from '../../utils/response';

export default async (req, res) => {
  if (req.method !== 'GET') return error(res, 405, 'Method not allowed');

  try {
    const { type } = req.query;
    if (!type) return error(res, 400, 'Missing course type parameter');

    const courses = await executeQuery(
      `SELECT 
        id AS "id",
        name AS "name",
        description AS "description",
        total_cost AS "totalCost",
        initial_payment AS "initialPayment",
        duration_weeks AS "durationWeeks"
      FROM courses
      WHERE type = ?
      AND is_active = true
      ORDER BY display_order DESC`,
      [type.toUpperCase()]
    );

    success(res, courses);
  } catch (err) {
    error(res, 500, 'Failed to fetch courses', err.message);
  }
};