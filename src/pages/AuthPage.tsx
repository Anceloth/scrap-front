import React from 'react';
import { AuthForm } from '../components/AuthForm';
import { ThemeToggleButton } from '../components/ThemeToggleButton';
import type { LoginFormData, RegisterFormData, AuthMode } from '../types/auth';
import { logger } from '../utils/config';

export const AuthPage: React.FC = () => {
  // Handle form submission - placeholder for future implementation
  const handleAuthSubmit = (data: LoginFormData | RegisterFormData, mode: AuthMode) => {
    logger.info('Auth form submitted:', { mode, email: data.email });
    
    // TODO: Implement actual authentication logic here
    // This is where you would typically:
    // - Send the data to your authentication API
    // - Handle success/error responses
    // - Redirect user on successful authentication
    // - Store authentication tokens/session data
    
    if (mode === 'login') {
      logger.debug('Processing login for:', (data as LoginFormData).email);
    } else {
      logger.debug('Processing registration for:', (data as RegisterFormData).email);
    }
  };

  return (
    <>
      <ThemeToggleButton />
      <AuthForm onSubmit={handleAuthSubmit} />
    </>
  );
};
