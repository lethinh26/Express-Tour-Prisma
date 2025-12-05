import { Router } from 'express';
import { createCategory, deleteCategory, getCategory, getCategoryById, updateCategory } from '../handlers/category.handle';
import { getTourImgFirst } from '../handlers/tourImage.handle';


const router = Router();

router.get('/', getCategory)
router.get('/:id', getCategoryById)
router.post('/', createCategory)
router.patch('/:id', updateCategory)
router.delete('/:id', deleteCategory)


export default router;
