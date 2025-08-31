import React, { useEffect } from 'react';
import {
  Dialog,
} from '@mui/material';
import type { Event } from '../../../types/event';
import EventEditView, { type EditFormData } from './EventEditView';
import { 
  updateEvent, 
  deleteEvent, 
  type UpdateEventRequest
} from '../../../service/api/api.service';
import { toast } from 'react-toastify';

import SlidingView from './SlidingView';
import EventGuestsView from './EventGuestsView/EventGuestsView';
import EventDefaultView from './EventDefaultView';

// TODO: Update any edit forms to store current values and disable if no changes are detected.

type TransitioningComponent = 'EditView' | 'GuestView'

interface EventTileExpandedProps {
  event: Event | null;
  open: boolean;
  onClose: () => void;
  onEventChanged?: (change: 'DELETE' | 'UPDATE', event: Event) => void;
}

const EventTileExpanded: React.FC<EventTileExpandedProps> = ({ event, open, onClose, onEventChanged }) => {
  const dialogRef = React.useRef<HTMLDivElement>(null);
  const [ editViewOpen, setEditViewOpen ] = React.useState(false);
  const [ guestViewOpen, setGuestViewOpen ] = React.useState(false);
  const [ transitioningComponent, setTransitioningComponent ] = React.useState<TransitioningComponent | null>(null);

  const onCancelEvent = async () => {
    if (event) {
      try {
        // TODO: Implement actual cancel event API call
        // await cancelEvent(event.id);
        console.log('Cancelling event:', event.id);
        await deleteEvent(event.id);
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
        console.log('finaly!')
      }
    }
  };

  const onEditSave = async (data: EditFormData) => {
    if (event) {
      try {
        await updateEvent(event.id, data as unknown as UpdateEventRequest);
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
        console.log('finally!')
      }
    }
  }




  useEffect(() => {
    if (open) {
      setEditViewOpen(false);
      setGuestViewOpen(false);
    }
  }, [open]);

  useEffect(() => {
    if (!(editViewOpen || guestViewOpen)) {
      setTransitioningComponent(null);
    }

  }, [editViewOpen, guestViewOpen]);


  useEffect(() => {
    if (transitioningComponent === 'GuestView'){
      setGuestViewOpen((prevState) => !prevState);

    } else if (transitioningComponent === 'EditView') {
      setEditViewOpen((prevState) => !prevState);
    } else {
      console.warn('Unknown transitioning component:', transitioningComponent);
    }

  }, [transitioningComponent]);

  if (!event) return null;

  return (
    <Dialog
      id='top-level=dialog'
      ref={dialogRef}
      open={open}
      maxWidth={false}
      onClose={onClose}
    
      sx={{
        '& .MuiPaper-root.MuiDialog-paper': {
            overflow: 'hidden',
            height: { xs: '100vh', sm: '100vh', md: '90vh' },
            width: '100%',
            maxWidth: { xs: 850, sm: 850, md: 850, lg: 850 },
            display: 'flex',
            flexDirection: 'column',
            margin: '0px 0px 0px 0px',
            marginX: { xs: 0, sm: 5 },
            borderRadius: { xs: 0, sm: 2 },
            backgroundColor: '#121212',
            backgroundImage: 'none'
        },
        '& .MuiDialog-paper': {
          borderRadius: 2,
          height: '90vh',
          maxHeight: '90vh',
        },
        backgroundColor: 'background.default',
      }}
      >
    

      {/**
       * Below are the different sliding views that this component supports.
       */}
      <SlidingView
        type="default"
        slideProps={{
          appear: false,
          in: !(editViewOpen || guestViewOpen),
          direction: 'right',
          unmountOnExit: true,
          mountOnEnter: true,
        }}

      >
        <EventDefaultView
          event={event}
          onEditClick={() => setTransitioningComponent('EditView')}
          onGuestsClick={() => setTransitioningComponent('GuestView')}
        />
      </SlidingView>
      <SlidingView
        slideProps={{
          appear: false,
          in: editViewOpen,
          direction: 'left',
          unmountOnExit: true,
          mountOnEnter: true,
        }}
        onBackClick={() => setEditViewOpen(false)}
      >
          <EventEditView
            onSave={onEditSave}
            onCancelEvent={onCancelEvent}
            event={event} 
            onClose={() => setEditViewOpen(false)} 
          />
      </SlidingView>
      <SlidingView
        slideProps={{
          appear: false,
          in: guestViewOpen,
          direction: 'left',
          unmountOnExit: true,
          mountOnEnter: true,
        }}
        onBackClick={() => setGuestViewOpen(false)}
      >
          <EventGuestsView eventId={event.id} />
      </SlidingView>
      
    </Dialog>
        
  );
};

export default EventTileExpanded;
