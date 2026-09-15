import Post from '../model/postModel.js'
import mongoose from 'mongoose'

let inMemoryPosts = [
  {
    _id: 'demo-post-1',
    id: 1,
    userId: {
      _id: 'demo-user-1',
      name: 'Rahul Sharma',
      avatar: 'https://i.pravatar.cc/150?img=12',
      title: 'Strength Athlete'
    },
    activity: 'Strength Training',
    time: '2 hours ago',
    createdAt: new Date(Date.now() - 7200000),
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1200&auto=format&fit=crop',
    content: '🔥 Day 15 completed! Feeling stronger every day. Never give up! 💪',
    caption: '🔥 Day 15 completed! Feeling stronger every day. Never give up! 💪',
    likesCount: 245,
    sharesCount: 18,
    likes: [],
    isLiked: false,
    comments: [
      {
        _id: 'comment-1',
        id: 1,
        userId: {
          name: 'Aman',
          avatar: 'https://i.pravatar.cc/150?img=13'
        },
        text: 'Great work bro! 🔥'
      },
      {
        _id: 'comment-2',
        id: 2,
        userId: {
          name: 'Priya',
          avatar: 'https://i.pravatar.cc/150?img=47'
        },
        text: 'Keep going! 💪'
      }
    ]
  },
  {
    _id: 'demo-post-2',
    id: 2,
    userId: {
      _id: 'demo-user-2',
      name: 'Priya Das',
      avatar: 'https://i.pravatar.cc/150?img=47',
      title: 'Marathon Runner'
    },
    activity: 'Running',
    time: '4 hours ago',
    createdAt: new Date(Date.now() - 14400000),
    image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=1200&auto=format&fit=crop',
    content: 'Completed my first 5KM run today! 🏃‍♀️🎉 Small progress every day leads to big results.',
    caption: 'Completed my first 5KM run today! 🏃‍♀️🎉 Small progress every day leads to big results.',
    likesCount: 182,
    sharesCount: 14,
    likes: [],
    isLiked: false,
    comments: [
      {
        _id: 'comment-3',
        id: 1,
        userId: {
          name: 'Sneha',
          avatar: 'https://i.pravatar.cc/150?img=45'
        },
        text: 'Amazing! Congratulations 🎉'
      }
    ]
  },
  {
    _id: 'demo-post-3',
    id: 3,
    userId: {
      _id: 'demo-user-3',
      name: 'Aman Singh',
      avatar: 'https://i.pravatar.cc/150?img=13',
      title: 'CrossFit Trainer'
    },
    activity: 'Workout Challenge',
    time: 'Yesterday',
    createdAt: new Date(Date.now() - 86400000),
    image: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?q=80&w=1200&auto=format&fit=crop',
    content: 'Day 7 of the 30-day fitness challenge completed! 🔥 Who is joining me?',
    caption: 'Day 7 of the 30-day fitness challenge completed! 🔥 Who is joining me?',
    likesCount: 320,
    sharesCount: 29,
    likes: [],
    isLiked: false,
    comments: []
  }
]

export const getAllPosts = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const posts = await Post.find()
        .sort({ createdAt: -1 })
        .populate('userId', 'name avatar title')
        .populate('comments.userId', 'name avatar')
        .lean()

      if (posts.length > 0) {
        const currentUserId = req.user?._id?.toString()
        const formattedPosts = posts.map(post => ({
          ...post,
          likesCount: post.likes?.length || 0,
          sharesCount: post.sharesCount || 0,
          isLiked: currentUserId ? post.likes?.some(id => id.toString() === currentUserId) : false
        }))
        return res.status(200).json(formattedPosts)
      }
    }

    // Fallback if DB is disconnected or empty
    const currentUserId = req.user?._id?.toString()
    const fallback = inMemoryPosts.map(post => ({
      ...post,
      sharesCount: post.sharesCount || 0,
      isLiked: currentUserId ? post.likes?.some(id => id.toString() === currentUserId) : false
    }))
    res.status(200).json(fallback)
  } catch (error) {
    res.status(200).json(inMemoryPosts)
  }
}

export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('userId', 'name avatar title')
      .populate('comments.userId', 'name avatar')
      .lean()

    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }

    const currentUserId = req.user?._id?.toString()
    res.status(200).json({
      ...post,
      likesCount: post.likes?.length || 0,
      sharesCount: post.sharesCount || 0,
      isLiked: currentUserId ? post.likes?.some(id => id.toString() === currentUserId) : false
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

export const createPost = async (req, res) => {
  try {
    const content = req.body.content || req.body.caption
    const { image, activity } = req.body
    const user = req.user

    if (!content || !content.trim()) {
      return res.status(400).json({ message: 'Post content or caption is required' })
    }

    if (mongoose.connection.readyState === 1) {
      const newPost = await Post.create({
        userId: user._id,
        content: content.trim(),
        image: image || '',
        activity: activity || 'Fitness Journey'
      })

      const populatedPost = await Post.findById(newPost._id)
        .populate('userId', 'name avatar title')
        .lean()

      return res.status(201).json({
        ...populatedPost,
        likesCount: 0,
        sharesCount: 0,
        isLiked: false
      })
    }

    // Offline in-memory fallback
    const localPost = {
      _id: 'post-' + Date.now(),
      id: Date.now(),
      userId: {
        _id: user._id,
        name: user.name || 'Athlete',
        avatar: user.avatar || '/default-avatar.png',
        title: user.title || 'Fitness Enthusiast'
      },
      content: content.trim(),
      caption: content.trim(),
      image: image || '',
      activity: activity || 'Fitness Journey',
      likes: [],
      likesCount: 0,
      sharesCount: 0,
      isLiked: false,
      comments: [],
      createdAt: new Date()
    }
    inMemoryPosts.unshift(localPost)
    res.status(201).json(localPost)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

export const toggleLikePost = async (req, res) => {
  try {
    const userIdStr = req.user._id.toString()

    if (mongoose.connection.readyState === 1) {
      const post = await Post.findById(req.params.id)
      if (post) {
        const alreadyLikedIndex = post.likes.findIndex(id => id.toString() === userIdStr)
        let isLiked = false
        if (alreadyLikedIndex > -1) {
          post.likes.splice(alreadyLikedIndex, 1)
          isLiked = false
        } else {
          post.likes.push(req.user._id)
          isLiked = true
        }

        await post.save()

        return res.status(200).json({
          message: isLiked ? 'Post liked' : 'Post unliked',
          likesCount: post.likes.length,
          isLiked,
          likes: post.likes
        })
      }
    }

    // In-memory fallback
    const memPost = inMemoryPosts.find(p => p._id === req.params.id || p.id == req.params.id)
    if (!memPost) {
      return res.status(404).json({ message: 'Post not found' })
    }

    const memLikedIdx = memPost.likes.findIndex(id => id.toString() === userIdStr)
    let isLiked = false
    if (memLikedIdx > -1) {
      memPost.likes.splice(memLikedIdx, 1)
      memPost.likesCount = Math.max(0, memPost.likesCount - 1)
      isLiked = false
    } else {
      memPost.likes.push(req.user._id)
      memPost.likesCount = (memPost.likesCount || 0) + 1
      isLiked = true
    }
    memPost.isLiked = isLiked

    res.status(200).json({
      message: isLiked ? 'Post liked' : 'Post unliked',
      likesCount: memPost.likesCount,
      isLiked,
      likes: memPost.likes
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

export const addComment = async (req, res) => {
  try {
    const { text } = req.body
    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'Comment text is required' })
    }

    if (mongoose.connection.readyState === 1) {
      const post = await Post.findById(req.params.id)
      if (post) {
        const comment = {
          userId: req.user._id,
          text: text.trim(),
          createdAt: new Date()
        }

        post.comments.push(comment)
        await post.save()

        const updatedPost = await Post.findById(req.params.id)
          .populate('comments.userId', 'name avatar')
          .lean()

        const newComment = updatedPost.comments[updatedPost.comments.length - 1]

        return res.status(201).json({
          message: 'Comment added successfully',
          comment: newComment,
          comments: updatedPost.comments
        })
      }
    }

    // In-memory fallback
    const memPost = inMemoryPosts.find(p => p._id === req.params.id || p.id == req.params.id)
    if (!memPost) {
      return res.status(404).json({ message: 'Post not found' })
    }

    const newComment = {
      _id: 'comment-' + Date.now(),
      id: Date.now(),
      userId: {
        _id: req.user._id,
        name: req.user.name || 'Athlete',
        avatar: req.user.avatar || '/default-avatar.png'
      },
      text: text.trim(),
      createdAt: new Date()
    }
    memPost.comments.push(newComment)

    res.status(201).json({
      message: 'Comment added successfully',
      comment: newComment,
      comments: memPost.comments
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

export const deleteComment = async (req, res) => {
  try {
    const { id, commentId } = req.params
    const post = await Post.findById(id)
    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }

    const comment = post.comments.id(commentId)
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' })
    }

    const userIdStr = req.user._id.toString()
    const isCommentAuthor = comment.userId.toString() === userIdStr
    const isPostAuthor = post.userId.toString() === userIdStr

    if (!isCommentAuthor && !isPostAuthor) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' })
    }

    comment.deleteOne()
    await post.save()

    res.status(200).json({
      message: 'Comment deleted successfully',
      comments: post.comments
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

export const sharePost = async (req, res) => {
  try {
    const { id } = req.params

    if (mongoose.connection.readyState === 1) {
      const post = await Post.findById(id)
      if (post) {
        post.sharesCount = (post.sharesCount || 0) + 1
        await post.save()
        return res.status(200).json({
          message: 'Post shared successfully',
          sharesCount: post.sharesCount,
          id: post._id
        })
      }
    }

    // In-memory fallback
    const memPost = inMemoryPosts.find(p => p._id === id || String(p.id) === String(id))
    if (!memPost) {
      return res.status(404).json({ message: 'Post not found' })
    }

    memPost.sharesCount = (memPost.sharesCount || 0) + 1
    res.status(200).json({
      message: 'Post shared successfully',
      sharesCount: memPost.sharesCount,
      id: memPost._id || memPost.id
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

export const deletePost = async (req, res) => {
  try {
    const { id } = req.params

    if (mongoose.connection.readyState === 1) {
      const post = await Post.findById(id)
      if (post) {
        if (post.userId.toString() !== req.user._id.toString()) {
          return res.status(403).json({ message: 'Not authorized to delete this post' })
        }

        await post.deleteOne()
        return res.status(200).json({ message: 'Post deleted successfully', postId: id })
      }
    }

    // In-memory fallback
    const index = inMemoryPosts.findIndex(p => p._id === id || String(p.id) === String(id))
    if (index === -1) {
      return res.status(404).json({ message: 'Post not found' })
    }

    const memPost = inMemoryPosts[index]
    const authorId = memPost.userId?._id ? String(memPost.userId._id) : String(memPost.userId)
    if (authorId && authorId !== String(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized to delete this post' })
    }

    inMemoryPosts.splice(index, 1)
    res.status(200).json({ message: 'Post deleted successfully', postId: id })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}