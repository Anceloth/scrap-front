import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  IconButton,
  InputAdornment,
  Alert,
  CircularProgress,
  Link,
} from '@mui/material';
import { Visibility, VisibilityOff, Person, Lock, Email } from '@mui/icons-material';
import type { RegisterFormData, AuthMode } from '../types/auth';
import { config, logger } from '../utils/config';
import { ForgotPasswordDialog } from './ForgotPasswordDialog';
import { useAuth } from '../context/auth/useAuth';

export const AuthForm: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  
  // Auth context
  const { state, login, register } = useAuth();
  const { error: authError, isLoading: authLoading, registrationSuccess } = state;
  
  const [formData, setFormData] = useState<RegisterFormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Partial<RegisterFormData>>({});
  const [submitError, setSubmitError] = useState<string>('');

  // Auto-switch to login mode after successful registration
  useEffect(() => {
    if (registrationSuccess) {
      setMode('login');
      // Clear form data
      setFormData({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
      setErrors({});
      setSubmitError('');
    }
  }, [registrationSuccess]);

  // Handle input changes
  const handleInputChange = (field: keyof RegisterFormData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((prev: RegisterFormData) => ({
      ...prev,
      [field]: event.target.value,
    }));
    
    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors((prev: Partial<RegisterFormData>) => ({
        ...prev,
        [field]: '',
      }));
    }
    
    // Clear submit error
    if (submitError) {
      setSubmitError('');
    }
  };

  // Validate form data
  const validateForm = (): boolean => {
    const newErrors: Partial<RegisterFormData> = {};

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    // Register mode specific validations
    if (mode === 'register') {
      if (!formData.username) {
        newErrors.username = 'User name is required';
      } else if (formData.username.includes(' ')) {
        newErrors.username = 'User name cannot contain spaces';
      } else if (formData.username.length < 3) {
        newErrors.username = 'User name must be at least 3 characters long';
      }
      
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      if (mode === 'login') {
        await login(formData.email, formData.password);
      } else {
        await register(formData.username, formData.email, formData.password);
      }
      // Success will be handled by the auth context
    } catch (error) {
      // Error will be handled by the auth context
      logger.error('Auth submission failed:', error);
    }
  };

  // Toggle between login and register modes
  const toggleMode = () => {
    // Check if registration is enabled
    if (mode === 'login' && !config.features.enableRegistration) {
      logger.warn('Registration is disabled in current environment');
      return;
    }
    
    setMode((prev: AuthMode) => prev === 'login' ? 'register' : 'login');
    setErrors({});
    setSubmitError('');
    setFormData({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    });
    logger.debug('Auth mode changed to:', mode === 'login' ? 'register' : 'login');
  };

  const isLogin = mode === 'login';

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        width: '100vw',
        position: 'relative',
        padding: { 
          xs: 1.5, // Más padding en móviles
          sm: 2, 
          md: 3 
        },
        boxSizing: 'border-box',
        background: (theme) => 
          `linear-gradient(135deg, ${theme.palette.primary.main}15 0%, ${theme.palette.secondary.main}10 100%)`,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          padding: { 
            xs: 2.5, // Padding optimizado para móviles
            sm: 4, 
            md: 5 
          },
          width: '100%',
          maxWidth: { 
            xs: 'calc(100vw - 24px)', // Ocupa casi toda la pantalla en móviles
            sm: 450, 
            md: 500 
          },
          borderRadius: { 
            xs: 2, // Bordes menos redondeados en móviles
            sm: 3 
          },
          boxShadow: (theme) => 
            theme.palette.mode === 'dark' 
              ? '0 8px 32px rgba(255, 255, 255, 0.1)'
              : '0 8px 32px rgba(0, 0, 0, 0.12)',
          backdropFilter: 'blur(10px)',
          border: (theme) => 
            theme.palette.mode === 'dark' 
              ? '1px solid rgba(255, 255, 255, 0.1)'
              : '1px solid rgba(255, 255, 255, 0.2)',
          margin: 'auto',
        }}
      >
        <Box sx={{ textAlign: 'center', mb: { xs: 3, sm: 4 } }}>
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom
            sx={{
              fontWeight: 'bold',
              fontSize: { 
                xs: '1.5rem', // Más pequeño en móviles
                sm: '1.875rem', 
                md: '2.125rem' 
              },
              color: 'primary.main',
              lineHeight: 1.2,
            }}
          >
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </Typography>
          <Typography 
            variant="body1" 
            color="text.secondary"
            sx={{
              fontSize: { 
                xs: '0.8rem', // Más pequeño en móviles
                sm: '0.875rem', 
                md: '1rem' 
              },
              mb: 1,
              lineHeight: 1.4,
            }}
          >
            {isLogin 
              ? 'Sign in to your account' 
              : 'Sign up to get started'
            }
          </Typography>

          {/* Error Message */}
          {authError && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 2,
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                '& .MuiAlert-message': {
                  width: '100%',
                  textAlign: 'left'
                }
              }}
            >
              {authError}
            </Alert>
          )}

          {/* Registration Success Message */}
          {registrationSuccess && (
            <Alert 
              severity="success" 
              sx={{ 
                mb: 2,
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                '& .MuiAlert-message': {
                  width: '100%',
                  textAlign: 'left'
                }
              }}
            >
              Registration successful! Please sign in with your credentials.
            </Alert>
          )}
        </Box>

        {submitError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {submitError}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          {!isLogin && (
            <TextField
              fullWidth
              label="User Name"
              value={formData.username}
              onChange={handleInputChange('username')}
              error={!!errors.username}
              helperText={errors.username}
              margin="normal"
              size="medium"
              placeholder="Enter your username (no spaces allowed)"
              sx={{
                '& .MuiInputBase-root': {
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  height: { xs: '48px', sm: '56px' }, // Altura optimizada para touch
                },
                '& .MuiFormLabel-root': {
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                },
                '& .MuiFormHelperText-root': {
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                },
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />
                    </InputAdornment>
                  ),
                },
              }}
            />
          )}

          <TextField
            fullWidth
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={handleInputChange('email')}
            error={!!errors.email}
            helperText={errors.email}
            margin="normal"
            autoComplete="email"
            size="medium"
            sx={{
              '& .MuiInputBase-root': {
                fontSize: { xs: '0.875rem', sm: '1rem' },
                height: { xs: '48px', sm: '56px' },
              },
              '& .MuiFormLabel-root': {
                fontSize: { xs: '0.875rem', sm: '1rem' },
              },
              '& .MuiFormHelperText-root': {
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
              },
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Email sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />
                  </InputAdornment>
                ),
              },
            }}
          />

          <TextField
            fullWidth
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleInputChange('password')}
            error={!!errors.password}
            helperText={errors.password}
            margin="normal"
            autoComplete={isLogin ? 'current-password' : 'new-password'}
            size="medium"
            sx={{
              '& .MuiInputBase-root': {
                fontSize: { xs: '0.875rem', sm: '1rem' },
                height: { xs: '48px', sm: '56px' },
              },
              '& .MuiFormLabel-root': {
                fontSize: { xs: '0.875rem', sm: '1rem' },
              },
              '& .MuiFormHelperText-root': {
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
              },
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      aria-label="toggle password visibility"
                      sx={{ 
                        padding: { xs: '6px', sm: '8px' },
                      }}
                    >
                      {showPassword ? 
                        <VisibilityOff sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} /> : 
                        <Visibility sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />
                      }
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          {!isLogin && (
            <TextField
              fullWidth
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleInputChange('confirmPassword')}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              margin="normal"
              autoComplete="new-password"
              size="medium"
              sx={{
                '& .MuiInputBase-root': {
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  height: { xs: '48px', sm: '56px' },
                },
                '& .MuiFormLabel-root': {
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                },
                '& .MuiFormHelperText-root': {
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                },
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                        aria-label="toggle confirm password visibility"
                        sx={{ 
                          padding: { xs: '6px', sm: '8px' },
                        }}
                      >
                        {showConfirmPassword ? 
                          <VisibilityOff sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} /> : 
                          <Visibility sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />
                        }
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={authLoading}
            sx={{ 
              mt: { xs: 2.5, sm: 3 }, 
              mb: { xs: 1.5, sm: 2 }, 
              py: { xs: 1.3, sm: 1.5 },
              fontSize: { xs: '0.9rem', sm: '1rem' },
              fontWeight: 'bold',
              borderRadius: 2,
              textTransform: 'none',
              boxShadow: 2,
              minHeight: { xs: '44px', sm: '48px' }, // Altura mínima para touch
              '&:hover': {
                boxShadow: 4,
                transform: 'translateY(-1px)',
              },
              '&:active': {
                transform: 'translateY(0px)',
              },
              transition: 'all 0.2s ease-in-out',
            }}
          >
            {authLoading ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={20} color="inherit" />
                {isLogin ? 'Signing In...' : 'Creating Account...'}
              </Box>
            ) : (
              <>
                {isLogin ? 'Sign In' : 'Create Account'}
              </>
            )}
          </Button>

          {/* Forgot Password Link - Only show for login mode when enabled */}
          {isLogin && config.features.enablePasswordReset && (
            <Box sx={{ textAlign: 'center', mt: 1, mb: 1 }}>
              <Link
                component="button"
                type="button"
                onClick={() => setShowForgotPassword(true)}
                sx={{ 
                  textDecoration: 'none',
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  fontWeight: 'medium',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                Forgot your password?
              </Link>
            </Box>
          )}

          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              {config.features.enableRegistration && (
                <Link
                  component="button"
                  type="button"
                  onClick={toggleMode}
                  sx={{ 
                    textDecoration: 'none',
                    fontWeight: 'bold',
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  {isLogin ? 'Sign up here' : 'Sign in here'}
                </Link>
              )}
              {!config.features.enableRegistration && isLogin && (
                <Typography 
                  variant="body2" 
                  color="text.disabled"
                  sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                >
                  Registration is currently disabled
                </Typography>
              )}
            </Typography>
          </Box>
        </Box>
      </Paper>
      
      {/* Forgot Password Dialog */}
      <ForgotPasswordDialog 
        open={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
      />
    </Box>
  );
};
