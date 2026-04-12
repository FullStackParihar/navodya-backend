const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const getHeaders = (customHeaders = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...customHeaders,
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const clearAuthStorage = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('isAuthenticated');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('userRole');
  window.dispatchEvent(new Event('auth:logout'));
};

const safeParseResponse = async (response) => {
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    return null;
  }

  return response.json();
};

const refreshAccessToken = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    return null;
  }

  const response = await fetch(`${API_URL}/auth/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await safeParseResponse(response);
  if (!response.ok || !result?.success || !result?.data?.token) {
    clearAuthStorage();
    return null;
  }

  localStorage.setItem('token', result.data.token);
  return result.data.token;
};

const request = async (endpoint, options = {}, retryOnUnauthorized = true) => {
  const isFormData = options.body instanceof FormData;
  const headers = getHeaders(options.headers || {});

  if (isFormData) {
    delete headers['Content-Type'];
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const result = await safeParseResponse(response);

  if (response.status === 401 && retryOnUnauthorized) {
    const refreshedToken = await refreshAccessToken();

    if (refreshedToken) {
      return request(endpoint, options, false);
    }
  }

  if (!response.ok) {
    throw result || { message: 'Request failed' };
  }

  return result;
};

export const api = {
  request,
  get: async (endpoint) => {
    return request(endpoint, { method: 'GET' });
  },

  post: async (endpoint, data) => {
    return request(endpoint, {
      method: 'POST',
      body: data instanceof FormData ? data : JSON.stringify(data),
    });
  },

  patch: async (endpoint, data) => {
    return request(endpoint, {
      method: 'PATCH',
      body: data instanceof FormData ? data : JSON.stringify(data),
    });
  },

  delete: async (endpoint) => {
    return request(endpoint, { method: 'DELETE' });
  },
};

export default api;
