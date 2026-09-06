import { useState } from "react"

import {
  FiHeart,
  FiMessageCircle,
  FiSend,
  FiMoreHorizontal,
} from "react-icons/fi"

import { FaHeart } from "react-icons/fa"


const PostCard = ({ post }) => {

  const [liked, setLiked] = useState(false)

  const [likeCount, setLikeCount] =
    useState(post.likes)

  const [showComments, setShowComments] =
    useState(false)

  const [comments, setComments] =
    useState(post.comments || [])

  const [commentText, setCommentText] =
    useState("")


  const handleLike = () => {

    if (liked) {

      setLikeCount(likeCount - 1)

    } else {

      setLikeCount(likeCount + 1)

    }

    setLiked(!liked)
  }


  const addComment = (e) => {

    e.preventDefault()

    if (!commentText.trim()) return

    const newComment = {

      id: Date.now(),

      username: "You",

      text: commentText,

    }

    setComments([
      ...comments,
      newComment,
    ])

    setCommentText("")
  }


  return (

    <article className="post-card">


      {/* Post Header */}

      <div className="post-header">

        <div className="post-user">

          <img
            src={post.avatar}
            alt={post.username}
          />

          <div>

            <h3>{post.username}</h3>

            <p>
              {post.activity} • {post.time}
            </p>

          </div>

        </div>


        <button className="more-btn">

          <FiMoreHorizontal />

        </button>

      </div>


      {/* Post Image */}

      {post.image && (

        <div className="post-image-container">

          <img
            src={post.image}
            alt="Fitness post"
            className="post-image"
          />

        </div>

      )}


      {/* Post Content */}

      <div className="post-content">

        <div className="post-actions">


          <button
            className={`action-btn ${
              liked ? "liked" : ""
            }`}
            onClick={handleLike}
          >

            {liked ? (
              <FaHeart />
            ) : (
              <FiHeart />
            )}

          </button>


          <button
            className="action-btn"
            onClick={() =>
              setShowComments(!showComments)
            }
          >

            <FiMessageCircle />

          </button>


          <button className="action-btn">

            <FiSend />

          </button>

        </div>


        {/* Likes */}

        <p className="likes-count">

          {likeCount} likes

        </p>


        {/* Caption */}

        <p className="post-caption">

          <strong>{post.username}</strong>

          {" "}

          {post.caption}

        </p>


        {/* Comments */}

        {comments.length > 0 && (

          <button
            className="view-comments-btn"
            onClick={() =>
              setShowComments(!showComments)
            }
          >

            {showComments
              ? "Hide comments"
              : `View all ${comments.length} comments`
            }

          </button>

        )}


        {/* Comments List */}

        {showComments && (

          <div className="comments-section">

            {comments.map((comment) => (

              <div
                className="comment"
                key={comment.id}
              >

                <strong>
                  {comment.username}
                </strong>

                <span>
                  {comment.text}
                </span>

              </div>

            ))}


            {/* Add Comment */}

            <form
              className="comment-form"
              onSubmit={addComment}
            >

              <input
                type="text"
                placeholder="Add a comment..."
                value={commentText}
                onChange={(e) =>
                  setCommentText(e.target.value)
                }
              />

              <button type="submit">

                Post

              </button>

            </form>

          </div>

        )}

      </div>

    </article>
  )
}

export default PostCard