import React, { useState, useRef } from "react"
import {
  FiX,
  FiUploadCloud,
  FiLink,
  FiCheck,
  FiTrash2,
  FiSend,
} from "react-icons/fi"
import { getStoredProfile, DEFAULT_AVATAR, compressImage } from "../utils/userProfile"
import { fetchApi, uploadMediaApi, resolveMediaUrl } from "../utils/api"

const STORY_PRESETS = [
  {
    label: "Morning Run",
    url: "https://images.unsplash.com/photo-1483721310020-03333e577078?q=80&w=1200&auto=format&fit=crop",
  },
  {
    label: "Gym Grind",
    url: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1200&auto=format&fit=crop",
  },
  {
    label: "Yoga Zen",
    url: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1200&auto=format&fit=crop",
  },
  {
    label: "Power Lift",
    url: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1200&auto=format&fit=crop",
  },
]

const AddStoryModal = ({ isOpen, onClose, onStoryAdded }) => {
  const [image, setImage] = useState("")
  const [caption, setCaption] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [inputMode, setInputMode] = useState("upload") // "upload" | "url"
  const fileInputRef = useRef(null)

  if (!isOpen) return null

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file")
      return
    }

    if (file.size > 25 * 1024 * 1024) {
      alert("Image size should be under 25MB")
      return
    }

    try {
      const compressed = await compressImage(file, 1080, 1920, 0.85)
      setImage(compressed)
    } catch (err) {
      console.error("Story image processing failed:", err)
      alert("Failed to process image")
    }
  }

  const handlePresetSelect = (presetUrl) => {
    setImage(presetUrl)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!image || isSubmitting) return

    setIsSubmitting(true)
    const token = localStorage.getItem("navchetnaToken")
    const currentProfile = getStoredProfile()

    try {
      let finalImageUrl = image
      if (image.startsWith("data:")) {
        try {
          const uploadRes = await uploadMediaApi(image)
          if (uploadRes?.url) {
            finalImageUrl = uploadRes.url
          }
        } catch (uploadErr) {
          console.warn("Story image upload failed, falling back to direct URL:", uploadErr.message)
        }
      }

      const fallbackStory = {
        id: "story-" + Date.now(),
        _id: "story-" + Date.now(),
        username: currentProfile.name || "You",
        avatar: currentProfile.avatar || DEFAULT_AVATAR,
        image: finalImageUrl,
        caption: caption.trim(),
        isUser: true,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      }

      if (token) {
        try {
          const createdStory = await fetchApi("/api/stories", {
            method: "POST",
            body: JSON.stringify({
              image: finalImageUrl,
              caption: caption.trim(),
            }),
          })

          if (createdStory) {
            onStoryAdded(createdStory)
            resetAndClose()
            return
          }
        } catch (err) {
          console.warn("Story backend sync failed, using fallback:", err.message)
        }
      }

      // Fallback if offline or not logged in
      onStoryAdded(fallbackStory)
      resetAndClose()
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetAndClose = () => {
    setImage("")
    setCaption("")
    setIsSubmitting(false)
    onClose()
  }

  return (
    <div className="share-modal-backdrop" onClick={resetAndClose}>
      <div
        className="add-story-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="add-story-header">
          <h3>Add to Your Story</h3>
          <button
            type="button"
            className="share-close-btn"
            onClick={resetAndClose}
            aria-label="Close"
          >
            <FiX />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="add-story-body">
          {/* Mode Switcher */}
          <div className="story-input-tabs">
            <button
              type="button"
              className={`story-tab ${inputMode === "upload" ? "active" : ""}`}
              onClick={() => setInputMode("upload")}
            >
              <FiUploadCloud /> Upload Photo
            </button>
            <button
              type="button"
              className={`story-tab ${inputMode === "url" ? "active" : ""}`}
              onClick={() => setInputMode("url")}
            >
              <FiLink /> Image Link
            </button>
          </div>

          {/* Upload Area */}
          {inputMode === "upload" ? (
            <div
              className="story-upload-zone"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                style={{ display: "none" }}
              />
              <FiUploadCloud className="upload-zone-icon" />
              <p>Click to browse and upload image</p>
              <span>PNG, JPG, WebP up to 5MB</span>
            </div>
          ) : (
            <div className="story-url-input-wrap">
              <input
                type="url"
                placeholder="Paste story image URL (e.g. https://...)"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="story-url-input"
              />
            </div>
          )}

          {/* Quick Presets */}
          <div className="story-presets-row">
            <span className="presets-label">Presets:</span>
            {STORY_PRESETS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                className="story-preset-chip"
                onClick={() => handlePresetSelect(preset.url)}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Image Preview & Caption */}
          {image && (
            <div className="story-preview-card">
              <div className="story-preview-img-wrap">
                <img src={resolveMediaUrl(image)} alt="Story preview" />
                <button
                  type="button"
                  className="story-preview-remove"
                  onClick={() => setImage("")}
                  title="Remove image"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          )}

          {/* Caption Input */}
          <div className="story-caption-wrap">
            <input
              type="text"
              placeholder="Add a story caption or workout mood... (optional)"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              maxLength={120}
              className="story-caption-input"
            />
            <span className="caption-counter">{caption.length}/120</span>
          </div>

          {/* Footer Submit */}
          <div className="add-story-footer">
            <button
              type="button"
              className="story-cancel-btn"
              onClick={resetAndClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="story-publish-btn"
              disabled={!image || isSubmitting}
            >
              <FiSend /> {isSubmitting ? "Sharing..." : "Share Story"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddStoryModal
