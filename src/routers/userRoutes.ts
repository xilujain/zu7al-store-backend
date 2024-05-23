import { Router } from 'express'
import { uploadImageUser } from '../middlewares/uploadImage'
import { isAdmin, isLoggedOut, isLoggedin } from '../middlewares/isLoggedin'
import { UserInfoValidation } from '../middlewares/validation'
import { runValidation } from '../middlewares'
import { activateUser, banUser, deleteSingleUser, findUserByid, forgetPassword, getAllUsers, registerUser, resetPassword, unBanUser, updateRole, updateUser } from '../controllers/UserController'

const router = Router()

router.post('/process-register', uploadImageUser.single('image'), isLoggedOut, UserInfoValidation, runValidation, registerUser)
router.post('/activate', isLoggedOut, activateUser)
router.post('/forget-password', isLoggedOut, forgetPassword)

router.get('/:id', isLoggedin, findUserByid)
router.get('/', isLoggedin, isAdmin, getAllUsers)

router.put('/update/:id', updateUser)
router.put('/reset-password', isLoggedOut, resetPassword)

router.patch('/:id/ban', isLoggedin, isAdmin, banUser)
router.patch('/:id/unban', isLoggedin, isAdmin, unBanUser)
router.patch('/:id/role', isLoggedin, isAdmin, updateRole)

router.delete('/:id', isLoggedin, isAdmin, deleteSingleUser)

export default router
