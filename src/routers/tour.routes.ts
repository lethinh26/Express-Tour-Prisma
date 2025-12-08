import { Router } from 'express';
import { countAllTours, countTour, createTour, deleteTour, getTourById, getTours, updateTour, createReview, getReviews, getReviewsByTourId, deleteReview } from '../handlers/tour.handler';

const router = Router();

router.get('/', getTours);
router.get('/:id', getTourById); 
router.post('/', createTour);
router.patch('/:id', updateTour);
router.delete('/:id', deleteTour);
router.get('/count', countTour);
router.get('/count/all', countAllTours);

router.post('/reviews', createReview);
router.get('/reviews', getReviews);
router.get('/reviews/tour/:tourId', getReviewsByTourId);
router.delete('/reviews/:id', deleteReview);

export default router;
