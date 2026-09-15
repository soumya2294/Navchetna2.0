import User from '../model/userModel.js'
import mongoose from 'mongoose'
import { inMemoryUsers } from '../config/inMemoryStore.js'

export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user?._id

    if (!userId) {
      return res.status(401).json({ message: 'User not authorized' })
    }

    if (mongoose.connection.readyState === 1) {
      const user = await User.findById(userId).select('-password')
      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }
      return res.status(200).json(user)
    }

    const localUser = inMemoryUsers.find(u => u._id.toString() === userId.toString())
    if (!localUser) {
      return res.status(404).json({ message: 'User not found' })
    }

    const { password, ...safeUser } = localUser
    return res.status(200).json(safeUser)
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return res.status(500).json({ message: 'Failed to fetch profile', error: error.message })
  }
}

export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user?._id

    if (!userId) {
      return res.status(401).json({ message: 'User not authorized' })
    }

    const {
      name,
      title,
      location,
      age,
      gender,
      avatar,
      disciplines,
      workouts,
      activeDays,
      streak
    } = req.body

    if (mongoose.connection.readyState === 1) {
      const user = await User.findById(userId)
      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }

      if (name !== undefined) user.name = name.trim()
      if (title !== undefined) user.title = title.trim()
      if (location !== undefined) user.location = location.trim()
      if (age !== undefined) user.age = age ? Number(age) : undefined
      if (gender !== undefined) user.gender = gender
      if (avatar !== undefined) user.avatar = avatar
      if (disciplines !== undefined) user.disciplines = Array.isArray(disciplines) ? disciplines : []
      if (workouts !== undefined) user.workouts = Number(workouts) || 0
      if (activeDays !== undefined) user.activeDays = Number(activeDays) || 0
      if (streak !== undefined) user.streak = Number(streak) || 0

      await user.save()

      const updatedSafeUser = await User.findById(userId).select('-password')
      return res.status(200).json(updatedSafeUser)
    }

    const localIndex = inMemoryUsers.findIndex(u => u._id.toString() === userId.toString())
    if (localIndex === -1) {
      return res.status(404).json({ message: 'User not found' })
    }

    const current = inMemoryUsers[localIndex]
    const updated = {
      ...current,
      name: name !== undefined ? name.trim() : current.name,
      title: title !== undefined ? title.trim() : current.title,
      location: location !== undefined ? location.trim() : current.location,
      age: age !== undefined ? (age ? Number(age) : undefined) : current.age,
      gender: gender !== undefined ? gender : current.gender,
      avatar: avatar !== undefined ? avatar : current.avatar,
      disciplines: disciplines !== undefined ? (Array.isArray(disciplines) ? disciplines : []) : current.disciplines,
      workouts: workouts !== undefined ? Number(workouts) || 0 : current.workouts,
      activeDays: activeDays !== undefined ? Number(activeDays) || 0 : current.activeDays,
      streak: streak !== undefined ? Number(streak) || 0 : current.streak
    }

    inMemoryUsers[localIndex] = updated
    const { password, ...safeLocalUser } = updated
    return res.status(200).json(safeLocalUser)
  } catch (error) {
    console.error('Error updating user profile:', error)
    return res.status(500).json({ message: 'Failed to update profile', error: error.message })
  }
}

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params

    if (mongoose.connection.readyState === 1) {
      const user = await User.findById(id).select('-password')
      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }
      return res.status(200).json(user)
    }

    const localUser = inMemoryUsers.find(u => u._id.toString() === id.toString())
    if (!localUser) {
      return res.status(404).json({ message: 'User not found' })
    }

    const { password, ...safeUser } = localUser
    return res.status(200).json(safeUser)
  } catch (error) {
    console.error('Error fetching user by ID:', error)
    return res.status(500).json({ message: 'Failed to fetch user', error: error.message })
  }
}
