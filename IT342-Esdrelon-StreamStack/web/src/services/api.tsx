import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  firstname?: string;
  lastname?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface UserInfo {
  userId: number;
  username: string;
  email: string;
  firstname?: string;
  lastname?: string;
  role: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: UserInfo;
    accessToken: string;
    refreshToken: string;
  } | null;
  timestamp: string;
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authService = {
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },
};

export default api;