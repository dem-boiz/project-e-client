import React, { useState, useEffect } from 'react';
import * as z from "zod";
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Typography,
  Box,
  Stack,
  TextField,
  Alert,
  FormControlLabel,
  Checkbox,
  Snackbar,
  type SnackbarCloseReason,
  type SlideProps,
  Slide,
  Button,
} from '@mui/material';
import {
} from '@mui/icons-material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import type { Event } from '../../../types/event';
import dayjs, { Dayjs } from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import DialogTitle from './DialogTitle';

dayjs.extend(relativeTime);

function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction="left" />;
}

// Zod schema matching CreateEventPage structure
const editEventSchema = z.object({
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

type EditFormData = z.infer<typeof editEventSchema>;

interface EventEditViewProps {
  event: Event | null;
  onClose: () => void;
}

const EventEditView: React.FC<EventEditViewProps> = ({ event }) => {
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const { register, handleSubmit, control, reset, watch, formState: { errors } } = useForm<EditFormData>({
    resolver: zodResolver(editEventSchema),
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
  
  // Reset form when event changes or modal opens
  useEffect(() => {
      reset({
        name: event?.name,
        description: event?.description || '',
        location: event?.location || '',
        date: event?.date,
        capacity: event?.capacity || 100,
        isPrivate: event?.isPrivate,
      });
      setSaveSuccess(false);
  }, [event, reset]);

  if (!event) return null;



  const onSave = (data: EditFormData) => {
    console.log('Saving event data:', data);
    
    // Simulate successful save
    setSaveSuccess(true);
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };

  const handleCloseSnackbar = (
    _event?: React.SyntheticEvent | globalThis.Event,
    reason?: SnackbarCloseReason,
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setSaveSuccess(false);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Snackbar
        open={saveSuccess}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        slots={{ transition: SlideTransition }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          variant="filled"
          sx={{ width: '100%', bgcolor: 'primary.main', color: 'text.primary', fontFamily: 'typography.fontFamily', fontWeight: 500 }}
        >
          Event Saved!
        </Alert>
      </Snackbar>
      
          <Box
            sx={{
              padding: 3,
              borderBottom: '1px solid',
              borderColor: 'divider',
              position: 'relative',
            }}
          >

            <Box sx={{ display: 'flex', alignItems: 'flex-start', marginBottom: 2, paddingRight: 6 }}>
              <DialogTitle title={'Edit Event'} />
            </Box>
          </Box>

          {/* Form Content */}
          <Box sx={{ padding: 3 }}>
            <Box
              component="form"
              onSubmit={handleSubmit(onSave)}
              sx={{ width: '100%' }}
            >
              <Stack spacing={4}>
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
                      backgroundColor: 'rgba(255,255, 255, 0.05)',
                    },
                  }}
                />


                {/* Top Row: Date & Time + Location */}
                <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
                  <Box sx={{ flex: 1 }}>
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
                  </Box>
                  <Box sx={{ flex: 1 }}>
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
                        '& .MuiInputBase-input.MuiOutlinedInput-input.Mui-disabled': {
                          color: 'red',
                        }
                      }}
                    />
                  </Box>
                </Box>

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
            </Box>
              <Button 
                  variant="contained" 
                  sx={{ 
                    width: 'fit-content', 
                    alignSelf: 'center',
                    marginTop: 10
                  }} 
                  color="error" 
                  onClick={() => console.log('Cancel Event Clicked')} 
                >
                  Cancel Event
              </Button>
          </Box>

    </LocalizationProvider>
  );
};

export default EventEditView;
