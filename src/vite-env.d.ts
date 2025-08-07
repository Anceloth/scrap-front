/// <reference types="vite/client" />

interface ImportMetaEnv {
  // App Configuration
  readonly VITE_APP_NAME: string;
  readonly VITE_APP_VERSION: string;
  readonly VITE_APP_DESCRIPTION: string;
  
  // API Configuration
  readonly VITE_API_BASE_URL: string;
  readonly VITE_API_TIMEOUT: string;
  
  // Authentication Configuration
  readonly VITE_AUTH_TOKEN_KEY: string;
  readonly VITE_AUTH_REFRESH_TOKEN_KEY: string;
  readonly VITE_AUTH_TOKEN_EXPIRY: string;
  
  // Theme Configuration
  readonly VITE_THEME_STORAGE_KEY: string;
  readonly VITE_DEFAULT_THEME: string;
  
  // Feature Flags
  readonly VITE_ENABLE_REGISTRATION: string;
  readonly VITE_ENABLE_PASSWORD_RESET: string;
  readonly VITE_ENABLE_REMEMBER_ME: string;
  
  // Development Configuration
  readonly VITE_DEBUG_MODE: string;
  readonly VITE_LOG_LEVEL: string;
  
  // Social Auth
  readonly VITE_GOOGLE_CLIENT_ID: string;
  readonly VITE_FACEBOOK_APP_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
