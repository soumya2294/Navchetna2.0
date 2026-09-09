import {
  FiX,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi"

const StoryViewer = ({
  stories,
  currentStory,
  onClose,
  onNext,
  onPrevious,
}) => {

  const currentIndex = stories.findIndex(
    (story) => story.id === currentStory.id
  )

  return (
    <div className="story-modal">

      <div className="story-viewer">

        {/* Progress Bars */}

        <div className="story-progress-container">

          {stories.map((story, index) => (
            <div
              key={story.id}
              className={`story-progress ${
                index <= currentIndex ? "active-progress" : ""
              }`}
            />
          ))}

        </div>


        {/* Close Button */}

        <button
          className="story-close-btn"
          onClick={onClose}
        >
          <FiX />
        </button>


        {/* Previous */}

        <button
          className="story-nav-btn previous"
          onClick={onPrevious}
        >
          <FiChevronLeft />
        </button>


        {/* Image */}

        <img
          src={currentStory.image}
          alt={currentStory.username}
          className="story-main-image"
        />


        {/* User Info */}

        <div className="story-user-info">

          <img
            src={currentStory.avatar}
            alt={currentStory.username}
          />

          <span>{currentStory.username}</span>

        </div>


        {/* Caption */}

        <div className="story-caption">

          <p>{currentStory.caption}</p>

        </div>


        {/* Next */}

        <button
          className="story-nav-btn next"
          onClick={onNext}
        >
          <FiChevronRight />
        </button>

      </div>

    </div>
  )
}

export default StoryViewer