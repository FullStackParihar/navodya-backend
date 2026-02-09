import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PrivateRoute from '../components/PrivateRoute';
import './UserProfile.css';

const UserProfile = () => {
  const navigate = useNavigate();
  
  // Get user data from localStorage (in production, this would come from API)
  const [userData, setUserData] = useState({
    firstName: localStorage.getItem('userFirstName') || '',
    lastName: localStorage.getItem('userLastName') || '',
    email: localStorage.getItem('userEmail') || '',
    phone: localStorage.getItem('userPhone') || '',
    profileImage: localStorage.getItem('userProfileImage') || 'https://i.pravatar.cc/150?img=5',
    bio: localStorage.getItem('userBio') || '',
    address: localStorage.getItem('userAddress') || '',
    city: localStorage.getItem('userCity') || '',
    state: localStorage.getItem('userState') || '',
    pincode: localStorage.getItem('userPincode') || '',
    jnvSchool: localStorage.getItem('userJnvSchool') || '',
    batchYear: localStorage.getItem('userBatchYear') || ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    // Check if user is authenticated
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [navigate]);

  const handleGoogleSignup = () => {
    // Google OAuth integration - placeholder
    window.open('https://accounts.google.com/oauth/authorize?client_id=YOUR_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URI&response_type=code&scope=email%20profile', '_blank');
  };

  const handleEdit = () => {
    setEditForm(userData);
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      // Save to localStorage (in production, save to API)
      Object.keys(editForm).forEach(key => {
        localStorage.setItem(`user${key.charAt(0).toUpperCase() + key.slice(1)}`, editForm[key]);
      });
      
      setUserData(editForm);
      setIsEditing(false);
      
      // Show success message (you could use a toast system here)
      alert('Profile updated successfully!');
    } catch (error) {
      alert('Failed to update profile');
    }
  };

  const handleCancel = () => {
    setEditForm({});
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogout = () => {
    // Clear authentication and user data
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userFirstName');
    localStorage.removeItem('userLastName');
    localStorage.removeItem('userPhone');
    
    navigate('/login');
  };

  return (
    <PrivateRoute>
      <div className="user-profile">
        <div className="profile-container">
          {/* Profile Header */}
          <div className="profile-header">
            <div className="profile-avatar">
              <img 
                src={userData.profileImage} 
                alt="Profile" 
                className="avatar-img"
              />
              <button className="change-avatar-btn">
                <i className="fas fa-camera"></i>
                Change Photo
              </button>
            </div>
            
            <div className="profile-info">
              {isEditing ? (
                <div className="edit-form">
                  <div className="form-row">
                    <label>First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={editForm.firstName}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>
                  <div className="form-row">
                    <label>Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={editForm.lastName}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>
                  <div className="form-row">
                    <label>Email</label>
                    <input
                      type="email"
                      name="email"
                      value={editForm.email}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>
                  <div className="form-row">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={editForm.phone}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  <div className="form-row">
                    <label>Bio</label>
                    <textarea
                      name="bio"
                      value={editForm.bio}
                      onChange={handleInputChange}
                      className="form-textarea"
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                  <div className="form-row">
                    <label>Address</label>
                    <input
                      type="text"
                      name="address"
                      value={editForm.address}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>
                  <div className="form-row">
                    <label>City</label>
                    <input
                      type="text"
                      name="city"
                      value={editForm.city}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>
                  <div className="form-row">
                    <label>State</label>
                    <input
                      type="text"
                      name="state"
                      value={editForm.state}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>
                  <div className="form-row">
                    <label>Pincode</label>
                    <input
                      type="text"
                      name="pincode"
                      value={editForm.pincode}
                      onChange={handleInputChange}
                      className="form-input"
                      maxLength={6}
                    />
                  </div>
                  <div className="form-row">
                    <label>JNV School</label>
                    <input
                      type="text"
                      name="jnvSchool"
                      value={editForm.jnvSchool}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>
                  <div className="form-row">
                    <label>Batch Year</label>
                    <input
                      type="text"
                      name="batchYear"
                      value={editForm.batchYear}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>
                  <div className="edit-actions">
                    <button className="save-btn" onClick={handleSave}>
                      <i className="fas fa-save"></i>
                      Save Changes
                    </button>
                    <button className="cancel-btn" onClick={handleCancel}>
                      <i className="fas fa-times"></i>
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="view-mode">
                  <h2 className="user-name">
                    {userData.firstName} {userData.lastName}
                  </h2>
                  <p className="user-email">{userData.email}</p>
                  <p className="user-phone">{userData.phone}</p>
                  <p className="user-bio">{userData.bio}</p>
                  
                  <div className="info-grid">
                    <div className="info-item">
                      <label>Address:</label>
                      <span>{userData.address}</span>
                    </div>
                    <div className="info-item">
                      <label>City:</label>
                      <span>{userData.city}</span>
                    </div>
                    <div className="info-item">
                      <label>State:</label>
                      <span>{userData.state}</span>
                    </div>
                    <div className="info-item">
                      <label>Pincode:</label>
                      <span>{userData.pincode}</span>
                    </div>
                    <div className="info-item">
                      <label>JNV School:</label>
                      <span>{userData.jnvSchool}</span>
                    </div>
                    <div className="info-item">
                      <label>Batch Year:</label>
                      <span>{userData.batchYear}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="profile-actions">
            {!isEditing && (
              <button className="edit-profile-btn" onClick={handleEdit}>
                <i className="fas fa-edit"></i>
                Edit Profile
              </button>
            )}
            
            <button className="google-signup-btn" onClick={handleGoogleSignup}>
              <i className="fab fa-google"></i>
              Sign Up with Google
            </button>
            
            <button className="logout-btn" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt"></i>
              Logout
            </button>
          </div>
        </div>
      </div>
    </PrivateRoute>
  );
};

export default UserProfile;
