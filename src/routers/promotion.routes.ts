import { Router } from 'express';
import { createPromotion, createPromotionUser, deletePromotionById, getPromotion, getPromotionByToken, getPromotionByUserId, updatePromotion } from '../handlers/promotion.handle';



const router = Router();

router.get('/', getPromotion)
router.get('/:userId', getPromotionByUserId)
router.post('/', createPromotion)
router.patch('/:id', updatePromotion)
router.delete('/:id', deletePromotionById)
router.get('/token/:token', getPromotionByToken)
router.post('/token', createPromotionUser)


export default router;
