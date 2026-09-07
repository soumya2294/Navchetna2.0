import { Link } from 'react-router-dom'
import { FcGoogle } from 'react-icons/fc'

const Signup = () => {
  return (
    <div className="login-wrapper">
      <div className="login-split-card">
        
        <div className="login-form-section">
          <div className="login-header">
            <h2>Create Account</h2>
            <p>Join the Navchetna 2.0 community today</p>
          </div>

          <form className="custom-login-form">
            <div className="input-group">
              <label>Full Name</label>
              <input type="text" placeholder="John Doe" />
            </div>

            <div className="input-group">
              <label>Email</label>
              <input type="email" placeholder="user@example.com" />
            </div>
            
            <div className="input-group">
              <label>Password</label>
              <input type="password" placeholder="••••••••" />
            </div>

            <button type="submit" className="sign-in-btn">Sign Up</button>

            <div className="divider-container">
              <span className="divider-line"></span>
              <span className="divider-text">OR</span>
              <span className="divider-line"></span>
            </div>

            <button type="button" className="google-btn">
              <FcGoogle className="google-icon" /> Sign up with Google
            </button>
          </form>

          <p className="signup-prompt">
            Already have an account? <Link to="/login" className="signup-link">Sign in</Link>
          </p>
        </div>

        <div className="signup-image-section">
          <div className="image-overlay-content">
            <h2>Start your journey</h2>
            <p>Track your workouts, connect with athletes, and hit your fitness goals.</p>
            <Link to="/login" className="image-signup-btn">Sign in</Link>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Signup