const API_BASE =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000/api'
    : 'https://your-render-backend.onrender.com/api');

export const buildApiUrl = (path) => `${API_BASE}${path}`;

export async function apiRequest(path, options = {}) {
  const token = localStorage.getItem('innovation_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (token) {
    headers['x-auth-token'] = token;
  }

  const response = await fetch(buildApiUrl(path), {
    ...options,
    headers,
    body: options.body ? options.body : undefined
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : {};

  if (!response.ok) {
    throw new Error(data.msg || data.message || 'Request failed');
  }

  return data;
}

export default API_BASE;
