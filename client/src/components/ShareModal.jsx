import React, { useState } from "react"
import {
  FiX,
  FiCopy,
  FiCheck,
  FiShare2,
  FiRepeat,
  FiExternalLink,
} from "react-icons/fi"
import { FaWhatsapp, FaTwitter } from "react-icons/fa"
import { getStoredProfile, DEFAULT_AVATAR } from "../utils/userProfile"

const ShareModal = ({ post, onClose, onRepost, onShareIncrement }) => {
  const [copied, setCopied] = useState(false)
  const [repostText, setRepostText] = useState("")
  const [isReposting, setIsReposting] = useState(false)
  const [showRepostInput, setShowRepostInput] = useState(false)

  if (!post) return null

  const postId = post._id || post.id
  const author = post.userId?.name || post.username || "Athlete"
  const caption = post.caption || post.content || ""
  const shareUrl = `${window.location.origin}/#post-${postId}`
  const shareText = `Check out this fitness update by ${author} on Navchetna: "${caption.slice(0, 100)}..."`

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl)
      } else {
        const input = document.createElement("input")
        input.value = shareUrl
        document.body.appendChild(input)
        input.select()
        document.execCommand("copy")
        document.body.removeChild(input)
      }
      setCopied(true)
      triggerShareCount()
      setTimeout(() => setCopied(false), 2500)
    } catch (err) {
      console.warn("Clipboard copy notice:", err)
    }
  }

  const triggerShareCount = () => {
    if (onShareIncrement) {
      onShareIncrement(postId)
    }
  }

  const handleWhatsApp = () => {
    triggerShareCount()
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(
      `${shareText} ${shareUrl}`
    )}`
    window.open(url, "_blank", "noopener,noreferrer")
  }

  const handleTwitter = () => {
    triggerShareCount()
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      shareText
    )}&url=${encodeURIComponent(shareUrl)}&hashtags=Navchetna,Fitness`
    window.open(url, "_blank", "noopener,noreferrer")
  }

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Post by ${author} | Navchetna`,
          text: shareText,
          url: shareUrl,
        })
        triggerShareCount()
      } catch (err) {
        if (err.name !== "AbortError") {
          console.warn("Native share notice:", err)
        }
      }
    }
  }

  const handleConfirmRepost = async (e) => {
    e.preventDefault()
    setIsReposting(true)
    triggerShareCount()

    const currentProfile = getStoredProfile()

    const repostedPost = {
      id: Date.now(),
      username: currentProfile.name || "You",
      avatar: currentProfile.avatar || DEFAULT_AVATAR,
      activity: "Repost • " + (post.activity || "Fitness Journey"),
      time: "Just now",
      image: post.image || "",
      caption: repostText.trim()
        ? `${repostText.trim()}\n\n🔁 Reposted from @${author}: "${caption}"`
        : `🔁 Reposted from @${author}: "${caption}"`,
      likes: 0,
      likesCount: 0,
      sharesCount: 0,
      isLiked: false,
      comments: [],
    }

    if (onRepost) {
      await onRepost(repostedPost)
    }

    setIsReposting(false)
    onClose()
  }

  return (
    <div className="share-modal-backdrop" onClick={onClose}>
      <div
        className="share-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="share-modal-header">
          <div className="share-header-title">
            <FiShare2 className="share-icon-title" />
            <h3>Share & Forward Post</h3>
          </div>
          <button
            type="button"
            className="share-close-btn"
            onClick={onClose}
            aria-label="Close share dialog"
          >
            <FiX />
          </button>
        </div>

        {/* Post Preview Snippet */}
        <div className="share-post-preview">
          <div className="share-preview-meta">
            <img
              src={
                post.avatar ||
                post.userId?.avatar ||
                DEFAULT_AVATAR
              }
              alt={author}
              className="share-preview-avatar"
            />
            <div>
              <strong>{author}</strong>
              <p>{post.activity || "Fitness Journey"}</p>
            </div>
          </div>
          <p className="share-preview-text">
            {caption.length > 110 ? `${caption.slice(0, 110)}...` : caption}
          </p>
        </div>

        {/* Copy Link Section */}
        <div className="share-link-box">
          <input
            type="text"
            readOnly
            value={shareUrl}
            className="share-link-input"
          />
          <button
            type="button"
            className={`share-copy-btn ${copied ? "copied" : ""}`}
            onClick={handleCopyLink}
          >
            {copied ? (
              <>
                <FiCheck /> Copied!
              </>
            ) : (
              <>
                <FiCopy /> Copy Link
              </>
            )}
          </button>
        </div>

        {/* Quick Social & Forward Buttons */}
        <div className="share-actions-grid">
          <button
            type="button"
            className="share-option-btn whatsapp"
            onClick={handleWhatsApp}
          >
            <FaWhatsapp className="share-option-icon" />
            <span>WhatsApp</span>
          </button>

          <button
            type="button"
            className="share-option-btn twitter"
            onClick={handleTwitter}
          >
            <FaTwitter className="share-option-icon" />
            <span>Twitter / X</span>
          </button>

          <button
            type="button"
            className={`share-option-btn repost ${
              showRepostInput ? "active" : ""
            }`}
            onClick={() => setShowRepostInput(!showRepostInput)}
          >
            <FiRepeat className="share-option-icon" />
            <span>Repost to Feed</span>
          </button>

          {typeof navigator !== "undefined" && navigator.share && (
            <button
              type="button"
              className="share-option-btn native"
              onClick={handleNativeShare}
            >
              <FiExternalLink className="share-option-icon" />
              <span>More Apps</span>
            </button>
          )}
        </div>

        {/* Repost Comment Drawer */}
        {showRepostInput && (
          <form className="repost-form" onSubmit={handleConfirmRepost}>
            <textarea
              placeholder="Add your thoughts or workout quote to this repost..."
              value={repostText}
              onChange={(e) => setRepostText(e.target.value)}
              rows={2}
              className="repost-textarea"
            />
            <div className="repost-actions">
              <button
                type="button"
                className="repost-cancel-btn"
                onClick={() => setShowRepostInput(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="repost-submit-btn"
                disabled={isReposting}
              >
                <FiRepeat /> {isReposting ? "Reposting..." : "Forward to Feed"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default ShareModal
