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
import { EventApiService } from '../../../service/api/api.service';

dayjs.extend(relativeTime);

// Zod schema matching CreateEventPage structure
const editEventSchema = z.object({
  name: z.string().min(1, "Event name is required"),
  description: z.string().optional(),
  location: z.string().optional(),
  date_time: z.string()
    .min(1, "Date is required")
    .refine((dateString) => {
      const date = new Date(dateString);
      return date > new Date();
    }, "Event date must be in the future"),
  capacity: z.number().min(1, "Capacity must be at least 1").max(10000, "Capacity cannot exceed 10,000").optional(),
});

export type EditFormData = z.infer<typeof editEventSchema>;

interface EventEditViewProps {
  event: Event;
  onClose: () => void;
  onSave: (data: EditFormData) => void;
  onCancelEvent?: () => void;
}

const EventEditView: React.FC<EventEditViewProps> = ({ event, onSave, onCancelEvent }) => {
  const [showWarning, setShowWarning] = React.useState(false);
  const [loadingUpdate, setLoadingUpdate] = React.useState(false);
  const [formHasChanges, setFormHasChanges] = React.useState(false);
  

  
  const { register, handleSubmit, control, reset, watch, formState: { errors } } = useForm<EditFormData>({
    resolver: zodResolver(editEventSchema),
    defaultValues: {
      name: event.name || '',
      description: event.description || '',
      location: event.location || '',
      date_time: event.date_time || '',
      capacity: event.capacity || 100,
    },
  });
  
  // Watch all form fields to detect changes
  const watchedFields = watch();
  
  // Check if form values have changed from original values
  React.useEffect(() => {
    
    console.log('Event in useEffect:', event);
    console.log('Watched fields:', watchedFields);


    // TODO: Add capacity to backend?
    const hasChanged = 
      watchedFields.name?.toUpperCase() !== event.name?.toUpperCase() ||
      watchedFields.description?.toUpperCase() !== event.description?.toUpperCase() ||
      watchedFields.location?.toUpperCase() !== event.location?.toUpperCase() ||
      new Date(watchedFields.date_time).getTime() !== new Date(event.date_time).getTime()
      //watchedFields.capacity !== event.capacity;

    
      
    setFormHasChanges(hasChanged);
  }, [watchedFields, event]);


  const handleSubmitForm = async (formData: EditFormData) => {
    setLoadingUpdate(true);
    try {
      await EventApiService.updateEvent(event!.id, {
        id: event!.id,
        name: formData.name,
        description: formData.description,
        location: formData.location,
        date_time: formData.date_time,
      });
      
      // Call the onSave callback from parent component
      onSave(formData);
    } catch (error) {
      console.error('Error saving changes:', error);
    } finally {
      setLoadingUpdate(false);
    }
  }



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
        date_time: event?.date_time,
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
          onSubmit={handleSubmit(handleSubmitForm)}
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
                  name="date_time"
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
                          error: !!errors.date_time,
                          helperText: errors.date_time?.message,
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
          <Box sx={{ 
              display: 'flex', 
              gap: 2, 
              justifyContent: 'center',
              marginTop: 10 
            }}>
            <Button 
                variant="outlined" 
                sx={{ 
                  width: 'fit-content'
                }} 
                color="error" 
                onClick={() => setShowWarning(true)} 
              >
                Cancel Event
            </Button>

            <Button
              disabled={formHasChanges === false}
              loading={loadingUpdate}
              type="submit"
              form="event-edit-form"
              variant="contained"
              sx={{ 
                width: 'fit-content'
              }}
            >
              {loadingUpdate ? 'Saving...' : 'Save Changes'}
            </Button>
          </Box>
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
