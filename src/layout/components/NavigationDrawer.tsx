import React, { useState } from 'react';
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  useTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  Login as JoinIcon,
  Add as CreateIcon,
  Dashboard as DashboardIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router';

interface NavigationItem {
  label: string;
  icon: React.ReactNode;
  route: string;
  enabled?: boolean;
}

const navigationItems: NavigationItem[] = [
  {
    label: 'Join Event',
    icon: <JoinIcon />,
    route: '/join-event',
    enabled: true,
  },
  {
    label: 'Create Event',
    icon: <CreateIcon />,
    route: '/create-event',
    enabled: true,
  },
  {
    label: 'My Events',
    icon: <DashboardIcon />,
    route: '/my-events',
    enabled: true, // Disabled for now, future feature
  },
  {
    label: 'Settings',
    icon: <SettingsIcon />,
    route: '/settings',
    enabled: false, // Disabled for now, future feature
  },
];

const NavigationDrawer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  const handleNavigate = (route: string) => {
    navigate(route);
    setIsOpen(false);
  };

  const drawerContent = (
    <Box
      sx={{
        width: 280,
        height: '100%',
        backgroundColor: 'background.paper',
        color: 'text.primary',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 24px',
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 300,
            letterSpacing: '0.1em',
            color: 'text.primary',
          }}
        >
          PROJECT E
        </Typography>
        <IconButton
          onClick={() => setIsOpen(false)}
          sx={{ color: 'text.primary'}}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Navigation Items */}
      <List sx={{ padding: '16px 0' }}>
        {navigationItems.map((item) => {
          const isActive = location.pathname === item.route;
          const isDisabled = item.enabled === false;

          return (
            <ListItem key={item.route} disablePadding>
              <ListItemButton
                onClick={() => item.enabled && handleNavigate(item.route)}
                disabled={isDisabled}
                sx={{
                  margin: '4px 16px',
                  borderRadius: '8px',
                  backgroundColor: isActive ? 'primary.main' : 'transparent',
                  color: isActive ? 'primary.contrastText' : 'text.primary',
                  opacity: isDisabled ? 0.5 : 1,
                  '&:hover': {
                    backgroundColor: isActive 
                      ? 'primary.dark' 
                      : isDisabled 
                        ? 'transparent'
                        : 'rgba(255, 255, 255, 0.08)',
                  },
                  '&.Mui-disabled': {
                    color: 'text.disabled',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: 'inherit',
                    minWidth: '40px',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  sx={{
                    '& .MuiTypography-root': {
                      fontSize: '0.95rem',
                      fontWeight: isActive ? 500 : 400,
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* Footer/Version Info */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 16,
          left: 24,
          right: 24,
        }}
      >
        <Divider sx={{ marginBottom: 2 }} />
        <Typography
          variant="caption"
          sx={{
            color: 'text.secondary',
            fontSize: '0.75rem',
          }}
        >
          Event Management System
        </Typography>
      </Box>
    </Box>
  );

  return (
    <>
      {/* Hamburger Menu Button */}
      <IconButton
        onClick={() => setIsOpen(true)}
        sx={{
          position: 'fixed',
          top: 16,
          left: 16,
          zIndex: 1200,
          backgroundColor: 'transparent',
          color: 'text.primary',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          },
        }}
      >
        <MenuIcon />
      </IconButton>

      {/* Drawer */}
      <Drawer
        anchor="left"
        open={isOpen}
        onClose={() => setIsOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            backgroundColor: 'background.paper',
            borderRight: `1px solid ${theme.palette.divider}`,
          },
        }}
        // Use temporary drawer on mobile, persistent could be added for desktop later
        variant="temporary"
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export default NavigationDrawer;
