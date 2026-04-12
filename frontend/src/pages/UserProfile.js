import React from 'react';
import { Navigate } from 'react-router-dom';

const UserProfile = () => <Navigate to="/account?tab=profile" replace />;

export default UserProfile;
