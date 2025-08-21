import React, { useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Slide,
} from '@mui/material';
import type { Event } from '../../../types/event';
import EventGuestView from './EventGuestView';
import EventEditView, { type EditFormData } from './EventEditView';
import { 
  updateEvent, 
  deleteEvent, 
  inviteGuest,
  type UpdateEventRequest
} from '../../../service/api/api.service';
import { toast } from 'react-toastify';
import { useAuth } from '../../../hooks/useAuth';

// TODO: Update any edit forms to store current values and disable if no changes are detected.


interface EventTileExpandedProps {
  event: Event | null;
  open: boolean;
  onClose: () => void;
  onEventChanged?: (change: 'DELETE' | 'UPDATE', event: Event) => void;
}

const EventTileExpanded: React.FC<EventTileExpandedProps> = ({ event, open, onClose, onEventChanged }) => {
  const dialogContentRef = React.useRef<HTMLElement>(null);
  const [ editViewOpen, setEditViewOpen ] = React.useState(false);
  const [ isSaving, setIsSaving ] = React.useState(false);
  const [ isCancelling, setIsCancelling ] = React.useState(false);
  const { user } = useAuth();

  const onCancelEvent = async () => {
    if (event) {
      try {
        // TODO: Implement actual cancel event API call
        // await cancelEvent(event.id);
        console.log('Cancelling event:', event.id);
        setIsCancelling(true);
        await deleteEvent(event.id, user?.access_token);
        toast.success('Event cancelled successfully');
        if (onEventChanged) {
          onEventChanged('DELETE', event);
        }
        onClose(); // Close the dialog after cancelling
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsCancelling(false); 
      }
    }
  };

  const onEditSave = async (data: EditFormData) => {
    if (event) {
      try {
        setIsSaving(true);
        await updateEvent(event.id, data as unknown as UpdateEventRequest, user?.access_token);
        toast.success('Event updated successfully');
        if (onEventChanged) {
          event.date_time = data.datetime; // Update the event date_time
          event.name = data.name;
          event.description = data.description;
          event.location = data.location;
          onEventChanged('UPDATE', event);
        }
        onClose(); // Close the dialog after saving
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsSaving(false);
      }
    }
  }

  const onInviteGuest = async () => {
    if (event) {
      try {
        // TODO: Implement actual invite guest API call
        // await inviteGuest(event.id);
        console.log('Inviting guest to event:', event.id);
        const inviteCode = await inviteGuest(event.id, user?.access_token, "testGuest@example.com", "test invite");
        toast.success(`Guest invited successfully. Invite code: ${inviteCode}`);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error(errorMessage);
        toast.error(errorMessage);
      }
    }
  }


  useEffect(() => {
    if (open) {
      setEditViewOpen(false);
    }
  }, [open]);

  useEffect(() => {
    if (dialogContentRef.current) {
      dialogContentRef.current.scrollTo(0, 0);
    }
  }, [editViewOpen]);

  if (!event) return null;

  return (
    <Dialog
      open={open}
      maxWidth={false}
      onClose={onClose}
      sx={{
        '& .MuiPaper-root.MuiDialog-paper': {
          overflowX: 'hidden',
          height: { xs: '100vh', sm: '100vh', md: '90vh' },
          width: '100%',
          maxWidth: { xs: 850, sm: 850, md: 850, lg: 850 },
          display: 'flex',
          flexDirection: 'column',
          margin: '0px 0px 0px 0px',
          marginX: { xs: 0, sm: 5 },
          borderRadius: { xs: 0, sm: 2 },

        },
        '& .MuiDialog-paper': {
          borderRadius: 2,
          height: '90vh',
          maxHeight: '90vh',
        }
      }}
      >
      <DialogContent sx={{ padding: 0, position: 'relative', overflowX: 'hidden' }} ref={dialogContentRef}>
        <Slide
          appear={false}
          in={!editViewOpen}
          direction="right"
          container={dialogContentRef.current || undefined}
          mountOnEnter
          unmountOnExit
        >

        <Box sx={{ 
          width: '100%', 
          borderRadius: 2, 
          overflow: 'hidden', 
          position: 'absolute',
          }}>
          <EventGuestView  event={event} />

        </Box>

        </Slide>

        <Slide
          appear={false}
          in={editViewOpen}
          direction="left"
          container={dialogContentRef.current || undefined}
          mountOnEnter
          unmountOnExit
          
        >
          <Box sx={{ 
            width: '100%', 
            borderRadius: 2, 
            overflow: 'hidden', 
            position: 'absolute',
          }}>
            <EventEditView
              onSave={onEditSave}
              onCancelEvent={onCancelEvent}
              event={event} 
              onClose={() => setEditViewOpen(false)} 
            />
          </Box>

        </Slide>

      </DialogContent>

        <DialogActions 
          sx={{ 
            padding: 3, 
            borderTop: '1px solid', 
            borderColor: 'divider',
        }}
        > 

          {editViewOpen && (
            <Button
              disabled={isCancelling}
              loading={isSaving}
              type="submit"
              form="event-edit-form"
              variant="contained"
              color="primary"
              sx={{ textTransform: 'none' }}
            >
              Save
            </Button>
          )}

          {event.host_id === user?.id && (
            <>
              <Button
                onClick={() => onInviteGuest()}
                variant="contained"
                color="primary"
                sx={{ textTransform: 'none' }}
              >
                Invite Guest
              </Button>

              <Button
                disabled={isCancelling || isSaving}
                onClick={() => setEditViewOpen(() => !editViewOpen)}
                variant="contained"
                color="primary"
                sx={{ textTransform: 'none' }}
              >
                {editViewOpen ? 'Cancel' : 'Edit Event'}
              </Button>
            </>
          )}
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



      </DialogActions>
    </Dialog>
        
  );
};

export default EventTileExpanded;
