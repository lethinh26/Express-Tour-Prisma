import { Router } from 'express';
import { countAllTours, countTour, createTour, deleteTour, getTourById, getTours, updateTour, createReview, getReviews, getReviewsByTourId, deleteReview, getUserReviewForTour, getOrderReview } from '../handlers/tour.handler';

const router = Router();
router.get('/count/all', countAllTours);
router.get('/count', countTour);

router.post('/reviews', createReview);
router.get('/reviews', getReviews);
router.get('/reviews/tour/:tourId', getReviewsByTourId);
router.get('/reviews/user/:userId/tour/:tourId', getUserReviewForTour);
router.get('/reviews/order/:orderId/user/:userId', getOrderReview);
router.delete('/reviews/:id', deleteReview);

router.get('/', getTours);
router.get('/:id', getTourById);
router.post('/', createTour);
router.patch('/:id', updateTour);
router.delete('/:id', deleteTour);

export default router;
