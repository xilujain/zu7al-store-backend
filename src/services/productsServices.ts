import slugify from 'slugify'

import { type ProductInterface, Products } from '../models/productSchema'

import { createHttpError } from '../errors/createError'

import { deletImage } from '../helper/deletImage'

export const productCreation = async (productData: ProductInterface, image: string | undefined) => {
  const { name, price, description, quantity, sold, category } = productData
  const newProduct = await Products.create({
    name,
    slug: slugify(name),
    price,
    image,
    description,
    quantity,
    sold,
    category
  })
  await newProduct.populate('category')

  return newProduct
}

export const productPagination = async (page = 1, limit = 4, search = '') => {
  const count = await Products.countDocuments()
  const totalPages = Math.ceil(count / limit)
  if (page > totalPages) {
    page = totalPages
  }
  const skip = (page - 1) * limit

  const searchRegExp = new RegExp('.*' + search + '.*', 'i')
  const filter = {
    $or: [
      { name: { $regex: searchRegExp } },
      { description: { $regex: searchRegExp } }
    ]
  }

  const products = await Products.find(filter)
    .populate('category')
    .skip(skip)
    .limit(limit)

  return {
    products,
    totalPages,
    currentPage: page,
    count
  }
}

export const productsFiltering = async (page = 1, limit = 4, checkedCategories: string[], priceRange: string[]) => {
  const filter = {
    price: {},
    category: {}
  }
  if (priceRange && priceRange.length > 0) {
    filter.price = { $gte: priceRange[0], $lte: priceRange[1] }
  }
  if (checkedCategories && checkedCategories.length > 0) {
    filter.category = { $in: checkedCategories }
  }

  const count = await Products.countDocuments(filter)
  if (count === 0) {
    throw createHttpError(409, 'No products found')
  }

  const totalPages = Math.ceil(count / limit)
  if (page > totalPages) {
    page = totalPages
  }

  const skip = (page - 1) * limit
  const products = await Products.find(filter)
    .populate('category')
    .skip(skip)
    .limit(limit)

  return {
    products,
    totalPages,
    currentPage: page,
    count
  }
}

export const singleProduct = async (slug: string | undefined) => {
  const product = await Products.find({ slug }).populate('category')
  if (product.length === 0) {
    throw createHttpError(409, 'Product not found with this slug')
  }

  return product
}

export const productRemoved = async (slug: string) => {
  const deleteproducts = await Products.findOneAndDelete({ slug })
  if (deleteproducts?.image) {
    await deletImage(deleteproducts.image)
  }
  if (!deleteproducts) {
    throw createHttpError(409, 'Product not found with this slug!')
  }

  return deleteproducts
}

export const productUpdated = async (slug: string, productData: ProductInterface) => {
  const products = await Products.findOneAndUpdate({ slug }, productData, {
    new: true
  })
  if (!products) {
    throw new Error('Product not found with this slug!')
  }

  return products
}
