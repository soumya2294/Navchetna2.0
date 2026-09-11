import React, { useEffect, useState } from "react";

import {
  FiMapPin,
  FiZap,
  FiHeart,
  FiMessageCircle,
  FiShare2,
  FiEdit2,
  FiActivity,
  FiCalendar,
  FiTrendingUp,
  FiX,
  FiUser,
  FiTrash2,
  FiCamera,
} from "react-icons/fi";


const defaultProfile = {
  name: "ISHOWSPEED",
  title: "Hybrid Athlete & Marathon Runner",
  location: "Budge Budge, West Bengal",
  age: "20",
  gender: "Male",
  avatar: "https://static-cdn.jtvnw.net/jtv_user_pictures/46a38d3a-a39c-4c43-ac12-c331b1c469c2-profile_image-300x300.png",

  posts: "42",
  followers: "2,985",
  following: "132",

  workouts: "342",
  activeDays: "180",
  streak: "12",

  disciplines: [
    "Calisthenics",
    "Powerlifting",
    "HIIT",
    "Endurance Running",
    "Mobility",
  ],
};


const defaultPosts = [
  {
    id: 1,

    text:
      "Just crushed a 10km morning run! The weather in Budge Budge is absolutely perfect for endurance training today. Who else is getting their miles in? 🏃‍♂️💨",

    time: "2 hours ago",

    likes: 24,

    comments: 5,
  },

  {
    id: 2,

    text:
      "Hit a new PR on the bench press today! 225lbs for 3 solid reps. Consistency in the Training Zone is finally paying off. 💪🔥",

    time: "Yesterday",

    likes: 156,

    comments: 12,
  },
];


const Profile = () => {

  const [isEditing, setIsEditing] = useState(false);


  /* =========================================
     PROFILE STATE
  ========================================= */

  const [profileData, setProfileData] =
    useState(defaultProfile);


  /* =========================================
     POSTS STATE
  ========================================= */

  const [posts, setPosts] =
    useState(defaultPosts);


  /* =========================================
     LOAD DATA
  ========================================= */

  useEffect(() => {

    const savedProfile =
      localStorage.getItem("navchetnaProfile");

    const savedPosts =
      localStorage.getItem("navchetnaPosts");


    if (savedProfile) {

      setProfileData(
        JSON.parse(savedProfile)
      );

    }


    if (savedPosts) {

      setPosts(
        JSON.parse(savedPosts)
      );

    }

  }, []);



  /* =========================================
     INPUT CHANGE
  ========================================= */

  const handleInputChange = (e) => {

    const { name, value } = e.target;


    setProfileData((prev) => ({

      ...prev,

      [name]: value,

    }));

  };



  /* =========================================
     DISCIPLINE CHANGE
  ========================================= */

  const handleDisciplinesChange = (e) => {

    const disciplines = e.target.value

      .split(",")

      .map((item) => item.trim())

      .filter((item) => item !== "");


    setProfileData((prev) => ({

      ...prev,

      disciplines,

    }));

  };



  /* =========================================
     SAVE PROFILE
  ========================================= */

  const handleSave = (e) => {

    e.preventDefault();


    localStorage.setItem(

      "navchetnaProfile",

      JSON.stringify(profileData)

    );


    setIsEditing(false);

  };



  /* =========================================
     DELETE POST
  ========================================= */

  const handleDeletePost = (postId) => {

    const confirmDelete = window.confirm(

      "Are you sure you want to delete this post?"

    );


    if (!confirmDelete) return;


    const updatedPosts = posts.filter(

      (post) => post.id !== postId

    );


    setPosts(updatedPosts);


    localStorage.setItem(

      "navchetnaPosts",

      JSON.stringify(updatedPosts)

    );

  };



  return (

    <div className="profile-page-wrapper">


      {/* =====================================
          PROFILE HEADER
      ====================================== */}

      <div className="profile-card header-card">


        <div className="profile-banner"></div>


        <div className="profile-header-content">


          {/* PROFILE IMAGE */}

          <div className="header-left-col">

            <div className="profile-avatar-container">

              <img
                src={profileData.avatar}
                alt="Profile"
                className="profile-avatar-squircle"
              />

            </div>

          </div>



          {/* PROFILE INFORMATION */}

          <div className="header-mid-col">


            <div className="name-badge-row">

              <h1 className="athlete-header-name">

                {profileData.name}

              </h1>


              <span className="pro-badge">

                PRO

                <FiZap size={11} />

              </span>

            </div>



            <p className="user-title">

              {profileData.title}

            </p>



            <div className="profile-details-row">


              <span className="profile-location">

                <FiMapPin size={14} />

                {profileData.location}

              </span>


              <span className="profile-location">

                <FiUser size={14} />

                {profileData.age} yrs,
                {" "}
                {profileData.gender}

              </span>


            </div>



            <div className="profile-actions-inline">


              <button className="btn-primary">

                Follow

              </button>


              <button className="btn-outline">

                Message

              </button>


              <button
                className="btn-outline edit-profile-btn"
                onClick={() => setIsEditing(true)}
              >

                <FiEdit2 size={14} />

                Edit Profile

              </button>


            </div>


          </div>



          {/* PROFILE STATS */}

          <div className="header-right-col">


            <div className="stat-item">

              <span className="stat-val">

                {posts.length}

              </span>

              <span className="stat-lbl">

                Posts

              </span>

            </div>


            <div className="stat-item">

              <span className="stat-val">

                {profileData.followers}

              </span>

              <span className="stat-lbl">

                Followers

              </span>

            </div>


            <div className="stat-item">

              <span className="stat-val">

                {profileData.following}

              </span>

              <span className="stat-lbl">

                Following

              </span>

            </div>


          </div>


        </div>



        {/* TABS */}

        <div className="header-tabs">

          <button className="tab active">

            Overview

          </button>

          <button className="tab">

            Training Log

          </button>

          <button className="tab">

            Milestones

          </button>

          <button className="tab">

            Nutrition

          </button>

        </div>


      </div>



      {/* =====================================
          TRAINING + PERFORMANCE
      ====================================== */}

      <div className="profile-grid-row">


        {/* TRAINING DISCIPLINES */}

        <div className="profile-card">

          <h3 className="card-title">

            Training Disciplines

          </h3>


          <div className="tags-container">

            {profileData.disciplines.map(

              (discipline, index) => (

                <span
                  className="tag"
                  key={index}
                >

                  {discipline}

                </span>

              )

            )}

          </div>


        </div>



        {/* PERFORMANCE */}

        <div className="profile-card">

          <h3 className="card-title">

            Performance

          </h3>


          <div className="performance-stats-grid">


            <div className="perf-stat-box">

              <div className="perf-icon-wrapper">

                <FiActivity />

              </div>


              <div>

                <span className="perf-val">

                  {profileData.workouts}

                </span>

                <span className="perf-lbl">

                  Workouts

                </span>

              </div>


            </div>



            <div className="perf-stat-box">

              <div className="perf-icon-wrapper">

                <FiCalendar />

              </div>


              <div>

                <span className="perf-val">

                  {profileData.activeDays}

                </span>

                <span className="perf-lbl">

                  Active Days

                </span>

              </div>


            </div>



            <div className="perf-stat-box">

              <div className="perf-icon-wrapper">

                <FiTrendingUp />

              </div>


              <div>

                <span className="perf-val">

                  {profileData.streak}

                </span>

                <span className="perf-lbl">

                  Day Streak

                </span>

              </div>


            </div>


          </div>


        </div>


      </div>



      {/* =====================================
          MY POSTS
      ====================================== */}

      <div className="profile-card posts-card">


        <div className="posts-heading">

          <div>

            <h3 className="card-title">

              My Posts

            </h3>


            <p className="posts-subtitle">

              Manage and track your shared fitness journey.

            </p>

          </div>


          <span className="posts-count">

            {posts.length} Posts

          </span>


        </div>



        {/* =====================================
            POSTS
        ====================================== */}

        <div className="posts-list">


          {posts.length === 0 ? (


            <div className="empty-posts">

              <FiMessageCircle size={35} />

              <h3>No posts yet</h3>

              <p>

                Your fitness posts will appear here.

              </p>

            </div>


          ) : (


            posts.map((post) => (


              <div
                className="post-feed-item"
                key={post.id}
              >


                {/* POST HEADER */}

                <div className="post-header">


                  <div className="post-author-info">


                    <img
                      src={profileData.avatar}
                      alt={profileData.name}
                      className="post-avatar"
                    />


                    <div className="post-meta">


                      <span className="post-author">

                        {profileData.name}

                      </span>


                      <span className="post-time">

                        {post.time}

                      </span>


                    </div>


                  </div>



                  {/* DELETE BUTTON */}

                  <button
                    className="delete-post-btn"
                    onClick={() =>
                      handleDeletePost(post.id)
                    }
                    title="Delete Post"
                  >

                    <FiTrash2 size={17} />

                  </button>


                </div>



                {/* POST TEXT */}

                <p className="post-text">

                  {post.text}

                </p>



                {/* POST ACTIONS */}

                <div className="post-actions">


                  <button className="post-action-btn">

                    <FiHeart size={16} />

                    <span>

                      {post.likes} Likes

                    </span>

                  </button>


                  <button className="post-action-btn">

                    <FiMessageCircle size={16} />

                    <span>

                      {post.comments} Comments

                    </span>

                  </button>


                  <button className="post-action-btn">

                    <FiShare2 size={16} />

                    <span>

                      Share

                    </span>

                  </button>


                </div>


              </div>


            ))

          )}


        </div>


      </div>



      {/* =====================================
          EDIT PROFILE MODAL
      ====================================== */}

      {isEditing && (

        <div className="modal-overlay">


          <div className="edit-modal">


            <div className="edit-modal-header">


              <div>

                <h3>Edit Profile</h3>

                <p>

                  Update your profile information

                </p>

              </div>


              <button
                className="close-modal-btn"
                onClick={() =>
                  setIsEditing(false)
                }
              >

                <FiX size={22} />

              </button>


            </div>



            <form
              className="edit-form"
              onSubmit={handleSave}
            >


              {/* AVATAR */}

              <div className="edit-form-group">

                <label>

                  Profile Image URL

                </label>


                <div className="input-with-icon">

                  <FiCamera />

                  <input

                    type="text"

                    name="avatar"

                    value={profileData.avatar}

                    onChange={handleInputChange}

                  />

                </div>

              </div>



              {/* NAME */}

              <div className="edit-form-group">

                <label>

                  Display Name

                </label>


                <input

                  type="text"

                  name="name"

                  value={profileData.name}

                  onChange={handleInputChange}

                />

              </div>



              {/* TITLE */}

              <div className="edit-form-group">

                <label>

                  Bio / Title

                </label>


                <input

                  type="text"

                  name="title"

                  value={profileData.title}

                  onChange={handleInputChange}

                />

              </div>



              {/* LOCATION */}

              <div className="edit-form-group">

                <label>

                  Location

                </label>


                <input

                  type="text"

                  name="location"

                  value={profileData.location}

                  onChange={handleInputChange}

                />

              </div>



              <div className="edit-two-column">


                {/* AGE */}

                <div className="edit-form-group">

                  <label>

                    Age

                  </label>


                  <input

                    type="number"

                    name="age"

                    value={profileData.age}

                    onChange={handleInputChange}

                  />

                </div>



                {/* GENDER */}

                <div className="edit-form-group">

                  <label>

                    Gender

                  </label>


                  <select

                    name="gender"

                    value={profileData.gender}

                    onChange={handleInputChange}

                  >

                    <option>Male</option>

                    <option>Female</option>

                    <option>Other</option>

                    <option>Prefer not to say</option>

                  </select>

                </div>


              </div>



              {/* DISCIPLINES */}

              <div className="edit-form-group">

                <label>

                  Training Disciplines

                </label>


                <input

                  type="text"

                  value={
                    profileData.disciplines.join(", ")
                  }

                  onChange={
                    handleDisciplinesChange
                  }

                />


                <small>

                  Separate disciplines using commas

                </small>

              </div>



              {/* PERFORMANCE */}

              <div className="edit-two-column">


                <div className="edit-form-group">

                  <label>

                    Total Workouts

                  </label>


                  <input

                    type="number"

                    name="workouts"

                    value={profileData.workouts}

                    onChange={handleInputChange}

                  />

                </div>



                <div className="edit-form-group">

                  <label>

                    Active Days

                  </label>


                  <input

                    type="number"

                    name="activeDays"

                    value={profileData.activeDays}

                    onChange={handleInputChange}

                  />

                </div>


              </div>



              <div className="edit-form-group">

                <label>

                  Followers

                </label>


                <input

                  type="text"

                  name="followers"

                  value={profileData.followers}

                  onChange={handleInputChange}

                />

              </div>



              {/* ACTIONS */}

              <div className="modal-actions-row">


                <button

                  type="button"

                  className="btn-outline"

                  onClick={() =>
                    setIsEditing(false)
                  }

                >

                  Cancel

                </button>


                <button

                  type="submit"

                  className="btn-primary"

                >

                  Save Changes

                </button>


              </div>


            </form>


          </div>


        </div>

      )}


    </div>

  );

};


export default Profile;