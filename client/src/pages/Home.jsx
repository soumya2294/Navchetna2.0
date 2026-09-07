import { useState } from "react"

import StoryBar from "../components/StoryBar"
import StoryViewer from "../components/StoryViewer"
import CreatePost from "../components/CreatePost"
import PostCard from "../components/PostCard"

import { stories } from "../data/stories"
import { posts as initialPosts } from "../data/posts"


const Home = () => {

  const [selectedStory, setSelectedStory] =
    useState(null)

  const [posts, setPosts] =
    useState(initialPosts)


  const openStory = (story) => {

    setSelectedStory(story)

  }


  const closeStory = () => {

    setSelectedStory(null)

  }


  const nextStory = () => {

    const currentIndex =
      stories.findIndex(
        story =>
          story.id === selectedStory.id
      )

    const nextIndex =
      (currentIndex + 1) %
      stories.length

    setSelectedStory(
      stories[nextIndex]
    )

  }


  const previousStory = () => {

    const currentIndex =
      stories.findIndex(
        story =>
          story.id === selectedStory.id
      )

    const previousIndex =
      currentIndex === 0
        ? stories.length - 1
        : currentIndex - 1

    setSelectedStory(
      stories[previousIndex]
    )

  }


  const createPost = (newPost) => {

    setPosts([
      newPost,
      ...posts,
    ])

  }


  return (

    <div className="community-page">


      {/* Page Header */}


      <div className="community-layout">


        {/* Main Feed */}

        <main className="community-main">


          {/* Stories */}

          <StoryBar
            stories={stories}
            onStoryClick={openStory}
          />


          {/* Create Post */}

          <CreatePost
            onCreatePost={createPost}
          />


          {/* Feed Title */}

          <div className="feed-title">

            <h2>
              Latest from the Community
            </h2>

          </div>


          {/* Posts */}

          <div className="posts-list">

            {posts.map((post) => (

              <PostCard
                key={post.id}
                post={post}
              />

            ))}

          </div>


        </main>


        {/* Right Sidebar */}

        <aside className="community-sidebar">

          <div className="sidebar-card">

            <h3>
              🔥 Trending Challenges
            </h3>

            <div className="challenge-item">

              <span>💪</span>

              <div>

                <strong>
                  30 Day Fitness Challenge
                </strong>

                <p>
                  1.2K participants
                </p>

              </div>

            </div>


            <div className="challenge-item">

              <span>🏃</span>

              <div>

                <strong>
                  5KM Running Challenge
                </strong>

                <p>
                  845 participants
                </p>

              </div>

            </div>


            <div className="challenge-item">

              <span>🔥</span>

              <div>

                <strong>
                  7 Day Streak Challenge
                </strong>

                <p>
                  2.4K participants
                </p>

              </div>

            </div>

          </div>


          <div className="sidebar-card">

            <h3>
              🏆 Community Stats
            </h3>

            <div className="community-stats">

              <div>

                <strong>12K+</strong>

                <span>Members</span>

              </div>

              <div>

                <strong>8.5K</strong>

                <span>Workouts</span>

              </div>

              <div>

                <strong>2.1K</strong>

                <span>Posts</span>

              </div>

            </div>

          </div>

        </aside>


      </div>


      {/* Story Viewer */}

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