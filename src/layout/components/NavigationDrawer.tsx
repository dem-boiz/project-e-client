import React, { useEffect, useState } from 'react';
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
import { useAuth } from '../../hooks/useAuth';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import { toast } from 'react-toastify';
import { requestLogout } from '../../service/api/api.service';

interface NavigationItem {
  label: string;
  icon: React.ReactNode;
  route: string;
  enabled?: boolean;
}

interface FooterItem {
  label: string;
  icon: React.ReactNode;
  route?: string;
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
  const auth = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(auth.isAuthenticated());

  const footerItems: FooterItem[] = React.useMemo(() => [
    
    {
        label: isAuthenticated ? 'Sign Out' : 'Sign In/Create Account',
        icon: isAuthenticated ? <LogoutIcon /> : <LoginIcon />,
      route: isAuthenticated ? '/sign-out' : '/sign-in',
      enabled: true,
    },
  ], [isAuthenticated]);

  useEffect(() => {
    if (isOpen) {
      // Handle drawer open
      setIsAuthenticated(auth.isAuthenticated());
    } else {
      // Handle drawer close
    }
  }, [auth, isOpen]);

  const handleNavigate = (route: string) => {
    navigate(route);
    setIsOpen(false);
  };

  const handleSignOut = async () => {
    try {
        await requestLogout();
        setIsOpen(false);
        auth.logout();
        setIsAuthenticated(false);
        toast.success('Successfully signed out.');
        handleNavigate('/sign-in');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to sign out.');
      console.error(error);
    }

  };

  const drawerContent = (
    <Box
      sx={{
        width: 280,
        height: '100%',
        backgroundColor: 'background.paper',
        color: 'text.primary',
        display: 'flex',
        flexDirection: 'column',
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

      {/* Footer Items */}
      <List sx={{ 
        padding: '16px 0',
        marginTop: 'auto',
        }}>

        <Typography
          variant="caption"
          sx={{
            fontSize: '0.80rem',
            padding: '8px 16px',
            color: 'text.secondary',
          }}
        >
          {isAuthenticated ? `Signed in as ${auth.user?.name}` : ''}
        </Typography>

        {footerItems.map((item) => {
          const isActive = location.pathname === item.route;
          const isDisabled = item.enabled === false;

          return (
            <ListItem key={item.route} disablePadding>
              <ListItemButton
                onClick={() => {
                  console.log('Footer item clicked:', item.label);
                  if (item.enabled) {
                      console.log('Navigating to:', item.route);
                      if (isAuthenticated && item.route === '/sign-out') {
                          handleSignOut();
                          return;
                      }
                      if (item.route) {
                          handleNavigate(item.route);
                      }
                  }
                }}
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
