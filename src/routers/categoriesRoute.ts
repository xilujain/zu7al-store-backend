import { Router } from 'express'

import { createSingleCategory, deleteCategory, getAllCategories, readSingleCategory, updateCategory } from '../controllers/CategoryController'

import { categoryUpdateValidation, slugValidation, validateCreateCategory } from '../middlewares/validation'
import { runValidation } from '../middlewares'

const router = Router()

router.post('/', validateCreateCategory, runValidation, createSingleCategory)

router.get('/', getAllCategories)
router.get('/:slug', slugValidation, runValidation, readSingleCategory)

router.put('/:slug', categoryUpdateValidation, runValidation, updateCategory)

router.delete('/:slug', slugValidation, runValidation, deleteCategory)

export default router
