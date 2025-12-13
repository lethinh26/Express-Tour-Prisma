import { Router } from 'express';
import { checkPromotionUsable, createPromotion, createPromotionUser, deletePromotionById, getPromotion, getPromotionByToken, updatePromotion, usePromotion } from '../handlers/promotion.handle';



const router = Router();

router.get('/', getPromotion)
router.post('/check-usable', checkPromotionUsable)
router.post('/use', usePromotion)
router.post('/token', createPromotionUser)
router.get('/token/:token', getPromotionByToken)
router.post('/', createPromotion)
router.patch('/:id', updatePromotion)
router.delete('/:id', deletePromotionById)

export default router;
