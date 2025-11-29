import { Router } from 'express';
import { createTourDeparture, getTourDeparture, getTourDepartureByTourId } from '../handlers/tourDeparture.hanle';


const router = Router();

router.get('/', getTourDeparture);
router.get('/:id', getTourDepartureByTourId); 
router.post('/', createTourDeparture);

export default router;
