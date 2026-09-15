import Story from '../model/storyModel.js'

const defaultStories = [
  {
    username: 'Your Story',
    avatar: '/default-avatar.png',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1200&auto=format&fit=crop',
    caption: "Ready to crush today's workout! 💪🔥",
    isUser: true
  },
  {
    username: 'Rahul',
    avatar: 'https://i.pravatar.cc/150?img=12',
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1200&auto=format&fit=crop',
    caption: 'Chest day completed! 🔥'
  },
  {
    username: 'Priya',
    avatar: 'https://i.pravatar.cc/150?img=47',
    image: 'https://images.unsplash.com/photo-1483721310020-03333e577078?q=80&w=1200&auto=format&fit=crop',
    caption: 'Morning run done! 🏃‍♀️'
  },
  {
    username: 'Aman',
    avatar: 'https://i.pravatar.cc/150?img=13',
    image: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?q=80&w=1200&auto=format&fit=crop',
    caption: 'Leg day never skips! 🦵💪'
  },
  {
    username: 'Sneha',
    avatar: 'https://i.pravatar.cc/150?img=45',
    image: 'https://images.unsplash.com/photo-1545389336-cf090694435e?q=80&w=1200&auto=format&fit=crop',
    caption: 'Peace. Balance. Strength. 🧘‍♀️'
  },
  {
    username: 'Arjun',
    avatar: 'https://i.pravatar.cc/150?img=14',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1200&auto=format&fit=crop',
    caption: 'Consistency is the key! 🔥'
  }
]

import mongoose from 'mongoose'

let inMemoryStories = [...defaultStories.map((s, idx) => ({ ...s, id: idx + 1, _id: 'story-' + (idx + 1) }))]

export const getAllStories = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const stories = await Story.find({
        expiresAt: { $gt: new Date() }
      }).sort({ createdAt: -1 }).lean()

      if (stories.length > 0) {
        return res.status(200).json(stories.map(s => ({ ...s, id: s._id })))
      }
    }

    res.status(200).json(inMemoryStories)
  } catch (error) {
    res.status(200).json(inMemoryStories)
  }
}

export const createStory = async (req, res) => {
  try {
    const { image, caption } = req.body
    if (!image) {
      return res.status(400).json({ message: 'Image URL is required for a story' })
    }

    if (mongoose.connection.readyState === 1) {
      const newStory = await Story.create({
        userId: req.user._id,
        username: req.user.name || 'Athlete',
        avatar: req.user.avatar || '/default-avatar.png',
        image,
        caption: caption || '',
        isUser: true,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
      })

      return res.status(201).json({ ...newStory.toObject(), id: newStory._id })
    }

    // In-memory fallback
    const mockStory = {
      id: 'story-' + Date.now(),
      _id: 'story-' + Date.now(),
      userId: req.user._id,
      username: req.user.name || 'Athlete',
      avatar: req.user.avatar || '/default-avatar.png',
      image,
      caption: caption || '',
      isUser: true,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
    }
    inMemoryStories.unshift(mockStory)

    res.status(201).json(mockStory)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

export const deleteStory = async (req, res) => {
  try {
    const { id } = req.params

    if (mongoose.connection.readyState === 1) {
      const story = await Story.findById(id)
      if (story) {
        if (story.userId && story.userId.toString() !== req.user._id.toString()) {
          return res.status(403).json({ message: 'Not authorized to delete this story' })
        }
        await story.deleteOne()
        return res.status(200).json({ message: 'Story deleted successfully', storyId: id })
      }
    }

    // In-memory fallback
    const index = inMemoryStories.findIndex(s => s._id === id || String(s.id) === String(id))
    if (index === -1) {
      return res.status(404).json({ message: 'Story not found' })
    }

    const memStory = inMemoryStories[index]
    if (memStory.userId && String(memStory.userId) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized to delete this story' })
    }

    inMemoryStories.splice(index, 1)
    res.status(200).json({ message: 'Story deleted successfully', storyId: id })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

