import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
  FiUploadCloud,
  FiLogOut,
} from "react-icons/fi";
import {
  DEFAULT_AVATAR,
  getStoredProfile,
  saveStoredProfile,
  logoutUser,
  compressImage,
  syncProfileWithBackend,
} from "../utils/userProfile";
import { fetchApi, uploadMediaApi, resolveMediaUrl } from "../utils/api";

const defaultProfile = {
  name: "Athlete",
  title: "",
  location: "",
  age: "",
  gender: "",
  avatar: DEFAULT_AVATAR,

  posts: "0",
  followers: "0",
  following: "0",

  workouts: "0",
  activeDays: "0",
  streak: "0",

  disciplines: [],
};


const defaultPosts = [];


const Profile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  /* =========================================
     PROFILE STATE
  ========================================= */

  const [profileData, setProfileData] =
    useState(() => getStoredProfile());


  /* =========================================
     POSTS STATE
  ========================================= */

  const [posts, setPosts] =
    useState(defaultPosts);


  /* =========================================
     LOAD DATA
  ========================================= */

  useEffect(() => {
    const loadedProfile = getStoredProfile();
    setProfileData(loadedProfile);

    // Synchronize latest profile data with MongoDB if logged in
    syncProfileWithBackend().then((synced) => {
      if (synced) setProfileData(synced);
    });

    const loadUserPosts = async () => {
      try {
        const allPosts = await fetchApi('/api/posts');
        if (Array.isArray(allPosts)) {
          const currentProfile = getStoredProfile();
          const currentUserId = currentProfile._id || currentProfile.id;
          const userPosts = allPosts.filter((p) => {
            const pAuthorId = p.userId?._id || p.userId;
            const pAuthorName = p.userId?.name || p.username;
            return (
              (currentUserId && pAuthorId && String(currentUserId) === String(pAuthorId)) ||
              pAuthorName === "You" ||
              pAuthorName === currentProfile.name
            );
          });
          setPosts(userPosts);
          return;
        }
      } catch (err) {
        console.warn("Could not fetch user posts from server, checking local backup:", err.message);
      }

      const savedPosts = localStorage.getItem("navchetnaPosts");
      if (savedPosts) {
        try {
          const parsed = JSON.parse(savedPosts);
          const isLegacyDefaultPosts =
            Array.isArray(parsed) &&
            parsed.length > 0 &&
            parsed.every(
              (p) =>
                (p.id === 1 && p.text?.includes("Budge Budge")) ||
                (p.id === 2 && p.text?.includes("225lbs"))
            );
          if (isLegacyDefaultPosts) {
            localStorage.removeItem("navchetnaPosts");
            setPosts([]);
          } else {
            setPosts(parsed);
          }
        } catch {
          setPosts([]);
        }
      } else {
        setPosts([]);
      }
    };

    loadUserPosts();
  }, []);

  /* =========================================
     AVATAR HANDLERS
  ========================================= */

  const handleAvatarFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file (JPEG, PNG, WebP, etc.)");
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      alert("Image size should be under 25MB");
      return;
    }

    try {
      setIsUploadingAvatar(true);
      const compressedDataUrl = await compressImage(file, 400, 400, 0.85);
      let finalAvatarUrl = compressedDataUrl;

      try {
        const uploadRes = await uploadMediaApi(compressedDataUrl);
        if (uploadRes?.url) {
          finalAvatarUrl = uploadRes.url;
        }
      } catch (uploadErr) {
        console.warn("Server avatar upload notice:", uploadErr.message);
      }

      setProfileData((prev) => {
        const updated = {
          ...prev,
          avatar: finalAvatarUrl,
        };
        saveStoredProfile(updated);
        return updated;
      });
    } catch (err) {
      console.error("Failed to process image:", err);
      alert("Failed to process image. Please try another image file.");
    } finally {
      setIsUploadingAvatar(false);
      e.target.value = "";
    }
  };

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
    saveStoredProfile(profileData);
    setIsEditing(false);
  };

  /* =========================================
     LOGOUT HANDLER
  ========================================= */

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (!confirmLogout) return;

    logoutUser();
    navigate("/login");
  };



  /* =========================================
     DELETE POST
  ========================================= */

  const handleDeletePost = async (postId, postMongoId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this post?"
    );
    if (!confirmDelete) return;

    const targetId = postMongoId || postId;
    try {
      await fetchApi(`/api/posts/${targetId}`, {
        method: "DELETE",
      });
    } catch (err) {
      console.warn("Delete post backend notice:", err.message);
    }

    const updatedPosts = posts.filter(
      (post) => (post._id || post.id) !== targetId && post.id !== postId
    );
    setPosts(updatedPosts);
    localStorage.setItem("navchetnaPosts", JSON.stringify(updatedPosts));
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
            <div
              className="profile-avatar-container"
              onClick={() => setIsEditing(true)}
              title="Click to edit profile picture"
              style={{ cursor: "pointer" }}
            >
              <img
                src={resolveMediaUrl(profileData.avatar || DEFAULT_AVATAR)}
                alt="Profile"
                className="profile-avatar-squircle"
              />
              <div className="avatar-camera-badge" title="Change Photo">
                <FiCamera size={18} />
              </div>
            </div>
          </div>



          {/* PROFILE INFORMATION */}

          <div className="header-mid-col">


            <div className="name-badge-row">

              <h1 className="athlete-header-name">

                {profileData.name || "Athlete"}

              </h1>


              <span className="pro-badge">

                PRO

                <FiZap size={11} />

              </span>

            </div>



            {profileData.title ? (
              <p className="user-title">
                {profileData.title}
              </p>
            ) : (
              <p className="user-title" style={{ color: "#9ca3af", fontStyle: "italic" }}>
                No bio added yet
              </p>
            )}



            <div className="profile-details-row">

              {profileData.location && (
                <span className="profile-location">
                  <FiMapPin size={14} />
                  {profileData.location}
                </span>
              )}

              {(profileData.age || profileData.gender) && (
                <span className="profile-location">
                  <FiUser size={14} />
                  {[profileData.age ? `${profileData.age} yrs` : null, profileData.gender].filter(Boolean).join(", ")}
                </span>
              )}

            </div>



            <div className="profile-actions-inline">

              <button
                className="btn-primary edit-profile-btn"
                onClick={() => setIsEditing(true)}
              >
                <FiEdit2 size={14} />
                Edit Profile
              </button>

              <button
                className="btn-outline logout-profile-btn"
                onClick={handleLogout}
                title="Log out of your account"
              >
                <FiLogOut size={14} />
                Log Out
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

                {profileData.followers || 0}

              </span>

              <span className="stat-lbl">

                Followers

              </span>

            </div>


            <div className="stat-item">

              <span className="stat-val">

                {profileData.following || 0}

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

            {profileData.disciplines && profileData.disciplines.length > 0 ? (
              profileData.disciplines.map((discipline, index) => (
                <span
                  className="tag"
                  key={index}
                >
                  {discipline}
                </span>
              ))
            ) : (
              <span className="no-tags-text" style={{ color: "#9ca3af", fontSize: "14px" }}>
                No training disciplines added yet
              </span>
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

                  {profileData.workouts || 0}

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

                  {profileData.activeDays || 0}

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

                  {profileData.streak || 0}

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
                key={post._id || post.id}
              >
                {/* POST HEADER */}
                <div className="post-header">
                  <div className="post-author-info">
                    <img
                      src={resolveMediaUrl(post.avatar || profileData.avatar || DEFAULT_AVATAR)}
                      alt={post.username || profileData.name}
                      className="post-avatar"
                    />
                    <div className="post-meta">
                      <span className="post-author">
                        {post.username || profileData.name}
                      </span>
                      <span className="post-time">
                        {post.time || (post.createdAt ? new Date(post.createdAt).toLocaleDateString() : "Just now")}
                      </span>
                    </div>
                  </div>

                  {/* DELETE BUTTON */}
                  <button
                    className="delete-post-btn"
                    onClick={() =>
                      handleDeletePost(post.id, post._id)
                    }
                    title="Delete Post"
                  >
                    <FiTrash2 size={17} />
                  </button>
                </div>

                {/* POST IMAGE */}
                {post.image && (
                  <div className="profile-post-image-wrap" style={{ margin: "12px 0", borderRadius: "10px", overflow: "hidden" }}>
                    <img
                      src={resolveMediaUrl(post.image)}
                      alt="Post"
                      style={{ width: "100%", maxHeight: "360px", objectFit: "cover", display: "block" }}
                    />
                  </div>
                )}

                {/* POST TEXT */}
                <p className="post-text">
                  {post.caption || post.content || post.text}
                </p>

                {/* POST ACTIONS */}
                <div className="post-actions">
                  <button className="post-action-btn">
                    <FiHeart size={16} />
                    <span>
                      {post.likesCount !== undefined
                        ? post.likesCount
                        : Array.isArray(post.likes)
                        ? post.likes.length
                        : post.likes || 0}{" "}
                      Likes
                    </span>
                  </button>

                  <button className="post-action-btn">
                    <FiMessageCircle size={16} />
                    <span>
                      {Array.isArray(post.comments)
                        ? post.comments.length
                        : post.comments || 0}{" "}
                      Comments
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
                <label>Profile Picture</label>
                <div className="avatar-edit-preview-box">
                  <img
                    src={resolveMediaUrl(profileData.avatar || DEFAULT_AVATAR)}
                    alt="Preview"
                    className="avatar-edit-thumb"
                  />
                  <div className="avatar-edit-controls">
                    <label
                      className="avatar-upload-action"
                      style={{
                        opacity: isUploadingAvatar ? 0.65 : 1,
                        cursor: isUploadingAvatar ? "wait" : "pointer",
                        pointerEvents: isUploadingAvatar ? "none" : "auto",
                      }}
                    >
                      <FiUploadCloud /> {isUploadingAvatar ? "Optimizing & Saving..." : "Upload New Photo"}
                      <input
                        type="file"
                        accept="image/*"
                        disabled={isUploadingAvatar}
                        onChange={handleAvatarFile}
                        style={{ display: "none" }}
                      />
                    </label>
                  </div>
                </div>

                <div className="input-with-icon" style={{ marginTop: "10px" }}>
                  <FiCamera />
                  <input
                    type="text"
                    name="avatar"
                    placeholder="Or enter Image URL"
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
                  placeholder="Your display name"
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
                  placeholder="e.g. Marathon Runner, Fitness Enthusiast"
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
                  placeholder="e.g. Kolkata, India"
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
                    placeholder="e.g. 24"
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
                    value={profileData.gender || ""}
                    onChange={handleInputChange}
                  >

                    <option value="">Select gender</option>

                    <option value="Male">Male</option>

                    <option value="Female">Female</option>

                    <option value="Other">Other</option>

                    <option value="Prefer not to say">Prefer not to say</option>

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
                  placeholder="e.g. Running, Calisthenics, Yoga"
                  value={
                    profileData.disciplines?.join(", ") || ""
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
                    placeholder="0"
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
                    placeholder="0"
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
                  placeholder="0"
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