import React, { useState, useRef } from "react"
import {
  FiImage,
  FiUploadCloud,
  FiSend,
  FiX,
  FiTrash2,
  FiTag,
} from "react-icons/fi"
import { useProfile, DEFAULT_AVATAR, compressImage } from "../utils/userProfile"
import { fetchApi, uploadMediaApi } from "../utils/api"

const ACTIVITIES = [
  "Fitness Journey",
  "Strength Training",
  "Running",
  "Yoga & Flexibility",
  "CrossFit",
  "Healthy Nutrition",
]

const CreatePost = ({ onCreatePost }) => {
  const { profile } = useProfile()
  const [isOpen, setIsOpen] = useState(false)
  const [caption, setCaption] = useState("")
  const [image, setImage] = useState("")
  const [activity, setActivity] = useState("Fitness Journey")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imageInputMode, setImageInputMode] = useState("upload") // "upload" | "url"
  const fileInputRef = useRef(null)

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 20 * 1024 * 1024) {
      alert("Image size should be under 20MB")
      return
    }

    try {
      // Compress to high quality feed size (max 1200x1200)
      const compressed = await compressImage(file, 1200, 1200, 0.85)
      setImage(compressed)
    } catch {
      const reader = new FileReader()
      reader.onloadend = () => setImage(reader.result)
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!caption.trim() || isSubmitting) return

    setIsSubmitting(true)
    const token = localStorage.getItem("navchetnaToken")

    let finalImageUrl = image || "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1200&auto=format&fit=crop"

    // If image is a base64 data URL, upload to server storage
    if (image && image.startsWith("data:")) {
      try {
        const uploadRes = await uploadMediaApi(image)
        if (uploadRes && uploadRes.url) {
          finalImageUrl = uploadRes.url
        }
      } catch (uploadErr) {
        console.warn("Could not upload to server static storage, using inline:", uploadErr.message)
      }
    }

    const fallbackPost = {
      id: Date.now(),
      _id: "post-" + Date.now(),
      username: profile.name || "You",
      avatar: profile.avatar || DEFAULT_AVATAR,
      activity: activity || "Fitness Journey",
      time: "Just now",
      image: finalImageUrl,
      caption: caption.trim(),
      likes: [],
      likesCount: 0,
      sharesCount: 0,
      isLiked: false,
      comments: [],
      createdAt: new Date(),
    }

    if (token) {
      try {
        const createdPost = await fetchApi("/api/posts", {
          method: "POST",
          body: JSON.stringify({
            content: caption.trim(),
            image: finalImageUrl,
            activity: activity || "Fitness Journey",
          }),
        })

        if (createdPost) {
          onCreatePost(createdPost)
          resetForm()
          return
        }
      } catch (err) {
        console.warn("Backend sync notice, creating locally:", err.message)
      }
    }

    // Fallback if not logged in or server unreachable
    onCreatePost(fallbackPost)
    resetForm()
  }

  const resetForm = () => {
    setCaption("")
    setImage("")
    setActivity("Fitness Journey")
    setIsOpen(false)
    setIsSubmitting(false)
  }

  return (
    <div className="create-post-container">
      {!isOpen ? (
        <div className="create-post-preview" onClick={() => setIsOpen(true)}>
          <img src={profile.avatar || DEFAULT_AVATAR} alt="You" />
          <div className="create-post-placeholder">
            Share your fitness journey or workout win today...
          </div>
        </div>
      ) : (
        <form className="create-post-form" onSubmit={handleSubmit}>
          <div className="create-post-header">
            <h3>Create Post</h3>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close"
            >
              <FiX />
            </button>
          </div>

          {/* Activity Category Selection */}
          <div className="create-post-activities">
            <span className="activity-label">
              <FiTag /> Activity:
            </span>
            <div className="activity-chips">
              {ACTIVITIES.map((act) => (
                <button
                  key={act}
                  type="button"
                  className={`activity-chip ${activity === act ? "active" : ""}`}
                  onClick={() => setActivity(act)}
                >
                  {act}
                </button>
              ))}
            </div>
          </div>

          <textarea
            placeholder="What's your fitness achievement or thought today?"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            rows={3}
          />

          {/* Image Input Options */}
          <div className="create-post-media-controls">
            <div className="media-mode-toggle">
              <button
                type="button"
                className={`media-tab ${imageInputMode === "upload" ? "active" : ""}`}
                onClick={() => setImageInputMode("upload")}
              >
                <FiUploadCloud /> Upload Image
              </button>
              <button
                type="button"
                className={`media-tab ${imageInputMode === "url" ? "active" : ""}`}
                onClick={() => setImageInputMode("url")}
              >
                <FiImage /> Image URL
              </button>
            </div>

            {imageInputMode === "upload" ? (
              <div
                className="file-upload-trigger"
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  style={{ display: "none" }}
                />
                <FiUploadCloud /> Click to choose image from device
              </div>
            ) : (
              <div className="image-url-container">
                <FiImage />
                <input
                  type="url"
                  placeholder="Paste image URL (optional)"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                />
              </div>
            )}
          </div>

          {/* Image Preview */}
          {image && (
            <div className="post-create-preview-wrap">
              <img src={image} alt="Post upload preview" />
              <button
                type="button"
                className="post-preview-remove-btn"
                onClick={() => setImage("")}
                title="Remove image"
              >
                <FiTrash2 />
              </button>
            </div>
          )}

          <div className="create-post-footer">
            <button
              type="button"
              className="create-post-cancel-btn"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </button>
            <button
              className="publish-post-btn"
              type="submit"
              disabled={!caption.trim() || isSubmitting}
            >
              <FiSend />
              {isSubmitting ? "Publishing..." : "Publish Post"}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

export default CreatePost