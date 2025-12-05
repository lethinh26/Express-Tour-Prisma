import { Router } from 'express';
import { createTourImage, deleteTourImage, getAllImage, getImageTour, getTourImgFirst, updateTourImage } from '../handlers/tourImage.handle';


const router = Router();

router.get('/all', getAllImage);
router.get('/', getImageTour);
router.get('/:id', getTourImgFirst);
router.post('/', createTourImage);
router.patch('/:id', updateTourImage);
router.delete('/:id', deleteTourImage);

export default router;
