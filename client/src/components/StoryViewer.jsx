import React, { useState, useEffect, useRef } from "react"
import {
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiTrash2,
  FiPause,
  FiPlay,
} from "react-icons/fi"
import { resolveMediaUrl } from "../utils/api"

const STORY_DURATION = 5000 // 5 seconds per story
const REACTIONS = ["🔥", "💪", "❤️", "👏", "🎯"]

const StoryViewer = ({
  stories = [],
  currentStory,
  onClose,
  onNext,
  onPrevious,
  onDeleteStory,
}) => {
  if (!currentStory) return null

  const currentIndex = stories.findIndex(
    (story) => (story._id || story.id) === (currentStory._id || currentStory.id)
  )

  const [progress, setProgress] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [floatingEmojis, setFloatingEmojis] = useState([])
  const timerRef = useRef(null)
  const startTimeRef = useRef(Date.now())
  const elapsedRef = useRef(0)

  const savedProfile = JSON.parse(
    localStorage.getItem("navchetnaProfile") || "{}"
  )
  const isOwnStory =
    currentStory.isUser ||
    currentStory.username === "Your Story" ||
    currentStory.username === "You" ||
    currentStory.username === savedProfile.name

  // Reset progress when story changes
  useEffect(() => {
    setProgress(0)
    elapsedRef.current = 0
    startTimeRef.current = Date.now()
  }, [currentStory])

  // Progress timer loop
  useEffect(() => {
    if (isPaused) {
      if (timerRef.current) cancelAnimationFrame(timerRef.current)
      return
    }

    const updateProgress = () => {
      const now = Date.now()
      const delta = now - startTimeRef.current
      const currentElapsed = elapsedRef.current + delta
      const percent = Math.min(100, (currentElapsed / STORY_DURATION) * 100)
      setProgress(percent)

      if (currentElapsed >= STORY_DURATION) {
        if (currentIndex < stories.length - 1) {
          onNext()
        } else {
          onClose()
        }
      } else {
        timerRef.current = requestAnimationFrame(updateProgress)
      }
    }

    startTimeRef.current = Date.now()
    timerRef.current = requestAnimationFrame(updateProgress)

    return () => {
      if (timerRef.current) cancelAnimationFrame(timerRef.current)
      elapsedRef.current = elapsedRef.current + (Date.now() - startTimeRef.current)
    }
  }, [currentStory, isPaused, currentIndex, stories.length, onNext, onClose])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose()
      } else if (e.key === "ArrowLeft") {
        onPrevious()
      } else if (e.key === "ArrowRight") {
        onNext()
      } else if (e.key === " ") {
        e.preventDefault()
        setIsPaused((p) => !p)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [onClose, onNext, onPrevious])

  const handlePauseStart = () => {
    setIsPaused(true)
  }

  const handlePauseEnd = () => {
    setIsPaused(false)
  }

  const handleTapScreen = (e) => {
    // Ignore clicks on buttons, reactions, and overlays
    if (e.target.closest("button") || e.target.closest(".story-reactions-bar")) {
      return
    }
    const rect = e.currentTarget.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    if (clickX < rect.width * 0.35) {
      onPrevious()
    } else {
      onNext()
    }
  }

  const handleReaction = (emoji) => {
    const id = Date.now() + Math.random()
    setFloatingEmojis((prev) => [...prev, { id, emoji }])
    setTimeout(() => {
      setFloatingEmojis((prev) => prev.filter((item) => item.id !== id))
    }, 1800)
  }

  const handleDelete = () => {
    if (!window.confirm("Delete this story?")) return
    if (onDeleteStory) {
      onDeleteStory(currentStory)
    }
  }

  return (
    <div className="story-modal" onClick={onClose}>
      <div
        className="story-viewer"
        onClick={(e) => e.stopPropagation()}
        onMouseDown={handlePauseStart}
        onMouseUp={handlePauseEnd}
        onTouchStart={handlePauseStart}
        onTouchEnd={handlePauseEnd}
      >
        {/* Progress Bars */}
        <div className="story-progress-container">
          {stories.map((story, index) => {
            const storyId = story._id || story.id
            let barFill = 0
            if (index < currentIndex) {
              barFill = 100
            } else if (index === currentIndex) {
              barFill = progress
            }
            return (
              <div key={storyId} className="story-progress-track">
                <div
                  className="story-progress-fill"
                  style={{ width: `${barFill}%` }}
                />
              </div>
            )
          })}
        </div>

        {/* Top Header Overlay */}
        <div className="story-top-header">
          <div className="story-user-info">
            <img src={resolveMediaUrl(currentStory.avatar)} alt={currentStory.username} />
            <div className="story-user-meta">
              <span className="story-user-name">{currentStory.username}</span>
              <span className="story-time">
                {currentStory.createdAt
                  ? new Date(currentStory.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "Today"}
              </span>
            </div>
          </div>

          <div className="story-header-actions">
            {isPaused ? (
              <span className="pause-indicator" title="Paused">
                <FiPause />
              </span>
            ) : null}

            {isOwnStory && onDeleteStory && (
              <button
                type="button"
                className="story-action-btn delete"
                onClick={handleDelete}
                title="Delete story"
              >
                <FiTrash2 />
              </button>
            )}

            <button
              type="button"
              className="story-close-btn"
              onClick={onClose}
              aria-label="Close story"
            >
              <FiX />
            </button>
          </div>
        </div>

        {/* Tap area to advance/go back */}
        <div className="story-tap-area" onClick={handleTapScreen}>
          {/* Previous Button */}
          <button
            type="button"
            className="story-nav-btn previous"
            onClick={(e) => {
              e.stopPropagation()
              onPrevious()
            }}
            aria-label="Previous story"
          >
            <FiChevronLeft />
          </button>

          {/* Main Story Media */}
          <img
            src={resolveMediaUrl(currentStory.image)}
            alt={currentStory.username}
            className="story-main-image"
          />

          {/* Next Button */}
          <button
            type="button"
            className="story-nav-btn next"
            onClick={(e) => {
              e.stopPropagation()
              onNext()
            }}
            aria-label="Next story"
          >
            <FiChevronRight />
          </button>
        </div>

        {/* Floating Animated Emojis */}
        <div className="floating-emojis-container">
          {floatingEmojis.map((item) => (
            <span key={item.id} className="floating-emoji">
              {item.emoji}
            </span>
          ))}
        </div>

        {/* Caption & Reactions Footer */}
        <div className="story-footer-panel">
          {currentStory.caption && (
            <div className="story-caption-box">
              <p>{currentStory.caption}</p>
            </div>
          )}

          {/* Quick Reaction Emoji Bar */}
          <div className="story-reactions-bar">
            {REACTIONS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                className="story-reaction-btn"
                onClick={() => handleReaction(emoji)}
                title={`React with ${emoji}`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default StoryViewer