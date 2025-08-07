import { ThemeProvider } from './context';
import { AuthProvider } from './context/auth';
import { AuthPage, Dashboard } from './pages';
import { useAuth } from './context/auth/useAuth';
import { Box, CircularProgress } from '@mui/material';

// Component to handle authentication routing
const AppContent: React.FC = () => {
  const { state } = useAuth();
  const { isAuthenticated, isLoading } = state;

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh' 
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Show dashboard if authenticated, otherwise show auth page
  return isAuthenticated ? <Dashboard /> : <AuthPage />;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
