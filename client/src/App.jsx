import { Routes, Route, useLocation } from 'react-router-dom'
import { useState } from 'react'
import AIWorkoutCoach from './components/AIWorkoutCoach';
import FloatingAICoach from './components/FloatingAICoach';

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
  const location = useLocation()

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  // Active training routes where the AI Coach should float
  const trainingRoutes = ['/dashboard', '/workouts', '/leaderboard', '/ai-coach', '/training', '/training-zone']
  const isTrainingZone = trainingRoutes.some(route => location.pathname === route || location.pathname.startsWith(route + '/'))

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
            path="/training"
            element={<Dashboard />}
          />

          <Route
            path="/training-zone"
            element={<Dashboard />}
          />

          <Route
            path="/workouts"
            element={<MyWorkouts />}
          />
          <Route
                path="/ai-coach"
                element={<AIWorkoutCoach onExit={() => window.history.back()} />}
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

      {/* FLOATING AI COACH IN TRAINING ZONE */}
      {isTrainingZone && <FloatingAICoach />}

    </>
  )
}


export default App