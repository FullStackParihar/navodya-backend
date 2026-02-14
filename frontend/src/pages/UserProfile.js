import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PrivateRoute from '../components/PrivateRoute';
import api from '../utils/api';
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
    const fetchProfileData = async () => {
      try {
        const result = await api.get('/auth/profile');

        if (result.success && result.data) {
          const user = result.data.user || result.data;
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
          localStorage.setItem('userRole', user.role || 'user');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfileData();
  }, []);

  const handleAvatarUpdate = async (newUrl) => {
    try {
      const result = await api.patch('/auth/profile', { avatar: newUrl });
      
      if (result.success) {
        setUserData(prev => ({ ...prev, profileImage: newUrl }));
        localStorage.setItem('userProfileImage', newUrl);
        setShowAvatarModal(false);
      }
    } catch (error) {
      console.error('Avatar update error:', error);
    }
  };

  const handleEdit = () => {
    setEditForm(userData);
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const fullName = `${editForm.firstName || ''} ${editForm.lastName || ''}`.trim();
      const result = await api.patch('/auth/profile', {
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
      });
      
      if (result.success) {
        setUserData(editForm);
        setIsEditing(false);
        alert('Profile updated successfully!');
      }
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
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleGoogleSignup = () => {
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
                    />
                  </div>
                  <div className="form-row">
                    <label>Bio</label>
                    <textarea
                      name="bio"
                      value={editForm.bio}
                      onChange={handleInputChange}
                      className="form-textarea"
                    />
                  </div>
                  <div className="edit-actions">
                    <button className="save-btn" onClick={handleSave}>Save</button>
                    <button className="cancel-btn" onClick={handleCancel}>Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="view-mode">
                  <h2 className="user-name">{userData.firstName} {userData.lastName}</h2>
                  <p className="user-email">{userData.email}</p>
                  <p className="user-phone">{userData.phone}</p>
                  <div className="info-grid">
                    <div className="info-item">
                      <label>Address:</label>
                      <span>{userData.address || 'N/A'}</span>
                    </div>
                    <div className="info-item">
                      <label>JNV School:</label>
                      <span>{userData.jnvSchool || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="profile-actions">
            {!isEditing && <button className="edit-profile-btn" onClick={handleEdit}>Edit Profile</button>}
            <button className="google-signup-btn" onClick={handleGoogleSignup}>Signup with Google</button>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        </div>

        {showAvatarModal && (
          <div className="avatar-modal-overlay">
            <div className="avatar-modal">
              <h3>Choose Profile Photo</h3>
              <div className="avatar-grid">
                {Array.from({ length: 12 }, (_, i) => `https://i.pravatar.cc/150?img=${i + 1}`).map((url, index) => (
                  <img 
                    key={index} 
                    src={url} 
                    alt="Avatar" 
                    className={userData.profileImage === url ? 'selected' : ''}
                    onClick={() => handleAvatarUpdate(url)} 
                  />
                ))}
              </div>
              <button onClick={() => setShowAvatarModal(false)}>Close</button>
            </div>
          </div>
        )}
      </div>
    </PrivateRoute>
  );
};

export default UserProfile;
