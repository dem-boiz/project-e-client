
import './App.css'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import AppRouter from './routes/AppRouter';
import { AuthProvider } from './service/auth/AuthProvider';

// TODO: For a more seamless experience, track y scroll when keyboard pushes up elements.
// After the keyboard is dismiessed, scroll back to the previous position.

// Dark theme configuration
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#5C8374', // Dark blue,
      light: '#93B1A6',
      dark: '#183D3D',
    },
    error: {
      main: '#F44336', // Red 
      light: '#E57373',
      dark: '#C62828',
    },
    background: {
      default: '#121212',
      paper: '#1E1E1E',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b3b3b3',
    },
    divider: '#373737',
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function App() {
  // Set the basename for GitHub Pages deployment

  return (
    <AuthProvider>
      <ThemeProvider theme={darkTheme}>
        <AppRouter />
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App
