import express from 'express'
import { uploadMedia } from '../controllers/uploadController.js'
import { optionalAuth } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.post('/', optionalAuth, uploadMedia)

export default router
