import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useTheme } from '../context';

export const ThemeToggleButton: React.FC = () => {
  const { mode, toggleTheme } = useTheme();

  return (
    <Tooltip title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}>
      <IconButton
        onClick={toggleTheme}
        color="inherit"
        aria-label="toggle theme"
        sx={{
          position: 'fixed',
          top: { xs: 12, sm: 16 },
          right: { xs: 12, sm: 16 },
          zIndex: 1000,
          width: { xs: 44, sm: 48 },
          height: { xs: 44, sm: 48 },
          backgroundColor: (theme) => theme.palette.background.paper,
          boxShadow: (theme) => theme.shadows[3],
          '&:hover': {
            backgroundColor: (theme) => theme.palette.action.hover,
            transform: 'scale(1.05)',
          },
          '&:active': {
            transform: 'scale(0.95)',
          },
          transition: 'all 0.2s ease-in-out',
        }}
      >
        {mode === 'light' ? 
          <Brightness4 sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} /> : 
          <Brightness7 sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />
        }
      </IconButton>
    </Tooltip>
  );
};
