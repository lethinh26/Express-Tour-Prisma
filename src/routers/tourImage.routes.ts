import { Router } from 'express';
import { createTourImage, getImageTour, getTourImgFirst } from '../handlers/tourImage.handle';


const router = Router();

router.get('/', getImageTour);
router.get('/:tourId', getTourImgFirst);
router.post('/', createTourImage);

export default router;
