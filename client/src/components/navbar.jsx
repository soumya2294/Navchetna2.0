import { Link, useLocation } from 'react-router-dom'
import { FiBell, FiMenu, FiX, FiChevronDown } from 'react-icons/fi'
import { useState } from 'react'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
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
        <Link to="/" className="brand-logo" onClick={closeMenu}>
          <span className="brand-text">NAVCHETNA <span className="brand-accent">2.0</span></span>
        </Link>

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