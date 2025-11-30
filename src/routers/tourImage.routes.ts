import { Router } from 'express';
import { createTourImage, getImageTour, getTourImgFirst } from '../handlers/tourImage.handle';


const router = Router();

router.get('/', getImageTour);
router.get('/:id', getTourImgFirst);
router.post('/', createTourImage);

export default router;
