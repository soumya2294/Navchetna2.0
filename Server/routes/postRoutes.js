import express from 'express'
import { createPost, getAllPosts } from '../controllers/postController.js'
import protect from '../middlewares/authMiddleware.js'

const router = express.Router()

router.post('/', protect, createPost)
router.get('/', protect, getAllPosts)

export default router