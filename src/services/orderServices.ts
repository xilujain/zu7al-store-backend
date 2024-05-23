import { createHttpError } from '../errors/createError'

import { type IOrderProduct, Order, type OrderInterface } from '../models/orderSchema'

export const getAdminOrder = async () => {
  const order = await Order.find()
    .populate({
      path: 'products',
      populate: { path: 'product', select: 'name price category quantity' }
    })
    .populate('buyer', 'name email phone')

  return order
}

export const processPayment = async (cartItems: any, buyerId: string | undefined) => {
  const newOrder: OrderInterface = new Order({
    products:
      cartItems.products.length > 0 &&
      cartItems.products.map((item: IOrderProduct) => ({
        product: item.product,
        quantity: item.quantity
      })),
    payment: cartItems.payment,
    buyer: buyerId
  })
  await newOrder.save()

  return newOrder
}

export const getUserOrder = async (userId: string | undefined) => {
  const orders = await Order.find({ buyer: userId })
    .populate({
      path: 'products',
      populate: { path: 'product', select: 'name price category quantity' }
    })
    .populate('buyer', 'name email phone')

  return orders
}

export const deleteOrder = async (slug: string) => {
  const order = await Order.findOneAndDelete({ slug })
  if (!order) {
    const error = createHttpError(404, `order is not found with this slug: ${slug}`)
    throw error
  }

  return order
}
