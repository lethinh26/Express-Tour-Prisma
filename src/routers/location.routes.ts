import { Router } from 'express';
import { createLocation, deleteLocation, getLocation, getLocationById, updateLocation } from '../handlers/location.handler';



const router = Router();

router.get('/', getLocation)
router.get('/:id', getLocationById)
router.post('/', createLocation)
router.patch('/:id', updateLocation)
router.delete('/:id', deleteLocation)


export default router;
