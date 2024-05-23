import { Router } from 'express'

import {
  createSingleProduct,
  deleteProductBySlug,
  filterProducts,
  readAllProducts,
  readSingleProduct,
  updateProductBySlug
} from '../controllers/ProductController'

import { uploadImageProduct, validateImageUpload } from '../middlewares/uploadImage'
import { runValidation } from '../middlewares/index'
import {
  productCreateValidation,
  slugValidation,
  productUpdateValidation
} from '../middlewares/validation'

const router = Router()

router.post(
  '/',
  uploadImageProduct.single('image'),
  validateImageUpload,
  productCreateValidation,
  runValidation,
  createSingleProduct
)
router.post('/filter-products', filterProducts)

router.get('/', readAllProducts)
router.get('/:slug', slugValidation, runValidation, readSingleProduct)

router.delete('/:slug', slugValidation, runValidation, deleteProductBySlug)

router.put(
  '/:slug',
  productUpdateValidation,
  runValidation,
  updateProductBySlug
)

export default router
