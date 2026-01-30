import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import runnerImage from '../assets/Runner.png';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (email.trim()) {
      // Store email in sessionStorage for OTP verification
      sessionStorage.setItem('userEmail', email);
      navigate('/otp');
    } else {
      alert('Please enter your email or phone number');
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <div className="logo">
          <span>Productr</span>
          <span className="logo-icon">🔗</span>
        </div>
        <div className="image-card">
          <img src={runnerImage} alt="Runner" className="runner-image" />
          <div className="image-text">
            <p>Uplist your</p>
            <p>product to market</p>
          </div>
        </div>
      </div>

      <div className="login-right">
        <div className="login-form-container">
          <h1 className="login-title">Login to your Productr Account</h1>

          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email or Phone number</label>
              <input
                type="text"
                id="email"
                placeholder="Enter email or phone number"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
              />
            </div>

            <button type="submit" className="login-button">
              Login
            </button>
          </form>

          <div className="signup-link">
            <p>Don't have a Productr Account</p>
            <a href="/signup">SignUp Here</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
