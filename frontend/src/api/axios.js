import axios from 'axios';

const api = axios.create({
  baseURL: 'https://cosmos-7k46.onrender.com',
});

// Add token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || 
                  localStorage.getItem('facultyToken') || 
                  localStorage.getItem('studentToken') ||
                  localStorage.getItem('tpo_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle 401 errors globally (auto logout)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
