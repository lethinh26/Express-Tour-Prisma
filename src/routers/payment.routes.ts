import { Router } from 'express';
import { createPayment, getPaymentById, getPayments, updatePayment, createOrder, createOrderItem, handleSepayIPN, getOrders } from '../handlers/payment.handler';


const router = Router();
router.get('/', getPayments);
router.get('/:id', getPaymentById);
router.post('/', createPayment);
router.patch('/:id', updatePayment);
router.post('/order', createOrder);
router.post('/order-item', createOrderItem);
router.post('/sepay-ipn', handleSepayIPN);
router.get('/orders/all', getOrders); 


export default router;
