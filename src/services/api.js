import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api'; // Update with your backend URL

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('tpo_token') || 
                localStorage.getItem('facultyToken') || 
                localStorage.getItem('studentToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Student Analytics APIs
export const studentAnalyticsAPI = {
  getPerformanceBands: (testId, subject) => {
    return api.get('/student-analytics/performance-bands', {
      params: { testId, subject },
    });
  },
  getTopPerformers: () => {
    return api.get('/student-analytics/top-performers');
  },
};

// Faculty Analytics APIs
export const facultyAnalyticsAPI = {
  getPerformanceBands: (subject) => {
    return api.get('/faculty-analytics/performance-bands', {
      params: { subject },
    });
  },
  getComplete: (subject) => {
    return api.get('/faculty-analytics/complete', {
      params: { subject },
    });
  },
};

// TPO Auth APIs
export const tpoAuthAPI = {
  login: (email, password) => {
    return api.post('/tpo/login', { email, password });
  },
  signup: (data) => {
    return api.post('/tpo/signup', data);
  },
};

// Faculty APIs
export const facultyAPI = {
  // Auth
  signup: (data) => api.post('/faculty/signup', data),
  login: (data) => api.post('/faculty/login', data),
  
  // Dashboard
  getDashboardStats: () => api.get('/faculty/dashboard/stats'),
  getRecentTests: () => api.get('/faculty/dashboard/recent-tests'),
  getUpcomingTests: () => api.get('/faculty/dashboard/upcoming-tests'),
  
  // Questions
  createQuestion: (data) => api.post('/faculty/questions', data),
  getQuestions: () => api.get('/faculty/questions'),
  getQuestionsDropdown: (facultyId) => api.get(`/faculty/questions/dropdown?facultyId=${facultyId}`),
  
  // Tests
  createTest: (data) => api.post('/faculty/tests/create', data),
  getTests: () => api.get('/faculty/tests'),
  getTestById: (id) => api.get(`/faculty/tests/${id}`),
  
  // Analytics
  getTestSummary: (id) => api.get(`/faculty/tests/${id}/summary`),
  getTestQuestions: (id) => api.get(`/faculty/tests/${id}/questions`),
  getTestStudents: (id) => api.get(`/faculty/tests/${id}/students`),
};

export default api;