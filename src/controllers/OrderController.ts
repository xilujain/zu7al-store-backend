import { type NextFunction, type Request, type Response } from 'express'
import braintree from 'braintree'

import { dev } from '../config'

import { getAdminOrder, getUserOrder, processPayment } from '../services/orderServices'

import { createHttpError } from '../errors/createError'

import { Order } from '../models/orderSchema'

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: dev.app.braintreeMerchantId,
  publicKey: dev.app.braintreePublicKey,
  privateKey: dev.app.braintreePrivateKey
})

interface CustomRequest extends Request {
  userId?: string
}

export const getAllOrdersForAdmin = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const orders = await getAdminOrder()

    res.status(200).json({ message: 'Orders are returned for the admin', payload: orders })
  } catch (error) {
    next(error)
  }
}

export const handleProcessPayment = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { nonce, cartItems, amount } = req.body

    const result = await gateway.transaction.sale(
      {
        amount,
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true
        }
      }
    )
    if (result.success) {
      const order = new Order({
        products: cartItems,
        payment: result,
        buyer: req.userId
      })

      await order.save()
    } else {
      console.error(result.message)
    }

    const buyerId = req.userId
    const newOrder = processPayment(cartItems, buyerId)

    res.status(200).json({ message: 'payment was successful and order is created', payload: newOrder })
  } catch (error) {
    next(error)
  }
}

export const getOrderForUser = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.id
    const orders = await getUserOrder(userId)

    res.status(200).json({ message: 'Orders are returned for the user', payload: orders })
  } catch (error) {
    next(error)
  }
}

export const getBraintreeClientToken = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const braintreeClientToken = await gateway.clientToken.generate({})
    if (!braintreeClientToken) {
      throw createHttpError(409, 'undefined ClientToken')
    }

    res.status(200).json(braintreeClientToken)
  } catch (error) {
    next(error)
  }
}
