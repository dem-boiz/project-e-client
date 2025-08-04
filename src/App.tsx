
import './App.css'
import JoinEventPage from './features/join-event/JoinEventPage';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { BrowserRouter, Routes, Route } from "react-router";
import RootLayout from './layout/RootLayout';
import { Navigate } from 'react-router';
import CreateEventPage from './features/create-event/CreateEventPage';
import MyEventsPage from './features/my-events/MyEventsPage';

/**
 * JIRA: MOB-123
 * Title: Implement scroll position restoration after keyboard dismissal
 * 
 * Description:
 * Implement functionality to track Y-scroll position when the mobile keyboard 
 * pushes up UI elements, then restore that position when the keyboard is dismissed.
 * This will create a more seamless user experience especially on mobile devices.
 * 
 * Acceptance Criteria:
 * - Track scroll position before keyboard appears
 * - Restore scroll position after keyboard is dismissed
 * - Works across all form elements in the application
 * - Tested on iOS and Android devices
 * 
 * Priority: Medium
 * Story points: 3
 */
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
