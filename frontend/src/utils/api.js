const API_URL = process.env.REACT_APP_API_URL || 'https://navodya-backend.onrender.com/api';
const BASE_URL = API_URL.replace('/api', '');

const handle401 = () => {
  localStorage.removeItem('isAuthenticated');
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('userRole');
  window.location.href = '/login';
};

const getHeaders = () => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const resolveImageUrl = (url) => {
  if (!url) return 'https://via.placeholder.com/400x500?text=No+Image';
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  if (url.startsWith('/')) {
    return `${BASE_URL}${url}`;
  }
  return url;
};

export const api = {
  get: async (endpoint) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: getHeaders(),
    });
    if (response.status === 401) {
      handle401();
      return { success: false, message: 'Unauthorized' };
    }
    return response.json();
  },

  post: async (endpoint, data) => {
    const isFormData = data instanceof FormData;
    const headers = getHeaders();
    if (isFormData) {
      delete headers['Content-Type']; // Let browser set boundary
    }
    
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: headers,
      body: isFormData ? data : JSON.stringify(data),
    });
    if (response.status === 401) {
      handle401();
      return { success: false, message: 'Unauthorized' };
    }
    return response.json();
  },

  patch: async (endpoint, data) => {
    const isFormData = data instanceof FormData;
    const headers = getHeaders();
    if (isFormData) {
      delete headers['Content-Type'];
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'PATCH',
      headers: headers,
      body: isFormData ? data : JSON.stringify(data),
    });
    if (response.status === 401) {
      handle401();
      return { success: false, message: 'Unauthorized' };
    }
    return response.json();
  },

  put: async (endpoint, data) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (response.status === 401) {
      handle401();
      return { success: false, message: 'Unauthorized' };
    }
    return response.json();
  },

  delete: async (endpoint) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (response.status === 401) {
      handle401();
      return { success: false, message: 'Unauthorized' };
    }
    return response.json();
  },
};

export { resolveImageUrl };
export default api;
