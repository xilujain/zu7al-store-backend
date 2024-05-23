import express, { type Application } from 'express'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import mongoose from 'mongoose'
import cors from 'cors'

import { dev } from './config'
import { connectDB } from './config/db'

import usersRouter from './routers/userRoutes'
import productsRouter from './routers/productRoute'
import ordersRouter from './routers/orderRoute'
import categoriesRouter from './routers/categoriesRoute'
import authRoute from './routers/authRoute'

import { apiErrorHandler } from './middlewares/errorHandler'

import { createHttpError } from './errors/createError'

const app: Application = express()
const PORT = dev.app.port

app.use(cors({ origin: 'http://localhost:3000', credentials: true }))
app.use('/images', express.static('images'))
app.use(cookieParser())
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/users', usersRouter)
app.use('/auth', authRoute)
app.use('/products', productsRouter)
app.use('/categories', categoriesRouter)
app.use('/orders', ordersRouter)

app.use(apiErrorHandler)
mongoose.set('strictQuery', false)
mongoose
  .connect(String(dev.db.url))
  .then(() => {
    console.log('Database connected')
  })
  .catch((err) => {
    console.log('MongoDB connection error, ', err)
  })

app.listen(PORT, () => {
  console.log('Server running http://localhost:' + PORT)
  connectDB()
})

app.use((req, res, next) => {
  const error = createHttpError(404, 'Route not found')
  next(error)
})

app.use(apiErrorHandler)
