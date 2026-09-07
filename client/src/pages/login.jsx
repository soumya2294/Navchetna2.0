import { Link } from 'react-router-dom'
import { FcGoogle } from 'react-icons/fc' 

const Login = () => {
  return (
    <div className="login-wrapper">
      <div className="login-split-card">
        
        {/* Left Side: Login Form */}
        <div className="login-form-section">
          <div className="login-header">
            <h2>Welcome Back</h2>
            <p>Please enter your details to sign in</p>
          </div>

          <form className="custom-login-form">
            <div className="input-group">
              <label>Email</label>
              <input type="email" placeholder="admin@example.com" />
            </div>
            
            <div className="input-group">
              <label>Password</label>
              <input type="password" placeholder="••••••••" />
            </div>

            <div className="form-options">
              <label className="remember-me">
                <input type="checkbox" /> Remember me
              </label>
              <Link to="/forgot-password" className="forgot-password">Forgot password?</Link>
            </div>

            <button type="submit" className="sign-in-btn">Sign in</button>

            <div className="divider-container">
              <span className="divider-line"></span>
              <span className="divider-text">OR</span>
              <span className="divider-line"></span>
            </div>

            <button type="button" className="google-btn">
              <FcGoogle className="google-icon" /> Sign in with Google
            </button>
          </form>

          <p className="signup-prompt">
            Don't have an account? <Link to="/signup" className="signup-link">Sign up</Link>
          </p>
        </div>

        {/* Right Side: Image Area */}
        <div className="login-image-section">
          <div className="image-overlay-content">
            <h2>Ready to train?</h2>
            <p>Log in to access your dashboard and continue your fitness journey.</p>
            <Link to="/signup" className="image-signup-btn">Sign up</Link>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Login