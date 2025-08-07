import { ThemeProvider } from './context';
import { AuthProvider } from './context/auth';
import { AuthPage } from './pages';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AuthPage />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
