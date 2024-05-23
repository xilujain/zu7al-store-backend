import slugify from 'slugify'

import { createHttpError } from '../errors/createError'

import { Categories, type CategoryInterface } from '../models/categorySchema'

export const categoryCreation = async (name: string) => {
  const categoryExist = await Categories.exists({ name })
  if (categoryExist) {
    throw createHttpError(409, 'Category already exist')
  }

  const newCategory = new Categories({
    name,
    slug: slugify(name)
  })
  newCategory.save()

  return newCategory
}

export const singleCategory = async (slug: string) => {
  const category = await Categories.find({ slug })
  if (category.length === 0) {
    throw createHttpError(409, 'Category not found with this slug')
  }

  return category
}

export const categoryRemoved = async (slug: string) => {
  const category = await Categories.findOneAndDelete({ slug })
  if (!category) {
    throw createHttpError(409, 'Category not found with this slug')
  }

  return category
}

export const categoryUpdated = async (slug: string, categoryData: CategoryInterface) => {
  const category = await Categories.findOneAndUpdate({ slug }, categoryData, {
    new: true
  })
  if (!category) {
    throw new Error('Product not found with this slug!')
  }

  return category
}

export const categoryPagination = async (page: number, limit: number) => {
  const count = await Categories.countDocuments()
  const totalPages = Math.ceil(count / limit)
  if (page > totalPages) {
    page = totalPages
  }
  const skip = (page - 1) * limit
  const categories = await Categories.find().skip(skip).limit(limit)

  return {
    categories,
    totalPages,
    currentPage: page
  }
}
