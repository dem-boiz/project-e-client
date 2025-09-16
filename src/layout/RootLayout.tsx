import { Outlet } from "react-router";
import NavigationDrawer from "./components/NavigationDrawer";
import { Box, useTheme, useMediaQuery } from "@mui/material";
import { ToastContainer } from 'react-toastify';
import { useDrawer } from '../context/useDrawer';


export default function RootLayout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const { isDrawerOpen } = useDrawer();
  
  // Calculate main content margin based on drawer state
  const drawerWidth = isMobile ? 0 : 280; // Same as in NavigationDrawer
  
  return (
    <Box 
      sx={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: 'background.default',
      }}
    >
      <NavigationDrawer />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: !isMobile && isDrawerOpen ? `calc(100% - ${drawerWidth}px)` : '100%',
          minHeight: '100vh',
          overflow: 'auto',
          marginLeft: !isMobile && isDrawerOpen ? `${drawerWidth}px` : 0,
          paddingTop: theme.spacing(2),
          paddingLeft: theme.spacing(2),
          paddingRight: theme.spacing(2),
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.standard,
          }),
        }}
      >
        <Outlet />  {/* This is where nested routes will render */}
      </Box>
      <ToastContainer
        theme="dark"
      />
    </Box>
  );
}
