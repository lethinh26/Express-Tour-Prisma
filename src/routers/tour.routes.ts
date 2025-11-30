import { Router } from 'express';
import { createTour, getTourById, getTours } from '../handlers/tour.handler';


const router = Router();

router.get('/', getTours);
router.get('/:id', getTourById); 
router.post('/', createTour);

export default router;
