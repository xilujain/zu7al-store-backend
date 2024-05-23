import { Schema, model, type Document } from 'mongoose'
import mongoose from 'mongoose'

import { type ProductInterface } from './productSchema'

export interface IOrderProduct {
  product: ProductInterface['_id']
  quantity: number
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IOrderPayment {}

export interface OrderInterface extends Document {
  products: IOrderProduct[]
  payment: IOrderPayment
  buyer: mongoose.Schema.Types.ObjectId
  status: 'Not Processed' | 'Processing' | 'Shipped' | 'Delivered' | 'Canceled'
}

const orderSchema = new Schema<OrderInterface>(
  {
    products: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true
        },
        quantity: { type: Number, required: true, trim: true }
      }
    ],
    payment: { type: Object, required: true },
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    status: {
      type: String,
      enum: ['Not Processed', 'Processing', 'Shipped', 'Delivered', 'Canceled'],
      default: 'Not Processed'
    }
  },
  { timestamps: true }
)

export const Order = model<OrderInterface>('Order', orderSchema)
