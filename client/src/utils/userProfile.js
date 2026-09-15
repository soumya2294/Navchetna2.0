import { useState, useEffect } from "react"
import defaultAvatar from "../assets/default-avatar.png"
import { fetchApi, uploadMediaApi } from "./api"

export const DEFAULT_AVATAR = defaultAvatar

export const compressImage = (file, maxWidth = 400, maxHeight = 400, quality = 0.85) => {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith("image/")) {
      return reject(new Error("Invalid image file"))
    }

    const reader = new FileReader()
    reader.onerror = () => reject(new Error("Failed to read image file"))
    reader.onload = (e) => {
      const img = new Image()
      img.onerror = () => reject(new Error("Failed to load image element"))
      img.onload = () => {
        let width = img.width
        let height = img.height

        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width)
            width = maxWidth
          } else {
            width = Math.round((width * maxHeight) / height)
            height = maxHeight
          }
        }

        const canvas = document.createElement("canvas")
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext("2d")
        ctx.drawImage(img, 0, 0, width, height)

        const dataUrl = canvas.toDataURL("image/jpeg", quality)
        resolve(dataUrl)
      }
      img.src = e.target.result
    }
    reader.readAsDataURL(file)
  })
}

export const getStoredProfile = () => {
  try {
    const raw = localStorage.getItem("navchetnaProfile")
    const customAvatar = localStorage.getItem("navchetnaCustomAvatar")
    if (raw) {
      const parsed = JSON.parse(raw)
      let changed = false

      // If avatar is missing or an obsolete mock avatar, migrate
      if (
        !parsed.avatar ||
        parsed.avatar.includes("jtvnw.net") ||
        parsed.avatar.includes("img=11")
      ) {
        parsed.avatar = customAvatar || DEFAULT_AVATAR
        changed = true
      } else if (customAvatar && parsed.avatar === DEFAULT_AVATAR) {
        parsed.avatar = customAvatar
        changed = true
      }

      // Strip obsolete hardcoded dummy fields if present from previous templates
      if (
        parsed.title === "Hybrid Athlete & Fitness Enthusiast" ||
        parsed.title === "Hybrid Athlete & Marathon Runner"
      ) {
        parsed.title = ""
        changed = true
      }
      if (
        parsed.location === "Kolkata, India" ||
        parsed.location === "Kolkata, West Bengal"
      ) {
        parsed.location = ""
        changed = true
      }
      if (parsed.age === "22") {
        parsed.age = ""
        changed = true
      }
      if (parsed.gender === "Male" && !raw.includes('"genderSetExplicitly"')) {
        // Only clear if it was the old default template
        if (parsed.workouts === "148" || parsed.workouts === "342") {
          parsed.gender = ""
          changed = true
        }
      }
      if (parsed.followers === "420" || parsed.followers === "2,985") {
        parsed.followers = "0"
        changed = true
      }
      if (parsed.following === "85" || parsed.following === "132") {
        parsed.following = "0"
        changed = true
      }
      if (parsed.workouts === "148" || parsed.workouts === "342") {
        parsed.workouts = "0"
        changed = true
      }
      if (parsed.activeDays === "95" || parsed.activeDays === "180") {
        parsed.activeDays = "0"
        changed = true
      }
      if (parsed.streak === "12") {
        parsed.streak = "0"
        changed = true
      }
      if (
        Array.isArray(parsed.disciplines) &&
        (parsed.disciplines.join(",") === "Calisthenics,Powerlifting,Running" ||
          parsed.disciplines.join(",") ===
            "Calisthenics,Powerlifting,HIIT,Endurance Running,Mobility")
      ) {
        parsed.disciplines = []
        changed = true
      }

      if (changed) {
        localStorage.setItem("navchetnaProfile", JSON.stringify(parsed))
      }
      return parsed
    }
  } catch (err) {
    console.warn("Error reading profile from localStorage:", err)
  }

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
  }

  try {
    localStorage.setItem("navchetnaProfile", JSON.stringify(defaultProfile))
  } catch (err) {
    // Ignore storage write issues
  }

  return defaultProfile
}

export const saveStoredProfile = (updatedProfile) => {
  try {
    const current = getStoredProfile()
    const merged = {
      ...current,
      ...updatedProfile,
    }
    if (!merged.avatar) {
      merged.avatar = DEFAULT_AVATAR
    }

    // Persist custom avatar to dedicated backup key
    if (merged.avatar && merged.avatar !== DEFAULT_AVATAR) {
      try {
        localStorage.setItem("navchetnaCustomAvatar", merged.avatar)
      } catch (backupErr) {
        console.warn("Could not save avatar to backup key:", backupErr)
      }
    } else if (merged.avatar === DEFAULT_AVATAR) {
      localStorage.removeItem("navchetnaCustomAvatar")
    }

    localStorage.setItem("navchetnaProfile", JSON.stringify(merged))
    window.dispatchEvent(new CustomEvent("navchetnaProfileChange", { detail: merged }))

    // Asynchronously push updates to backend if authenticated
    const token = localStorage.getItem("navchetnaToken")
    if (token) {
      fetchApi('/api/users/profile', {
        method: 'PUT',
        body: JSON.stringify({
          name: merged.name,
          title: merged.title,
          location: merged.location,
          age: merged.age,
          gender: merged.gender,
          avatar: merged.avatar,
          disciplines: merged.disciplines,
          workouts: merged.workouts,
          activeDays: merged.activeDays,
          streak: merged.streak
        }),
      }).catch((apiErr) => {
        console.warn("Could not sync profile with backend:", apiErr.message)
      })
    }

    return merged
  } catch (err) {
    console.error("Error saving profile to localStorage:", err)
    // If saving full merged profile hit quota, save essential minimal profile
    try {
      const minimal = {
        name: updatedProfile.name || "Athlete",
        avatar: updatedProfile.avatar || DEFAULT_AVATAR,
      }
      localStorage.setItem("navchetnaProfile", JSON.stringify(minimal))
      window.dispatchEvent(new CustomEvent("navchetnaProfileChange", { detail: minimal }))
      return minimal
    } catch (fallbackErr) {
      console.error("Critical: Could not save minimal profile:", fallbackErr)
    }
  }
}

export const syncProfileWithBackend = async () => {
  const token = localStorage.getItem("navchetnaToken")
  if (!token) return null

  try {
    const backendProfile = await fetchApi('/api/users/profile')
    if (backendProfile && backendProfile.name) {
      const local = getStoredProfile()
      const merged = {
        ...local,
        name: backendProfile.name,
        title: backendProfile.title !== undefined ? backendProfile.title : local.title,
        location: backendProfile.location !== undefined ? backendProfile.location : local.location,
        age: backendProfile.age !== undefined && backendProfile.age !== null ? String(backendProfile.age) : local.age,
        gender: backendProfile.gender !== undefined ? backendProfile.gender : local.gender,
        avatar: backendProfile.avatar || local.avatar || DEFAULT_AVATAR,
        disciplines: Array.isArray(backendProfile.disciplines) ? backendProfile.disciplines : local.disciplines,
        workouts: backendProfile.workouts !== undefined ? String(backendProfile.workouts) : local.workouts,
        activeDays: backendProfile.activeDays !== undefined ? String(backendProfile.activeDays) : local.activeDays,
        streak: backendProfile.streak !== undefined ? String(backendProfile.streak) : local.streak,
      }
      localStorage.setItem("navchetnaProfile", JSON.stringify(merged))
      if (merged.avatar && merged.avatar !== DEFAULT_AVATAR) {
        localStorage.setItem("navchetnaCustomAvatar", merged.avatar)
      }
      window.dispatchEvent(new CustomEvent("navchetnaProfileChange", { detail: merged }))
      return merged
    }
  } catch (err) {
    // Graceful offline fallback
  }
}

export const logoutUser = () => {
  try {
    localStorage.removeItem("navchetnaToken")
    localStorage.removeItem("navchetnaProfile")
    localStorage.removeItem("navchetnaCustomAvatar")
    window.dispatchEvent(new CustomEvent("navchetnaProfileChange"))
    window.dispatchEvent(new Event("storage"))
  } catch (err) {
    console.warn("Error during logout:", err)
  }
}

export const useProfile = () => {
  const [profile, setProfileState] = useState(() => getStoredProfile())
  const [isLoggedIn, setIsLoggedIn] = useState(() =>
    Boolean(localStorage.getItem("navchetnaToken"))
  )

  useEffect(() => {
    const handleProfileChange = (event) => {
      if (event?.detail) {
        setProfileState(event.detail)
      } else {
        setProfileState(getStoredProfile())
      }
      setIsLoggedIn(Boolean(localStorage.getItem("navchetnaToken")))
    }

    window.addEventListener("navchetnaProfileChange", handleProfileChange)
    window.addEventListener("storage", handleProfileChange)

    if (localStorage.getItem("navchetnaToken")) {
      syncProfileWithBackend()
    }

    return () => {
      window.removeEventListener("navchetnaProfileChange", handleProfileChange)
      window.removeEventListener("storage", handleProfileChange)
    }
  }, [])

  return {
    profile,
    updateProfile: saveStoredProfile,
    syncProfile: syncProfileWithBackend,
    logout: logoutUser,
    isLoggedIn,
    defaultAvatar: DEFAULT_AVATAR,
  }
}
