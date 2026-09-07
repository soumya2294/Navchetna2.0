import { useState } from "react"
import { FiChevronRight, FiUsers, FiActivity, FiTarget, FiAward } from 'react-icons/fi'
import { FaFire } from 'react-icons/fa'
import StoryBar from "../components/StoryBar"
import StoryViewer from "../components/StoryViewer"
import CreatePost from "../components/CreatePost"
import PostCard from "../components/PostCard"
import { stories } from "../data/stories"
import { posts as initialPosts } from "../data/posts"

const Home = () => {
  const [selectedStory, setSelectedStory] = useState(null)
  const [posts, setPosts] = useState(initialPosts)

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

  return (
    <div className="community-page">
      <div className="community-layout">
        
        <main className="community-main">
          <StoryBar stories={stories} onStoryClick={openStory} />
          <CreatePost onCreatePost={createPost} />
          <div className="feed-title">
            <h2>Latest from the Community</h2>
          </div>
          <div className="posts-list">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
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

      {selectedStory && (
        <StoryViewer
          stories={stories}
          currentStory={selectedStory}
          onClose={closeStory}
          onNext={nextStory}
          onPrevious={previousStory}
        />
      )}
    </div>
  )
}

export default Home