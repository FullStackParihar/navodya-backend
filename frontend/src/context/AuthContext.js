import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsAuthenticated(true);
        
        // Validate token with backend
        validateToken(token);
      } catch (error) {
        console.error('Error parsing user data:', error);
        logout();
      }
    }
    setIsLoading(false);
  }, []);

  const validateToken = async (token) => {
    try {
      const response = await api.get('/auth/validate');
      if (!response.success) {
        logout();
      }
    } catch (error) {
      console.error('Token validation failed:', error);
      logout();
    }
  };

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      
      if (response.success) {
        const { token, user: userData } = response.data;
        
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userEmail', userData.email);
        localStorage.setItem('userRole', userData.role || 'user');
        
        setUser(userData);
        setIsAuthenticated(true);
        
        return { success: true };
      } else {
        return { success: false, message: response.message || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Login failed. Please try again.' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    
    setUser(null);
    setIsAuthenticated(false);
  };

  const refreshToken = async () => {
    try {
      const response = await api.post('/auth/refresh');
      if (response.success) {
        const { token } = response.data;
        localStorage.setItem('token', token);
        return token;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout();
      return null;
    }
  };

  // Enhanced API call with token refresh
  const authenticatedApiCall = async (endpoint, options = {}) => {
    let token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token');
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5001/api'}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          ...options.headers
        }
      });

      if (response.status === 401) {
        // Token expired, try to refresh
        const newToken = await refreshToken();
        if (newToken) {
          // Retry with new token
          const retryResponse = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5001/api'}${endpoint}`, {
            ...options,
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${newToken}`,
              ...options.headers
            }
          });
          return retryResponse.json();
        } else {
          throw new Error('Token refresh failed');
        }
      }

      return response.json();
    } catch (error) {
      console.error('Authenticated API call failed:', error);
      throw error;
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    refreshToken,
    authenticatedApiCall
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
