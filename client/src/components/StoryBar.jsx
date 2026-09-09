import React, { useState } from 'react'
import { FiPlus } from 'react-icons/fi'

const StoryBar = ({ stories = [], onStoryClick }) => {
  const [viewedStories, setViewedStories] = useState([])

  const filteredStories = stories.filter(
    story =>
      story.username !== 'Your Story' &&
      story.username !== 'You'
  )

  const handleStoryClick = (story) => {
    setViewedStories((previous) => {
      if (previous.includes(story.id)) {
        return previous
      }

      return [...previous, story.id]
    })

    onStoryClick(story)
  }

  return (
    <div className="stories-section">

      <div className="section-header">
        <h2>Stories</h2>
        <span>See what's happening 🔥</span>
      </div>

      <div className="stories-container">

        {/* YOUR STORY */}

        <div className="story-item">

          <div className="story-avatar-wrapper your-story">

            <img
              src="https://i.pravatar.cc/150?img=11"
              alt="You"
              className="story-avatar"
            />

            <div className="add-story-icon">
              <FiPlus />
            </div>

          </div>

          <p>Your Story</p>

        </div>


        {/* OTHER STORIES */}

        {filteredStories.map((story) => {

          const isViewed = viewedStories.includes(story.id)

          return (

            <div
              key={story.id}
              className="story-item"
              onClick={() => handleStoryClick(story)}
            >

              <div
                className={`story-avatar-wrapper ${
                  isViewed ? 'viewed-story' : 'unviewed-story'
                }`}
              >

                <img
                  src={story.avatar}
                  alt={story.username}
                  className="story-avatar"
                />

              </div>

              <p>{story.username}</p>

            </div>

          )
        })}

      </div>

    </div>
  )
}

export default StoryBar