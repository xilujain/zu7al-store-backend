import { type Request } from 'express'
import { check } from 'express-validator'

import multer, { type FileFilterCallback } from 'multer'

import { createHttpError } from '../errors/createError'

const userImage = multer.diskStorage({
  destination: function (req: Request, image: Express.Multer.File, cb) {
    cb(null, 'images/users')
  },
  filename: function (req: Request, image: Express.Multer.File, cb) {
    cb(null, Date.now() + '-' + image.originalname)
  }
})

const productImage = multer.diskStorage({
  destination: function (req, image, cb) {
    cb(null, 'images/products')
  },
  filename: function (req: Request, image: Express.Multer.File, cb) {
    cb(null, Date.now() + '-' + image.originalname)
  }
})

const fileFilter = (req: Request, image: Express.Multer.File, cb: FileFilterCallback) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg']
  if (!image.mimetype.startsWith('image/')) {
    cb(new Error('only image allowed'))
  }

  if (!allowedTypes.includes(image.mimetype)) {
    cb(new Error('Invalid file type'))
  }

  cb(null, true)
}

export const uploadImageProduct = multer({ storage: productImage, limits: { fileSize: 1024 * 1024 * 1 }, fileFilter })
export const uploadImageUser = multer({ storage: userImage, limits: { fileSize: 1024 * 1024 * 1 }, fileFilter })
export const validateImageUpload = [
  check('image').custom((value, { req }) => {
    if (!req.file) {
      throw createHttpError(400, 'Image is required')
    }
    return true
  })
]
