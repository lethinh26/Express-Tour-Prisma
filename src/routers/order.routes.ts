import { Router } from 'express';
import { getOrdersByDeparture, getAllOrders } from '../handlers/order.handler';

const router = Router();

router.get('/departure/:departureId', getOrdersByDeparture);
router.get('/all', getAllOrders);

export default router;
