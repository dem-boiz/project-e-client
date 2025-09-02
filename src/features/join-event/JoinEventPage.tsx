import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
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
import { toast } from 'react-toastify';
import { EventApiService } from '../../service/api/api.service';


// Zod schema for form validation
const joinEventSchema = z.object({
  accessCode: z.string().min(1, "Access code is required").regex(/^\d{6}$/, "Access code must be exactly 6 digits"),
});

type JoinEventFormData = z.infer<typeof joinEventSchema>;

const JoinEventPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [urlParamError, setUrlParamError] = useState<string | null>(null);

  const { accessCode } = useParams<{ accessCode?: string }>();
  
  // Validate the accessCode from params using Zod
  const isValidAccessCode = React.useMemo(() => {
    if (!accessCode) return false;
    
    try {
      // Parse will throw if validation fails
      joinEventSchema.parse({ accessCode });
      setUrlParamError(null);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = z.flattenError(error).fieldErrors as { accessCode?: string[] };
        const errorMessage = fieldErrors.accessCode?.[0] || "Invalid access code";
        setUrlParamError(errorMessage);
        console.log('errr', errorMessage);
      }
      return false;
    }
  }, [accessCode]);

  const { register, handleSubmit, formState: { errors }, setValue } = useForm<JoinEventFormData>({
    resolver: zodResolver(joinEventSchema),
    defaultValues: {
      accessCode: accessCode || '',
    },
  });
  
  // Ensure the access code from URL params shows up in the form field
  React.useEffect(() => {
    if (accessCode) {
      setValue('accessCode', accessCode);
    }
  }, [accessCode, setValue]);

  const onSubmit = React.useCallback(async (data: JoinEventFormData) => {
    setIsLoading(true);
    try {
      console.log('Joining event with code:', data.accessCode);
      // Call the redeemEventInvite API
      await EventApiService.redeemEventInvite(data.accessCode);
      toast.success("Successfully joined the event!");
      navigate('/my-events'); // Redirect to my events after successful join
    } catch (error) {
      console.error('Failed to join event:', error);
      toast.error('Failed to join event. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);
  
  // Auto-join when accessed with valid accessCode
  React.useEffect(() => {
    console.log('accessCode:', accessCode);
    if (accessCode && isValidAccessCode) {
      console.log('Auto-submitting valid access code');
      onSubmit({ accessCode });
    } else if (accessCode && !isValidAccessCode) {
      console.log('Invalid access code format, not auto-submitting');
      // Don't navigate away, just show error in form
    }
  }, [accessCode, onSubmit, isValidAccessCode]);

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
          overflow: 'auto',
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
                  disabled={isLoading}
                  fullWidth
                  variant="outlined"
                  placeholder="Enter your one-time access code"
                  {...register('accessCode')}
                  error={!!errors.accessCode || !!urlParamError}
                  helperText={errors.accessCode?.message || urlParamError || ' '} // Add space to maintain height
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
                  disabled={isLoading}
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
                disabled={isLoading}
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