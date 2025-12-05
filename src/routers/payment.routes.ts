import { Router } from 'express';
import { createPayment, deletePayment, getPaymentById, getPayments, updatePayment } from '../handlers/payment.handler';


const router = Router();
router.get('/', getPayments);
router.get('/:id', getPaymentById);
router.post('/', createPayment);
router.patch('/:id', updatePayment);
router.delete('/:id', deletePayment);

export default router;
