
import './App.css'
import JoinEventPage from './features/join-event/JoinEventPage';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { BrowserRouter, Routes, Route } from "react-router";
import RootLayout from './layout/RootLayout';
import { Navigate } from 'react-router';


// Dark theme configuration
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#04291b', // Dark blue,
      light: '#365348',
      dark: '#021C12',
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
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RootLayout />}>
            <Route index element={<Navigate to="/join-event" replace />} /> {/* Redirect root to join event page, for good UX */}
            <Route path="join-event" element={<JoinEventPage />} />
            <Route path="create-event" element={<JoinEventPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App
