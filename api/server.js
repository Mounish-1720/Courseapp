import express from 'express';
import Razorpay from 'razorpay';
import dotenv from 'dotenv';
import cors from 'cors';
import { createConnection } from 'snowflake-sdk';
import courseRoutes from '../routes/courseroutes.js';
import paymentRoutes from '../routes/paymentroute.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', courseRoutes);
app.use('/api', paymentRoutes);

app.get('/api', (req, res) => {
  res.send('✅ Backend is running');
});

export default app;
