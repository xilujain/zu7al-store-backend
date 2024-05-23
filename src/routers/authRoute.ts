import { Router } from 'express'

import { login, logout } from '../controllers/AuthController'

import { isLoggedOut } from '../middlewares/isLoggedin'

const router = Router()

router.post('/login', isLoggedOut, login)
router.post('/logout', logout)

export default router
