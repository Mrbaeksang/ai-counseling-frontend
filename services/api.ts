import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios';
import Constants from 'expo-constants';

// Get API URL from environment variables
const API_BASE_URL = Constants.expoConfig?.extra?.apiUrl || 'http://localhost:8080/api';

// Extend AxiosRequestConfig for retry flag
interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

// Create Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token refresh state management
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: string | null) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Request interceptor: Automatically add token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor: Handle token expiration and RsData structure
api.interceptors.response.use(
  (response) => {
    // Handle backend RsData response structure
    if (response.data?.resultCode) {
      if (response.data.resultCode.startsWith('S-')) {
        // Success response - unwrap data
        // 문자열이 반환되는 경우 (즐겨찾기 추가/삭제 등) 빈 객체로 처리
        const unwrappedData = response.data.data;
        if (typeof unwrappedData === 'string') {
          response.data = {}; // 문자열은 빈 객체로 변환
        } else {
          response.data = unwrappedData;
        }
      } else if (response.data.resultCode.startsWith('F-')) {
        // Failure response - throw error with message
        const error = new Error(response.data.msg || 'Request failed') as Error & {
          code?: string;
          response?: AxiosResponse;
        };
        error.code = response.data.resultCode;
        error.response = response;
        return Promise.reject(error);
      }
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    // If 401 error and not retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        // Request token refresh
        const response = await api.post('/auth/refresh', {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data;

        // Save new tokens
        await AsyncStorage.setItem('accessToken', accessToken);
        await AsyncStorage.setItem('refreshToken', newRefreshToken);

        // Process queued requests
        processQueue(null, accessToken);

        // Retry original request
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);

        // Clear auth on refresh failure
        await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'user']);
        // TODO: Redirect to login screen
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default api;
