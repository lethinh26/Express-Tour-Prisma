import { Router } from 'express';
import { createTourDeparture, deleteTourDeparture, getTourDeparture, getTourDepartureByTourId, updateTourDeparture } from '../handlers/tourDeparture.hanle';


const router = Router();

router.get('/', getTourDeparture);
router.get('/tour/:id', getTourDepartureByTourId); 
router.post('/', createTourDeparture);
router.patch('/:id', updateTourDeparture);
router.delete('/:id', deleteTourDeparture);

export default router;
