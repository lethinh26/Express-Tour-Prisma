import express from 'express';
import paymentRoutes from './routers/payment.routes';
import tourRoutes from './routers/tour.routes';
import tourImages from './routers/tourImage.routes';
import category from './routers/category.routes';
import tourDeparture from './routers/tourDeparture.routes';

const app = express();

app.use(express.json());

app.use('/api/payments', paymentRoutes);
app.use('/api/tours', tourRoutes);
app.use('/api/tourImages', tourImages );
app.use('/api/tourDepartures', tourDeparture );
app.use('/api/categories', category );

export default app;