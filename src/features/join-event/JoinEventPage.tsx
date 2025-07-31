import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Paper,
  Stack,
} from '@mui/material';



const JoinEventPage: React.FC = () => {
  const [accessCode, setAccessCode] = useState('');
  const navigate = useNavigate();

  const handleJoinEvent = () => {
    // TODO: Implement join event logic
  };

  const handleCreateEvent = () => {
    navigate('/create-event');
  };

  return (
      <Box
        sx={{
          height: '100vh',
          backgroundColor: 'background.default',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 2,
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="sm">
          <Paper
            elevation={3}
            sx={{
              padding: { xs: 3, sm: 4, md: 5 },
              backgroundColor: 'background.paper',
              borderRadius: 2,
            }}
          >
            <Stack spacing={4} alignItems="center">
              {/* Logo/Title */}
              <Typography
                variant="h3"
                component="h1"
                sx={{
                  fontWeight: 100,
                  letterSpacing: '0.2em',
                  color: 'text.primary',
                  textAlign: 'center',
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                }}
              >
                PROJECT E
              </Typography>

              {/* Code Input Row */}
              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  width: '100%',
                  flexDirection: { xs: 'column', sm: 'row' },
                  alignItems: 'stretch',
                }}
              >
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Enter your one-time access code"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  sx={{
                    flex: 0.7,
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    },
                  }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleJoinEvent}
                  sx={{
                    flex: 0.3,
                    minHeight: '56px',
                    fontSize: '1rem',
                    textTransform: 'none',
                  }}
                >
                  Join
                </Button>
              </Box>

              {/* Divider Text */}
              <Typography
                variant="body1"
                sx={{
                  color: 'text.secondary',
                  fontWeight: 300,
                  fontSize: '1.1rem',
                }}
              >
                or
              </Typography>

              {/* Create Event Button */}
              <Button
                color="primary"
                variant='contained'
                onClick={handleCreateEvent}
                sx={{
                  width: '100%',
                  padding: '12px 24px',
                  fontSize: '1rem',
                  textTransform: 'none',
                }}
              >
                Create Event
              </Button>
            </Stack>
          </Paper>
        </Container>
      </Box>
  );
};

export default JoinEventPage;