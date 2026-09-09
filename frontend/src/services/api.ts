import axios from 'axios';
import {
  StudentData,
  PredictionResult,
  PresetStudent,
  BatchResult,
  AnalyticsData,
  AuthResponse,
  PredictionHistoryItem,
  User
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to every request if present
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('student_ai_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Global response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token on unauthorized if expired
      // localStorage.removeItem('student_ai_token');
    }
    return Promise.reject(error);
  }
);

export const api = {
  // Authentication
  auth: {
    login: async (credentials: { username: string; password: string }): Promise<AuthResponse> => {
      const { data } = await apiClient.post<AuthResponse>('/auth/login', credentials);
      return data;
    },
    register: async (userData: { username: string; email: string; password: string; full_name?: string }): Promise<AuthResponse> => {
      const { data } = await apiClient.post<AuthResponse>('/auth/register', userData);
      return data;
    },
    me: async (): Promise<User> => {
      const { data } = await apiClient.get<User>('/auth/me');
      return data;
    },
  },

  // Prediction
  predict: {
    predictSingle: async (student: StudentData): Promise<PredictionResult> => {
      const { data } = await apiClient.post<PredictionResult>('/predict', student);
      return data;
    },
    getPresets: async (): Promise<PresetStudent[]> => {
      const { data } = await apiClient.get<PresetStudent[]>('/presets');
      return data;
    },
    batchPredict: async (file: File): Promise<BatchResult> => {
      const formData = new FormData();
      formData.append('file', file);
      const { data } = await apiClient.post<BatchResult>('/batch-predict', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data;
    },
    downloadBatch: (batchId: string): string => {
      return `${API_BASE_URL}/batch-predict/download/${batchId}`;
    },
    getTemplateUrl: (): string => {
      return `${API_BASE_URL}/batch-predict/template`;
    },
  },

  // Analytics
  analytics: {
    getOverview: async (): Promise<AnalyticsData> => {
      const { data } = await apiClient.get<AnalyticsData>('/analytics/overview');
      return data;
    },
  },

  // Model Metadata
  modelInfo: {
    getMetadata: async () => {
      const { data } = await apiClient.get('/model-info');
      return data;
    },
  },

  // Prediction History
  history: {
    getAll: async (page = 1, pageSize = 15): Promise<{ total: number; predictions: PredictionHistoryItem[] }> => {
      const { data } = await apiClient.get(`/history?page=${page}&page_size=${pageSize}`);
      return data;
    },
    getById: async (id: number): Promise<PredictionHistoryItem> => {
      const { data } = await apiClient.get(`/history/${id}`);
      return data;
    },
    deleteById: async (id: number): Promise<{ success: boolean; message: string }> => {
      const { data } = await apiClient.delete(`/history/${id}`);
      return data;
    },
  },

  // Admin & Operations
  admin: {
    getUsers: async (): Promise<User[]> => {
      const { data } = await apiClient.get('/admin/users');
      return data;
    },
    getStats: async () => {
      const { data } = await apiClient.get('/admin/stats');
      return data;
    },
    retrainModel: async () => {
      const { data } = await apiClient.post('/admin/retrain');
      return data;
    },
    getLogs: async () => {
      const { data } = await apiClient.get('/admin/logs');
      return data;
    },
  },

  // Health
  health: {
    check: async () => {
      const { data } = await axios.get('/health');
      return data;
    },
  },
};

export default apiClient;
