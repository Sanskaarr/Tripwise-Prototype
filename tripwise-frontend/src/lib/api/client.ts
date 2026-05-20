import axios, { AxiosInstance, AxiosError, AxiosResponse } from 'axios';
import { config } from '@/config/env';
import { sessionCheckState } from '@/lib/sessionCheckState';

export const apiClient: AxiosInstance = axios.create({
  baseURL: config.apiBaseUrl,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
  // Sends the httpOnly auth_token cookie automatically on every request.
  // The Authorization header is no longer used by browser clients.
  withCredentials: true,
});

// Response interceptor — log errors, handle 401
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    const { response, request, message } = error;

    if (response) {
      console.error(`API Error: ${response.config?.method?.toUpperCase()} ${response.config?.url}`, {
        status: response.status,
      });
      if (response.status === 401) {
        sessionCheckState.validated = false;
        // A 401 from a resource endpoint doesn't necessarily mean the session is dead
        // (e.g. a background call to a non-existent or restricted endpoint).
        // Verify the session first; only logout if the session is genuinely expired.
        // isVerifyingSession debounces concurrent 401s so we only fire one verify.
        if (!sessionCheckState.isVerifyingSession) {
          sessionCheckState.isVerifyingSession = true;
          import('@/lib/api/authApi')
            .then(({ validateSession }) => validateSession())
            .then(res => {
              sessionCheckState.isVerifyingSession = false;
              if (!res.success) {
                sessionCheckState.onUnauthorized?.();
              }
            })
            .catch(() => {
              sessionCheckState.isVerifyingSession = false;
              sessionCheckState.onUnauthorized?.();
            });
        }
      }
    } else if (request) {
      if (message.includes('timeout')) {
        console.error('Request timeout');
      } else {
        console.error('Network error');
      }
    }

    return Promise.reject(error);
  }
);

export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const { response, request, message } = error;
    if (response) {
      switch (response.status) {
        case 401: return 'Session expired. Please log in again.';
        case 404: return 'Resource not found.';
        case 500: return 'Our AI servers are currently busy. Please try again in a few minutes.';
        case 503: return 'Our servers are currently busy. Please try again in a few minutes.';
        default: return (response.data as { message?: string })?.message || response.statusText || 'An error occurred';
      }
    } else if (request) {
      return message.includes('timeout')
        ? 'Request timed out. Please try again.'
        : 'Network error. Please check your connection.';
    }
  }
  return error instanceof Error ? error.message : 'An unexpected error occurred';
};

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export const createApiResponse = <T>(success: boolean, data?: T, error?: string): ApiResponse<T> => ({
  success, data, error,
});

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
