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
  useMediaQuery,
  Divider,
} from '@mui/material';
import { useDrawer } from '../../context/useDrawer';
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
import { getAuthService } from '../../service/auth';

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
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const auth = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(auth.isAuthenticated());
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  console.log('breakpoint:', theme.breakpoints.down('md'));
  console.log('isMobile:', isMobile);
  const { isDrawerOpen, setIsDrawerOpen } = useDrawer();

  const footerItems: FooterItem[] = React.useMemo(() => [
    {
        label: isAuthenticated ? 'Sign Out' : 'Sign In/Create Account',
        icon: isAuthenticated ? <LogoutIcon /> : <LoginIcon />,
      route: isAuthenticated ? '/sign-out' : '/sign-in',
      enabled: true,
    },
  ], [isAuthenticated]);

  useEffect(() => {
    if (isDrawerOpen) {
      // Handle drawer open
      setIsAuthenticated(auth.isAuthenticated());
    } else {
      // Handle drawer close
    }
    console.log('Drawer useEffect called');
    console.log('isDrawerOpen:', isDrawerOpen);
    console.log('isAuthenticated:', auth.isAuthenticated());

  }, [auth, isDrawerOpen]);

  const handleNavigate = (route: string) => {
    navigate(route);
    setIsDrawerOpen(false);
  };

  const handleSignOut = async () => {
    try {
        await getAuthService().logout();
        setIsDrawerOpen(false);
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
          onClick={() => setIsDrawerOpen(false)}
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
      {/* Hamburger Menu Button - Only visible on mobile */}
      {isMobile && (
        <IconButton
          onClick={() => setIsDrawerOpen(true)}
          sx={{
            position: 'fixed',
            top: 16,
            left: 16,
            zIndex: 1200,
            backgroundColor: 'transparent',
            color: 'text.primary',
            padding: '8px',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
          }}
        >
          <MenuIcon />
        </IconButton>
      )}
      {/* Desktop toggle button - Only visible on desktop */}
      {!isMobile && !isDrawerOpen && (

        <Box 
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            height: '100vh',
            zIndex: 1200,
            width: 75,
            paddingTop: '15px'
          }}
        >

            <IconButton
              onClick={() => setIsDrawerOpen(true)}
              sx={{
  
                color: 'text.primary',

                alignSelf: 'center',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  
                },
              }}
            >
              <MenuIcon />
            </IconButton>
            <Divider />
            <List sx={{ width: '100%', padding: '0px 0px', marginTop: '22px'}}>
              {navigationItems.map((item) => {
                const isActive = location.pathname === item.route;
                const isDisabled = item.enabled === false;

                return (
                  <ListItem key={item.route} disablePadding>
                    <ListItemButton
                      onClick={() => item.enabled && handleNavigate(item.route)}
                      disabled={isDisabled}
                      sx={{
                        padding: '16px 0px',
                        display: 'flex',
          
                        flexDirection: 'column',
                        alignItems: 'center',
                        margin: '0px 4px',
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
                          minWidth: '24px',
                          marginRight: 0,
                          padding: 0,
                          color: 'inherit',
                          alignSelf: 'center',
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>

                      <ListItemText
                        primary={item.label}
                        sx={{
                          '& .MuiTypography-root': {
                            fontSize: '10px',
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

      )}

      {/* Drawer */}
      <Drawer
        anchor="left"
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            backgroundColor: 'background.paper',
            borderRight: `1px solid ${theme.palette.divider}`,
            width: 280,
            boxShadow: isMobile ? '0px 0px 15px rgba(0, 0, 0, 0.2)' : 'none',
          },
          width: isMobile ? 0 : isDrawerOpen ? 0 : 0,
          flexShrink: 0,
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.standard,
          }),
        }}
        // Use temporary drawer on mobile, persistent on desktop
        variant={isMobile ? "temporary" : "persistent"}
        ModalProps={{
          keepMounted: true, // Better performance on mobile
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export default NavigationDrawer;
