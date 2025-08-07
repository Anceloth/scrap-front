import React from 'react';
import { AuthForm } from '../components/AuthForm';
import { ThemeToggleButton } from '../components/ThemeToggleButton';

export const AuthPage: React.FC = () => {
  return (
    <>
      <ThemeToggleButton />
      <AuthForm />
    </>
  );
};
