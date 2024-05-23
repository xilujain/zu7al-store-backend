import { type NextFunction, type Request, type Response } from 'express'
import slugify from 'slugify'

import { productCreation, productPagination, productRemoved, productUpdated, productsFiltering, singleProduct } from '../services/productsServices'

export const createSingleProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productData = req.body
    const image = req.file?.path
    const newProduct = await productCreation(productData, image)

    res.status(201).json({
      payload: newProduct,
      message: 'create product successfully'
    })
  } catch (error) {
    next(error)
  }
}

export const readAllProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 4
    const search = req.query.search as string
    const { products, totalPages, currentPage, count } = await productPagination(page, limit, search)

    res.status(200).json({
      payload: {
        products,
        pagination: {
          totalProducts: count,
          totalPages,
          currentPage
        }
      }
    })
  } catch (error) {
    next(error)
  }
}

export const filterProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { checkedCategories, priceRange } = req.body
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 4
    const { products, totalPages, currentPage, count } = await productsFiltering(page, limit, checkedCategories, priceRange)

    res.status(200).json({
      payload: {
        products,
        pagination: {
          totalProducts: count,
          totalPages,
          currentPage
        }
      }
    })
  } catch (error) {
    next(error)
  }
}

export const readSingleProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const slugProduct = req.params.slug
    const product = await singleProduct(slugProduct)

    res.status(200).send(product)
  } catch (error) {
    next(error)
  }
}

export const deleteProductBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const slugProduct = req.params.slug
    await productRemoved(slugProduct)

    res.send({ message: 'Deleted a single product' })
  } catch (error) {
    next(error)
  }
}

export const updateProductBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.body.name) {
      req.body.slug = slugify(req.body.name)
    }

    const slug = req.params.slug
    const productData = req.body
    const product = await productUpdated(slug, productData)

    res.status(200).json({ message: 'Update a single product', payload: product })
  } catch (error) {
    next(error)
  }
}
