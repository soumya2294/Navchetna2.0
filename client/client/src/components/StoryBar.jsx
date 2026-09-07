import { FiPlus } from "react-icons/fi"

const StoryBar = ({ stories, onStoryClick }) => {
  return (
    <div className="stories-section">

      <div className="section-header">
        <h2>Stories</h2>
        <span>See what's happening 🔥</span>
      </div>

      <div className="stories-container">

        {stories.map((story) => (
          <div
            className="story-item"
            key={story.id}
            onClick={() => onStoryClick(story)}
          >

            <div
              className={`story-avatar-wrapper ${
                story.isUser ? "your-story" : ""
              }`}
            >
              <img
                src={story.avatar}
                alt={story.username}
                className="story-avatar"
              />

              {story.isUser && (
                <div className="add-story-icon">
                  <FiPlus />
                </div>
              )}
            </div>

            <p>{story.username}</p>

          </div>
        ))}

      </div>

    </div>
  )
}

export default StoryBar