import express from 'express';
import paymentRoutes from './routers/payment.routes';
import tourRoutes from './routers/tour.routes';
import tourImages from './routers/tourImage.routes';
import category from './routers/category.routes';
import tourDeparture from './routers/tourDeparture.routes';
import auth from './routers/auth.routes';
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/payments', paymentRoutes);
app.use('/api/tours', tourRoutes);
app.use('/api/tourImages', tourImages );
app.use('/api/tourDepartures', tourDeparture );
app.use('/api/categories', category );
app.use('/api/auth', auth);

export default app;