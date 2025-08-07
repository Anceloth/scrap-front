import { ThemeProvider } from './context';
import { AuthPage } from './pages';

function App() {
  return (
    <ThemeProvider>
      <AuthPage />
    </ThemeProvider>
  );
}

export default App;
