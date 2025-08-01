
import './App.css'
import JoinEventPage from './features/join-event/JoinEventPage';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { BrowserRouter, Routes, Route } from "react-router";
import RootLayout from './layout/RootLayout';
import { Navigate } from 'react-router';
import CreateEventPage from './features/create-event/CreateEventPage';
import MyEventsPage from './features/my-events/MyEventsPage';

// Dark theme configuration
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#5C8374', // Dark blue,
      light: '#93B1A6',
      dark: '#183D3D',
    },
    background: {
      default: '#121212',
      paper: '#0a0a0a',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b3b3b3',
    },

    divider: '#161616',
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function App() {
  // Set the basename for GitHub Pages deployment
  const basename = import.meta.env.VITE_BASE_NAME ?? '/';

  return (
    <ThemeProvider theme={darkTheme}>
      <BrowserRouter basename={basename}>
        <Routes>
          <Route path="/" element={<RootLayout />}>
            <Route index element={<Navigate to="/join-event" replace />} /> {/* Redirect root to join event page, for good UX */}
            <Route path="join-event" element={<JoinEventPage />} />
            <Route path="create-event" element={<CreateEventPage />} />
            <Route path="my-events" element={<MyEventsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App
