const RAW_API_URL = process.env.REACT_APP_API_URL || 'navodya-backend-6uwo4so1d.vercel.app';

const API_URL = RAW_API_URL.endsWith('/api')
  ? RAW_API_URL
  : `${RAW_API_URL.replace(/\/$/, '')}/api`;

const getHeaders = (customHeaders = {}) => {
  const token = localStorage.getItem('token');
  const headers = { ...customHeaders };
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
  const method = options.method || 'GET';

  if (!isFormData && options.body && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    method,
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
