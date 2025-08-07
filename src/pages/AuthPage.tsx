import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthForm } from '../components/AuthForm';
import { FloatingThemeToggle } from '../components/FloatingThemeToggle';
import { useAuth } from '../context/auth/useAuth';

export const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useAuth();
  const { isAuthenticated, isLoading } = state;

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Show loading state while checking authentication
  if (isLoading) {
    return null; // or a loading spinner
  }

  // Don't show auth form if already authenticated
  if (isAuthenticated) {
    return null;
  }

  return (
    <>
      <AuthForm />
      <FloatingThemeToggle />
    </>
  );
};
