import React from 'react';
import { AuthForm } from '../components/AuthForm';
import { FloatingThemeToggle } from '../components/FloatingThemeToggle';

export const AuthPage: React.FC = () => {
  return (
    <>
      <AuthForm />
      <FloatingThemeToggle />
    </>
  );
};
