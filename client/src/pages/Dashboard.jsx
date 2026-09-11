import React from 'react'
import {
  FiActivity,
  FiZap,
  FiTarget,
  FiTrendingUp,
  FiClock,
  FiArrowRight,
  FiAward
} from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'

function Dashboard() {
  const navigate = useNavigate()

  const stats = [
    {
      icon: <FiActivity />,
      value: '8,542',
      label: 'Steps Today'
    },
    {
      icon: <FiZap />,
      value: '620',
      label: 'Calories Burned'
    },
    {
      icon: <FiClock />,
      value: '48 min',
      label: 'Active Time'
    },
    {
      icon: <FiTrendingUp />,
      value: '12',
      label: 'Day Streak'
    }
  ]

  return (
    <div className="training-page">

      {/* HEADER */}
      <div className="training-page-header">
        <div>
          <h1>Good Evening, Athlete! 👋</h1>
          <p>Let's make today's workout count.</p>
        </div>

        <button
          className="add-workout-btn"
          onClick={() => navigate('/workouts')}
        >
          Start Workout
          <FiArrowRight />
        </button>
      </div>

      {/* STATS */}
      <div className="dashboard-section">
        <div className="dashboard-performance-grid">
          {stats.map((stat, index) => (
            <div
              className="dashboard-perf-card"
              key={index}
            >
              {/* CSS expects SVG directly inside the card */}
              {stat.icon}
              
              <h2>{stat.value}</h2>
              
              {/* CSS expects a span here, not a p tag */}
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* MAIN GRID (Daily Goals & Weekly Activity) */}
      {/* Note: I wrapped this in your dashboard-section class so it inherits the nice white background and rounded borders! */}
      <div className="dashboard-section" style={{ marginTop: '30px' }}>
        <div className="dashboard-main-grid">

          {/* DAILY GOAL */}
          <div className="dashboard-card daily-goal-card">
            <div className="card-heading">
              <div>
                <p className="small-label">DAILY GOAL</p>
                <h2>Keep Moving</h2>
              </div>
              <FiTarget />
            </div>

            <div className="progress-circle">
              <div className="progress-inner">
                <strong>85%</strong>
                <span>Complete</span>
              </div>
            </div>

            <div className="goal-details">
              <div>
                <strong>8,542</strong>
                <span>Steps</span>
              </div>
              <div>
                <strong>10,000</strong>
                <span>Goal</span>
              </div>
            </div>
          </div>

          {/* WEEKLY ACTIVITY */}
          <div className="dashboard-card weekly-card">
            <div className="card-heading">
              <div>
                <p className="small-label">THIS WEEK</p>
                <h2>Activity Overview</h2>
              </div>
            </div>

            <div className="weekly-bars">
              <div><span className="bar" style={{ height: '55%' }} /><p>Mon</p></div>
              <div><span className="bar" style={{ height: '70%' }} /><p>Tue</p></div>
              <div><span className="bar" style={{ height: '45%' }} /><p>Wed</p></div>
              <div><span className="bar" style={{ height: '90%' }} /><p>Thu</p></div>
              <div><span className="bar" style={{ height: '65%' }} /><p>Fri</p></div>
              <div><span className="bar" style={{ height: '35%' }} /><p>Sat</p></div>
              <div><span className="bar" style={{ height: '80%' }} /><p>Sun</p></div>
            </div>
          </div>

        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div className="dashboard-section" style={{ marginTop: '30px' }}>
        <h2 style={{ marginBottom: '20px' }}>Quick Actions</h2>
        
        {/* I am applying your workout-summary-grid classes here so they style correctly! */}
        <div className="workout-summary-grid">
          
          <button
            className="workout-summary-card"
            style={{ textAlign: 'left', cursor: 'pointer' }}
            onClick={() => navigate('/workouts')}
          >
            <FiActivity />
            <div>
              <h2>My Workouts</h2>
              <span>View your training sessions</span>
            </div>
          </button>

          <button
            className="workout-summary-card"
            style={{ textAlign: 'left', cursor: 'pointer' }}
            onClick={() => navigate('/leaderboard')}
          >
            <FiAward />
            <div>
              <h2>Leaderboard</h2>
              <span>Check your ranking</span>
            </div>
          </button>

        </div>
      </div>

    </div>
  )
}

export default Dashboard