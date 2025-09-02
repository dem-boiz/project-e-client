import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useAuth } from '../../hooks/useAuth';
import { Box, CircularProgress, Typography } from '@mui/material';

/**
 * This component handles the initial entry point for invite links.
 * It redirects users based on their authentication state:
 * - If authenticated: directly to the join-event page
 * - If not authenticated: to the sign-in page with the access code
 */
const InviteLinkHandler: React.FC = () => {
  const { accessCode } = useParams<{ accessCode: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Validate the access code format (6 digits)
    const isValidAccessCode = /^\d{6}$/.test(accessCode || '');
    
    if (!isValidAccessCode) {
      navigate('/join-event', { replace: true });
      return;
    }

    if (isAuthenticated()) {
      // User is already signed in, redirect to join event page
      navigate(`/join-event/${accessCode}`, { replace: true });
    } else {
      // User is not signed in, redirect to sign-in page with the access code
      navigate(`/sign-in/${accessCode}`, { replace: true });
    }
  }, [accessCode, navigate, isAuthenticated]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
      }}
    >
      <CircularProgress />
      <Typography sx={{ mt: 2 }}>Redirecting you to join the event...</Typography>
    </Box>
  );
};

export default InviteLinkHandler;
