import React, { useState } from "react"
import {
  FiHeart,
  FiMessageCircle,
  FiSend,
  FiMoreHorizontal,
  FiShare2,
  FiTrash2,
  FiCopy,
  FiCheck,
} from "react-icons/fi"
import { FaHeart } from "react-icons/fa"
import { DEFAULT_AVATAR } from "../utils/userProfile"
import { fetchApi, resolveMediaUrl } from "../utils/api"

const PostCard = ({ post, onShareClick, onDeletePost }) => {
  const username = post.username || post.userId?.name || "Athlete"
  const avatar =
    post.avatar || post.userId?.avatar || DEFAULT_AVATAR
  const caption = post.caption || post.content || ""
  const time =
    post.time ||
    (post.createdAt ? new Date(post.createdAt).toLocaleDateString() : "Just now")

  const initialLikes =
    post.likesCount !== undefined
      ? post.likesCount
      : Array.isArray(post.likes)
      ? post.likes.length
      : typeof post.likes === "number"
      ? post.likes
      : 0

  const sharesCount = post.sharesCount !== undefined ? post.sharesCount : 0

  const [liked, setLiked] = useState(post.isLiked || false)
  const [likeCount, setLikeCount] = useState(initialLikes)
  const [showComments, setShowComments] = useState(false)
  const [comments, setComments] = useState(post.comments || [])
  const [commentText, setCommentText] = useState("")
  const [showMenu, setShowMenu] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const savedProfile = JSON.parse(
    localStorage.getItem("navchetnaProfile") || "{}"
  )
  const currentUserId = savedProfile._id || savedProfile.id
  const postAuthorId = post.userId?._id || post.userId
  const isAuthor =
    (currentUserId &&
      postAuthorId &&
      String(currentUserId) === String(postAuthorId)) ||
    username === "You" ||
    username === savedProfile.name

  const handleLike = async () => {
    const token = localStorage.getItem("navchetnaToken")
    const nextLiked = !liked
    const nextCount = nextLiked ? likeCount + 1 : Math.max(0, likeCount - 1)

    // Optimistic update
    setLiked(nextLiked)
    setLikeCount(nextCount)

    if (post._id && token) {
      try {
        const data = await fetchApi(`/api/posts/${post._id}/like`, {
          method: "PUT",
        })
        if (data) {
          setLiked(data.isLiked)
          setLikeCount(data.likesCount)
        }
      } catch (error) {
        console.warn("Like sync failed, maintaining local state:", error.message)
      }
    }
  }

  const handleShareClick = () => {
    if (onShareClick) {
      onShareClick(post)
    }
  }

  const handleCopyLink = async () => {
    const postId = post._id || post.id
    const shareUrl = `${window.location.origin}/#post-${postId}`
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
      setCopiedLink(true)
      setTimeout(() => setCopiedLink(false), 2000)
      setShowMenu(false)
    } catch (err) {
      console.warn("Failed to copy link:", err)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return
    setIsDeleting(true)
    const token = localStorage.getItem("navchetnaToken")
    const postId = post._id || post.id

    if (token && post._id) {
      try {
        await fetchApi(`/api/posts/${post._id}`, {
          method: "DELETE",
        })
      } catch (err) {
        console.warn("Delete post network notice:", err.message)
      }
    }

    if (onDeletePost) {
      onDeletePost(postId)
    }
    setIsDeleting(false)
    setShowMenu(false)
  }

  const addComment = async (e) => {
    e.preventDefault()
    if (!commentText.trim()) return

    const token = localStorage.getItem("navchetnaToken")

    const localComment = {
      id: Date.now(),
      username: savedProfile.name || "You",
      text: commentText.trim(),
    }

    if (post._id && token) {
      try {
        const data = await fetchApi(`/api/posts/${post._id}/comment`, {
          method: "POST",
          body: JSON.stringify({ text: commentText.trim() }),
        })

        if (data) {
          setComments(data.comments || [...comments, data.comment])
          setCommentText("")
          return
        }
      } catch (error) {
        console.warn("Comment sync failed, appending locally:", error.message)
      }
    }

    // Local fallback
    setComments([...comments, localComment])
    setCommentText("")
  }

  return (
    <article className="post-card" id={`post-${post._id || post.id}`}>
      {/* Post Header */}
      <div className="post-header">
        <div className="post-user">
          <img src={resolveMediaUrl(avatar)} alt={username} />
          <div>
            <h3>{username}</h3>
            <p>
              {post.activity || "Fitness Journey"} • {time}
            </p>
          </div>
        </div>

        <div className="post-more-wrap">
          <button
            type="button"
            className="more-btn"
            onClick={() => setShowMenu(!showMenu)}
            aria-label="Post options"
          >
            <FiMoreHorizontal />
          </button>

          {showMenu && (
            <div className="post-dropdown-menu">
              <button
                type="button"
                className="dropdown-item"
                onClick={handleCopyLink}
              >
                {copiedLink ? <FiCheck className="text-green" /> : <FiCopy />}
                <span>{copiedLink ? "Link Copied!" : "Copy Post Link"}</span>
              </button>

              <button
                type="button"
                className="dropdown-item"
                onClick={() => {
                  setShowMenu(false)
                  handleShareClick()
                }}
              >
                <FiShare2 />
                <span>Forward / Share...</span>
              </button>

              {isAuthor && (
                <button
                  type="button"
                  className="dropdown-item delete"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  <FiTrash2 />
                  <span>{isDeleting ? "Deleting..." : "Delete Post"}</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Post Image */}
      {post.image && (
        <div className="post-image-container">
          <img src={resolveMediaUrl(post.image)} alt="Fitness post" className="post-image" />
        </div>
      )}

      {/* Post Content & Actions */}
      <div className="post-content">
        <div className="post-actions">
          <button
            type="button"
            className={`action-btn ${liked ? "liked" : ""}`}
            onClick={handleLike}
            title={liked ? "Unlike" : "Like"}
          >
            {liked ? <FaHeart /> : <FiHeart />}
          </button>

          <button
            type="button"
            className="action-btn"
            onClick={() => setShowComments(!showComments)}
            title="Comments"
          >
            <FiMessageCircle />
          </button>

          <button
            type="button"
            className="action-btn share-btn"
            onClick={handleShareClick}
            title="Forward / Share"
          >
            <FiSend />
          </button>
        </div>

        {/* Likes and Shares Count */}
        <div className="post-stats-row">
          <span className="likes-count">{likeCount} likes</span>
          {sharesCount > 0 && (
            <span className="shares-count">• {sharesCount} shares</span>
          )}
        </div>

        {/* Caption */}
        <p className="post-caption">
          <strong>{username}</strong> {caption}
        </p>

        {/* Comments Toggle */}
        {comments.length > 0 && (
          <button
            type="button"
            className="view-comments-btn"
            onClick={() => setShowComments(!showComments)}
          >
            {showComments
              ? "Hide comments"
              : `View all ${comments.length} comments`}
          </button>
        )}

        {/* Comments List */}
        {showComments && (
          <div className="comments-section">
            {comments.map((comment) => (
              <div className="comment" key={comment._id || comment.id}>
                <strong>
                  {comment.userId?.name || comment.username || "Athlete"}
                </strong>
                <span>{comment.text}</span>
              </div>
            ))}

            {/* Add Comment */}
            <form className="comment-form" onSubmit={addComment}>
              <input
                type="text"
                placeholder="Add a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <button type="submit">Post</button>
            </form>
          </div>
        )}
      </div>
    </article>
  )
}

export default PostCard