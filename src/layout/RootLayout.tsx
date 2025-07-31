import { Outlet } from "react-router";
import NavigationDrawer from "./components/NavigationDrawer";
import { Box } from "@mui/material";

export default function RootLayout() {
  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: '100vh',
        backgroundColor: 'background.default',
      }}
    >
      <NavigationDrawer />
      <main>
        <Outlet />  {/* This is where nested routes will render */}
      </main>
    </Box>
  );
}
