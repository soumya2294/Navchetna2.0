import React from 'react'
import {
  FiAward,
  FiTrendingUp,
  FiZap
} from 'react-icons/fi'

function Leaderboard() {

  const athletes = [
    {
      rank: 1,
      name: 'ISHOWSPEED',
      xp: '2,450',
      streak: '🔥 12 Day Streak',
      avatar: 'https://i.pravatar.cc/150?img=11'
    },
    {
      rank: 2,
      name: 'Alex Johnson',
      xp: '2,210',
      streak: '🔥 10 Day Streak',
      avatar: 'https://i.pravatar.cc/150?img=12'
    },
    {
      rank: 3,
      name: 'Sarah Williams',
      xp: '1,980',
      streak: '🔥 8 Day Streak',
      avatar: 'https://i.pravatar.cc/150?img=47'
    },
    {
      rank: 4,
      name: 'Mike Anderson',
      xp: '1,750',
      streak: '🔥 7 Day Streak',
      avatar: 'https://i.pravatar.cc/150?img=53'
    },
    {
      rank: 5,
      name: 'Athlete 05',
      xp: '1,540',
      streak: '🔥 5 Day Streak',
      avatar: 'https://i.pravatar.cc/150?img=33'
    }
  ]

  const getMedal = (rank) => {
    if (rank === 1) return '🥇'
    if (rank === 2) return '🥈'
    if (rank === 3) return '🥉'
    return `#${rank}`
  }

  // Split athletes into Top 3 and the rest for your CSS layout
  const topThree = athletes.slice(0, 3);
  const restOfAthletes = athletes.slice(3);

  return (
    <div className="training-page">

      {/* HEADER */}
      <div className="leaderboard-header">
        <div>
          <p className="page-tag">TRAINING ZONE</p>
          <h1>Leaderboard 🏆</h1>
          <p>See who's dominating the Navchetna community.</p>
        </div>
      </div>

      {/* TOP STATS - Reusing your beautiful workout-summary-grid CSS here! */}
      <div className="workout-summary-grid">
        <div className="workout-summary-card">
          <FiAward />
          <div>
            <h2>#12</h2>
            <span>Your Rank</span>
          </div>
        </div>

        <div className="workout-summary-card">
          <FiZap />
          <div>
            <h2>1,240 XP</h2>
            <span>Your Points</span>
          </div>
        </div>

        <div className="workout-summary-card">
          <FiTrendingUp />
          <div>
            <h2>+3</h2>
            <span>Rank This Week</span>
          </div>
        </div>
      </div>

      {/* TOP 3 ATHLETES GRID */}
      <div className="top-athletes">
        {topThree.map((athlete) => (
          <div className={`top-athlete podium-rank-${athlete.rank}`} key={athlete.rank}>
            <div className="rank-number">{getMedal(athlete.rank)}</div>
            <img src={athlete.avatar} alt={athlete.name} />
            <h3>{athlete.name}</h3>
            <span>{athlete.xp} XP</span>
          </div>
        ))}
      </div>

      {/* RANKINGS LIST (4th place and below) */}
      <div className="rankings-container">
        <h2>Weekly Champions</h2>
        
        <div className="rankings-list">
          {restOfAthletes.map((athlete) => (
            <div className="ranking-card" key={athlete.rank}>
              
              <div className="athlete-rank">
                {getMedal(athlete.rank)}
              </div>
              
              <img
                className="ranking-avatar"
                src={athlete.avatar}
                alt={athlete.name}
              />
              
              <div className="ranking-user">
                <h3>{athlete.name}</h3>
                <span>{athlete.streak}</span>
              </div>
              
              <div className="ranking-points">
                {athlete.xp} <span>XP</span>
              </div>
              
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

export default Leaderboard