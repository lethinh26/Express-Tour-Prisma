import { Router } from 'express';
import { createPromotion, deletePromotionById, getPromotion, getPromotionByUserId, updatePromotion } from '../handlers/promotion.handle';



const router = Router();

router.get('/', getPromotion)
router.get('/:userId', getPromotionByUserId)
router.post('/', createPromotion)
router.patch('/:id', updatePromotion)
router.delete('/:id', deletePromotionById)



export default router;
