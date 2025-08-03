import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Paper,
  Stack,
  Divider,
} from '@mui/material';
import { joinEvent } from '../../service/api/api.service';
import { toast } from 'react-toastify';
// Zod schema for form validation
const joinEventSchema = z.object({
  accessCode: z.string().min(1, "Access code is required"),
});

type JoinEventFormData = z.infer<typeof joinEventSchema>;

const JoinEventPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm<JoinEventFormData>({
    resolver: zodResolver(joinEventSchema),
    defaultValues: {
      accessCode: '',
    },
  });

  const onSubmit = async (data: JoinEventFormData) => {
    setIsLoading(true);
    try {
      console.log('Joining event with code:', data.accessCode);
      await joinEvent(data.accessCode);
      navigate('/my-events');
      
    } catch (error) {
      console.error('Failed to join event:', error);
      toast.error('Failed to join event. Please try again later.');
    } finally {
      setIsLoading(false);
    }
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
          padding: { xs: 1, sm: 1, md: 2, lg: 2 },
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="sm" sx={{ padding: { xs: 1, sm: 1, md: 2, lg: 2 } }}>
          <Paper
            elevation={3}
            sx={{
              padding: { xs: 2, sm: 3, md: 4 },
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
                component="form"
                onSubmit={handleSubmit(onSubmit)}
                sx={{
                  display: 'flex',
                  gap: 2,
                  width: '100%',
                  flexDirection: { xs: 'column', sm: 'row' },
                  height: { sm: 80 },
                  alignItems: 'stretch',
                }}
              >
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Enter your one-time access code"
                  {...register('accessCode')}
                  error={!!errors.accessCode}
                  helperText={errors.accessCode?.message}
                  sx={{
                    flex: 0.7,
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    },
                  }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  loading={isLoading}
                  sx={{
                    height: '56px',
                    flex: 0.3,
                    minHeight: '56px',
                    fontSize: '1rem',
                    textTransform: 'none',
                  }}
                >
                  {isLoading ? 'Joining...' : 'Join'}
                </Button>
              </Box>

              {/* Divider Text */}
              <Divider 
                sx={{ 
                  width: '100%',
                  "&::before, &::after": {
                    borderColor: "#333333",
                    borderWidth: '1px',
                  },  
                }}
              >
                Or
              </Divider>
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