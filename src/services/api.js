// import axios from 'axios';

// const API_URL = 'http://localhost:8000/api';

// const api = axios.create({
//   baseURL: API_URL,
//   headers: { 'Content-Type': 'application/json' },
// });

// // ✅ हर request में Authorization header attach करने के लिए interceptor
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token'); // login के बाद store token
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// export const login = (credentials) => axios.post(`${API_URL}/login`, credentials);

// // Projects
// export const fetchProjects = () => api.get('/projects');
// export const fetchProjectTasks = (projectId) => api.get(`/projects/${projectId}/tasks`);

// // Tasks
// export const createTask = (data) => api.post('/tasks', data);
// export const updateTask = (taskId, data) => api.put(`/tasks/${taskId}`, data);

// export default api;
import axios from 'axios';

// const API_URL = 'http://localhost:8000/api';
const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = (credentials) => axios.post(`${API_URL}/login`, credentials);

// Projects
export const fetchProjects     = ()            => api.get('/projects');
export const fetchProjectTasks = (projectId)   => api.get(`/projects/${projectId}/tasks`);

// Users ✅ yeh missing tha
export const fetchUsers        = ()            => api.get('/users');

// Tasks ✅ URL fix kiya
export const createTask        = (projectId, data) => api.post(`/projects/${projectId}/tasks`, data);
export const updateTask        = (taskId, data)    => api.put(`/tasks/${taskId}`, data);

export default api;