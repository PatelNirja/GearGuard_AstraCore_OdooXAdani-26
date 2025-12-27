const API_BASE_URL = 'http://localhost:5000/api';

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message);
  }
  return response.json();
};

export const api = {
  teams: {
    getAll: () => fetch(`${API_BASE_URL}/teams`).then(handleResponse),
    getById: (id) => fetch(`${API_BASE_URL}/teams/${id}`).then(handleResponse),
    create: (data) => fetch(`${API_BASE_URL}/teams`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(handleResponse),
    update: (id, data) => fetch(`${API_BASE_URL}/teams/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(handleResponse),
    delete: (id) => fetch(`${API_BASE_URL}/teams/${id}`, {
      method: 'DELETE'
    }).then(handleResponse)
  },
  equipment: {
    getAll: () => fetch(`${API_BASE_URL}/equipment`).then(handleResponse),
    getById: (id) => fetch(`${API_BASE_URL}/equipment/${id}`).then(handleResponse),
    getRequests: (id) => fetch(`${API_BASE_URL}/equipment/${id}/requests`).then(handleResponse),
    getRequestsCount: (id) => fetch(`${API_BASE_URL}/equipment/${id}/requests/count`).then(handleResponse),
    create: (data) => fetch(`${API_BASE_URL}/equipment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(handleResponse),
    update: (id, data) => fetch(`${API_BASE_URL}/equipment/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(handleResponse),
    delete: (id) => fetch(`${API_BASE_URL}/equipment/${id}`, {
      method: 'DELETE'
    }).then(handleResponse)
  },
  requests: {
    getAll: () => fetch(`${API_BASE_URL}/requests`).then(handleResponse),
    getCalendar: () => fetch(`${API_BASE_URL}/requests/calendar`).then(handleResponse),
    getById: (id) => fetch(`${API_BASE_URL}/requests/${id}`).then(handleResponse),
    create: (data) => fetch(`${API_BASE_URL}/requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(handleResponse),
    update: (id, data) => fetch(`${API_BASE_URL}/requests/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(handleResponse),
    delete: (id) => fetch(`${API_BASE_URL}/requests/${id}`, {
      method: 'DELETE'
    }).then(handleResponse)
  }
};
