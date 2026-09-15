import User from '../model/userModel.js'
import Post from '../model/postModel.js'
import bcrypt from 'bcrypt'

export const seedInitialCommunityData = async () => {
  try {
    const postCount = await Post.countDocuments()
    if (postCount > 0) {
      return
    }

    console.log('Seeding initial community data...')

    // Create or find demo users
    const demoPassword = await bcrypt.hash('password123', 10)

    const usersData = [
      {
        name: 'Rahul Sharma',
        email: 'rahul@example.com',
        password: demoPassword,
        avatar: 'https://i.pravatar.cc/150?img=12',
        title: 'Strength Athlete'
      },
      {
        name: 'Priya Das',
        email: 'priya@example.com',
        password: demoPassword,
        avatar: 'https://i.pravatar.cc/150?img=47',
        title: 'Marathon Runner'
      },
      {
        name: 'Aman Singh',
        email: 'aman@example.com',
        password: demoPassword,
        avatar: 'https://i.pravatar.cc/150?img=13',
        title: 'CrossFit Trainer'
      }
    ]

    const users = []
    for (const u of usersData) {
      let user = await User.findOne({ email: u.email })
      if (!user) {
        user = await User.create(u)
      }
      users.push(user)
    }

    const postsData = [
      {
        userId: users[0]._id,
        content: '🔥 Day 15 completed! Feeling stronger every day. Never give up! 💪',
        image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1200&auto=format&fit=crop',
        activity: 'Strength Training',
        likes: [users[1]._id, users[2]._id],
        comments: [
          {
            userId: users[2]._id,
            text: 'Great work bro! 🔥',
            createdAt: new Date(Date.now() - 3600000)
          },
          {
            userId: users[1]._id,
            text: 'Keep going! 💪',
            createdAt: new Date(Date.now() - 1800000)
          }
        ]
      },
      {
        userId: users[1]._id,
        content: 'Completed my first 5KM run today! 🏃‍♀️🎉 Small progress every day leads to big results.',
        image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=1200&auto=format&fit=crop',
        activity: 'Running',
        likes: [users[0]._id],
        comments: [
          {
            userId: users[0]._id,
            text: 'Amazing! Congratulations 🎉',
            createdAt: new Date(Date.now() - 7200000)
          }
        ]
      },
      {
        userId: users[2]._id,
        content: 'Day 7 of the 30-day fitness challenge completed! 🔥 Who is joining me?',
        image: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?q=80&w=1200&auto=format&fit=crop',
        activity: 'Workout Challenge',
        likes: [users[0]._id, users[1]._id],
        comments: []
      }
    ]

    await Post.insertMany(postsData)
    console.log('Initial community data seeded successfully!')
  } catch (error) {
    console.warn('Community seeding notice:', error.message)
  }
}
