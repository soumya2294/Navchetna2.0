import { useState, useEffect } from "react"
import {
  FiChevronRight,
  FiUsers,
  FiActivity,
  FiTarget,
  FiAward,
} from "react-icons/fi"
import { FaFire } from "react-icons/fa"
import StoryBar from "../components/StoryBar"
import StoryViewer from "../components/StoryViewer"
import CreatePost from "../components/CreatePost"
import PostCard from "../components/PostCard"
import ShareModal from "../components/ShareModal"
import AddStoryModal from "../components/AddStoryModal"
import { stories as initialStories } from "../data/stories"
import { posts as initialPosts } from "../data/posts"
import { fetchApi } from "../utils/api"

const Home = () => {
  const [selectedStory, setSelectedStory] = useState(null)
  const [storiesList, setStoriesList] = useState(initialStories)
  const [posts, setPosts] = useState(initialPosts)
  const [sharingPost, setSharingPost] = useState(null)
  const [shareCallback, setShareCallback] = useState(null)
  const [isAddStoryOpen, setIsAddStoryOpen] = useState(false)

  const fetchCommunityData = async () => {
    try {
      const [postsRes, storiesRes] = await Promise.allSettled([
        fetchApi("/api/posts"),
        fetchApi("/api/stories"),
      ])

      if (postsRes.status === "fulfilled" && Array.isArray(postsRes.value) && postsRes.value.length > 0) {
        setPosts(postsRes.value)
      }

      if (storiesRes.status === "fulfilled" && Array.isArray(storiesRes.value) && storiesRes.value.length > 0) {
        setStoriesList(storiesRes.value)
      }
    } catch (error) {
      console.warn("Community live data fetch notice:", error.message)
    }
  }

  useEffect(() => {
    fetchCommunityData()

    // Periodically refresh community feed every 30 seconds to sync with other online members
    const interval = setInterval(fetchCommunityData, 30000)
    return () => clearInterval(interval)
  }, [])

  const openStory = (story) => {
    setSelectedStory(story)
  }

  const closeStory = () => {
    setSelectedStory(null)
  }

  const nextStory = () => {
    if (!selectedStory || storiesList.length === 0) return
    const currentIndex = storiesList.findIndex(
      (story) => (story._id || story.id) === (selectedStory._id || selectedStory.id)
    )
    if (currentIndex < storiesList.length - 1) {
      setSelectedStory(storiesList[currentIndex + 1])
    } else {
      setSelectedStory(null)
    }
  }

  const previousStory = () => {
    if (!selectedStory || storiesList.length === 0) return
    const currentIndex = storiesList.findIndex(
      (story) => (story._id || story.id) === (selectedStory._id || selectedStory.id)
    )
    if (currentIndex > 0) {
      setSelectedStory(storiesList[currentIndex - 1])
    }
  }

  const createPost = (newPost) => {
    setPosts((prev) => [newPost, ...prev])
  }

  const handleShareClick = (post) => {
    setSharingPost(post)
  }

  const handleShareIncrement = async (postId) => {
    // Update local post state
    setPosts((prev) =>
      prev.map((p) => {
        if ((p._id || p.id) === postId) {
          return { ...p, sharesCount: (p.sharesCount || 0) + 1 }
        }
        return p
      })
    )

    try {
      await fetchApi(`/api/posts/${postId}/share`, {
        method: "PUT",
      })
    } catch (err) {
      console.warn("Share increment notice:", err.message)
    }
  }

  const handleRepost = async (repostedPost) => {
    setPosts((prev) => [repostedPost, ...prev])

    try {
      await fetchApi("/api/posts", {
        method: "POST",
        body: JSON.stringify({
          content: repostedPost.caption,
          image: repostedPost.image,
          activity: repostedPost.activity,
        }),
      })
    } catch (err) {
      console.warn("Repost sync notice:", err.message)
    }
  }

  const handleDeletePost = (postId) => {
    setPosts((prev) => prev.filter((p) => (p._id || p.id) !== postId))
  }

  const handleStoryAdded = (newStory) => {
    setStoriesList((prev) => [newStory, ...prev])
  }

  const handleDeleteStory = async (storyToDelete) => {
    const storyId = storyToDelete._id || storyToDelete.id
    setStoriesList((prev) =>
      prev.filter((s) => (s._id || s.id) !== storyId)
    )
    setSelectedStory(null)

    if (storyToDelete._id) {
      try {
        await fetchApi(`/api/stories/${storyToDelete._id}`, {
          method: "DELETE",
        })
      } catch (err) {
        console.warn("Delete story network notice:", err.message)
      }
    }
  }

  return (
    <div className="community-page">
      <div className="community-layout">
        <main className="community-main">
          <StoryBar
            stories={storiesList}
            onStoryClick={openStory}
            onAddStoryClick={() => setIsAddStoryOpen(true)}
          />

          <CreatePost onCreatePost={createPost} />

          <div className="feed-title">
            <h2>Latest from the Community</h2>
          </div>

          <div className="posts-list">
            {posts.length > 0 ? (
              posts.map((post) => (
                <PostCard
                  key={post._id || post.id}
                  post={post}
                  onShareClick={handleShareClick}
                  onDeletePost={handleDeletePost}
                />
              ))
            ) : (
              <p className="no-posts-msg">
                No posts yet. Be the first to share your fitness journey!
              </p>
            )}
          </div>
        </main>

        <aside className="community-sidebar">
          <div className="modern-sidebar-card gradient-border">
            <div className="card-header">
              <FaFire className="header-icon orange" />
              <h3>Trending Challenges</h3>
            </div>
            <div className="challenge-list">
              <div className="modern-challenge-item">
                <div className="challenge-icon-box bg-orange">
                  <FiTarget />
                </div>
                <div className="challenge-info">
                  <strong>30 Day Fitness Challenge</strong>
                  <p>1.2K participants</p>
                </div>
                <FiChevronRight className="action-arrow" />
              </div>

              <div className="modern-challenge-item">
                <div className="challenge-icon-box bg-blue">
                  <FiActivity />
                </div>
                <div className="challenge-info">
                  <strong>5KM Running Challenge</strong>
                  <p>845 participants</p>
                </div>
                <FiChevronRight className="action-arrow" />
              </div>

              <div className="modern-challenge-item">
                <div className="challenge-icon-box bg-purple">
                  <FiAward />
                </div>
                <div className="challenge-info">
                  <strong>7 Day Streak Challenge</strong>
                  <p>2.4K participants</p>
                </div>
                <FiChevronRight className="action-arrow" />
              </div>
            </div>
          </div>

          <div className="modern-sidebar-card">
            <div className="card-header">
              <FiUsers className="header-icon blue" />
              <h3>Community Stats</h3>
            </div>
            <div className="modern-stats-grid">
              <div className="stat-card">
                <div className="stat-value orange-gradient">12K+</div>
                <div className="stat-label">Members</div>
              </div>
              <div className="stat-card">
                <div className="stat-value blue-gradient">8.5K</div>
                <div className="stat-label">Workouts</div>
              </div>
              <div className="stat-card">
                <div className="stat-value purple-gradient">2.1K</div>
                <div className="stat-label">Posts</div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Story Viewer Modal */}
      {selectedStory && (
        <StoryViewer
          stories={storiesList}
          currentStory={selectedStory}
          onClose={closeStory}
          onNext={nextStory}
          onPrevious={previousStory}
          onDeleteStory={handleDeleteStory}
        />
      )}

      {/* Share / Forward Post Modal */}
      {sharingPost && (
        <ShareModal
          post={sharingPost}
          onClose={() => setSharingPost(null)}
          onRepost={handleRepost}
          onShareIncrement={handleShareIncrement}
        />
      )}

      {/* Add Story Modal */}
      <AddStoryModal
        isOpen={isAddStoryOpen}
        onClose={() => setIsAddStoryOpen(false)}
        onStoryAdded={handleStoryAdded}
      />
    </div>
  )
}

export default Home