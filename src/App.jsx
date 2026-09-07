import { Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import Navbar from './components/navbar'
import Sidebar from './components/Sidebar'
import Home from './pages/Home'
import Login from './pages/login'
import Signup from './pages/Signup'
import Profile from './pages/Profile'

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)

  return (
    <>
      <Navbar toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} closeSidebar={() => setIsSidebarOpen(false)} />
      
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
    </>
  )
}

export default App