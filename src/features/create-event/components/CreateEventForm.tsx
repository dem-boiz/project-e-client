import React from 'react';
import * as z from "zod";
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Stack,
  Container,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import dayjs, { Dayjs } from 'dayjs';
import { useNavigate } from 'react-router';
import { createEvent } from '../../../service/api/api.service';
import { toast } from 'react-toastify';
import { useAuth } from '../../../hooks/useAuth';


const schema = z.object({
  name: z.string().min(1, "Event name is required"),
  description: z.string().optional(),
  location: z.string().optional(),
  datetime: z.string()
    .min(1, "Date is required")
    .refine((dateString) => {
      const date = new Date(dateString);
      return date > new Date();
    }, "Event date must be in the future"),
  capacity: z.number().min(1, "Capacity must be at least 1").max(10000, "Capacity cannot exceed 10,000").optional(),
});

type FormData = z.infer<typeof schema>;

const CreateEventForm: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [ isLoading, setIsLoading ] = React.useState(false);
  const { register, handleSubmit, control, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      description: '',
      location: '',
      datetime: '',
      capacity: 100,
    },
  });


  const onSubmit = async (data: FormData) => {
    // Convert capacity to undefined if event is public
    if (!user?.id) {
      console.error('Must be signed in to create an event');
      return;
    }
    const eventData = {
      ...data,
      host_id: user?.id
      //capacity: data.capacity,
    };

    console.log('Creating event:', eventData); // TODO: Replace with actual API call
    setIsLoading(true);
    try {
          await createEvent(eventData); // TODO: Replace with actual API call
          toast.success('Event created successfully');
          navigate('/my-events'); // Navigate to My Events page after creation
    } catch (error) {
      console.log('Caught API error:', error);
      toast.error('Failed to create event. Please try again later.');
      // Handle error appropriately, e.g., show a notification
    }
    setIsLoading(false);
    // Call your backend here
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        sx={{
          height: '100vh',
          scrollbarGutter: 'stable', // Fixes shifting from scrollbar appearence... only works on modern browsers.
          backgroundColor: 'background.default',
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          padding: { xs: 1, sm: 1, md: 2, lg: 2 },
          overflow: 'auto',
        }}
      >
        <Container 
          maxWidth="sm" 
          sx={{ 
            padding: { xs: 1, sm: 1, md: 2, lg: 2 },
            marginTop: { xs: 10, sm: 12, md: 20, lg: 20 },
            height: 'fit-content',
            marginBottom: '100px'
          }}
          >
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
                  marginBottom: 2,
                }}
              >
                CREATE EVENT
              </Typography>

              {/* Form */}
              <Box
                component="form"
                onSubmit={handleSubmit(onSubmit)}
                sx={{ width: '100%' }}
              >
                <Stack spacing={3}>
                  {/* Event Name */}
                  <TextField
                    fullWidth
                    label="Event Name"
                    variant="outlined"
                    placeholder="Enter event name"
                    {...register("name")}
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      },
                    }}
                  />

                  {/* Event Date */}
                  <Controller
                    name="datetime"
                    control={control}
                    render={({ field }) => (
                      <DateTimePicker
                        label="Event Date & Time"
                        value={field.value ? dayjs(field.value) : null}
                        onChange={(newValue: Dayjs | null) => {
                          field.onChange(newValue ? newValue.toISOString() : '');
                        }}
                        disablePast
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            error: !!errors.datetime,
                            helperText: errors.datetime?.message,
                            sx: {
                              '& .MuiOutlinedInput-root': {
                                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                              },
                            },
                          },
                        }}
                      />
                    )}
                  />


                  {/* Advanced Options Accordion */}
                  <Accordion
                    sx={{
                      backgroundColor: 'background.default',
                      boxShadow: 'none',
                      '&:before': {
                        display: 'none',
                      },
                      '& .MuiAccordionSummary-root': {
                        backgroundColor: 'transparent',
                      },
                      '& .MuiAccordionDetails-root': {
                        backgroundColor: 'transparent',
                        paddingX: 0,

                      },
                      '&.MuiPaper-root': {
                        boxShadow: 'none',
                      },
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon  sx={{ color: 'text.secondary', fontSize: '1.5rem' }} />}
                      sx={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        '& .MuiAccordionSummary-content': {
                          margin: '8px 0 4px 0',
                          justifyContent: 'center',
                          order: 2,
                        },
                        '& .MuiAccordionSummary-expandIconWrapper': {
                          order: 1,
                          margin: '0 0 4px 0',
                        },
                      }}
                    >
                      <Typography sx={{ color: 'text.secondary', fontSize: '1rem' }}>
                          More Options
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Stack spacing={3}>
                        {/* Description */}
                        <TextField
                          fullWidth
                          label="Description"
                          variant="outlined"
                          placeholder="Enter event description"
                          multiline
                          rows={3}
                          {...register("description")}
                          error={!!errors.description}
                          helperText={errors.description?.message}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            },
                          }}
                        />

                        {/* Location */}
                        <TextField
                          fullWidth
                          label="Location"
                          variant="outlined"
                          placeholder="Enter event location"
                          {...register("location")}
                          error={!!errors.location}
                          helperText={errors.location?.message}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            },
                          }}
                        />

                        {/* Max Attendees (only for private events) */}
                        <Controller
                          name="capacity"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              fullWidth
                              label="Max Attendees"
                              type="number"
                              variant="outlined"
                              placeholder="100"
                              {...field}
                              onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                              error={!!errors.capacity}
                              helperText={errors.capacity?.message || "Min: 1, Max: 10,000"}
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                },
                                '& .Mui-disabled': {
                                  opacity: 0.6,
                                },
                              }}
                            />
                          )}
                        />
                      </Stack>
                    </AccordionDetails>
                  </Accordion>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    loading={isLoading}
                    sx={{
                      width: '100%',
                      padding: '12px 24px',
                      fontSize: '1rem',
                      textTransform: 'none',
                      marginTop: 2,
                    }}
                  >
                    Create Event
                  </Button>

                  {/* Join Event Link */}
                  <Typography
                    onClick={() => navigate('/join-event')}
                    sx={{
                      textAlign: 'center',
                      color: 'text.secondary',
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      marginTop: 2,
                      '&:hover': {
                        color: 'primary.main',
                        textDecoration: 'underline',
                      },
                      transition: 'color 0.2s ease-in-out',
                    }}
                  >
                    Have an event code? Join
                  </Typography>
                </Stack>
              </Box>
            </Stack>
          </Paper>
        </Container>
      </Box>
    </LocalizationProvider>
  );
};

export default CreateEventForm;