import { type NextFunction, type Request, type Response } from 'express'
import mongoose from 'mongoose'

import { banUserById, deletUserById, findUserById, getUsers, processActivateUser, processForgetPassword, processRegisterUser, processResetPassword, processUpdateUser, unBanUserById, updateUserRoleById } from '../services/usersServices'

import { createHttpError } from '../errors/createError'

import { deletImage } from '../helper/deletImage'

export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, password, address, phone, email, order } = req.body
    const imagePath = req.file?.path
    const result = await processRegisterUser({ name, password, address, phone, email, order }, imagePath)

    res.status(200).json(result)
  } catch (error) {
    next(error)
  }
}

export const activateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.body
    const result = await processActivateUser(token)

    res.status(201).json(result)
  } catch (error) {
    next(error)
  }
}

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = Number(req.query.page)
    const limit = Number(req.query.limit)
    const search = req.query.search as string
    const { users, totalPages, currentPage } = await getUsers(page, limit, search)

    res.status(200).json({
      payload: {
        users,
        totalPages,
        currentPage
      }
    })
  } catch (error) {
    next(error)
  }
}

export const findUserByid = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await findUserById(req.params.id)
    if (!user) {
      throw new Error('User not found')
    }

    res.status(200).json({ message: 'user is reternd', payload: user })
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      const error = createHttpError(400, 'Id foramt is not valid')
      next(error)
    } else {
      next(error)
    }
  }
}

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updatedUserData = req.body
    const userId = req.params.id
    const user = await processUpdateUser(userId, updatedUserData)

    res.status(200).json(user)
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      const error = createHttpError(400, 'ID format is not valid')
      next(error)
    } else {
      next(error)
    }
  }
}

export const banUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await banUserById(req.params.id)

    res.status(200).json({ message: 'User banned successfully' })
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      const error = createHttpError(400, 'Id foramt is not valid')
      next(error)
    } else {
      next(error)
    }
  }
}

export const deleteSingleUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await deletUserById(req.params.id)
    if (user && user.image) {
      await deletImage(user.image)
    }

    res.status(200).json({ message: 'User deleted successfully' })
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      const error = createHttpError(400, 'Id foramt is not valid')
      next(error)
    } else {
      next(error)
    }
  }
}

export const unBanUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await unBanUserById(req.params.id)

    res.status(200).json({ message: 'User unbanned successfully' })
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      const error = createHttpError(400, 'Id foramt is not valid')
      next(error)
    } else {
      next(error)
    }
  }
}

export const updateRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await updateUserRoleById(req.params.id)

    res.status(200).json({ message: 'Updated role successfully' })
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      const error = createHttpError(400, 'Id foramt is not valid')
      next(error)
    } else {
      next(error)
    }
  }
}

export const forgetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body
    const result = await processForgetPassword(email)

    res.status(200).json(result)
  } catch (error) {
    next(error)
  }
}

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token, password } = req.body
    const result = await processResetPassword(token, password)

    res.status(200).json(result)
  } catch (error) {
    next(error)
  }
}
