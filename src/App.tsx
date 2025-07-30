
import './App.css'
import LandingPage from './features/landing/LandingPage'
import { ThemeProvider, createTheme } from '@mui/material/styles';

// Dark theme configuration
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#032418', // Dark blue,
      light: '#354F46',
      dark: '#021910',
    },
    background: {
      default: '#121212',
      paper: '#0a0a0a',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b3b3b3',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <LandingPage />
    </ThemeProvider>
  );
}

export default App
