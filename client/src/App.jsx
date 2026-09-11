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

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }


  return (
    <>

      {/* NAVBAR */}
      <Navbar toggleSidebar={toggleSidebar} />


      {/* SIDEBAR */}
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

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/workouts"
            element={<MyWorkouts />}
          />

          <Route
            path="/leaderboard"
            element={<Leaderboard />}
          />


          {/* ACCOUNT */}

          <Route
            path="/profile"
            element={<Profile />}
          />


          {/* AUTH */}

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/signup"
            element={<Signup />}
          />

        </Routes>

      </main>

    </>
  )
}


export default App