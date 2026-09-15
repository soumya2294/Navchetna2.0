import jwt from 'jsonwebtoken'
import User from '../model/userModel.js'
import mongoose from 'mongoose'
import { inMemoryUsers } from '../config/inMemoryStore.js'

const resolveUser = async (userId) => {
  if (mongoose.connection.readyState === 1) {
    return await User.findById(userId).select('-password')
  }
  return inMemoryUsers.find(u => u._id.toString() === userId.toString()) || null
}

export const protect = async (req, res, next) => {
  let token

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1]
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123')

      req.user = await resolveUser(decoded.id)

      if (!req.user) {
        return res.status(401).json({ message: 'User not found' })
      }

      return next()
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' })
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' })
  }
}

export const optionalAuth = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      const token = req.headers.authorization.split(' ')[1]
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123')
      req.user = await resolveUser(decoded.id)
    } catch {
      req.user = null
    }
  }

  next()
}

export default protect