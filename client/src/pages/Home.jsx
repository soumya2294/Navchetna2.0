import { useState, useEffect } from "react"
import { FiChevronRight, FiUsers, FiActivity, FiTarget, FiAward } from 'react-icons/fi'
import { FaFire } from 'react-icons/fa'
import StoryBar from "../components/StoryBar"
import StoryViewer from "../components/StoryViewer"
import CreatePost from "../components/CreatePost"
import PostCard from "../components/PostCard"
import { stories } from "../data/stories"

const Home = () => {
  const [selectedStory, setSelectedStory] = useState(null)
  const [posts, setPosts] = useState([])

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem('navchetnaToken')
        const response = await fetch('http://localhost:5000/api/posts', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        if (response.ok) {
          const data = await response.json()
          setPosts(data)
        }
      } catch (error) {
        console.error("Error fetching posts:", error)
      }
    }
    
    fetchPosts()
  }, [])

  const openStory = (story) => {
    setSelectedStory(story)
  }

  const closeStory = () => {
    setSelectedStory(null)
  }

  const nextStory = () => {
    const currentIndex = stories.findIndex(story => story.id === selectedStory.id)
    const nextIndex = (currentIndex + 1) % stories.length
    setSelectedStory(stories[nextIndex])
  }

  const previousStory = () => {
    const currentIndex = stories.findIndex(story => story.id === selectedStory.id)
    const previousIndex = currentIndex === 0 ? stories.length - 1 : currentIndex - 1
    setSelectedStory(stories[previousIndex])
  }

  const createPost = (newPost) => {
    setPosts([newPost, ...posts])
  }
  return()
}