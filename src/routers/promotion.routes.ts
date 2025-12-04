import { Router } from 'express';
import { getPromotion, getPromotionByUserId } from '../handlers/promotion.handle';



const router = Router();

router.get('/', getPromotion)
router.get('/:userId', getPromotionByUserId)



export default router;
