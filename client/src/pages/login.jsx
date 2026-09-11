import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [errorMessage, setErrorMessage] = useState('')
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const token = urlParams.get('token')
    
    if (token) {
      localStorage.setItem('navchetnaToken', token)
      
      const existingProfile = JSON.parse(localStorage.getItem('navchetnaProfile')) || {}
      
      if (!existingProfile.name) {
        const newProfile = {
          ...existingProfile,
          name: "Google Athlete",
          title: "Fitness Enthusiast",
          location: "",
          avatar: "https://i.pravatar.cc/150?img=11",
        }
        localStorage.setItem('navchetnaProfile', JSON.stringify(newProfile))
      }
      
      navigate('/profile')
    }
  }, [location, navigate])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage('')

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Login failed')
      }

      localStorage.setItem('navchetnaToken', data.token)
      
      const existingProfile = JSON.parse(localStorage.getItem('navchetnaProfile')) || {}
      
      const newProfile = {
        ...existingProfile,
        name: data.user.name,
        title: data.user.title || "Fitness Enthusiast",
        location: data.user.location || "",
        avatar: data.user.avatar || "https://i.pravatar.cc/150?img=11",
      }
      
      localStorage.setItem('navchetnaProfile', JSON.stringify(newProfile))

      navigate('/profile')
    } catch (error) {
      setErrorMessage(error.message)
    }
  }

  const handleGoogleAuth = () => {
    window.location.href = 'http://localhost:5000/api/auth/google'
  }

  return (
    <div className="login-wrapper">
      <div className="login-split-card">
        <div className="login-form-section">
          <div className="login-header">
            <h2>Welcome Back</h2>
            <p>Log in to continue your fitness journey.</p>
          </div>

          {errorMessage && <div style={{ color: 'red', marginBottom: '15px', fontSize: '13px' }}>{errorMessage}</div>}

          <form className="custom-login-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Email Address</label>
              <input 
                type="email" 
                name="email" 
                placeholder="Enter your email" 
                value={formData.email}
                onChange={handleChange}
                required 
              />
            </div>

            <div className="input-group">
              <label>Password</label>
              <input 
                type="password" 
                name="password" 
                placeholder="Enter your password" 
                value={formData.password}
                onChange={handleChange}
                required 
              />
            </div>

            <div className="form-options">
              <label className="remember-me">
                <input type="checkbox" /> Remember me
              </label>
              <Link to="#" className="forgot-password">Forgot Password?</Link>
            </div>

            <button type="submit" className="sign-in-btn">Log In</button>
          </form>

          <div className="divider-container">
            <div className="divider-line"></div>
            <span className="divider-text">OR CONTINUE WITH</span>
            <div className="divider-line"></div>
          </div>

          <button type="button" className="google-btn" onClick={handleGoogleAuth}>
            <svg className="google-icon" viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Sign in with Google
          </button>

          <div className="signup-prompt">
            Don't have an account? <Link to="/signup" className="signup-link">Sign up</Link>
          </div>
        </div>
        
        <div className="login-image-section">
          <div className="image-overlay-content">
            <h2>Welcome Back</h2>
            <p>Log in to continue your fitness journey and track your progress.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login