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
  FormControlLabel,
  Checkbox,
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

const schema = z.object({
  name: z.string().min(1, "Event name is required"),
  description: z.string().optional(),
  location: z.string().optional(),
  date: z.string()
    .min(1, "Date is required")
    .refine((dateString) => {
      const date = new Date(dateString);
      return date > new Date();
    }, "Event date must be in the future"),
  capacity: z.number().min(1, "Capacity must be at least 1").max(10000, "Capacity cannot exceed 10,000").optional(),
  isPrivate: z.boolean(),
});

type FormData = z.infer<typeof schema>;

const CreateEventForm: React.FC = () => {
  const { register, handleSubmit, control, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      description: '',
      location: '',
      date: '',
      capacity: 100,
      isPrivate: false,
    },
  });

  const isPrivate = watch('isPrivate');

  const onSubmit = (data: FormData) => {
    // Convert capacity to undefined if event is public
    const eventData = {
      ...data,
      capacity: isPrivate ? data.capacity : undefined,
    };
    console.log(eventData);
    // Call your backend here
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        sx={{
          height: '100vh',
          backgroundColor: 'background.default',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 2,
          overflow: 'auto',
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
                    name="date"
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
                            error: !!errors.date,
                            helperText: errors.date?.message,
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

                  {/* Private Event Checkbox */}
                  <Controller
                    name="isPrivate"
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={
                          <Checkbox
                            {...field}
                            checked={field.value}
                            sx={{
                              color: 'text.secondary',
                              '&.Mui-checked': {
                                color: 'primary.main',
                              },
                            }}
                          />
                        }
                        label={
                          <Typography sx={{ color: 'text.primary', fontSize: '1rem' }}>
                            Private Event
                          </Typography>
                        }
                        sx={{ alignSelf: 'flex-start', marginLeft: 0 }}
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
                      },
                      '&.MuiPaper-root': {
                        boxShadow: 'none',
                      },
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon  sx={{ color: 'text.primary', fontSize: '1.5rem' }} />}
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
                      <Typography sx={{ color: 'text.primary', fontSize: '1rem' }}>
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
                              disabled={!isPrivate}
                              {...field}
                              onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                              error={!!errors.capacity}
                              helperText={
                                !isPrivate 
                                  ? "Only available for private events" 
                                  : errors.capacity?.message || "Min: 1, Max: 10,000"
                              }
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