import { Link, useLocation } from 'react-router-dom'
import { FiBell, FiMenu, FiX, FiChevronDown, FiCheck } from 'react-icons/fi'
import { FaFire } from 'react-icons/fa'
import { useState } from 'react'

const Navbar = ({ toggleSidebar }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isStreakOpen, setIsStreakOpen] = useState(false)
  const location = useLocation()

  const items = [
    { label: "Community Feed", href: "/" },
    { label: "Training Zone", href: "/dashboard" }
  ]

  const toggleMenu = () => setIsOpen(!isOpen)
  const closeMenu = () => setIsOpen(false)

  return (
    <header className="fitness-navbar">
      <div className="nav-container">
        
        <div className="brand-group">
          <button className="sidebar-trigger" onClick={toggleSidebar}>
            <FiMenu size={24} />
          </button>
          <Link to="/" className="brand-logo" onClick={closeMenu}>
            <span className="brand-text">NAVCHETNA <span className="brand-accent">2.0</span></span>
          </Link>
        </div>

        <nav className={`nav-menu ${isOpen ? 'active' : ''}`}>
          {items.map(item => (
            <Link 
              key={item.href} 
              to={item.href} 
              className={`nav-link ${location.pathname === item.href ? 'active-link' : ''}`}
              onClick={closeMenu}
            >
              {item.label}
            </Link>
          ))}
          
          <div className="mobile-auth">
            <Link to="/login" className="login-link" onClick={closeMenu}>Login</Link>
            <Link to="/signup" className="signup-btn" onClick={closeMenu}>Sign Up</Link>
          </div>
        </nav>

        <div className="header-actions">
          <Link to="/login" className="login-link desktop-only">Login</Link>
          <Link to="/signup" className="signup-btn desktop-only">Sign Up</Link>

          <div className="divider desktop-only"></div>

          <div className="streak-container">
            <div className="streak-indicator" onClick={() => setIsStreakOpen(!isStreakOpen)}>
              <div className="streak-icon-wrapper">
                <FaFire className="streak-icon" />
              </div>
              <span className="streak-count">12</span>
            </div>

            {isStreakOpen && (
              <div className="streak-popup">
                <button className="close-popup" onClick={() => setIsStreakOpen(false)}>
                  <FiX />
                </button>
                
                <div className="streak-popup-header">
                  <FaFire className="streak-popup-icon" />
                  <h3>12 Day Streak</h3>
                </div>
                <p className="streak-subtext">Check in to keep your streak alive</p>

                <div className="streak-days">
                  {['M', 'T', 'W', 'T', 'F'].map((day, i) => (
                    <div key={i} className="streak-day completed">
                      <span className="day-label">{day}</span>
                      <div className="day-circle"><FiCheck size={16} /></div>
                    </div>
                  ))}
                  <div className="streak-day today">
                    <span className="day-label">S</span>
                    <div className="day-circle">6</div>
                  </div>
                  <div className="streak-day future">
                    <span className="day-label">S</span>
                    <div className="day-circle">7</div>
                  </div>
                </div>

                <div className="streak-milestone">
                  <p className="milestone-label">Next milestone</p>
                  <h4>14 days</h4>
                  <p className="milestone-remaining">2 days to go</p>
                </div>

                <button className="check-in-btn">Check In Today</button>
              </div>
            )}
          </div>

          <div className="notification-wrapper">
            <FiBell className="icon-btn" />
            <span className="notification-badge">2</span>
          </div>
          
          <div className="profile-menu">
            <img src="https://i.pravatar.cc/150?img=11" alt="User" className="avatar" />
            <FiChevronDown className="dropdown-icon" />
          </div>
        </div>

        <button className="mobile-menu-btn" onClick={toggleMenu}>
          {isOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>
    </header>
  )
}

export default Navbar