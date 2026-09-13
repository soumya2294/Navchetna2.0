import { Routes, Route } from 'react-router-dom'
import { useState } from 'react'

import Navbar from './components/navbar'
import Sidebar from './components/Sidebar'

import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import MyWorkouts from './pages/MyWorkouts'
import Leaderboard from './pages/Leaderboard'

import Login from './pages/login'
import Signup from './pages/Signup'
import Profile from './pages/Profile'


function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // FIX: Removed duplicate declaration of this function
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <>
      {/* NAVBAR */}
      <Navbar toggleSidebar={toggleSidebar} />

      {/* SIDEBAR */}
      {/* FIX: Removed the duplicate Sidebar component that was here */}
      <Sidebar
        isOpen={isSidebarOpen}
        closeSidebar={() => setIsSidebarOpen(false)}
      />

      {/* MAIN CONTENT */}
      <main className="main-content">
        <Routes>

          {/* COMMUNITY FEED */}
          <Route path="/" element={<Home />} />

          {/* TRAINING ZONE */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/workouts" element={<MyWorkouts />} />
          <Route path="/leaderboard" element={<Leaderboard />} />

          {/* ACCOUNT & AUTH */}
          {/* FIX: Removed the duplicate routes for profile, login, and signup */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

        </Routes>
      </main>
    </>
  )
}

export default App