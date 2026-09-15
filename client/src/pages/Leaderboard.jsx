import React, { useState, useEffect } from 'react';
import {
  FiAward,
  FiTrendingUp,
  FiZap
} from 'react-icons/fi'

function Leaderboard() {
  const [myXP, setMyXP] = useState(1240);

  useEffect(() => {
    const saved = localStorage.getItem('userXP') || '1240';
    if (saved) {
      setMyXP(parseInt(saved, 10));
    }
  }, []);

 const baseAthletes = [
    { name: 'IShowSPEED', xp: 2450, streak: '🔥 12 Day Streak', avatar: 'https://i.pravatar.cc/150?img=11' },
    { name: 'Alex Johnson', xp: 2210, streak: '🔥 10 Day Streak', avatar: 'https://i.pravatar.cc/150?img=12' },
    { name: 'Sarah Williams', xp: 1980, streak: '🔥 8 Day Streak', avatar: 'https://i.pravatar.cc/150?img=47' },
    { name: 'Mike Anderson', xp: 1750, streak: '🔥 7 Day Streak', avatar: 'https://i.pravatar.cc/150?img=53' },
    { name: 'Athlete 05', xp: 1540, streak: '🔥 5 Day Streak', avatar: 'https://i.pravatar.cc/150?img=33' },
    { name: 'David Miller', xp: 1400, streak: '🔥 4 Day Streak', avatar: 'https://i.pravatar.cc/150?img=60' },
    { name: 'Emma Watson', xp: 1300, streak: '🔥 3 Day Streak', avatar: 'https://i.pravatar.cc/150?img=45' },
    { name: 'You', xp: myXP, streak: '🔥 Active', avatar: 'https://i.pravatar.cc/150?img=68', isUser: true }
  ];

  const getMedal = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  // Sort highest XP to lowest, assign ranks, and format XP for display
  const athletes = [...baseAthletes]
    .sort((a, b) => b.xp - a.xp)
    .map((athlete, index) => ({
      ...athlete,
      rank: index + 1,
      xp: athlete.xp.toLocaleString()
    }));

  // Find your real-time rank position
 const myRank = athletes.find((a) => a.name === 'You')?.rank || 1;

  const topThree = athletes.slice(0, 3);
  const restOfAthletes = athletes.slice(3);

  return (
    <div className="training-page">

      {/* HEADER */}
      <div className="leaderboard-header">
        <div>
          <p className="page-tag">TRAINING ZONE</p>
          <h1>Leaderboard 🏆</h1>
          <p>See who's dominating the FITMATES community.</p>
        </div>
      </div>

      {/* TOP STATS - Reusing your beautiful workout-summary-grid CSS here! */}
      <div className="workout-summary-grid">
        <div className="workout-summary-card">
          <FiAward />
          <div>
            <h2>#{myRank}</h2>
            <span>Your Rank</span>
          </div>
        </div>

        <div className="workout-summary-card">
          <FiZap />
          <div>
            <h2>{myXP.toLocaleString()} XP</h2>
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