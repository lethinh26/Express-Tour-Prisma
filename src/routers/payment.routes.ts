import { Router } from 'express';
import { createPayment, getPaymentById, getPayments } from '../handlers/payment.handler';


const router = Router();

router.get('/', getPayments);
router.get('/:id', getPaymentById);
router.post('/', createPayment);

export default router;
