import { Router } from 'express';
import { countAllTours, countTour, createTour, deleteTour, getTourById, getTours, updateTour } from '../handlers/tour.handler';

const router = Router();

router.get('/', getTours);
router.get('/:id', getTourById); 
router.post('/', createTour);
router.patch('/:id', updateTour);
router.delete('/:id', deleteTour);
router.get('/count', countTour);
router.get('/count/all', countAllTours);

export default router;
