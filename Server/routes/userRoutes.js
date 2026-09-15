import express from 'express'
import {
  getUserProfile,
  updateUserProfile,
  getUserById
} from '../controllers/userController.js'
import { protect } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.get('/profile', protect, getUserProfile)
router.put('/profile', protect, updateUserProfile)
router.get('/:id', getUserById)

export default router
