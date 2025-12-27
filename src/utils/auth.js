const TOKEN_KEY = 'mainteno_token';
const USER_KEY = 'mainteno_user';

export const authStore = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  setToken: (token) => localStorage.setItem(TOKEN_KEY, token),
  clearToken: () => localStorage.removeItem(TOKEN_KEY),

  getUser: () => {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },
  setUser: (user) => localStorage.setItem(USER_KEY, JSON.stringify(user)),
  clearUser: () => localStorage.removeItem(USER_KEY),

  clear: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
};

export const getDefaultAppPathForRole = (role) => {
  switch (role) {
    case 'MANAGER':
      return '/app';
    case 'TECHNICIAN':
      return '/app';
    case 'USER':
    default:
      return '/app';
  }
};
