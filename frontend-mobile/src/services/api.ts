import axios, { AxiosInstance, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// API Configuration
const API_BASE_URL = __DEV__ 
  ? 'http://localhost:4000/api/v1' 
  : 'https://your-production-api.com/api/v1';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      async (config) => {
        const token = await AsyncStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Token expired, clear storage and redirect to login
          await AsyncStorage.removeItem('auth_token');
          // You can dispatch a logout action here
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async login(phone: string, otp: string) {
    const response = await this.api.post('/auth/login', { phone, otp });
    return response.data;
  }

  async sendOtp(phone: string) {
    const response = await this.api.post('/auth/send-otp', { phone });
    return response.data;
  }

  async getProfile() {
    const response = await this.api.get('/auth/me');
    return response.data;
  }

  // User endpoints
  async getUsers(params?: any) {
    const response = await this.api.get('/users', { params });
    return response.data;
  }

  async updateUser(userId: string, data: any) {
    const response = await this.api.put(`/users/${userId}`, data);
    return response.data;
  }

  // Forum endpoints
  async getForumPosts(params?: any) {
    const response = await this.api.get('/forums', { params });
    return response.data;
  }

  async createForumPost(data: any) {
    const response = await this.api.post('/forums', data);
    return response.data;
  }

  async getForumPost(id: string) {
    const response = await this.api.get(`/forums/${id}`);
    return response.data;
  }

  async updateForumPost(id: string, data: any) {
    const response = await this.api.put(`/forums/${id}`, data);
    return response.data;
  }

  async deleteForumPost(id: string) {
    const response = await this.api.delete(`/forums/${id}`);
    return response.data;
  }

  async addComment(postId: string, data: any) {
    const response = await this.api.post(`/forums/${postId}/comment`, data);
    return response.data;
  }

  async getComments(postId: string, params?: any) {
    const response = await this.api.get(`/forums/${postId}/comments`, { params });
    return response.data;
  }

  async addReaction(postId: string, data: any) {
    const response = await this.api.post(`/forums/${postId}/react`, data);
    return response.data;
  }

  async getPersonalizedFeed(params?: any) {
    const response = await this.api.get('/forums/feed', { params });
    return response.data;
  }

  // Report endpoints
  async getReports(params?: any) {
    try {
      const response = await this.api.get('/reports', { params });
      return response.data;
    } catch (error) {
      console.log('API not available, using fallback data for reports');
      return {
        data: [],
        message: 'Using offline data'
      };
    }
  }

  async createReport(data: any) {
    const response = await this.api.post('/reports', data);
    return response.data;
  }

  async getReport(id: string) {
    const response = await this.api.get(`/reports/${id}`);
    return response.data;
  }

  // SOS endpoints
  async createSOS(data: any) {
    const response = await this.api.post('/sos', data);
    return response.data;
  }

  async getSOSStatus(id: string) {
    const response = await this.api.get(`/sos/${id}/status`);
    return response.data;
  }

  // Warning endpoints
  async getWarnings(params?: any) {
    try {
      const response = await this.api.get('/warnings', { params });
      return response.data;
    } catch (error) {
      console.log('API not available, using fallback data for warnings');
      // Return fallback data structure
      return {
        data: [],
        message: 'Using offline data'
      };
    }
  }

  async createWarning(data: any) {
    const response = await this.api.post('/warnings', data);
    return response.data;
  }

  // File upload
  async uploadFile(file: any, type: 'image' | 'video' | 'audio' = 'image') {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const response = await this.api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  // Health check
  async healthCheck() {
    const response = await this.api.get('/health');
    return response.data;
  }
}

export const apiService = new ApiService();
export default apiService;
