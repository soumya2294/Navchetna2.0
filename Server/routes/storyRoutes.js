import express from 'express'
import { getAllStories, createStory, deleteStory } from '../controllers/storyController.js'
import { protect } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.get('/', getAllStories)
router.post('/', protect, createStory)
router.delete('/:id', protect, deleteStory)

export default router
