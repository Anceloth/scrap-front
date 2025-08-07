import { config, logger } from '../utils/config';
import type { ApiError } from '../types/api';

class ApiClient {
  private readonly baseURL: string;
  private readonly timeout: number;

  constructor() {
    this.baseURL = config.api.baseUrl;
    this.timeout = config.api.timeout;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    // Get auth token from localStorage
    const token = localStorage.getItem('accessToken');
    
    const defaultHeaders: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // Add auth header if token exists
    if (token) {
      defaultHeaders.Authorization = `Bearer ${token}`;
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      logger.debug('API Request:', { url, method: config.method || 'GET' });

      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Handle non-JSON responses
      const contentType = response.headers.get('content-type');
      if (!contentType?.includes('application/json')) {
        throw new Error('Invalid response format');
      }

      const data = await response.json();

      if (!response.ok) {
        const error: ApiError = {
          message: data.message || 'An error occurred',
          status: response.status,
          errors: data.errors,
        };
        
        logger.error('API Error:', error);
        throw error;
      }

      logger.debug('API Response:', { status: response.status, data });
      return data;

    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          const timeoutError: ApiError = {
            message: 'Request timeout',
            status: 408,
          };
          logger.error('API Timeout:', timeoutError);
          throw timeoutError;
        }
      }

      // Re-throw API errors
      if (error && typeof error === 'object' && 'status' in error) {
        throw error;
      }

      // Handle network errors
      const networkError: ApiError = {
        message: 'Network error occurred',
        status: 0,
      };
      logger.error('Network Error:', networkError);
      throw networkError;
    }
  }

  async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T>(endpoint: string, data?: unknown, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: unknown, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
