/**
 * Environment configuration handler
 * Provides type-safe access to environment variables with defaults and validation
 */

// Type definitions
export type ThemeMode = 'light' | 'dark';
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';
export type LogFunction = (...args: unknown[]) => void;

// Type definitions for configuration
export interface AppConfig {
  app: {
    name: string;
    version: string;
    description: string;
  };
  api: {
    baseUrl: string;
    timeout: number;
  };
  auth: {
    tokenKey: string;
    refreshTokenKey: string;
    tokenExpiry: number;
  };
  theme: {
    storageKey: string;
    defaultTheme: ThemeMode;
  };
  features: {
    enableRegistration: boolean;
    enablePasswordReset: boolean;
    enableRememberMe: boolean;
  };
  development: {
    debugMode: boolean;
    logLevel: LogLevel;
  };
  social: {
    googleClientId?: string;
    facebookAppId?: string;
  };
}

/**
 * Parse boolean value from string
 */
const parseBoolean = (value: string | undefined, defaultValue: boolean = false): boolean => {
  if (!value) return defaultValue;
  return value.toLowerCase() === 'true';
};

/**
 * Parse number value from string
 */
const parseNumber = (value: string | undefined, defaultValue: number = 0): number => {
  if (!value) return defaultValue;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
};

/**
 * Get environment variable with validation
 */
const getEnvVar = (key: keyof ImportMetaEnv, required: boolean = false): string => {
  const value = import.meta.env[key];
  
  if (required && !value) {
    throw new Error(`Required environment variable ${key} is not defined`);
  }
  
  return value || '';
};

/**
 * Validate theme value
 */
const validateTheme = (theme: string): ThemeMode => {
  return theme === 'dark' ? 'dark' : 'light';
};

/**
 * Validate log level
 */
const validateLogLevel = (level: string): LogLevel => {
  const validLevels: LogLevel[] = ['debug', 'info', 'warn', 'error'];
  return validLevels.includes(level as LogLevel) ? (level as LogLevel) : 'info';
};

/**
 * Main configuration object
 */
export const config: AppConfig = {
  app: {
    name: getEnvVar('VITE_APP_NAME') || 'React Auth App',
    version: getEnvVar('VITE_APP_VERSION') || '1.0.0',
    description: getEnvVar('VITE_APP_DESCRIPTION') || 'Modern React Authentication Application',
  },
  
  api: {
    baseUrl: getEnvVar('VITE_API_BASE_URL') || 'http://localhost:3001/api',
    timeout: parseNumber(getEnvVar('VITE_API_TIMEOUT'), 10000),
  },
  
  auth: {
    tokenKey: getEnvVar('VITE_AUTH_TOKEN_KEY') || 'auth_token',
    refreshTokenKey: getEnvVar('VITE_AUTH_REFRESH_TOKEN_KEY') || 'refresh_token',
    tokenExpiry: parseNumber(getEnvVar('VITE_AUTH_TOKEN_EXPIRY'), 3600000), // 1 hour default
  },
  
  theme: {
    storageKey: getEnvVar('VITE_THEME_STORAGE_KEY') || 'theme_mode',
    defaultTheme: validateTheme(getEnvVar('VITE_DEFAULT_THEME')),
  },
  
  features: {
    enableRegistration: parseBoolean(getEnvVar('VITE_ENABLE_REGISTRATION'), true),
    enablePasswordReset: parseBoolean(getEnvVar('VITE_ENABLE_PASSWORD_RESET'), true),
    enableRememberMe: parseBoolean(getEnvVar('VITE_ENABLE_REMEMBER_ME'), true),
  },
  
  development: {
    debugMode: parseBoolean(getEnvVar('VITE_DEBUG_MODE'), false),
    logLevel: validateLogLevel(getEnvVar('VITE_LOG_LEVEL')),
  },
  
  social: {
    googleClientId: getEnvVar('VITE_GOOGLE_CLIENT_ID') || undefined,
    facebookAppId: getEnvVar('VITE_FACEBOOK_APP_ID') || undefined,
  },
};

/**
 * Utility function to check if app is in development mode
 */
export const isDevelopment = (): boolean => {
  return import.meta.env.DEV || config.development.debugMode;
};

/**
 * Utility function to check if app is in production mode
 */
export const isProduction = (): boolean => {
  return import.meta.env.PROD && !config.development.debugMode;
};

/**
 * Get current environment name
 */
export const getEnvironment = (): string => {
  return import.meta.env.MODE || 'development';
};

/**
 * Debug logger (only works in development)
 */
export const logger = {
  debug: (...args: unknown[]) => {
    if (config.development.debugMode && config.development.logLevel === 'debug') {
      console.log('[DEBUG]', ...args);
    }
  },
  info: (...args: unknown[]) => {
    if (config.development.debugMode && ['debug', 'info'].includes(config.development.logLevel)) {
      console.info('[INFO]', ...args);
    }
  },
  warn: (...args: unknown[]) => {
    if (config.development.debugMode && ['debug', 'info', 'warn'].includes(config.development.logLevel)) {
      console.warn('[WARN]', ...args);
    }
  },
  error: (...args: unknown[]) => {
    console.error('[ERROR]', ...args);
  },
};

// Log configuration in development
if (isDevelopment()) {
  logger.info('App Configuration:', {
    environment: getEnvironment(),
    config: {
      ...config,
      // Hide sensitive information in logs
      social: {
        googleClientId: config.social.googleClientId ? '***configured***' : 'not set',
        facebookAppId: config.social.facebookAppId ? '***configured***' : 'not set',
      },
    },
  });
}
