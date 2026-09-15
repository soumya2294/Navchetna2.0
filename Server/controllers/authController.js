import User from '../model/userModel.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import { inMemoryUsers } from '../config/inMemoryStore.js'

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!email || !password || !name) {
      return res.status(400).json({ message: 'Name, email, and password are required' })
    }

    if (mongoose.connection.readyState === 1) {
      const existingUser = await User.findOne({ email })
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' })
      }

      const hashedPassword = await bcrypt.hash(password, 10)
      const newUser = new User({
        name,
        email,
        password: hashedPassword
      })

      await newUser.save()

      const token = jwt.sign(
        { id: newUser._id, name: newUser.name, email: newUser.email },
        process.env.JWT_SECRET || 'secret123',
        { expiresIn: '7d' }
      )

      return res.status(201).json({ user: newUser, token })
    }

    // In-memory fallback
    const existing = inMemoryUsers.find(u => u.email.toLowerCase() === email.toLowerCase())
    if (existing) {
      return res.status(400).json({ message: 'User already exists' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const mockUser = {
      _id: 'user-' + Date.now(),
      name,
      email,
      password: hashedPassword,
      avatar: '/default-avatar.png',
      title: ''
    }
    inMemoryUsers.push(mockUser)

    const token = jwt.sign(
      { id: mockUser._id, name: mockUser.name, email: mockUser.email },
      process.env.JWT_SECRET || 'secret123',
      { expiresIn: '7d' }
    )

    res.status(201).json({ user: mockUser, token })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' })
    }

    if (mongoose.connection.readyState === 1) {
      const user = await User.findOne({ email })
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' })
      }

      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' })
      }

      const token = jwt.sign(
        { id: user._id, name: user.name, email: user.email },
        process.env.JWT_SECRET || 'secret123',
        { expiresIn: '7d' }
      )

      return res.status(200).json({ user, token })
    }

    // In-memory fallback
    const user = inMemoryUsers.find(u => u.email.toLowerCase() === email.toLowerCase())
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }

    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email },
      process.env.JWT_SECRET || 'secret123',
      { expiresIn: '7d' }
    )

    res.status(200).json({ user, token })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}