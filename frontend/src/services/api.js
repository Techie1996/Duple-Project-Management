import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true
});

// Attach access token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401: try refresh then retry or redirect to login
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;
      const refresh = localStorage.getItem('refreshToken');
      if (refresh) {
        try {
          const { data } = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken: refresh });
          localStorage.setItem('accessToken', data.data.accessToken);
          original.headers.Authorization = `Bearer ${data.data.accessToken}`;
          return api(original);
        } catch {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(err);
  }
);

// Auth
export const login = (email, password) =>
  api.post('/auth/login', { email, password }).then((r) => r.data);

export const register = (name, email, password) =>
  api.post('/auth/register', { name, email, password }).then((r) => r.data);

export const logout = () => api.post('/auth/logout').then((r) => r.data);

export const refreshToken = (refreshToken) =>
  api.post('/auth/refresh', { refreshToken }).then((r) => r.data);

// Projects
export const getProjects = (params = {}) =>
  api.get('/projects', { params }).then((r) => r.data);

export const createProject = (payload) =>
  api.post('/projects', payload).then((r) => r.data);

export const getProject = (id) =>
  api.get(`/projects/${id}`).then((r) => r.data);

export const updateProject = (id, payload) =>
  api.patch(`/projects/${id}`, payload).then((r) => r.data);

export const deleteProject = (id) =>
  api.delete(`/projects/${id}`).then((r) => r.data);

// Boards
export const getBoards = (projectId) =>
  api.get(`/projects/${projectId}/boards`).then((r) => r.data);

export const createBoard = (projectId, payload) =>
  api.post(`/projects/${projectId}/boards`, payload).then((r) => r.data);

export const updateBoard = (projectId, boardId, payload) =>
  api.patch(`/projects/${projectId}/boards/${boardId}`, payload).then((r) => r.data);

export const deleteBoard = (projectId, boardId) =>
  api.delete(`/projects/${projectId}/boards/${boardId}`).then((r) => r.data);

export const reorderBoards = (projectId, boardIds) =>
  api.patch(`/projects/${projectId}/boards/reorder`, { boardIds }).then((r) => r.data);

// Tasks
export const getTasks = (projectId, params = {}) =>
  api.get(`/projects/${projectId}/tasks`, { params }).then((r) => r.data);

export const createTask = (projectId, payload) =>
  api.post(`/projects/${projectId}/tasks`, payload).then((r) => r.data);

export const updateTask = (projectId, taskId, payload) =>
  api.patch(`/projects/${projectId}/tasks/${taskId}`, payload).then((r) => r.data);

export const updateTaskStatus = (projectId, taskId, boardId) =>
  api.patch(`/projects/${projectId}/tasks/${taskId}/status`, { boardId }).then((r) => r.data);

export const deleteTask = (projectId, taskId) =>
  api.delete(`/projects/${projectId}/tasks/${taskId}`).then((r) => r.data);

export default api;
