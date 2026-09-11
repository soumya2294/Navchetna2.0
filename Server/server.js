import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/authRoutes.js'
import passport from 'passport'
import './config/passport.js'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())
app.use(passport.initialize())

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/navchetna')
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.log('Database connection error:', err))

app.use('/api/auth', authRoutes)

app.get('/', (req, res) => {
  res.send('Navchetna 2.0 API is running...')
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))