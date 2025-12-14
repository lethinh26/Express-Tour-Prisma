import { Router } from 'express';
import { createTourDeparture, deleteTourDeparture, getTourDeparture, getTourDepartureByTourId, updateTourDeparture, deleteTourDepartureByTourId } from '../handlers/tourDeparture.hanle';


const router = Router();

router.get('/', getTourDeparture);
router.get('/tour/:id', getTourDepartureByTourId);
router.delete('/tour/:tourId', deleteTourDepartureByTourId);
router.post('/', createTourDeparture);
router.patch('/:id', updateTourDeparture);
router.delete('/:id', deleteTourDeparture);

export default router;
