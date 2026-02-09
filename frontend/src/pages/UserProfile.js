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
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch('http://localhost:5000/api/auth/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const result = await response.json();

        if (result.success && result.data) {
          // Handle both response structures: data.user (login/register style) or just data (getProfile style)
          const user = result.data.user || result.data;
          console.log('Fetched user data:', user);
          
          if (!user) return;

          const nameParts = (user.name || '').split(' ');
          const firstName = nameParts[0] || '';
          const lastName = nameParts.slice(1).join(' ') || '';

          const newUserData = {
            firstName,
            lastName,
            email: user.email || '',
            phone: user.phone || '',
            profileImage: user.avatar || 'https://i.pravatar.cc/150?img=5',
            bio: user.bio || '',
            address: user.address || '',
            city: user.city || '',
            state: user.state || '',
            pincode: user.pincode || '',
            jnvSchool: user.jnvSchool || '',
            batchYear: user.batchYear || ''
          };

          setUserData(newUserData);
          
          // Update localStorage
          localStorage.setItem('userFirstName', firstName);
          localStorage.setItem('userLastName', lastName);
          localStorage.setItem('userEmail', user.email || '');
          localStorage.setItem('userPhone', user.phone || '');
          localStorage.setItem('userProfileImage', user.avatar || '');
          localStorage.setItem('userBio', user.bio || '');
          localStorage.setItem('userAddress', user.address || '');
          localStorage.setItem('userCity', user.city || '');
          localStorage.setItem('userState', user.state || '');
          localStorage.setItem('userPincode', user.pincode || '');
          localStorage.setItem('userJnvSchool', user.jnvSchool || '');
          localStorage.setItem('userBatchYear', user.batchYear || '');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, []);

  const handleAvatarUpdate = async (newUrl) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ avatar: newUrl })
      });

      const result = await response.json();
      
      if (result.success) {
        setUserData(prev => ({ ...prev, profileImage: newUrl }));
        localStorage.setItem('userProfileImage', newUrl);
        setShowAvatarModal(false);
        alert('Profile photo updated successfully!');
      } else {
        alert(result.message || 'Failed to update avatar');
      }
    } catch (error) {
      console.error('Avatar update error:', error);
      alert('Failed to update avatar');
    }
  };

  const handleEdit = () => {
    setEditForm(userData);
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const fullName = `${editForm.firstName || ''} ${editForm.lastName || ''}`.trim();
      
      const response = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: fullName,
          phone: editForm.phone,
          avatar: editForm.profileImage,
          bio: editForm.bio,
          address: editForm.address,
          city: editForm.city,
          state: editForm.state,
          pincode: editForm.pincode,
          jnvSchool: editForm.jnvSchool,
          batchYear: editForm.batchYear
        })
      });

      const result = await response.json();
      
      if (result.success) {
        setUserData(editForm);
        setIsEditing(false);
        
        // Update localStorage
        localStorage.setItem('userFirstName', editForm.firstName || '');
        localStorage.setItem('userLastName', editForm.lastName || '');
        localStorage.setItem('userPhone', editForm.phone || '');
        localStorage.setItem('userBio', editForm.bio || '');
        localStorage.setItem('userAddress', editForm.address || '');
        localStorage.setItem('userCity', editForm.city || '');
        localStorage.setItem('userState', editForm.state || '');
        localStorage.setItem('userPincode', editForm.pincode || '');
        localStorage.setItem('userJnvSchool', editForm.jnvSchool || '');
        localStorage.setItem('userBatchYear', editForm.batchYear || '');
        
        alert('Profile updated successfully!');
      } else {
        alert(result.message || 'Failed to update profile');
      }
    } catch (error) {
      alert('Failed to update profile');
      console.error('Update error:', error);
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

  const handleGoogleSignup = () => {
    // Google OAuth integration - placeholder
    window.open('https://accounts.google.com/oauth/authorize?client_id=YOUR_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URI&response_type=code&scope=email%20profile', '_blank');
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
              <button className="change-avatar-btn" onClick={() => setShowAvatarModal(true)}>
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
                      <span>{userData.address || <em className="text-muted">Not provided</em>}</span>
                    </div>
                    <div className="info-item">
                      <label>City:</label>
                      <span>{userData.city || <em className="text-muted">Not provided</em>}</span>
                    </div>
                    <div className="info-item">
                      <label>State:</label>
                      <span>{userData.state || <em className="text-muted">Not provided</em>}</span>
                    </div>
                    <div className="info-item">
                      <label>Pincode:</label>
                      <span>{userData.pincode || <em className="text-muted">Not provided</em>}</span>
                    </div>
                    <div className="info-item">
                      <label>JNV School:</label>
                      <span>{userData.jnvSchool || <em className="text-muted">Not provided</em>}</span>
                    </div>
                    <div className="info-item">
                      <label>Batch Year:</label>
                      <span>{userData.batchYear || <em className="text-muted">Not provided</em>}</span>
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

        {/* Avatar Selection Modal */}
        {showAvatarModal && (
          <div className="avatar-modal-overlay">
            <div className="avatar-modal">
              <div className="avatar-modal-header">
                <h3>Choose Profile Photo</h3>
                <button className="close-modal-btn" onClick={() => setShowAvatarModal(false)}>
                  <i className="fas fa-times"></i>
                </button>
              </div>
              
              <div className="avatar-grid">
                {Array.from({ length: 12 }, (_, i) => `https://i.pravatar.cc/150?img=${i + 1}`).map((url, index) => (
                  <div 
                    key={index} 
                    className={`avatar-option ${userData.profileImage === url ? 'selected' : ''}`}
                    onClick={() => handleAvatarUpdate(url)}
                  >
                    <img src={url} alt={`Avatar ${index + 1}`} />
                    {userData.profileImage === url && <div className="selected-overlay"><i className="fas fa-check"></i></div>}
                  </div>
                ))}
              </div>

              <div className="custom-avatar-input">
                <p>Or use a custom URL:</p>
                <div className="input-with-btn">
                  <input 
                    type="text" 
                    placeholder="https://example.com/image.jpg" 
                    id="custom-avatar-url"
                  />
                  <button 
                    className="apply-btn"
                    onClick={() => {
                      const url = document.getElementById('custom-avatar-url').value;
                      if (url) handleAvatarUpdate(url);
                    }}
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </PrivateRoute>
  );
};

export default UserProfile;
