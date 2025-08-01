import React, { useState, useEffect } from 'react';
import * as z from "zod";
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Stack,
  IconButton,
  TextField,
  Alert,
  FormControlLabel,
  Checkbox,
  Snackbar,
  type SnackbarCloseReason,
  type SlideProps,
  Slide,
} from '@mui/material';
import {
  Close as CloseIcon,
  Star as HostIcon,
  Event as EventIcon,
  People as PeopleIcon,
  QrCode as QrCodeIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Message as MessageIcon,
} from '@mui/icons-material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import type { Event } from '../../../types/event';
import dayjs, { Dayjs } from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import EventPassQR from './EventPassQR';

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

interface EventTileExpandedProps {
  event: Event | null;
  open: boolean;
  onClose: () => void;
}

const EventTileExpanded: React.FC<EventTileExpandedProps> = ({ event, open, onClose }) => {
  const [qrOpen, setQrOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
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
    if (event && open) {
      reset({
        name: event.name,
        description: event.description || '',
        location: event.location || '',
        date: event.date,
        capacity: event.capacity || 100,
        isPrivate: event.isPrivate,
      });
      setIsEditMode(false);
      setSaveSuccess(false);
    }
  }, [event, open, reset]);
  
  if (!event) return null;

  const isHost = event.role === 'host';

  const handleEditToggle = () => {
    if (isEditMode) {
      // Save mode - submit form
      handleSubmit(onSave)(); // get validation functiona and call it
    } else {
      // Edit mode - enable editing
      setIsEditMode(true);
      setSaveSuccess(false);
    }
  };

  const onSave = (data: EditFormData) => {
    console.log('Saving event data:', data);
    
    // Simulate successful save
    setIsEditMode(false);
    setSaveSuccess(true);
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };

  const handleCloseSnackbar = (
    event?: React.SyntheticEvent | globalThis.Event,
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

      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            backgroundColor: 'background.paper',
            borderRadius: 2,
            maxHeight: '90vh',
          },
        }}
      >
        <DialogContent sx={{ padding: 0 }}>
          {/* Header */}
          <Box
            sx={{
              padding: 3,
              borderBottom: '1px solid',
              borderColor: 'divider',
              position: 'relative',
            }}
          >
            <IconButton
              onClick={onClose}
              sx={{
                position: 'absolute',
                right: 16,
                top: 16,
                color: 'text.secondary',
              }}
            >
              <CloseIcon />
            </IconButton>

            <Box sx={{ display: 'flex', alignItems: 'flex-start', marginBottom: 2, paddingRight: 6 }}>
                <TextField
                  fullWidth
                  variant='filled'
                  disabled={!isEditMode}
                  {...register("name")}
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  sx={{
                    '& .MuiInputBase-root.MuiFilledInput-root': {
                      fontSize: '2rem',
                      '&.Mui-disabled': {
                        opacity: 1,
                        backgroundColor: 'transparent',
                        color: 'text.primary',
                        ':before': {
                          borderBottom: 'none',
                        }
                      },
                
                    },
                    '& .MuiInputBase-input.MuiFilledInput-input': {
                      paddingTop: '0px'
                    }

                  }}
                />
              {isHost && (
                <Box sx={{ display: 'flex', alignItems: 'center', marginLeft: 2 }}>
                  <HostIcon sx={{ color: 'primary.main', fontSize: '1.5rem', marginRight: 0.5 }} />
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'primary.main',
                      fontWeight: 500,
                      fontSize: '0.875rem',
                    }}
                  >
                    HOST
                  </Typography>
                </Box>
              )}
            </Box>

            <Stack direction="row" spacing={2} flexWrap="wrap">
              <Chip
                label={event.isPrivate ? 'Private Event' : 'Public Event'}
                icon={<EventIcon />}
                sx={{
                  backgroundColor: event.isPrivate ? 'rgba(255, 193, 7, 0.2)' : 'rgba(76, 175, 80, 0.2)',
                  color: event.isPrivate ? '#FFC107' : '#4CAF50',
                }}
              />
              <Chip
                label={event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                sx={{
                  backgroundColor: 'rgba(92, 131, 116, 0.2)',
                  color: 'primary.main',
                }}
              />
              {event.attendeeCount !== undefined && (
                <Chip
                  label={`${event.attendeeCount} attending`}
                  icon={<PeopleIcon />}
                  sx={{
                    backgroundColor: 'rgba(92, 131, 116, 0.1)',
                    color: 'text.secondary',
                  }}
                />
              )}
            </Stack>
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


                {/* Top Row: Date & Time + Location */}
                <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
                  <Box sx={{ flex: 1 }}>
                    <Controller
                      name="date"
                      control={control}
                      render={({ field }) => (
                        <DateTimePicker
                          label="Event Date & Time"
                          disabled={!isEditMode}
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
                      disabled={!isEditMode}
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
                  disabled={!isEditMode}
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
                          disabled={!isEditMode}
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
                      disabled={!isEditMode || !isPrivate}
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
          </Box>
        </DialogContent>

        <DialogActions sx={{ padding: 3, borderTop: '1px solid', borderColor: 'divider' }}>
          <Button
            onClick={onClose}
            variant="outlined"
            sx={{
              textTransform: 'none',
              borderColor: 'text.secondary',
              color: 'text.secondary',
              '&:hover': {
                borderColor: 'primary.main',
                color: 'primary.main',
              },
            }}
          >
            Close
          </Button>
          {isHost && (
            <Button
              onClick={handleEditToggle}
              variant="contained"
              color="primary"
              startIcon={isEditMode ? <SaveIcon /> : <EditIcon />}
              sx={{
                textTransform: 'none',
                marginLeft: 1,
              }}
            >
              {isEditMode ? 'Save' : 'Edit'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};

export default EventTileExpanded;
