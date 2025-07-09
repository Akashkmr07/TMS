import axios from 'axios';

const API_URL = 'http://localhost:5000/api/users';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData extends LoginCredentials {
  name: string;
}

interface UserResponse {
  _id: string;
  name: string;
  email: string;
  token: string;
}

export const register = async (data: RegisterData): Promise<UserResponse> => {
  const response = await axios.post(`${API_URL}/register`, data);
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

export const login = async (credentials: LoginCredentials): Promise<UserResponse> => {
  const response = await axios.post(`${API_URL}/login`, credentials);
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('user');
};

export const getCurrentUser = (): UserResponse | null => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    return JSON.parse(userStr);
  }
  return null;
};

const authService = {
  register,
  login,
  logout,
  getCurrentUser
};

export default authService;
