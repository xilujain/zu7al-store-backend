import { Router } from 'express'

import {
  getAllOrdersForAdmin,
  getBraintreeClientToken,
  getOrderForUser,
  handleProcessPayment
} from '../controllers/OrderController'

import { isAdmin, isLoggedin } from '../middlewares/auth'

const router = Router()

router.get('/all-orders', isLoggedin, isAdmin, getAllOrdersForAdmin)
router.get('/:id([0-9a-fA-F]{24})', isLoggedin, getOrderForUser)
router.get('/braintree/token', isLoggedin, getBraintreeClientToken)

router.post('/process-payment', handleProcessPayment)
// router.put('/:id([0-9a-fA-F]{24})', isLoggedin, isAdmin, updateOrderStatus)

export default router
