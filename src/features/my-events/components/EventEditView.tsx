import React, { useEffect } from 'react';
import * as z from "zod";
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Stack,
  TextField,
  Button,
  Dialog,
  DialogTitle as MuiDialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
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
import EditIcon from '@mui/icons-material/Edit';

dayjs.extend(relativeTime);



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
});

export type EditFormData = z.infer<typeof editEventSchema>;

interface EventEditViewProps {
  event: Event | null;
  onClose: () => void;
  onSave: (data: EditFormData) => void;
  onCancelEvent?: () => void;
}

const EventEditView: React.FC<EventEditViewProps> = ({ event, onSave, onCancelEvent }) => {
  const [showWarning, setShowWarning] = React.useState(false);
  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<EditFormData>({
    resolver: zodResolver(editEventSchema),
    defaultValues: {
      name: '',
      description: '',
      location: '',
      date: '',
      capacity: 100,
    },
  });


  const handleCancelEvent = () => {
    setShowWarning(false);
    onCancelEvent?.();
  };
  
  // Reset form when event changes or modal opens
  useEffect(() => {
      reset({
        name: event?.name,
        description: event?.description || '',
        location: event?.location || '',
        date: event?.date,
        capacity: event?.capacity || 100,
      });
      scrollTo(0, 0);
  }, [event, reset]);



  if (!event) return null;



  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      
          <Box
            sx={{
              padding: 3,
              borderBottom: '1px solid',
              borderColor: 'divider',
              position: 'relative',
            }}
          >

            <Box sx={{ 
              display: 'flex', 
              alignItems: 'flex-start', 
              marginBottom: 2, 
              paddingRight: 6,
            }}>
              <EditIcon 
                fontSize='medium' 
                color="action" 
                sx={{
                  marginRight: 1,
                  marginTop: 0.25,
                  color: 'text.primary',
                }} 
              />
              <DialogTitle title={'Edit Event'} />
            </Box>
          </Box>

          {/* Form Content */}
          <Box sx={{ padding: 3 }}>
            <Box
              id="event-edit-form"
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
            </Box>
              <Button 
                  variant="contained" 
                  sx={{ 
                    width: 'fit-content', 
                    alignSelf: 'center',
                    marginTop: 10
                  }} 
                  color="error" 
                  onClick={() => setShowWarning(true)} 
                >
                  Cancel Event
              </Button>
          </Box>

          {/* Cancel Event Warning Dialog */}
          <Dialog
            open={showWarning}
            onClose={() => setShowWarning(false)}
            maxWidth="sm"
            fullWidth
            sx={{
              '& .MuiDialog-paper': {
                backgroundColor: 'background.paper',
                borderRadius: 2,
              },
            }}
          >
            <MuiDialogTitle sx={{ 
              color: 'text.primary',
              fontWeight: 500,
              padding: 3,
              paddingBottom: 1,
            }}>
              Cancel Event
            </MuiDialogTitle>
            <DialogContent sx={{ padding: 3, paddingTop: 1 }}>
              <DialogContentText sx={{ 
                color: 'text.secondary',
                fontSize: '1rem',
                lineHeight: 1.5,
              }}>
                Are you sure you want to cancel this event? This action cannot be undone and all attendees will be notified of the cancellation.
              </DialogContentText>
            </DialogContent>
            <DialogActions sx={{ 
              padding: 3, 
              paddingTop: 1,
              gap: 2,
            }}>
              <Button
                onClick={() => setShowWarning(false)}
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
                Keep Event
              </Button>
              <Button
                onClick={handleCancelEvent}
                variant="contained"
                color="error"
                sx={{
                  textTransform: 'none',
                }}
              >
                Cancel Event
              </Button>
            </DialogActions>
          </Dialog>

    </LocalizationProvider>
  );
};

export default EventEditView;
