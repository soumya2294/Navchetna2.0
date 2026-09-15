import mongoose from 'mongoose'

const storySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false
    },
    username: {
      type: String,
      required: true
    },
    avatar: {
      type: String,
      default: 'https://i.pravatar.cc/150?img=11'
    },
    image: {
      type: String,
      required: true
    },
    caption: {
      type: String,
      default: ''
    },
    isUser: {
      type: Boolean,
      default: false
    },
    expiresAt: {
      type: Date,
      default: () => new Date(+new Date() + 24 * 60 * 60 * 1000)
    }
  },
  { timestamps: true }
)

const Story = mongoose.model('Story', storySchema)

export default Story
