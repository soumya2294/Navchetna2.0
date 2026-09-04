import { useState } from "react";

import {
  FiHeart,
  FiMessageCircle,
  FiBookmark,
  FiMoreHorizontal,
  FiSearch,
  FiBell,
  FiAward,
  FiTarget,
} from "react-icons/fi";

import { stories, posts } from "../data/dummy";

const Home = () => {
  const [likedPosts, setLikedPosts] = useState([]);

  const toggleLike = (id) => {
    setLikedPosts((current) =>
      current.includes(id)
        ? current.filter((postId) => postId !== id)
        : [...current, id]
    );
  };

  return (
    <div className="home-page">
      <div className="top-header">
        <h1>
          Fitness Feed <span>♡</span>
        </h1>

        <div className="top-actions">
          <button>
            <FiSearch />
          </button>

          <button className="top-notification">
            <FiBell />
            <span>3</span>
          </button>

          <img
            src="https://i.pravatar.cc/150?img=11"
            alt="User"
          />
        </div>
      </div>

      <div className="feed-layout">

        {/* MAIN FITNESS FEED */}
        <section className="feed-column">

          {/* STORIES */}
          <div className="stories-card">
            <div className="stories">
              {stories.map((story) => (
                <div className="story" key={story.id}>

                  {story.type === "add" ? (
                    <div className="add-story">+</div>
                  ) : story.type === "challenge" ? (
                    <div className="challenge-story">🏆</div>
                  ) : (
                    <div className="story-ring">
                      <img
                        src={story.image}
                        alt={story.name}
                        className="story-image"
                      />
                    </div>
                  )}

                  <p>{story.name}</p>
                </div>
              ))}
            </div>
          </div>

          {/* FITNESS POSTS */}
          {posts.map((post) => {
            const isLiked = likedPosts.includes(post.id);
            const totalLikes = post.likes + (isLiked ? 1 : 0);

            return (
              <article className="post-card" key={post.id}>

                <div className="post-header">
                  <div className="post-user-info">
                    <img
                      src={post.avatar}
                      alt={post.username}
                      className="post-avatar"
                    />

                    <div>
                      <h4>
                        {post.username}
                        <span className="verified">✓</span>
                      </h4>

                      <p>{post.location}</p>
                    </div>
                  </div>

                  <div className="post-time">
                    <span>{post.time}</span>
                    <FiMoreHorizontal />
                  </div>
                </div>

                <img
                  src={post.image}
                  alt="Fitness workout"
                  className="post-image"
                />

                <div className="post-actions">
                  <div className="action-group">
                    <button
                      className={`action-btn ${
                        isLiked ? "liked" : ""
                      }`}
                      onClick={() => toggleLike(post.id)}
                    >
                      <FiHeart />
                    </button>

                    <button className="action-btn">
                      <FiMessageCircle />
                    </button>
                  </div>

                  <button className="action-btn">
                    <FiBookmark />
                  </button>
                </div>

                <div className="post-content">
                  <div className="post-stats">
                    <span>
                      <FiHeart className="heart-small" />
                      {totalLikes.toLocaleString()}
                    </span>

                    <span>
                      <FiMessageCircle />
                      {post.comments}
                    </span>
                  </div>

                  <p className="post-caption">
                    <strong>{post.username}</strong>
                    {post.caption}
                  </p>

                  <button className="view-comments">
                    View all {post.comments} comments
                  </button>
                </div>
              </article>
            );
          })}
        </section>

        {/* RIGHT SIDEBAR */}
        <aside className="right-sidebar">

          {/* USER CARD */}
          <div className="profile-summary">
            <div className="profile-summary-top">
              <img
                src="https://i.pravatar.cc/150?img=11"
                alt="Sachin"
              />

              <div>
                <h3>Sachin Kumar</h3>
                <p>@sachin.fit</p>
              </div>
            </div>

            <div className="profile-summary-stats">
              <div>
                <strong>52</strong>
                <span>Posts</span>
              </div>

              <div>
                <strong>1.2K</strong>
                <span>Followers</span>
              </div>

              <div>
                <strong>320</strong>
                <span>Following</span>
              </div>
            </div>
          </div>

          {/* STREAK */}
          <div className="fitness-card streak-card">
            <div>
              <p className="card-title">🔥 Current Streak</p>
              <h2>12 Days</h2>
              <p>Keep showing up!</p>
            </div>

            <div className="fire-icon">🔥</div>
          </div>

          {/* TODAY PROGRESS */}
          <div className="fitness-card">
            <p className="card-title">📊 Today's Progress</p>

            <div className="goal-item">
              <div className="goal-header">
                <span>🔥 Calories</span>
                <strong>1,240 / 2,000</strong>
              </div>

              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{ width: "62%" }}
                ></div>
              </div>
            </div>

            <div className="goal-item">
              <div className="goal-header">
                <span>👟 Steps</span>
                <strong>8,542 / 10,000</strong>
              </div>

              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{ width: "85%" }}
                ></div>
              </div>
            </div>

            <div className="goal-item">
              <div className="goal-header">
                <span>💧 Water</span>
                <strong>1.8 / 3L</strong>
              </div>

              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{ width: "60%" }}
                ></div>
              </div>
            </div>

            <div className="workout-completed">
              <span>💪 Workout</span>
              <strong>Completed ✓</strong>
            </div>
          </div>

          {/* WEEKLY CHALLENGE */}
          <div className="fitness-card challenge-card">
            <div className="challenge-header">
              <p className="card-title">
                <FiTarget /> Weekly Challenge
              </p>

              <FiAward className="challenge-trophy" />
            </div>

            <h3>10K Steps Challenge</h3>

            <p>
              Complete 10,000 steps for 5 days this week and earn a badge.
            </p>

            <div className="challenge-progress-bar">
              <div></div>
            </div>

            <strong className="challenge-days">
              4 / 5 Days
            </strong>
          </div>

          {/* LEADERBOARD */}
          <div className="fitness-card leaderboard-card">
            <div className="leaderboard-heading">
              <p className="card-title">🏆 Leaderboard</p>
              <button>View All</button>
            </div>

            <div className="leaderboard-user">
              <span className="rank">🥇</span>
              <img
                src="https://i.pravatar.cc/150?img=12"
                alt="Rahul"
              />
              <span className="leader-name">Rahul</span>
              <strong>12,450 XP</strong>
            </div>

            <div className="leaderboard-user current-user">
              <span className="rank">2</span>
              <img
                src="https://i.pravatar.cc/150?img=11"
                alt="Sachin"
              />
              <span className="leader-name">Sachin</span>
              <strong>10,820 XP</strong>
            </div>

            <div className="leaderboard-user">
              <span className="rank">🥉</span>
              <img
                src="https://i.pravatar.cc/150?img=47"
                alt="Riya"
              />
              <span className="leader-name">Riya</span>
              <strong>9,640 XP</strong>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Home;