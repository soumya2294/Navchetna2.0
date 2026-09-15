import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import authRoutes from './routes/authRoutes.js'
import passport from 'passport'
import './config/passport.js'
import postRoutes from './routes/postRoutes.js'
import storyRoutes from './routes/storyRoutes.js'
import userRoutes from './routes/userRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'
import aiRoutes from './routes/aiRoutes.js'
import { seedInitialCommunityData } from './config/seedData.js'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

const allowedOrigins = process.env.CLIENT_URL
  ? [process.env.CLIENT_URL, 'http://localhost:5173', 'http://127.0.0.1:5173']
  : ['http://localhost:5173', 'http://127.0.0.1:5173', '*']

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, server-to-server)
    if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
      return callback(null, true)
    }
    return callback(null, true) // Permissive for production deployment
  },
  credentials: true
}))

app.use(express.json({ limit: '25mb' }))
app.use(express.urlencoded({ extended: true, limit: '25mb' }))
app.use(passport.initialize())

// Serve uploaded media files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

process.on('unhandledRejection', (reason) => {
  console.warn('Unhandled Rejection:', reason?.message || reason)
})

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err?.message || err)
})

mongoose.set('bufferCommands', false)

mongoose.connection.on('error', (err) => {
  console.log('MongoDB connection error:', err.message)
})

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/navchetna', {
  serverSelectionTimeoutMS: 5000
})
  .then(() => {
    console.log('MongoDB connected successfully')
    seedInitialCommunityData()
  })
  .catch((err) => console.log('Database initial connection failed:', err.message))

app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/posts', postRoutes)
app.use('/api/stories', storyRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/ai', aiRoutes)

app.get('/', (req, res) => {
  res.send('Navchetna 2.0 API is running...')
})

// Global Express error handler to prevent crashing on unhandled route errors
app.use((err, req, res, next) => {
  console.error('Express route error:', err.message)
  if (!res.headersSent) {
    res.status(500).json({ error: err.message || 'Internal Server Error' })
  }
})

// Keep Node event loop continuously active
const keepAliveTimer = setInterval(() => {}, 1000 * 60 * 60)

const PORT = process.env.PORT || 5000
const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Please free port ${PORT} or configure a different PORT.`)
  } else {
    console.error('Server HTTP error:', err.message)
  }
})