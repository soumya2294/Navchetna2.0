import express from 'express'
import {
  getAllPosts,
  getPostById,
  createPost,
  toggleLikePost,
  addComment,
  deleteComment,
  deletePost,
  sharePost
} from '../controllers/postController.js'
import { protect, optionalAuth } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.get('/', optionalAuth, getAllPosts)
router.get('/:id', optionalAuth, getPostById)
router.post('/', protect, createPost)
router.put('/:id/like', protect, toggleLikePost)
router.put('/:id/share', optionalAuth, sharePost)
router.post('/:id/comment', protect, addComment)
router.delete('/:id/comment/:commentId', protect, deleteComment)
router.delete('/:id', protect, deletePost)

export default router