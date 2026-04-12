import React from 'react';
import { Navigate } from 'react-router-dom';

const Profile = () => <Navigate to="/account?tab=profile" replace />;

export default Profile;
