import React, { useState } from 'react'
import {
  FiActivity,
  FiClock,
  FiPlay,
  FiPlus,
  FiCheckCircle,
  FiList
} from 'react-icons/fi'

function MyWorkouts() {
  const [completed, setCompleted] = useState([])

  const workouts = [
    {
      id: 1,
      title: 'Morning Run',
      category: 'Endurance Running',
      duration: '32 min',
      exercises: '5.2 KM',
      icon: <FiActivity />
    },
    {
      id: 2,
      title: 'Upper Body Strength',
      category: 'Strength Training',
      duration: '45 min',
      exercises: '8 Exercises',
      icon: '💪'
    },
    {
      id: 3,
      title: 'HIIT Challenge',
      category: 'High Intensity',
      duration: '25 min',
      exercises: '12 Exercises',
      icon: '🔥'
    }
  ]

  const startWorkout = (id) => {
    if (completed.includes(id)) {
      setCompleted(completed.filter(workoutId => workoutId !== id))
    } else {
      setCompleted([...completed, id])
    }
  }

  return (
    <div className="training-page">

      {/* HEADER */}
      <div className="training-page-header">
        <div>
          <p className="page-tag">TRAINING ZONE</p>
          <h1>My Workouts</h1>
          <p>Choose a workout and start your training.</p>
        </div>

        <button className="add-workout-btn">
          <FiPlus />
          Add Workout
        </button>
      </div>

      {/* SUMMARY */}
      <div className="workout-summary-grid">
        <div className="workout-summary-card">
          <FiCheckCircle />
          <div>
            <h2>{completed.length}</h2>
            <span>Completed Today</span>
          </div>
        </div>

        <div className="workout-summary-card">
          <FiList />
          <div>
            <h2>12</h2>
            <span>Total Workouts</span>
          </div>
        </div>

        <div className="workout-summary-card">
          <FiClock />
          <div>
            <h2>6.5 hrs</h2>
            <span>Training Time</span>
          </div>
        </div>
      </div>

      {/* WORKOUTS LIST */}
      <div className="workouts-container">
        <h2>Your Routine</h2>
        
        <div className="workouts-list">
          {workouts.map((workout) => {
            const isCompleted = completed.includes(workout.id)

            return (
              <div
                className={`workout-card ${isCompleted ? 'workout-completed' : ''}`}
                key={workout.id}
              >
                
                {/* 1. Icon on the left */}
                <div className="workout-icon">
                  {workout.icon}
                </div>

                {/* 2. Info takes up the middle space (flex: 1) */}
                <div className="workout-info">
                  <h3>{workout.title}</h3>
                  <span>{workout.category}</span>
                </div>

                {/* 3. Details pushed to the right */}
                <div className="workout-details">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <FiActivity /> {workout.exercises}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <FiClock /> {workout.duration}
                  </span>
                </div>

                {/* 4. Action Button */}
                <button
                  className={`workout-start-button ${isCompleted ? 'completed-button' : ''}`}
                  onClick={() => startWorkout(workout.id)}
                >
                  {isCompleted ? (
                    <>
                      <FiCheckCircle />
                      Completed
                    </>
                  ) : (
                    <>
                      <FiPlay />
                      Start
                    </>
                  )}
                </button>

              </div>
            )
          })}
        </div>
      </div>

    </div>
  )
}

export default MyWorkouts