import React from 'react';
import {
  Box,
  Typography,
  Container,
  Paper,
  Stack,
} from '@mui/material';

const MyEventsPage: React.FC = () => {
  return (
    <Box
      sx={{
        height: '100vh',
        backgroundColor: 'background.default',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2,
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={3}
          sx={{
            padding: { xs: 3, sm: 4, md: 5 },
            backgroundColor: 'background.paper',
            borderRadius: 2,
            textAlign: 'center',
          }}
        >
          <Stack spacing={3} alignItems="center">
            <Typography
              variant="h3"
              component="h1"
              sx={{
                fontWeight: 100,
                letterSpacing: '0.2em',
                color: 'text.primary',
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
              }}
            >
              MY EVENTS
            </Typography>
            
            <Typography
              variant="body1"
              sx={{
                color: 'text.secondary',
                fontSize: '1.1rem',
                maxWidth: '600px',
                lineHeight: 1.6,
              }}
            >
              This page will display your created events and events you've joined.
              <br />
              <br />
              Coming soon...
            </Typography>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

export default MyEventsPage;
