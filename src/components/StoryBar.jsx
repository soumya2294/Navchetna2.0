import React from 'react'
import { FiPlus } from 'react-icons/fi'

const StoryBar = ({ stories, onStoryClick }) => {
  const filteredStories = stories?.filter(
    story => story.username !== 'Your Story' && story.username !== 'You'
  )

  return (
    <div className="stories-section">
      <div className="section-header">
        <h2>Stories</h2>
        <span>See what's happening 🔥</span>
      </div>
      
      <div className="stories-container">
        <div className="story-item">
          <div className="story-avatar-wrapper your-story">
            <img src="https://i.pravatar.cc/150?img=11" alt="You" className="story-avatar" />
            <div className="add-story-icon"><FiPlus /></div>
          </div>
          <p>Your Story</p>
        </div>

        {filteredStories?.map((story) => (
          <div key={story.id} className="story-item" onClick={() => onStoryClick(story)}>
            <div className="story-avatar-wrapper">
              <img src={story.avatar} alt={story.username} className="story-avatar" />
            </div>
            <p>{story.username}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default StoryBar