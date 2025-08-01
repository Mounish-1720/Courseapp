import express from 'express';
import { fetchCourses } from '../db/snowflake.js';

const router = express.Router();

router.get('/courses/:track', async (req, res) => {
  const { track } = req.params;
  try {
    const courses = await fetchCourses(track.toLowerCase());
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

export default router;
