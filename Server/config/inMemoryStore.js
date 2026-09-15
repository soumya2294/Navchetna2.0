import bcrypt from 'bcrypt'

const demoPassword = await bcrypt.hash('password123', 10)

export const inMemoryUsers = [
  {
    _id: '64a1b2c3d4e5f6a7b8c9d0e1',
    name: 'Athlete One',
    email: 'athlete@example.com',
    password: demoPassword,
    avatar: '/default-avatar.png',
    title: ''
  }
]
