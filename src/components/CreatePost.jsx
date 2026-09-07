import { useState } from "react"
import {
  FiImage,
  FiSend,
  FiX,
} from "react-icons/fi"

const CreatePost = ({ onCreatePost }) => {

  const [isOpen, setIsOpen] = useState(false)

  const [caption, setCaption] = useState("")
  const [image, setImage] = useState("")

  const handleSubmit = (e) => {

    e.preventDefault()

    if (!caption.trim()) return

    const newPost = {
      id: Date.now(),

      username: "You",

      avatar:
        "https://i.pravatar.cc/150?img=11",

      activity: "Fitness Journey",

      time: "Just now",

      image: image
        ? image
        : "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1200&auto=format&fit=crop",

      caption,

      likes: 0,

      comments: [],
    }

    onCreatePost(newPost)

    setCaption("")
    setImage("")
    setIsOpen(false)
  }


  return (

    <div className="create-post-container">

      {!isOpen ? (

        <div
          className="create-post-preview"
          onClick={() => setIsOpen(true)}
        >

          <img
            src="https://i.pravatar.cc/150?img=11"
            alt="You"
          />

          <div className="create-post-placeholder">
            Share your fitness journey...
          </div>

        </div>

      ) : (

        <form
          className="create-post-form"
          onSubmit={handleSubmit}
        >

          <div className="create-post-header">

            <h3>Create Post</h3>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
            >
              <FiX />
            </button>

          </div>


          <textarea
            placeholder="What's your fitness achievement today?"
            value={caption}
            onChange={(e) =>
              setCaption(e.target.value)
            }
          />


          <div className="image-url-container">

            <FiImage />

            <input
              type="text"
              placeholder="Paste image URL (optional)"
              value={image}
              onChange={(e) =>
                setImage(e.target.value)
              }
            />

          </div>


          <button
            className="publish-post-btn"
            type="submit"
          >

            <FiSend />

            Publish Post

          </button>

        </form>

      )}

    </div>
  )
}

export default CreatePost