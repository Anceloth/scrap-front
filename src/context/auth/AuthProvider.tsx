import React, { createContext, useReducer, useEffect, useMemo } from 'react';
import type { ReactNode } from 'react';
import type { AuthState, User, ApiError } from '../../types/api';
import { authService } from '../../api/auth';
import { logger } from '../../utils/config';

// Auth actions
type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: User; accessToken: string } }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' };

// Initial state
const initialState: AuthState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Auth reducer
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        accessToken: action.payload.accessToken,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };

    case 'AUTH_FAILURE':
      return {
        ...state,
        user: null,
        accessToken: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };

    case 'LOGOUT':
      return {
        ...state,
        user: null,
        accessToken: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };

    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
}

// Auth context type
export interface AuthContextType {
  state: AuthState;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

// Create context
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider props
interface AuthProviderProps {
  children: ReactNode;
}

// Local storage helpers
const AUTH_STORAGE_KEY = 'authData';

interface StoredAuthData {
  user: User;
  accessToken: string;
}

const saveAuthData = (data: StoredAuthData): void => {
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data));
    localStorage.setItem('accessToken', data.accessToken); // For API client
    logger.debug('Auth data saved to localStorage');
  } catch (error) {
    logger.error('Failed to save auth data:', error);
  }
};

const loadAuthData = (): StoredAuthData | null => {
  try {
    const data = localStorage.getItem(AUTH_STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data) as StoredAuthData;
      logger.debug('Auth data loaded from localStorage');
      return parsed;
    }
  } catch (error) {
    logger.error('Failed to load auth data:', error);
  }
  return null;
};

const clearAuthData = (): void => {
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem('accessToken');
    logger.debug('Auth data cleared from localStorage');
  } catch (error) {
    logger.error('Failed to clear auth data:', error);
  }
};

// Auth provider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load auth data on mount
  useEffect(() => {
    const storedData = loadAuthData();
    if (storedData) {
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: storedData,
      });
    }
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<void> => {
    dispatch({ type: 'AUTH_START' });

    try {
      const response = await authService.login({ email, password });
      
      const authData: StoredAuthData = {
        user: response.user,
        accessToken: response.accessToken,
      };

      saveAuthData(authData);
      
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: authData,
      });

      logger.info('User logged in successfully:', response.user.email);

    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : (error as ApiError).message || 'Login failed';
      
      dispatch({
        type: 'AUTH_FAILURE',
        payload: errorMessage,
      });

      throw error;
    }
  };

  // Register function
  const register = async (username: string, email: string, password: string): Promise<void> => {
    dispatch({ type: 'AUTH_START' });

    try {
      const response = await authService.register({ username, email, password });
      
      const authData: StoredAuthData = {
        user: response.user,
        accessToken: response.accessToken,
      };

      saveAuthData(authData);
      
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: authData,
      });

      logger.info('User registered successfully:', response.user.email);

    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : (error as ApiError).message || 'Registration failed';
      
      dispatch({
        type: 'AUTH_FAILURE',
        payload: errorMessage,
      });

      throw error;
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      await authService.logout();
    } catch (error) {
      // Log but don't throw - we still want to clear local data
      logger.error('Logout API call failed:', error);
    }

    clearAuthData();
    dispatch({ type: 'LOGOUT' });
    logger.info('User logged out');
  };

  // Clear error function
  const clearError = (): void => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const contextValue: AuthContextType = useMemo(
    () => ({
      state,
      login,
      register,
      logout,
      clearError,
    }),
    [state]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
