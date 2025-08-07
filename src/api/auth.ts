import { apiClient } from './client';
import type { 
  LoginRequest, 
  RegisterRequest, 
  LoginResponse, 
  RegisterResponse, 
  ApiResponse 
} from '../types/api';
import { logger } from '../utils/config';

class AuthService {
  private readonly endpoint = '/auth';

  /**
   * Login user with email and password
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      logger.info('Attempting login for:', credentials.email);
      
      const response = await apiClient.post<ApiResponse<LoginResponse>>(
        `${this.endpoint}/login`,
        credentials
      );

      logger.info('Login successful for:', credentials.email);
      return response.data;
      
    } catch (error) {
      logger.error('Login failed for:', credentials.email, error);
      throw error;
    }
  }

  /**
   * Register new user
   */
  async register(userData: RegisterRequest): Promise<any> {
    try {
      logger.info('Attempting registration for:', userData.email);
      
      const response = await apiClient.post<ApiResponse<any>>(
        `${this.endpoint}/register`,
        userData
      );

      logger.info(response.message, userData.email);
      return response;
      
    } catch (error) {
      logger.error('Registration failed for:', userData.email, error);
      throw error;
    }
  }

  /**
   * Logout user (if backend endpoint exists)
   */
  async logout(): Promise<void> {
    try {
      logger.info('Attempting logout');
      
      // If you have a logout endpoint
      // await apiClient.post(`${this.endpoint}/logout`);
      
      logger.info('Logout successful');
      
    } catch (error) {
      logger.error('Logout failed:', error);
      // Don't throw on logout failure - still clear local data
    }
  }

  /**
   * Refresh access token (if backend supports it)
   */
  async refreshToken(): Promise<LoginResponse> {
    try {
      logger.info('Attempting token refresh');
      
      const response = await apiClient.post<ApiResponse<LoginResponse>>(
        `${this.endpoint}/refresh`
      );

      logger.info('Token refresh successful');
      return response.data;
      
    } catch (error) {
      logger.error('Token refresh failed:', error);
      throw error;
    }
  }

  /**
   * Verify current token validity
   */
  async verifyToken(): Promise<boolean> {
    try {
      await apiClient.get(`${this.endpoint}/verify`);
      return true;
    } catch {
      return false;
    }
  }
}

// Export singleton instance
export const authService = new AuthService();
