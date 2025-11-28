import express from 'express';
import paymentRoutes from './routers/payment.routes';

const app = express();

app.use(express.json());

app.use('/api/payments', paymentRoutes);

export default app;
