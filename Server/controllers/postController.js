import Post from '../model/postModel.js'

export const createPost = async (req, res) => {
  try {
    const { content, image } = req.body
    const userId = req.user.id

    if (!content) {
      return res.status(400).json({ message: 'Content is required' })
    }

    const newPost = await Post.create({
      userId,
      content,
      image
    })

    const populatedPost = await Post.findById(newPost._id).populate('userId', 'name avatar')

    res.status(201).json(populatedPost)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate('userId', 'name avatar')
      .populate('comments.userId', 'name avatar')

    res.status(200).json(posts)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}