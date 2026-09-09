import { Link, useLocation } from 'react-router-dom'
import {
  FiActivity,
  FiTarget,
  FiUser,
  FiSettings,
  FiChevronDown,
  FiCloud,
  FiX,
  FiLogOut
} from 'react-icons/fi'

import { useState } from 'react'


const Sidebar = ({ isOpen, closeSidebar }) => {

  const location = useLocation()

  const [isProfileOpen, setIsProfileOpen] = useState(false)

  const trainingRoutes = [
    '/dashboard',
    '/workouts',
    '/leaderboard'
  ]

  const [isTrainingOpen, setIsTrainingOpen] =
    useState(trainingRoutes.includes(location.pathname))


  return (

    <>
      {/* Overlay */}

      <div
        className={`sidebar-overlay ${isOpen ? 'active' : ''}`}
        onClick={closeSidebar}
      ></div>


      {/* Sidebar */}

      <aside
        className={`fitness-sidebar ${isOpen ? 'open' : ''}`}
      >


        {/* =========================
            SIDEBAR HEADER
        ========================= */}

        <div className="sidebar-header">

          <Link
            to="/"
            className="sidebar-brand"
            onClick={closeSidebar}
          >

            <span className="sidebar-brand-text">
              NAVCHETNA
              <span className="brand-accent">
                2.0
              </span>
            </span>

          </Link>


          <button
            className="close-sidebar-btn"
            onClick={closeSidebar}
            aria-label="Close sidebar"
          >
            <FiX size={22} />
          </button>

        </div>



        {/* =========================
            SIDEBAR CONTENT
        ========================= */}

        <div className="sidebar-scroll-area">

          <nav className="sidebar-nav">


            {/* MAIN MENU */}

            <div className="sidebar-section">

              <span className="nav-section-title">
                MAIN MENU
              </span>


              {/* Community Feed */}

              <Link
                to="/"
                className={`sidebar-link ${
                  location.pathname === '/'
                    ? 'active-link'
                    : ''
                }`}

                onClick={closeSidebar}
              >

                <div className="link-content">

                  <FiActivity size={18} />

                  <span>
                    Community Feed
                  </span>

                </div>


                <span className="nav-badge new">
                  NEW
                </span>

              </Link>



              {/* Training Zone */}

              <div className="nav-group">

                <button
                  className={`sidebar-link nav-group-toggle ${
                    isTrainingOpen ? 'open' : ''
                  }`}

                  onClick={() =>
                    setIsTrainingOpen(!isTrainingOpen)
                  }
                >

                  <div className="link-content">

                    <FiTarget size={18} />

                    <span>
                      Training Zone
                    </span>

                  </div>


                  <FiChevronDown
                    className={`group-chevron ${
                      isTrainingOpen
                        ? 'rotate'
                        : ''
                    }`}
                  />

                </button>



                {/* Training Submenu */}

                <div
                  className={`nav-group-items ${
                    isTrainingOpen
                      ? 'expanded'
                      : ''
                  }`}
                >


                  <Link
                    to="/dashboard"
                    className={`sidebar-sublink ${
                      location.pathname === '/dashboard'
                        ? 'active-sublink'
                        : ''
                    }`}

                    onClick={closeSidebar}
                  >

                    <div className="sublink-left">

                      <span className="bullet"></span>

                      Dashboard

                    </div>

                  </Link>



                  <Link
                    to="/workouts"
                    className={`sidebar-sublink ${
                      location.pathname === '/workouts'
                        ? 'active-sublink'
                        : ''
                    }`}

                    onClick={closeSidebar}
                  >

                    <div className="sublink-left">

                      <span className="bullet"></span>

                      My Workouts

                    </div>

                  </Link>



                  <Link
                    to="/leaderboard"
                    className={`sidebar-sublink ${
                      location.pathname === '/leaderboard'
                        ? 'active-sublink'
                        : ''
                    }`}

                    onClick={closeSidebar}
                  >

                    <div className="sublink-left">

                      <span className="bullet"></span>

                      Leaderboard

                    </div>


                    <span className="nav-badge count">
                      3
                    </span>

                  </Link>


                </div>

              </div>

            </div>



            {/* DIVIDER */}

            <div className="sidebar-divider"></div>



            {/* ACCOUNT */}

            <div className="sidebar-section">

              <span className="nav-section-title">
                ACCOUNT
              </span>


              <Link
                to="/profile"

                className={`sidebar-link ${
                  location.pathname === '/profile'
                    ? 'active-link'
                    : ''
                }`}

                onClick={closeSidebar}
              >

                <div className="link-content">

                  <FiUser size={18} />

                  <span>
                    Profile
                  </span>

                </div>

              </Link>



              <Link
                to="/settings"

                className={`sidebar-link ${
                  location.pathname === '/settings'
                    ? 'active-link'
                    : ''
                }`}

                onClick={closeSidebar}
              >

                <div className="link-content">

                  <FiSettings size={18} />

                  <span>
                    Settings
                  </span>

                </div>

              </Link>

            </div>



            {/* DIVIDER */}

            <div className="sidebar-divider"></div>



            {/* APP */}

            <div className="sidebar-section">

              <span className="nav-section-title">
                NAVCHETNA APP
              </span>


              <Link
                to="/download"

                className={`sidebar-link ${
                  location.pathname === '/download'
                    ? 'active-link'
                    : ''
                }`}

                onClick={closeSidebar}
              >

                <div className="link-content">

                  <FiCloud size={18} />

                  <span>
                    Download App
                  </span>

                </div>

              </Link>

            </div>


          </nav>

        </div>



        {/* =========================
            SIDEBAR FOOTER
        ========================= */}

        <div className="sidebar-footer">

          <div className="profile-dropdown-container">


            {/* Profile Toggle */}

            <button
              className="profile-toggle"

              onClick={() =>
                setIsProfileOpen(!isProfileOpen)
              }
            >

              <img
                src="https://i.pravatar.cc/150?img=11"

                alt="User"

                className="avatar"
              />


              <div className="profile-info">

                <span className="profile-name">
                  Athlete 01
                </span>


                <span className="profile-email">
                  athlete@navchetna.com
                </span>

              </div>


              <FiChevronDown
                className={`dropdown-icon ${
                  isProfileOpen
                    ? 'rotate'
                    : ''
                }`}
              />

            </button>



            {/* Profile Popup */}

            {isProfileOpen && (

              <div className="profile-menu-popup">


                <Link
                  to="/profile"

                  className="popup-item"

                  onClick={closeSidebar}
                >

                  <FiUser size={15} />

                  Account

                </Link>



                <Link
                  to="/settings"

                  className="popup-item"

                  onClick={closeSidebar}
                >

                  <FiSettings size={15} />

                  Settings

                </Link>



                <div className="popup-divider"></div>



                <button
                  className="popup-item logout-btn"
                >

                  <FiLogOut size={15} />

                  Logout

                </button>


              </div>

            )}

          </div>

        </div>


      </aside>

    </>

  )

}


export default Sidebar