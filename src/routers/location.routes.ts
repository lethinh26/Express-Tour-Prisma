import { Router } from 'express';
import { createLocation, getLocation, getLocationById } from '../handlers/location.handler';



const router = Router();

router.get('/', getLocation)
router.get('/:id', getLocationById)
router.post('/', createLocation)


export default router;
