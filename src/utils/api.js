const API_BASE_URL = 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('mainteno_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
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
    register: (data) =>
      fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }).then(handleResponse),
    login: (data) =>
      fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }).then(handleResponse),
    me: () =>
      fetch(`${API_BASE_URL}/auth/me`, {
        headers: { ...getAuthHeaders() }
      }).then(handleResponse)
  },
  teams: {
    getAll: () => fetch(`${API_BASE_URL}/teams`, { headers: { ...getAuthHeaders() } }).then(handleResponse),
    getById: (id) => fetch(`${API_BASE_URL}/teams/${id}`, { headers: { ...getAuthHeaders() } }).then(handleResponse),
    create: (data) => fetch(`${API_BASE_URL}/teams`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data)
    }).then(handleResponse),
    update: (id, data) => fetch(`${API_BASE_URL}/teams/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data)
    }).then(handleResponse),
    delete: (id) => fetch(`${API_BASE_URL}/teams/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeaders() }
    }).then(handleResponse)
  },
  equipment: {
    getAll: () => fetch(`${API_BASE_URL}/equipment`, { headers: { ...getAuthHeaders() } }).then(handleResponse),
    getById: (id) => fetch(`${API_BASE_URL}/equipment/${id}`, { headers: { ...getAuthHeaders() } }).then(handleResponse),
    getRequests: (id) => fetch(`${API_BASE_URL}/equipment/${id}/requests`, { headers: { ...getAuthHeaders() } }).then(handleResponse),
    getRequestsCount: (id) => fetch(`${API_BASE_URL}/equipment/${id}/requests/count`, { headers: { ...getAuthHeaders() } }).then(handleResponse),
    create: (data) => fetch(`${API_BASE_URL}/equipment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data)
    }).then(handleResponse),
    update: (id, data) => fetch(`${API_BASE_URL}/equipment/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data)
    }).then(handleResponse),
    delete: (id) => fetch(`${API_BASE_URL}/equipment/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeaders() }
    }).then(handleResponse)
  },
  requests: {
    getAll: () => fetch(`${API_BASE_URL}/requests`, { headers: { ...getAuthHeaders() } }).then(handleResponse),
    getManager: () => fetch(`${API_BASE_URL}/requests/manager`, { headers: { ...getAuthHeaders() } }).then(handleResponse),
    getTechnician: () => fetch(`${API_BASE_URL}/requests/technician`, { headers: { ...getAuthHeaders() } }).then(handleResponse),
    getTechnicians: () => fetch(`${API_BASE_URL}/requests/technicians`, { headers: { ...getAuthHeaders() } }).then(handleResponse),
    getCalendar: () => fetch(`${API_BASE_URL}/requests/calendar`, { headers: { ...getAuthHeaders() } }).then(handleResponse),
    getById: (id) => fetch(`${API_BASE_URL}/requests/${id}`, { headers: { ...getAuthHeaders() } }).then(handleResponse),
    create: (data) => fetch(`${API_BASE_URL}/requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data)
    }).then(handleResponse),
    update: (id, data) => fetch(`${API_BASE_URL}/requests/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data)
    }).then(handleResponse),
    assignManager: (id, technicianId) => fetch(`${API_BASE_URL}/requests/${id}/assign-manager`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify({ technicianId })
    }).then(handleResponse),
    assignSelf: (id) => fetch(`${API_BASE_URL}/requests/${id}/assign-self`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() }
    }).then(handleResponse),
    start: (id) => fetch(`${API_BASE_URL}/requests/${id}/start`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() }
    }).then(handleResponse),
    complete: (id, hoursSpent) => fetch(`${API_BASE_URL}/requests/${id}/complete`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify({ hoursSpent })
    }).then(handleResponse),
    scrap: (id, hoursSpent) => fetch(`${API_BASE_URL}/requests/${id}/scrap`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() }
      ,body: JSON.stringify({ hoursSpent })
    }).then(handleResponse),
    delete: (id) => fetch(`${API_BASE_URL}/requests/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeaders() }
    }).then(handleResponse)
  }
};
