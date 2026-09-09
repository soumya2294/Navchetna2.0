import React, { useState } from 'react'
import { FiMapPin, FiZap, FiHeart, FiMessageCircle, FiShare2, FiEdit2, FiActivity, FiCalendar, FiTrendingUp, FiX, FiUser } from 'react-icons/fi'

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    name: 'Soumya',
    title: 'Hybrid Athlete & Marathon Runner',
    location: 'Budge Budge, West Bengal',
    age: '20',
    gender: 'Male'
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSave = (e) => {
    e.preventDefault()
    setIsEditing(false)
  }

  return (
    <div className="profile-page-wrapper">
      <div className="profile-card header-card">
        <div className="profile-banner"></div>
        
        <div className="profile-header-content">
          <div className="header-left-col">
            <img src="https://i.pravatar.cc/150?img=11" alt="Profile" className="profile-avatar-squircle" />
          </div>
          
          <div className="header-mid-col">
            <div className="name-badge-row">
              <h1 className="athlete-header-name">{profileData.name}</h1>
              <span className="pro-badge">PRO <FiZap size={10} /></span>
            </div>
            <p className="user-title">{profileData.title}</p>
            <p className="profile-location">
              <FiMapPin size={12} /> {profileData.location} &nbsp;&bull;&nbsp; <FiUser size={12} /> {profileData.age} yrs, {profileData.gender}
            </p>
            
            <div className="profile-actions-inline">
              <button className="btn-primary">Follow</button>
              <button className="btn-outline">Message</button>
              <button className="btn-outline" onClick={() => setIsEditing(true)}>
                <FiEdit2 size={12} /> Edit
              </button>
            </div>
          </div>

          <div className="header-right-col">
            <div className="stat-item">
              <span className="stat-lbl">Posts</span>
              <span className="stat-val">42</span>
            </div>
            <div className="stat-item">
              <span className="stat-lbl">Followers</span>
              <span className="stat-val">2,985</span>
            </div>
            <div className="stat-item">
              <span className="stat-lbl">Following</span>
              <span className="stat-val">132</span>
            </div>
          </div>
        </div>

        <div className="header-tabs">
          <span className="tab active">Overview</span>
          <span className="tab">Training Log</span>
          <span className="tab">Milestones</span>
          <span className="tab">Nutrition</span>
        </div>
      </div>

      <div className="profile-grid-row">
        <div className="profile-card">
          <h3 className="card-title">Training Disciplines</h3>
          <div className="tags-container">
            <span className="tag">Calisthenics</span>
            <span className="tag">Powerlifting</span>
            <span className="tag">HIIT</span>
            <span className="tag">Endurance Running</span>
            <span className="tag">Mobility</span>
          </div>
        </div>

        <div className="profile-card">
          <h3 className="card-title">Performance</h3>
          <div className="performance-stats-grid">
            <div className="perf-stat-box">
              <FiActivity className="perf-icon" />
              <span className="perf-val">342</span>
              <span className="perf-lbl">Workouts</span>
            </div>
            <div className="perf-stat-box">
              <FiCalendar className="perf-icon" />
              <span className="perf-val">180</span>
              <span className="perf-lbl">Active Days</span>
            </div>
            <div className="perf-stat-box">
              <FiTrendingUp className="perf-icon" />
              <span className="perf-val">12</span>
              <span className="perf-lbl">Day Streak</span>
            </div>
          </div>
        </div>
      </div>

      <div className="profile-card">
        <h3 className="card-title">My Posts</h3>
        
        <div className="post-feed-item">
          <div className="post-header">
            <img src="https://i.pravatar.cc/150?img=11" alt="Author" className="post-avatar" />
            <div className="post-meta">
              <span className="post-author">{profileData.name}</span>
              <span className="post-time">2 hours ago</span>
            </div>
          </div>
          <p className="post-text">
            Just crushed a 10km morning run! The weather in Budge Budge is absolutely perfect for endurance training today. Who else is getting their miles in? 🏃‍♂️💨
          </p>
          <div className="post-actions">
            <button className="post-action-btn"><FiHeart size={14} /> 24 Likes</button>
            <button className="post-action-btn"><FiMessageCircle size={14} /> 5 Comments</button>
            <button className="post-action-btn"><FiShare2 size={14} /> Share</button>
          </div>
        </div>

        <div className="feed-divider"></div>

        <div className="post-feed-item">
          <div className="post-header">
            <img src="https://i.pravatar.cc/150?img=11" alt="Author" className="post-avatar" />
            <div className="post-meta">
              <span className="post-author">{profileData.name}</span>
              <span className="post-time">Yesterday</span>
            </div>
          </div>
          <p className="post-text">
            Hit a new PR on the bench press today! 225lbs for 3 solid reps. Consistency in the Training Zone is finally paying off. 
          </p>
          <div className="post-actions">
            <button className="post-action-btn"><FiHeart size={14} /> 156 Likes</button>
            <button className="post-action-btn"><FiMessageCircle size={14} /> 12 Comments</button>
            <button className="post-action-btn"><FiShare2 size={14} /> Share</button>
          </div>
        </div>
      </div>

      {isEditing && (
        <div className="modal-overlay">
          <div className="edit-modal">
            <div className="edit-modal-header">
              <h3>Edit Profile</h3>
              <button className="close-modal-btn" onClick={() => setIsEditing(false)}>
                <FiX size={24} />
              </button>
            </div>
            <form className="edit-form" onSubmit={handleSave}>
              <div className="edit-form-group">
                <label>Display Name</label>
                <input 
                  type="text" 
                  name="name" 
                  value={profileData.name} 
                  onChange={handleInputChange} 
                />
              </div>
              <div className="edit-form-group">
                <label>Bio / Title</label>
                <input 
                  type="text" 
                  name="title" 
                  value={profileData.title} 
                  onChange={handleInputChange} 
                />
              </div>
              <div className="edit-form-group">
                <label>Location</label>
                <input 
                  type="text" 
                  name="location" 
                  value={profileData.location} 
                  onChange={handleInputChange} 
                />
              </div>
              <div className="edit-form-group">
                <label>Age</label>
                <input 
                  type="number" 
                  name="age" 
                  value={profileData.age} 
                  onChange={handleInputChange} 
                />
              </div>
              <div className="edit-form-group">
                <label>Gender</label>
                <input 
                  type="text" 
                  name="gender" 
                  value={profileData.gender} 
                  onChange={handleInputChange} 
                />
              </div>
              <div className="modal-actions-row">
                <button type="button" className="btn-outline" onClick={() => setIsEditing(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Profile