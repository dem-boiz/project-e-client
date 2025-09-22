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
import ManageGuestsView from './ManageGuestsView/ManageGuestsView';
import EventDefaultView, { type Vendor } from './EventDefaultView';
import EventVendorView from './EventVendorsView/EventVendorsView';
import ManageVendorsView from './ManageVendorsView/ManageVendorsView';

// TODO: Update any edit forms to store current values and disable if no changes are detected.

type TransitioningComponent = 'EditView' | 'VendorView' | 'ManageGuestView' | 'ManageVendorsView';

interface EventTileExpandedProps {
  event: Event;
  open: boolean;
  onClose: () => void;
  onEventChanged?: (change: 'DELETE' | 'UPDATE', event: Event) => void;
}

const EventTileExpanded: React.FC<EventTileExpandedProps> = ({ event, open, onClose, onEventChanged }) => {
  const dialogRef = React.useRef<HTMLDivElement>(null);
  const [ editViewOpen, setEditViewOpen ] = React.useState(false);
  const [ manageGuestsViewOpen, setManageGuestsViewOpen ] = React.useState(false);
  const [ manageVendorsViewOpen, setManageVendorsViewOpen ] = React.useState(false);
  const [ vendorViewOpen, setVendorViewOpen ] = React.useState(false);
  const [ transitioningComponent, setTransitioningComponent ] = React.useState<TransitioningComponent | null>(null);
  const [ selectedVendor, setSelectedVendor ] = React.useState<Vendor | null>(null);



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
      }
    }
  };

  const onEditSave = async (data: EditFormData) => {
    if (event) {
      try {
        await updateEvent(event.id, data as unknown as UpdateEventRequest);
        toast.success('Event updated successfully');
        if (onEventChanged) {
          event.date_time = data.date_time; // Update the event date_time
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
      }
    }
  }


  const handleVendorClick = (vendor: Vendor) => {
    console.log('Vendor clicked in expanded view:', vendor);
    setSelectedVendor(vendor);
    setTransitioningComponent('VendorView');
  }

  useEffect(() => {
    if (open) {
      setEditViewOpen(false);
      setManageGuestsViewOpen(false);
    }
  }, [open]);

  useEffect(() => {
    if (!(editViewOpen || manageGuestsViewOpen || vendorViewOpen)) {
      setTransitioningComponent(null);
    }

  }, [editViewOpen, manageGuestsViewOpen, vendorViewOpen]);


  useEffect(() => {
     switch (transitioningComponent) {
       case 'EditView':
         setEditViewOpen(true);
         break;
       case 'ManageGuestView':
         setManageGuestsViewOpen(true);
         break;
       case 'VendorView':
         setVendorViewOpen(true);
         break;
       case 'ManageVendorsView':
         setManageVendorsViewOpen(true);
         break;
       default:
        console.warn('Unknown transitioning component:', transitioningComponent);
         break;
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
        },
        '& .MuiDialog-paper': {
          borderRadius: 2,
          height: '90vh',
          maxHeight: '90vh',
        }
      }}
      >
  
      {/**
       * Below are the different sliding views that this component supports.
       */}
      <SlidingView
        type="default"
        slideProps={{
          appear: false,
          in: !(editViewOpen || manageGuestsViewOpen || vendorViewOpen || manageVendorsViewOpen),
          direction: 'right',
          unmountOnExit: true,
          mountOnEnter: true,
        }}

      >
        <EventDefaultView
          event={event}
          onEditClick={() => setTransitioningComponent('EditView')}
          onManageGuestsClick={() => setTransitioningComponent('ManageGuestView')}
          onManageVendorsClick={() => setTransitioningComponent('ManageVendorsView')}
          onVendorsClick={(vendor: Vendor) => handleVendorClick(vendor)}
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
          in: manageGuestsViewOpen,
          direction: 'left',
          unmountOnExit: true,
          mountOnEnter: true,
        }}
        onBackClick={() => setManageGuestsViewOpen(false)}
      >
          <ManageGuestsView eventId={event.id} />
      </SlidingView>
      <SlidingView
        slideProps={{
          appear: false,
          in: manageVendorsViewOpen,
          direction: 'left',
          unmountOnExit: true,
          mountOnEnter: true,
        }}
        onBackClick={() => setManageVendorsViewOpen(false)}
      >
          <ManageVendorsView eventId={event.id} />
      </SlidingView>
      <SlidingView
        slideProps={{
          appear: false,
          in: vendorViewOpen,
          direction: 'left',
          unmountOnExit: true,
          mountOnEnter: true,
        }}
        onBackClick={() => setVendorViewOpen(false)}
      >
        <EventVendorView eventId={event.id} selectedVendor={selectedVendor} />
      </SlidingView>
    </Dialog>
        
  );
};

export default EventTileExpanded;
