import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { useToast } from '../context/ToastContext';
import './Login.css';

const Login = () => {
  const { success: toastSuccess, error: toastError } = useToast();
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
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const otpInputRefs = useRef([]);
  const [resendTimer, setResendTimer] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    if (showOtpModal) {
      setResendTimer(60);
      const timer = setInterval(() => {
        setResendTimer(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [showOtpModal]);

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
    if (!agreeTerms) {
      setError('Please agree to Terms & Conditions to continue.');
      return;
    }
    
    setError('');
    setIsLoading(true);
    try {
      const result = await api.post('/auth/send-otp', { email: formData.email });
      if (result.success) {
        setOtpSent(true);
        setShowOtpModal(true);
        setOtpDigits(['', '', '', '', '', '']);
        setOtp('');
        setTimeout(() => {
          if (otpInputRefs.current[0]) {
            otpInputRefs.current[0].focus();
          }
        }, 100);
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

  const handleOtpDigitChange = (index, value) => {
    const newValue = value.replace(/\D/g, '').slice(0, 1);
    const newDigits = [...otpDigits];
    newDigits[index] = newValue;
    setOtpDigits(newDigits);
    setOtp(newDigits.join(''));
    
    if (newValue && index < 5) {
      if (otpInputRefs.current[index + 1]) {
        otpInputRefs.current[index + 1].focus();
      }
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      if (otpInputRefs.current[index - 1]) {
        otpInputRefs.current[index - 1].focus();
      }
    }
  };

  const handlePasteOtp = (e) => {
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pastedData) {
      const newDigits = ['', '', '', '', '', ''];
      for (let i = 0; i < pastedData.length && i < 6; i++) {
        newDigits[i] = pastedData[i];
      }
      setOtpDigits(newDigits);
      setOtp(newDigits.join(''));
      e.preventDefault();
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

  const handleResendOtp = () => {
    if (resendTimer > 0) return;
    handleSendOTP();
  };

  return (
    <div className="be-page-wrapper">
      <div className="be-brand-panel">
        <div className="be-floating-shape shape-1"></div>
        <div className="be-floating-shape shape-2"></div>
        <div className="be-floating-shape shape-3"></div>
        <div className="be-floating-shape shape-4"></div>

        <div className="be-brand-content">
          <div className="be-logo-mark">
            <div className="be-logo-icon">
              <span className="be-logo-b">B</span>
              <span className="be-logo-e">E</span>
            </div>
          </div>

          <div className="be-tagline">
            DESIGN. PRINT. BRAND. DELIVER.
          </div>

          <h1 className="be-headline">
            Welcome to Brand Era
          </h1>

          <p className="be-subtitle">
            Your trusted partner for custom printing, branding, and merchandise solutions.
          </p>

          <ul className="be-features-list">
            <li className="be-feature-item">
              <span className="be-feature-check">
                <i className="fas fa-check"></i>
              </span>
              <span className="be-feature-text">Premium Quality Products</span>
            </li>
            <li className="be-feature-item">
              <span className="be-feature-check">
                <i className="fas fa-check"></i>
              </span>
              <span className="be-feature-text">Best Pricing</span>
            </li>
            <li className="be-feature-item">
              <span className="be-feature-check">
                <i className="fas fa-check"></i>
              </span>
              <span className="be-feature-text">Custom Design Support</span>
            </li>
            <li className="be-feature-item">
              <span className="be-feature-check">
                <i className="fas fa-check"></i>
              </span>
              <span className="be-feature-text">On-Time Delivery</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="be-form-panel">
        <div className="be-auth-card">
          <div className="be-card-header">
            <h2 className="be-card-title">{isLogin ? 'Welcome Back' : 'Get Started'}</h2>
            <p className="be-card-subtitle">
              {isLogin ? 'Sign in to access your Brand Era account' : 'Create your account and start branding'}
            </p>
          </div>

          {error && <div className="be-error-box">{error}</div>}

          <div className="be-tabs-wrapper">
            <button 
              type="button" 
              className={`be-tab-btn ${isLogin ? 'active' : ''}`}
              onClick={() => {
                setIsLogin(true);
                setOtpSent(false);
                setOtp('');
                setOtpDigits(['', '', '', '', '', '']);
                setError('');
                setShowOtpModal(false);
                setAgreeTerms(false);
              }}
            >
              Login
            </button>
            <button 
              type="button" 
              className={`be-tab-btn ${!isLogin ? 'active' : ''}`}
              onClick={() => {
                setIsLogin(false);
                setOtpSent(false);
                setOtp('');
                setOtpDigits(['', '', '', '', '', '']);
                setError('');
                setShowOtpModal(false);
                setAgreeTerms(false);
              }}
            >
              Register
            </button>
          </div>

          <form onSubmit={isLogin ? handleSubmit : undefined} className="be-auth-form">
            {!isLogin && (
              <>
                <div className="be-form-group">
                  <label htmlFor="name" className="be-form-label">
                    <i className="fas fa-user"></i> Full Name
                  </label>
                  <div className="be-input-wrap">
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="be-form-input"
                      placeholder="Enter your full name"
                      onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
                    />
                  </div>
                </div>
                <div className="be-form-group">
                  <label htmlFor="phone" className="be-form-label">
                    <i className="fas fa-phone"></i> Phone Number
                  </label>
                  <div className="be-input-wrap">
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      className="be-form-input"
                      placeholder="Enter your phone number"
                      onChange={(e) => setFormData(prev => ({...prev, phone: e.target.value}))}
                    />
                  </div>
                </div>
              </>
            )}
            
            <div className="be-form-group">
              <label htmlFor="email" className="be-form-label">
                <i className="fas fa-envelope"></i> Email Address
              </label>
              <div className="be-input-wrap">
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="be-form-input"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email"
                />
              </div>
            </div>
            
            <div className="be-form-group">
              <label htmlFor="password" className="be-form-label">
                <i className="fas fa-lock"></i> Password
              </label>
              <div className="be-input-wrap">
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="be-form-input"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter your password"
                />
              </div>
            </div>

            {!isLogin && (
              <div className="be-form-group">
                <label htmlFor="confirmPassword" className="be-form-label">
                  <i className="fas fa-shield-alt"></i> Confirm Password
                </label>
                <div className="be-input-wrap">
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    className="be-form-input"
                    placeholder="Confirm your password"
                    onChange={(e) => setFormData(prev => ({...prev, confirmPassword: e.target.value}))}
                  />
                </div>
              </div>
            )}

            {isLogin && (
              <div className="be-form-options">
                <div className="be-remember-me">
                  <label className="be-checkbox-wrap">
                    <input type="checkbox" />
                    <span className="be-checkbox-checkmark"></span>
                    <span className="be-checkbox-text">Remember me</span>
                  </label>
                </div>
                <Link to="/forgot" className="be-forgot-link">
                  Forgot Password?
                </Link>
              </div>
            )}

            {!isLogin && (
              <div className="be-terms-wrap">
                <label className="be-checkbox-wrap">
                  <input 
                    type="checkbox" 
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                  />
                  <span className="be-checkbox-checkmark"></span>
                  <span className="be-checkbox-text">
                    I agree to <Link to="/terms" className="be-terms-link">Terms & Conditions</Link>
                  </span>
                </label>
              </div>
            )}

            {isLogin ? (
              <button type="submit" disabled={isLoading} className="be-submit-btn be-btn-red">
                {isLoading ? (
                  <><i className="fas fa-spinner fa-spin"></i> Signing In...</>
                ) : (
                  <>Sign In <i className="fas fa-arrow-right"></i></>
                )}
              </button>
            ) : otpSent ? (
              <button 
                type="button" 
                onClick={() => {
                  setShowOtpModal(true);
                  setOtpDigits(['', '', '', '', '', '']);
                  setOtp('');
                  setTimeout(() => {
                    if (otpInputRefs.current[0]) {
                      otpInputRefs.current[0].focus();
                    }
                  }, 100);
                }} 
                disabled={isLoading} 
                className="be-submit-btn be-btn-black"
              >
                {isLoading ? (
                  <><i className="fas fa-spinner fa-spin"></i> Processing...</>
                ) : (
                  <>Verify Email (Enter OTP) <i className="fas fa-check-circle"></i></>
                )}
              </button>
            ) : (
              <button type="button" onClick={handleSendOTP} disabled={isLoading} className="be-submit-btn be-btn-black">
                {isLoading ? (
                  <><i className="fas fa-spinner fa-spin"></i> Sending OTP...</>
                ) : (
                  <>Send Verification OTP <i className="fas fa-paper-plane"></i></>
                )}
              </button>
            )}
          </form>

          <div className="be-divider">
            <div className="be-divider-line"></div>
            <span className="be-divider-text">OR</span>
            <div className="be-divider-line"></div>
          </div>

          <div className="be-social-login">
            <div id="google-signin-button" className="be-google-btn"></div>
          </div>

          <div className="be-toggle-footer">
            {isLogin ? (
              <p className="be-toggle-text">
                Don't have an account? 
                <button 
                  type="button" 
                  className="be-toggle-link"
                  onClick={() => {
                    setIsLogin(false);
                    setOtpSent(false);
                    setOtp('');
                    setOtpDigits(['', '', '', '', '', '']);
                    setError('');
                    setShowOtpModal(false);
                    setAgreeTerms(false);
                  }}
                >
                  Register Now
                </button>
              </p>
            ) : (
              <p className="be-toggle-text">
                Already have an account? 
                <button 
                  type="button" 
                  className="be-toggle-link"
                  onClick={() => {
                    setIsLogin(true);
                    setOtpSent(false);
                    setOtp('');
                    setOtpDigits(['', '', '', '', '', '']);
                    setError('');
                    setShowOtpModal(false);
                    setAgreeTerms(false);
                  }}
                >
                  Sign In
                </button>
              </p>
            )}
          </div>

          <div className="be-back-home">
            <Link to="/" className="be-back-link">
              <i className="fas fa-arrow-left"></i> Back to Home
            </Link>
          </div>
        </div>
      </div>

      {showOtpModal && (
        <div className="be-otp-overlay">
          <div className="be-otp-modal">
            <button 
              type="button" 
              className="be-otp-close" 
              onClick={() => setShowOtpModal(false)}
              aria-label="Close modal"
            >
              <i className="fas fa-times"></i>
            </button>

            <div className="be-otp-icon-wrap">
              <div className="be-otp-icon-circle">
                <i className="fas fa-envelope-open-text"></i>
              </div>
            </div>

            <h3 className="be-otp-title">Verify Your Email</h3>
            <p className="be-otp-desc">
              We've sent a 6-digit verification code to <strong className="be-otp-email">{formData.email}</strong>. Please enter it below to complete your registration.
            </p>

            <form onSubmit={handleSubmit} className="be-otp-form">
              <div className="be-otp-inputs-row" onPaste={handlePasteOtp}>
                {[0, 1, 2, 3, 4, 5].map((idx) => (
                  <input
                    key={idx}
                    ref={(el) => (otpInputRefs.current[idx] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={otpDigits[idx]}
                    onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    className="be-otp-digit"
                    autoFocus={idx === 0}
                  />
                ))}
              </div>

              <input
                type="hidden"
                value={otp}
                required
              />

              {error && <div className="be-error-box" style={{ margin: '10px 0 0' }}>{error}</div>}

              <button type="submit" disabled={isLoading || otp.length < 6} className="be-otp-verify-btn">
                {isLoading ? (
                  <><i className="fas fa-spinner fa-spin"></i> Verifying...</>
                ) : (
                  <>Verify OTP <i className="fas fa-check"></i></>
                )}
              </button>
            </form>

            <div className="be-otp-footer">
              <p className="be-otp-resend-text">Didn't receive the code?</p>
              {resendTimer > 0 ? (
                <span className="be-otp-timer">
                  Resend OTP in <strong>{resendTimer}s</strong>
                </span>
              ) : (
                <button 
                  type="button" 
                  onClick={handleResendOtp} 
                  disabled={isLoading}
                  className="be-otp-resend-link"
                >
                  <i className="fas fa-redo"></i> Resend OTP
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
