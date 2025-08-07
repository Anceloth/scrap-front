import React from 'react';
import { Box, Typography, Chip, Stack } from '@mui/material';
import { config, isDevelopment, getEnvironment } from '../utils/config';

export const AppInfo: React.FC = () => {
  if (!isDevelopment()) {
    return null; // Don't show app info in production
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 16,
        left: 16,
        backgroundColor: (theme) => theme.palette.background.paper,
        border: (theme) => `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
        padding: 2,
        minWidth: 200,
        boxShadow: 2,
        zIndex: 1000,
      }}
    >
      <Typography variant="h6" gutterBottom sx={{ fontSize: '0.875rem', fontWeight: 'bold' }}>
        {config.app.name}
      </Typography>
      
      <Stack direction="column" spacing={1}>
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
            Version: {config.app.version}
          </Typography>
        </Box>
        
        <Box>
          <Chip
            label={getEnvironment().toUpperCase()}
            color={isDevelopment() ? 'warning' : 'success'}
            size="small"
            sx={{ fontSize: '0.7rem', height: '20px' }}
          />
        </Box>
        
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
            API: {config.api.baseUrl}
          </Typography>
        </Box>
        
        <Stack direction="row" spacing={0.5} flexWrap="wrap">
          {config.features.enableRegistration && (
            <Chip
              label="Registration"
              color="success"
              size="small"
              variant="outlined"
              sx={{ fontSize: '0.6rem', height: '18px' }}
            />
          )}
          {config.features.enablePasswordReset && (
            <Chip
              label="Password Reset"
              color="info"
              size="small"
              variant="outlined"
              sx={{ fontSize: '0.6rem', height: '18px' }}
            />
          )}
          {config.development.debugMode && (
            <Chip
              label="Debug"
              color="error"
              size="small"
              variant="outlined"
              sx={{ fontSize: '0.6rem', height: '18px' }}
            />
          )}
        </Stack>
      </Stack>
    </Box>
  );
};
