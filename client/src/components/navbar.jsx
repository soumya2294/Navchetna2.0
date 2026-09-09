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

  const location = useLocation()


  /* =====================================================
     LOAD COMPLETED DAYS FROM LOCAL STORAGE
  ===================================================== */

  useEffect(() => {

    const savedDays = JSON.parse(
      localStorage.getItem("navchetnaCompletedDays")
    ) || []

    setCompletedDays(savedDays)

  }, [])


  /* =====================================================
     DATE INFORMATION
  ===================================================== */

  const today = new Date()

  const currentYear = today.getFullYear()

  const currentMonth = today.getMonth()

  const todayDate = today.getDate()


  /* =====================================================
     MONTH INFORMATION
  ===================================================== */

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


  /* =====================================================
     CREATE DATE ID

     Example:
     2026-09-09
  ===================================================== */

  const createDateId = (day) => {

    const month = String(
      currentMonth + 1
    ).padStart(2, "0")

    const date = String(day).padStart(2, "0")

    return `${currentYear}-${month}-${date}`

  }


  /* =====================================================
     TODAY STATUS
  ===================================================== */

  const todayId = createDateId(todayDate)

  const isTodayCompleted =
    completedDays.includes(todayId)


  /* =====================================================
     CHECK IN TODAY
  ===================================================== */

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


  /* =====================================================
     CALCULATE CURRENT STREAK

     Counts consecutive completed days.
  ===================================================== */

  const calculateStreak = () => {

    let streak = 0

    const date = new Date()


    /*
      If today isn't completed,
      start counting from yesterday.
    */

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


  /* =====================================================
     NAVIGATION
  ===================================================== */

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


        {/* =================================================
            BRAND
        ================================================= */}

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



        {/* =================================================
            NAVIGATION MENU
        ================================================= */}

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



          {/* MOBILE LOGIN / SIGNUP */}

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

        </nav>



        {/* =================================================
            HEADER ACTIONS
        ================================================= */}

        <div className="header-actions">


          {/* LOGIN */}

          <Link
            to="/login"
            className="login-link desktop-only"
          >

            Login

          </Link>



          {/* SIGN UP */}

          <Link
            to="/signup"
            className="signup-btn desktop-only"
          >

            Sign Up

          </Link>



          <div className="divider desktop-only"></div>



          {/* =================================================
              STREAK
          ================================================= */}

          <div className="streak-container">


            {/* STREAK INDICATOR */}

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



            {/* =================================================
                STREAK POPUP
            ================================================= */}

            {isStreakOpen && (

              <div className="streak-popup">


                {/* CLOSE */}

                <button
                  className="close-popup"
                  onClick={() =>
                    setIsStreakOpen(false)
                  }
                >

                  <FiX />

                </button>



                {/* HEADER */}

                <div className="streak-popup-header">

                  <FaFire className="streak-popup-icon" />

                  <h3>

                    {currentStreak} Day Streak

                  </h3>

                </div>



                {/* SUBTEXT */}

                <p className="streak-subtext">

                  {isTodayCompleted

                    ? "Great job! You completed today's check-in 🎉"

                    : "Check in today to keep your streak alive"

                  }

                </p>



                {/* =================================================
                    MONTH HEADER
                ================================================= */}

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



                {/* =================================================
                    WEEK DAYS
                ================================================= */}

                <div className="calendar-weekdays">

                  <span>Sun</span>

                  <span>Mon</span>

                  <span>Tue</span>

                  <span>Wed</span>

                  <span>Thu</span>

                  <span>Fri</span>

                  <span>Sat</span>

                </div>



                {/* =================================================
                    CALENDAR
                ================================================= */}

                <div className="streak-calendar">


                  {/* EMPTY DAYS */}

                  {Array.from({

                    length: firstDayOfMonth

                  }).map((_, index) => (

                    <div

                      key={`empty-${index}`}

                      className="calendar-empty"

                    />

                  ))}



                  {/* MONTH DAYS */}

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



                {/* =================================================
                    MILESTONE
                ================================================= */}

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



                {/* =================================================
                    CHECK IN BUTTON
                ================================================= */}

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



          {/* =================================================
              NOTIFICATIONS
          ================================================= */}

          <div className="notification-wrapper">

            <FiBell className="icon-btn" />

            <span className="notification-badge">

              2

            </span>

          </div>



          {/* =================================================
              PROFILE
          ================================================= */}

          <div className="profile-menu">

            <img
              src="https://i.pravatar.cc/150?img=11"
              alt="User"
              className="avatar"
            />

            <FiChevronDown className="dropdown-icon" />

          </div>


        </div>



        {/* =================================================
            MOBILE MENU
        ================================================= */}

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