import { Router } from 'express';
import { createCategory, getCategory, getCategoryById } from '../handlers/category.handle';
import { getTourImgFirst } from '../handlers/tourImage.handle';


const router = Router();

router.get('/', getCategory)
router.get('/:idCategory', getCategoryById)
router.post('/', createCategory)


export default router;
