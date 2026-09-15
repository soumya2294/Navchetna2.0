import React, { useState } from "react"
import { FiPlus } from "react-icons/fi"
import { useProfile } from "../utils/userProfile"
import { resolveMediaUrl } from "../utils/api"

const StoryBar = ({ stories = [], onStoryClick, onAddStoryClick }) => {
  const { profile } = useProfile()
  const [viewedStories, setViewedStories] = useState([])

  const myAvatar = profile.avatar

  // Check if user has an active story
  const userStory = stories.find(
    (story) =>
      story.isUser ||
      story.username === "Your Story" ||
      story.username === "You" ||
      story.username === profile.name
  )

  const otherStories = stories.filter(
    (story) =>
      !story.isUser &&
      story.username !== "Your Story" &&
      story.username !== "You" &&
      story.username !== profile.name
  )

  const handleStoryClick = (story) => {
    const storyId = story._id || story.id
    setViewedStories((prev) => (prev.includes(storyId) ? prev : [...prev, storyId]))
    onStoryClick(story)
  }

  const handleUserStoryClick = (e) => {
    e.stopPropagation()
    if (userStory) {
      handleStoryClick(userStory)
    } else if (onAddStoryClick) {
      onAddStoryClick()
    }
  }

  const handlePlusClick = (e) => {
    e.stopPropagation()
    if (onAddStoryClick) {
      onAddStoryClick()
    }
  }

  return (
    <div className="stories-section">
      <div className="section-header">
        <h2>Stories</h2>
      </div>

      <div className="stories-container">
        {/* YOUR STORY */}
        <div
          className="story-item"
          onClick={handleUserStoryClick}
          title={userStory ? "View Your Story" : "Add New Story"}
        >
          <div
            className={`story-avatar-wrapper your-story ${
              userStory ? "has-story unviewed-story" : ""
            }`}
          >
            <img src={resolveMediaUrl(myAvatar)} alt="You" className="story-avatar" />
            <div
              className="add-story-icon"
              onClick={handlePlusClick}
              title="Add to Story"
            >
              <FiPlus />
            </div>
          </div>
          <p>Your Story</p>
        </div>

        {/* COMMUNITY STORIES */}
        {otherStories.map((story) => {
          const storyId = story._id || story.id
          const isViewed = viewedStories.includes(storyId)

          return (
            <div
              key={storyId}
              className="story-item"
              onClick={() => handleStoryClick(story)}
            >
              <div
                className={`story-avatar-wrapper ${
                  isViewed ? "viewed-story" : "unviewed-story"
                }`}
              >
                <img
                  src={resolveMediaUrl(story.avatar)}
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