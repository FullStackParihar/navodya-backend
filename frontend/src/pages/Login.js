import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import './Login.css';

const Login = () => {
  // Add Font Awesome for Google icon
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
    document.head.appendChild(link);
  }, []);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGoogleLogin = () => {
    // Google OAuth integration - placeholder
    window.open('https://accounts.google.com/oauth/authorize?client_id=YOUR_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URI&response_type=code&scope=email%20profile', '_blank');
  };

  const handleSendOTP = async () => {
    if (!formData.email) {
      setError('Please enter your email address');
      return;
    }
    
    setIsLoading(true);
    try {
      // Simulate OTP sending - in production, integrate with SMS service
      await new Promise(resolve => setTimeout(resolve, 1500));
      setOtpSent(true);
      setError('OTP sent to your email');
    } catch (err) {
      setError('Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = isLogin 
        ? await api.post('/auth/login', { email: formData.email, password: formData.password })
        : await api.post('/auth/register', { name: formData.name, email: formData.email, password: formData.password });

      if (result.success) {
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('token', result.data.token);
        localStorage.setItem('user', JSON.stringify(result.data.user));
        localStorage.setItem('userEmail', result.data.user.email);
        localStorage.setItem('userRole', result.data.user.role || 'user');
        navigate('/account');
      } else {
        setError(result.message || 'Authentication failed');
      }
    } catch (err) {
      setError(isLogin ? 'Login failed' : 'Signup failed');
      console.error('Auth error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
          <p className="login-subtitle">
            {isLogin ? 'Enter your credentials to access your account' : 'Create a new account to get started'}
          </p>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        {/* Tab Switcher */}
        <div className="auth-tabs">
          <button 
            type="button" 
            className={`tab-btn ${isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button 
            type="button" 
            className={`tab-btn ${!isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(false)}
          >
            Sign Up
          </button>
        </div>

        {/* Google Login Button */}
        <button type="button" className="google-btn" onClick={handleGoogleLogin}>
          <i className="fab fa-google"></i>
          Continue with Google
        </button>

        <div className="divider">
          <span>OR</span>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter your full name"
                onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
              />
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
            />
          </div>


          
          <button type="submit" disabled={isLoading} className="login-button">
            {isLoading ? (isLogin ? 'Logging in...' : 'Creating account...') : (isLogin ? 'Login' : 'Sign Up')}
          </button>
        </form>

        {/* Demo Credentials Info */}
        <div className="demo-info">
          <p><strong>Demo Credentials:</strong></p>
          <p>Email: admin@navodaya.com</p>
          <p>Password: admin123!@#</p>
          {isLogin && <p>OTP for testing: 123456</p>}
        </div>
      </div>
    </div>
  );
};

export default Login;
