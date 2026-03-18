import axios from 'axios';

const API_URL = "https://task-manager-laravel-production-c034.up.railway.app/api";

// ✅ DEBUG LOGS (IMPORTANT)
console.log("👉 API_URL (hardcoded):", API_URL);
console.log("👉 ENV URL:", import.meta.env.VITE_API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// ✅ Request interceptor log
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  console.log("🚀 API Request:");
  console.log("URL:", config.baseURL + config.url);
  console.log("Method:", config.method);
  console.log("Token:", token);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ✅ LOGIN (important log)
export const login = async (credentials) => {
  console.log("🔥 LOGIN API HIT:", `${API_URL}/login`);
  console.log("📦 Payload:", credentials);

  return axios.post(`${API_URL}/login`, credentials);
};

// Projects
export const fetchProjects     = ()            => api.get('/projects');
export const fetchProjectTasks = (projectId)   => api.get(`/projects/${projectId}/tasks`);

// Users
export const fetchUsers        = ()            => api.get('/users');

// Tasks
export const createTask        = (projectId, data) => api.post(`/projects/${projectId}/tasks`, data);
export const updateTask        = (taskId, data)    => api.put(`/tasks/${taskId}`, data);

export default api;