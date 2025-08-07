import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
} from '@mui/material';
import { 
  AccountCircle, 
  Logout,
  Settings,
} from '@mui/icons-material';
import { useAuth } from '../context/auth/useAuth';

export const Header: React.FC = () => {
  const { state, logout } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleMenuClose();
    await logout();
  };

  const isMenuOpen = Boolean(anchorEl);

  // Get first letter of username for avatar
  const avatarLetter = state.user?.username?.charAt(0).toUpperCase() || 'U';

  return (
    <AppBar 
      position="static" 
      elevation={1}
      sx={{ 
        backgroundColor: (theme) => 
          theme.palette.mode === 'dark' 
            ? 'rgba(18, 18, 18, 0.95)'
            : 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: (theme) => 
          `1px solid ${theme.palette.mode === 'dark' 
            ? 'rgba(255, 255, 255, 0.1)' 
            : 'rgba(0, 0, 0, 0.1)'}`,
        color: (theme) => theme.palette.text.primary,
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Logo/App Name */}
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            fontWeight: 'bold',
            color: 'primary.main',
            display: { xs: 'none', sm: 'block' }
          }}
        >
          React Scraping App
        </Typography>

        {/* Mobile Logo */}
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            fontWeight: 'bold',
            color: 'primary.main',
            display: { xs: 'block', sm: 'none' }
          }}
        >
          App
        </Typography>

        {/* User Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Welcome Message */}
          <Typography 
            variant="body2" 
            sx={{ 
              mr: 1,
              display: { xs: 'none', md: 'block' },
              color: 'text.secondary'
            }}
          >
            Welcome back,
          </Typography>

          {/* User Info */}
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              cursor: 'pointer',
              padding: '4px 8px',
              borderRadius: 2,
              '&:hover': {
                backgroundColor: (theme) => 
                  theme.palette.mode === 'dark' 
                    ? 'rgba(255, 255, 255, 0.08)'
                    : 'rgba(0, 0, 0, 0.04)',
              },
              transition: 'background-color 0.2s ease',
            }}
            onClick={handleMenuOpen}
          >
            <Avatar
              sx={{
                width: 32,
                height: 32,
                backgroundColor: 'primary.main',
                fontSize: '0.9rem',
                fontWeight: 'bold',
              }}
            >
              {avatarLetter}
            </Avatar>
            
            <Typography 
              variant="body1" 
              sx={{ 
                fontWeight: 'medium',
                display: { xs: 'none', sm: 'block' }
              }}
            >
              {state.user?.username}
            </Typography>

            <IconButton
              size="small"
              sx={{ 
                color: 'text.secondary',
                '&:hover': { backgroundColor: 'transparent' }
              }}
            >
              <AccountCircle fontSize="small" />
            </IconButton>
          </Box>

          {/* User Menu */}
          <Menu
            anchorEl={anchorEl}
            open={isMenuOpen}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            slotProps={{
              paper: {
                sx: {
                  mt: 1,
                  minWidth: 200,
                  backgroundColor: (theme) =>
                    theme.palette.mode === 'dark'
                      ? 'rgba(18, 18, 18, 0.95)'
                      : 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(20px)',
                  border: (theme) => 
                    `1px solid ${theme.palette.mode === 'dark' 
                      ? 'rgba(255, 255, 255, 0.1)' 
                      : 'rgba(0, 0, 0, 0.1)'}`,
                  boxShadow: (theme) =>
                    theme.palette.mode === 'dark'
                      ? '0 8px 32px rgba(0, 0, 0, 0.3)'
                      : '0 8px 32px rgba(0, 0, 0, 0.1)',
                },
              },
            }}
          >
            {/* User Info Header */}
            <Box sx={{ px: 2, py: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
              <Typography variant="body2" color="text.secondary">
                Signed in as
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {state.user?.username}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {state.user?.email}
              </Typography>
            </Box>

            {/* Menu Items */}
            <MenuItem onClick={handleMenuClose}>
              <Settings sx={{ mr: 1, fontSize: '1.2rem' }} />
              Settings
            </MenuItem>
            
            <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
              <Logout sx={{ mr: 1, fontSize: '1.2rem' }} />
              Sign Out
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
