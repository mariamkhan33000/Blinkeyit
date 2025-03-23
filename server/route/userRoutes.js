import express from 'express'
import { loginController, logoutController, registerUser, updateUserDetails, uploadAvatar, verifyEmailController } from '../controllers/userController.js'
import auth from '../middleware/auth.js'
import upload from '../middleware/multer.js'
const userRouter = express.Router()

userRouter.post('/register', registerUser)
userRouter.post('/login', loginController)
userRouter.post('/logout', auth, logoutController)
userRouter.post('/verify-email',verifyEmailController)
userRouter.put('/upload-avatar', auth, upload.single('avatar'), uploadAvatar)
userRouter.put('/update-user',auth,updateUserDetails)


export default userRouter;