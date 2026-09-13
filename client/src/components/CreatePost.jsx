import { useState } from "react"
import { FiImage, FiSend, FiX } from "react-icons/fi"

const CreatePost = ({ onCreatePost }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [caption, setCaption] = useState("")
  const [image, setImage] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!caption.trim()) return

    try {
      const token = localStorage.getItem('navchetnaToken')
      
      const response = await fetch('http://localhost:5000/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          content: caption,
          image: image
        })
      })

      if (response.ok) {
        const newPost = await response.json()
        onCreatePost(newPost)
        setCaption("")
        setImage("")
        setIsOpen(false)
      }
    } catch (error) {
      console.error(error)
    }
  }

  return 
}
export default CreatePost