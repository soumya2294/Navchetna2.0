import {
  FiX,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi"

const StoryViewer = ({
  stories = [],
  currentStory,
  onClose,
  onNext,
  onPrevious,
}) => {

  if (!currentStory) {
    return null
  }

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
                index <= currentIndex
                  ? "active-progress"
                  : ""
              }`}
            />
          ))}

        </div>


        {/* Close Button */}

        <button
          type="button"
          className="story-close-btn"
          onClick={onClose}
          aria-label="Close story"
        >
          <FiX />
        </button>


        {/* Previous */}

        <button
          type="button"
          className="story-nav-btn previous"
          onClick={onPrevious}
          aria-label="Previous story"
        >
          <FiChevronLeft />
        </button>


        {/* Story Image */}

        <img
          src={currentStory.image}
          alt={currentStory.username}
          className="story-main-image"
        />


        {/* User Information */}

        <div className="story-user-info">

          <img
            src={currentStory.avatar}
            alt={currentStory.username}
          />

          <span>
            {currentStory.username}
          </span>

        </div>


        {/* Caption */}

        {currentStory.caption && (
          <div className="story-caption">
            <p>{currentStory.caption}</p>
          </div>
        )}


        {/* Next */}

        <button
          type="button"
          className="story-nav-btn next"
          onClick={onNext}
          aria-label="Next story"
        >
          <FiChevronRight />
        </button>

      </div>

    </div>
  )
}

export default StoryViewer