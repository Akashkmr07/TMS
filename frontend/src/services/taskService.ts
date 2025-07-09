import axios from 'axios';
import type { Task, TaskWithoutId } from '../types/task';
import authService from './authService';

const API_URL = 'http://localhost:5000/api';

// Add auth token to requests
axios.interceptors.request.use((config) => {
  const user = authService.getCurrentUser();
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export const getTasks = async (archived: boolean = false): Promise<Task[]> => {
  const response = await axios.get(`${API_URL}/tasks${archived ? '/archived' : ''}`);
  return response.data;
};

export const createTask = async (task: TaskWithoutId): Promise<Task> => {
  const response = await axios.post(`${API_URL}/tasks`, task);
  return response.data;
};

export const updateTask = async (id: string, task: TaskWithoutId): Promise<Task> => {
  const response = await axios.put(`${API_URL}/tasks/${id}`, task);
  return response.data;
};

export const deleteTask = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/tasks/${id}`);
};

export const archiveTask = async (id: string): Promise<Task> => {
  const response = await axios.put(`${API_URL}/tasks/${id}/archive`);
  return response.data;
};

const taskService = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  archiveTask,
};

export default taskService;
