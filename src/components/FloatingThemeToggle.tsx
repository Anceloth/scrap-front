import React from 'react';
import {
  Fab,
  Tooltip,
  useTheme as useMuiTheme,
} from '@mui/material';
import {
  LightMode,
  DarkMode,
} from '@mui/icons-material';
import { useTheme } from '../hooks/useTheme';

export const FloatingThemeToggle: React.FC = () => {
  const muiTheme = useMuiTheme();
  const { toggleTheme } = useTheme();
  
  const isDark = muiTheme.palette.mode === 'dark';

  return (
    <Tooltip 
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      placement="left"
    >
      <Fab
        onClick={toggleTheme}
        size="medium"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1000,
          backgroundColor: (theme) => 
            theme.palette.mode === 'dark' 
              ? 'rgba(255, 255, 255, 0.1)'
              : 'rgba(0, 0, 0, 0.04)',
          backdropFilter: 'blur(20px)',
          border: (theme) => 
            `1px solid ${theme.palette.mode === 'dark' 
              ? 'rgba(255, 255, 255, 0.2)' 
              : 'rgba(0, 0, 0, 0.1)'}`,
          boxShadow: (theme) =>
            theme.palette.mode === 'dark'
              ? '0 8px 32px rgba(0, 0, 0, 0.3)'
              : '0 8px 32px rgba(0, 0, 0, 0.15)',
          color: 'primary.main',
          '&:hover': {
            backgroundColor: (theme) => 
              theme.palette.mode === 'dark' 
                ? 'rgba(255, 255, 255, 0.15)'
                : 'rgba(0, 0, 0, 0.08)',
            transform: 'translateY(-2px)',
            boxShadow: (theme) =>
              theme.palette.mode === 'dark'
                ? '0 12px 40px rgba(0, 0, 0, 0.4)'
                : '0 12px 40px rgba(0, 0, 0, 0.2)',
          },
          '&:active': {
            transform: 'translateY(0px)',
          },
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {isDark ? (
          <LightMode sx={{ fontSize: '1.5rem' }} />
        ) : (
          <DarkMode sx={{ fontSize: '1.5rem' }} />
        )}
      </Fab>
    </Tooltip>
  );
};
