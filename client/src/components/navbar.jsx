import { Link, useLocation } from 'react-router-dom'
import {
  FiBell,
  FiMenu,
  FiX,
  FiChevronDown,
  FiCheck
} from 'react-icons/fi'

import { FaFire } from 'react-icons/fa'

import { useState, useEffect } from 'react'

const Navbar = ({ toggleSidebar }) => {

  const [isOpen, setIsOpen] = useState(false)

  const [isStreakOpen, setIsStreakOpen] = useState(false)

  const [completedDays, setCompletedDays] = useState([])
  
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const location = useLocation()

  useEffect(() => {

    const savedDays = JSON.parse(
      localStorage.getItem("navchetnaCompletedDays")
    ) || []

    setCompletedDays(savedDays)

  }, [])

  useEffect(() => {
    
    const token = localStorage.getItem('navchetnaToken')
    
    setIsLoggedIn(!!token)
    
  }, [location])

  const today = new Date()

  const currentYear = today.getFullYear()

  const currentMonth = today.getMonth()

  const todayDate = today.getDate()

  const daysInMonth = new Date(
    currentYear,
    currentMonth + 1,
    0
  ).getDate()

  const firstDayOfMonth = new Date(
    currentYear,
    currentMonth,
    1
  ).getDay()

  const createDateId = (day) => {

    const month = String(
      currentMonth + 1
    ).padStart(2, "0")

    const date = String(day).padStart(2, "0")

    return `${currentYear}-${month}-${date}`

  }

  const todayId = createDateId(todayDate)

  const isTodayCompleted =
    completedDays.includes(todayId)

  const handleCheckIn = () => {

    if (isTodayCompleted) return

    const updatedDays = [
      ...completedDays,
      todayId
    ]

    setCompletedDays(updatedDays)

    localStorage.setItem(
      "navchetnaCompletedDays",
      JSON.stringify(updatedDays)
    )

  }

  const calculateStreak = () => {

    let streak = 0

    const date = new Date()

    if (!completedDays.includes(todayId)) {

      date.setDate(
        date.getDate() - 1
      )

    }

    while (true) {

      const year = date.getFullYear()

      const month = String(
        date.getMonth() + 1
      ).padStart(2, "0")

      const day = String(
        date.getDate()
      ).padStart(2, "0")

      const dateId =
        `${year}-${month}-${day}`

      if (completedDays.includes(dateId)) {

        streak++

        date.setDate(
          date.getDate() - 1
        )

      } else {

        break

      }

    }

    return streak

  }

  const currentStreak =
    calculateStreak()

  const items = [
    {
      label: "Community Feed",
      href: "/"
    },
    {
      label: "Training Zone",
      href: "/dashboard"
    }
  ]

  const toggleMenu = () => {

    setIsOpen(!isOpen)

  }

  const closeMenu = () => {

    setIsOpen(false)

  }

  return (

    <header className="fitness-navbar">

      <div className="nav-container">

        <div className="brand-group">

          <button
            className="sidebar-trigger"
            onClick={toggleSidebar}
          >
            <FiMenu size={24} />
          </button>

          <Link
            to="/"
            className="brand-logo"
            onClick={closeMenu}
          >

            <span className="brand-text">

              NAVCHETNA{" "}

              <span className="brand-accent">
                2.0
              </span>

            </span>

          </Link>

        </div>

        <nav
          className={`nav-menu ${
            isOpen ? 'active' : ''
          }`}
        >

          {items.map(item => (

            <Link

              key={item.href}

              to={item.href}

              className={`nav-link ${
                location.pathname === item.href
                  ? 'active-link'
                  : ''
              }`}

              onClick={closeMenu}

            >

              {item.label}

            </Link>

          ))}

          {!isLoggedIn && (
            <div className="mobile-auth">

              <Link
                to="/login"
                className="login-link"
                onClick={closeMenu}
              >

                Login

              </Link>

              <Link
                to="/signup"
                className="signup-btn"
                onClick={closeMenu}
              >

                Sign Up

              </Link>

            </div>
          )}

        </nav>

        <div className="header-actions">

          {!isLoggedIn && (
            <>
              <Link
                to="/login"
                className="login-link desktop-only"
              >

                Login

              </Link>

              <Link
                to="/signup"
                className="signup-btn desktop-only"
              >

                Sign Up

              </Link>

              <div className="divider desktop-only"></div>
            </>
          )}

          <div className="streak-container">

            <div
              className="streak-indicator"
              onClick={() =>
                setIsStreakOpen(!isStreakOpen)
              }
            >

              <div className="streak-icon-wrapper">

                <FaFire className="streak-icon" />

              </div>

              <span className="streak-count">

                {currentStreak}

              </span>

            </div>

            {isStreakOpen && (

              <div className="streak-popup">

                <button
                  className="close-popup"
                  onClick={() =>
                    setIsStreakOpen(false)
                  }
                >

                  <FiX />

                </button>

                <div className="streak-popup-header">

                  <FaFire className="streak-popup-icon" />

                  <h3>

                    {currentStreak} Day Streak

                  </h3>

                </div>

                <p className="streak-subtext">

                  {isTodayCompleted

                    ? "Great job! You completed today's check-in 🎉"

                    : "Check in today to keep your streak alive"

                  }

                </p>

                <div className="calendar-header">

                  <h4>

                    {today.toLocaleString(
                      "default",
                      { month: "long" }
                    )}

                    {" "}

                    {currentYear}

                  </h4>

                </div>

                <div className="calendar-weekdays">

                  <span>Sun</span>

                  <span>Mon</span>

                  <span>Tue</span>

                  <span>Wed</span>

                  <span>Thu</span>

                  <span>Fri</span>

                  <span>Sat</span>

                </div>

                <div className="streak-calendar">

                  {Array.from({

                    length: firstDayOfMonth

                  }).map((_, index) => (

                    <div

                      key={`empty-${index}`}

                      className="calendar-empty"

                    />

                  ))}

                  {Array.from(

                    { length: daysInMonth },

                    (_, index) => index + 1

                  ).map((day) => {

                    const dateId =
                      createDateId(day)

                    const isCompleted =
                      completedDays.includes(dateId)

                    const isToday =
                      day === todayDate

                    const isFuture =
                      day > todayDate

                    return (

                      <div

                        key={day}

                        className={`

                          calendar-day

                          ${
                            isCompleted
                              ? "completed"
                              : ""
                          }

                          ${
                            isToday
                              ? "today"
                              : ""
                          }

                          ${
                            isFuture
                              ? "future"
                              : ""
                          }

                        `}

                      >

                        {isCompleted

                          ? <FiCheck size={15} />

                          : day

                        }

                      </div>

                    )

                  })}

                </div>

                <div className="streak-milestone">

                  <p className="milestone-label">

                    Next milestone

                  </p>

                  <h4>

                    {currentStreak < 7

                      ? "7 days"

                      : currentStreak < 14

                      ? "14 days"

                      : currentStreak < 30

                      ? "30 days"

                      : "100 days"

                    }

                  </h4>

                </div>

                <button

                  className={`check-in-btn ${
                    isTodayCompleted
                      ? "completed-btn"
                      : ""
                  }`}

                  onClick={handleCheckIn}

                  disabled={isTodayCompleted}

                >

                  {isTodayCompleted

                    ? "✓ Checked In Today"

                    : "Check In Today"

                  }

                </button>

              </div>

            )}

          </div>

          {isLoggedIn && (
            <div className="notification-wrapper">

              <FiBell className="icon-btn" />

              <span className="notification-badge">

                2

              </span>

            </div>
          )}

          {isLoggedIn && (
            <div className="profile-menu">

              <img
                src="https://i.pravatar.cc/150?img=11"
                alt="User"
                className="avatar"
              />

              <FiChevronDown className="dropdown-icon" />

            </div>
          )}

        </div>

        <button
          className="mobile-menu-btn"
          onClick={toggleMenu}
        >

          {isOpen

            ? <FiX />

            : <FiMenu />

          }

        </button>

      </div>

    </header>

  )

}

export default Navbar