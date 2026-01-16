import axios, { AxiosInstance, AxiosError, AxiosResponse } from 'axios';
import { config } from '@/config/env';

// Create axios instance
export const apiClient: AxiosInstance = axios.create({
  baseURL: config.apiBaseUrl,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, {
      data: config.data,
      params: config.params,
    });
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, {
      status: response.status,
      data: response.data,
    });
    return response;
  },
  (error: AxiosError) => {
    const { response, request, message } = error;
    
    if (response) {
      // Server responded with error status
      console.error(`❌ API Error: ${response.config?.method?.toUpperCase()} ${response.config?.url}`, {
        status: response.status,
        data: response.data,
        message: response.statusText,
      });
      
      // Handle specific error codes
      switch (response.status) {
        case 401:
          // Unauthorized - Session expired
          console.warn('🔒 Unauthorized - Session expired');
          // Let the component handle profile reset
          break;
          
        case 404:
          // Not found - Profile not found
          console.warn('🔍 Resource not found');
          break;
          
        case 500:
          // Server error - Allow retry
          console.error('🔥 Server error - Retry allowed');
          break;
          
        default:
          console.error(`❌ Unhandled error status: ${response.status}`);
      }
    } else if (request) {
      // Request was made but no response received
      if (message.includes('timeout')) {
        console.error('⏰ Request timeout - Taking longer than expected');
      } else {
        console.error('🌐 Network error - Offline mode');
      }
    } else {
      // Something else happened
      console.error('❌ Request setup error:', message);
    }
    
    return Promise.reject(error);
  }
);

// Error handling utilities
export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const { response, request, message } = error;
    
    if (response) {
      // Server responded with error
      switch (response.status) {
        case 401:
          return 'Session expired. Please start over.';
        case 404:
          return 'Profile not found. Please create a new profile.';
        case 500:
          return 'Server error. Please try again.';
        default:
          return response.data?.message || response.statusText || 'An error occurred';
      }
    } else if (request) {
      // Network error
      if (message.includes('timeout')) {
        return 'Request is taking longer than expected. Please try again.';
      } else {
        return 'Network error. Please check your connection.';
      }
    }
  }
  
  return error instanceof Error ? error.message : 'An unexpected error occurred';
};

// Standardized API response type
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

// Helper to create standardized responses
export const createApiResponse = <T>(
  success: boolean,
  data?: T,
  error?: string
): ApiResponse<T> => ({
  success,
  data,
  error,
});

// Wrapper for API calls with error handling
export const apiCall = async <T>(
  apiFunction: () => Promise<AxiosResponse<T>>
): Promise<ApiResponse<T>> => {
  try {
    const response = await apiFunction();
    return createApiResponse(true, response.data);
  } catch (error) {
    return createApiResponse(false, undefined, getErrorMessage(error));
  }
};
