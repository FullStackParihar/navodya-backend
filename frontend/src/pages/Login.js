import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useToast } from '../context/ToastContext';
import './Login.css';

const Login = () => {
  const { success: toastSuccess, error: toastError } = useToast();
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
  const [showOtpModal, setShowOtpModal] = useState(false);
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGoogleCredentialResponse = async (response) => {
    setError('');
    setIsLoading(true);
    try {
      const result = await api.post('/auth/google-login', { token: response.credential });

      if (result.success) {
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('token', result.data.token);
        localStorage.setItem('user', JSON.stringify(result.data.user));
        localStorage.setItem('userEmail', result.data.user.email);
        localStorage.setItem('userRole', result.data.user.role || 'user');
        toastSuccess('Logged in successfully!');
        navigate('/account');
      } else {
        setError(result.message || 'Google authentication failed');
      }
    } catch (err) {
      setError('Google login failed');
      console.error('Google Auth error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const initializeGoogleSignIn = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID || '825946890374-placeholder.apps.googleusercontent.com',
          callback: handleGoogleCredentialResponse
        });
        const buttonDiv = document.getElementById('google-signin-button');
        if (buttonDiv) {
          window.google.accounts.id.renderButton(
            buttonDiv,
            { 
              theme: 'outline', 
              size: 'large', 
              width: buttonDiv.offsetWidth || '320', 
              text: 'continue_with'
            }
          );
        }
      }
    };

    if (window.google) {
      initializeGoogleSignIn();
    } else {
      const interval = setInterval(() => {
        if (window.google) {
          initializeGoogleSignIn();
          clearInterval(interval);
        }
      }, 500);
      return () => clearInterval(interval);
    }
  }, [isLogin]);

  const handleSendOTP = async () => {
    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in Name, Email, and Password first.');
      return;
    }
    
    setError('');
    setIsLoading(true);
    try {
      const result = await api.post('/auth/send-otp', { email: formData.email });
      if (result.success) {
        setOtpSent(true);
        setShowOtpModal(true);
        toastSuccess('OTP sent to your email successfully!');
      } else {
        setError(result.message || 'Failed to send OTP');
        toastError(result.message || 'Failed to send OTP');
      }
    } catch (err) {
      setError('Failed to send OTP');
      toastError('Failed to send OTP');
      console.error('Send OTP error:', err);
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
        : await api.post('/auth/register', { name: formData.name, email: formData.email, password: formData.password, otp: otp });

      if (result.success) {
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('token', result.data.token);
        localStorage.setItem('user', JSON.stringify(result.data.user));
        localStorage.setItem('userEmail', result.data.user.email);
        localStorage.setItem('userRole', result.data.user.role || 'user');
        setShowOtpModal(false);
        toastSuccess(isLogin ? 'Logged in successfully!' : 'Account created successfully!');
        navigate('/account');
      } else {
        setError(result.message || 'Authentication failed');
        toastError(result.message || 'Authentication failed');
      }
    } catch (err) {
      const errMsg = isLogin ? 'Login failed' : 'Signup failed';
      setError(errMsg);
      toastError(errMsg);
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
            onClick={() => {
              setIsLogin(true);
              setOtpSent(false);
              setOtp('');
              setError('');
              setShowOtpModal(false);
            }}
          >
            Login
          </button>
          <button 
            type="button" 
            className={`tab-btn ${!isLogin ? 'active' : ''}`}
            onClick={() => {
              setIsLogin(false);
              setOtpSent(false);
              setOtp('');
              setError('');
              setShowOtpModal(false);
            }}
          >
            Sign Up
          </button>
        </div>

        {/* Google Login Button */}
        <div className="google-btn-container">
          <div id="google-signin-button"></div>
        </div>

        <div className="divider">
          <span>OR</span>
        </div>

        <form onSubmit={isLogin ? handleSubmit : undefined} className="login-form">
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

          {isLogin ? (
            <button type="submit" disabled={isLoading} className="login-button">
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          ) : otpSent ? (
            <button type="button" onClick={() => setShowOtpModal(true)} disabled={isLoading} className="login-button">
              Verify Email (Enter OTP)
            </button>
          ) : (
            <button type="button" onClick={handleSendOTP} disabled={isLoading} className="login-button">
              {isLoading ? 'Sending OTP...' : 'Send Verification OTP'}
            </button>
          )}
        </form>
      </div>

      {/* OTP Verification Modal Popup */}
      {showOtpModal && (
        <div className="otp-modal-overlay">
          <div className="otp-modal-card">
            <button 
              type="button" 
              className="otp-modal-close" 
              onClick={() => setShowOtpModal(false)}
              aria-label="Close modal"
            >
              &times;
            </button>
            <div className="otp-modal-icon">
              <i className="fas fa-envelope-open-text"></i>
            </div>
            <h3>Verify Your Email</h3>
            <p>
              We've sent a 6-digit verification code to <strong className="otp-email-highlight">{formData.email}</strong>. Please enter it to complete your registration.
            </p>
            <form onSubmit={handleSubmit} className="otp-modal-form">
              <div className="form-group">
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  required
                  maxLength={6}
                  placeholder="Enter 6-Digit OTP"
                  className="otp-modal-input"
                  autoFocus
                />
              </div>
              {error && <div className="error-message" style={{ margin: '10px 0 0' }}>{error}</div>}
              <button type="submit" disabled={isLoading} className="otp-verify-button">
                {isLoading ? 'Verifying...' : 'Verify & Sign Up'}
              </button>
            </form>
            <div className="otp-modal-footer">
              <p>Didn't receive the code?</p>
              <button 
                type="button" 
                onClick={handleSendOTP} 
                disabled={isLoading}
                className="otp-resend-btn"
              >
                Resend OTP
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
