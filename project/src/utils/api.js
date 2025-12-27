const API_BASE_URL = 'http://localhost:5000/api';

const getToken = () => localStorage.getItem('token');

const getHeaders = () => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message);
  }
  return response.json();
};

export const api = {
  auth: {
    login: async (email, password) => {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      return handleResponse(response);
    },
    register: async (userData) => {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      return handleResponse(response);
    },
    getCurrentUser: () => fetch(`${API_BASE_URL}/auth/me`, {
      headers: getHeaders()
    }).then(handleResponse),
    updateProfile: (data) => fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    }).then(handleResponse)
  },
  teams: {
    getAll: () => fetch(`${API_BASE_URL}/teams`, {
      headers: getHeaders()
    }).then(handleResponse),
    getById: (id) => fetch(`${API_BASE_URL}/teams/${id}`, {
      headers: getHeaders()
    }).then(handleResponse),
    create: (data) => fetch(`${API_BASE_URL}/teams`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    }).then(handleResponse),
    update: (id, data) => fetch(`${API_BASE_URL}/teams/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    }).then(handleResponse),
    delete: (id) => fetch(`${API_BASE_URL}/teams/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    }).then(handleResponse)
  },
  equipment: {
    getAll: () => fetch(`${API_BASE_URL}/equipment`, {
      headers: getHeaders()
    }).then(handleResponse),
    getById: (id) => fetch(`${API_BASE_URL}/equipment/${id}`, {
      headers: getHeaders()
    }).then(handleResponse),
    getRequests: (id) => fetch(`${API_BASE_URL}/equipment/${id}/requests`, {
      headers: getHeaders()
    }).then(handleResponse),
    getRequestsCount: (id) => fetch(`${API_BASE_URL}/equipment/${id}/requests/count`, {
      headers: getHeaders()
    }).then(handleResponse),
    create: (data) => fetch(`${API_BASE_URL}/equipment`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    }).then(handleResponse),
    update: (id, data) => fetch(`${API_BASE_URL}/equipment/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    }).then(handleResponse),
    delete: (id) => fetch(`${API_BASE_URL}/equipment/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    }).then(handleResponse)
  },
  requests: {
    getAll: () => fetch(`${API_BASE_URL}/requests`, {
      headers: getHeaders()
    }).then(handleResponse),
    getCalendar: () => fetch(`${API_BASE_URL}/requests/calendar`, {
      headers: getHeaders()
    }).then(handleResponse),
    getById: (id) => fetch(`${API_BASE_URL}/requests/${id}`, {
      headers: getHeaders()
    }).then(handleResponse),
    create: (data) => fetch(`${API_BASE_URL}/requests`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    }).then(handleResponse),
    update: (id, data) => fetch(`${API_BASE_URL}/requests/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    }).then(handleResponse),
    delete: (id) => fetch(`${API_BASE_URL}/requests/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    }).then(handleResponse)
  }
};
