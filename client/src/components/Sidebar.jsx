import { Link, useLocation } from 'react-router-dom'
import { 
  FiActivity, FiTarget, FiUser, FiSettings, 
  FiChevronDown, FiCloud, FiX 
} from 'react-icons/fi'
import { useState } from 'react'

const Sidebar = ({ isOpen, closeSidebar }) => {
  const location = useLocation()
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isTrainingOpen, setIsTrainingOpen] = useState(false) // Controls the accordion

  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? 'active' : ''}`} onClick={closeSidebar}></div>
      
      <aside className={`fitness-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <Link to="/" className="brand-logo" onClick={closeSidebar}>
            <span className="brand-text">NAVCHETNA <span className="brand-accent">2.0</span></span>
          </Link>
          <button className="close-sidebar-btn" onClick={closeSidebar}>
            <FiX size={24} />
          </button>
        </div>

        <div className="sidebar-scroll-area">
          <nav className="sidebar-nav">
            <span className="nav-section-title">Main Menu</span>
            
            <Link to="/" className={`sidebar-link ${location.pathname === '/' ? 'active-link' : ''}`} onClick={closeSidebar}>
              <div className="link-content">
                <FiActivity size={18} />
                <span>Community Feed</span>
              </div>
              <span className="nav-badge new">NEW</span>
            </Link>

            {/* Collapsible Nav Group */}
            <div className="nav-group">
              <button 
                className={`sidebar-link nav-group-toggle ${isTrainingOpen ? 'open' : ''}`}
                onClick={() => setIsTrainingOpen(!isTrainingOpen)}
              >
                <div className="link-content">
                  <FiTarget size={18} />
                  <span>Training Zone</span>
                </div>
                <FiChevronDown className={`group-chevron ${isTrainingOpen ? 'rotate' : ''}`} />
              </button>
              
              <div className={`nav-group-items ${isTrainingOpen ? 'expanded' : ''}`}>
                <Link to="/workouts" className="sidebar-sublink" onClick={closeSidebar}>
                  <div className="sublink-left">
                    <span className="bullet"></span> My Workouts
                  </div>
                </Link>
                <Link to="/leaderboard" className="sidebar-sublink" onClick={closeSidebar}>
                  <div className="sublink-left">
                    <span className="bullet"></span> Leaderboard
                  </div>
                  <span className="nav-badge count">3</span>
                </Link>
              </div>
            </div>

            <div className="sidebar-divider"></div>
            <span className="nav-section-title">Account Setup</span>

            <Link to="/profile" className={`sidebar-link ${location.pathname === '/profile' ? 'active-link' : ''}`} onClick={closeSidebar}>
              <div className="link-content">
                <FiUser size={18} />
                <span>Profile</span>
              </div>
            </Link>

            <Link to="/settings" className={`sidebar-link ${location.pathname === '/settings' ? 'active-link' : ''}`} onClick={closeSidebar}>
              <div className="link-content">
                <FiSettings size={18} />
                <span>Settings</span>
              </div>
            </Link>
            
            <div className="sidebar-divider"></div>
            
            <Link to="/download" className="sidebar-link" onClick={closeSidebar}>
              <div className="link-content">
                <FiCloud size={18} />
                <span>Download App</span>
              </div>
            </Link>
          </nav>
        </div>

        <div className="sidebar-footer">
          <div className="profile-dropdown-container">
            <div 
              className="profile-toggle" 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              <img src="https://i.pravatar.cc/150?img=11" alt="User" className="avatar" />
              <div className="profile-info">
                <span className="profile-name">Athlete 01</span>
                <span className="profile-email">athlete@navchetna.com</span>
              </div>
              <FiChevronDown className={`dropdown-icon ${isProfileOpen ? 'rotate' : ''}`} />
            </div>

            {isProfileOpen && (
              <div className="profile-menu-popup">
                <Link to="/profile" className="popup-item"><FiUser size={14} /> Account</Link>
                <Link to="/settings" className="popup-item"><FiSettings size={14}/> Settings</Link>
                <div className="popup-divider"></div>
                <button className="popup-item logout-btn"><FiX size={14}/> Logout</button>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar