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
import EventEditView from './EventEditView';


interface EventTileExpandedProps {
  event: Event | null;
  open: boolean;
  onClose: () => void;
}

const EventTileExpanded: React.FC<EventTileExpandedProps> = ({ event, open, onClose }) => {
  const dialogContentRef = React.useRef<HTMLElement>(null);
  const [ editViewOpen, setEditViewOpen ] = React.useState(false);

  useEffect(() => {
    if (open) {
      setEditViewOpen(false);
    }
  }, [open]);

  if (!event) return null;

  return (
    <Dialog
      open={open}
      maxWidth={false}
      onClose={onClose}
      sx={{
        '& .MuiPaper-root.MuiDialog-paper': {
          overflowX: 'hidden',
          height: { xs: '85vh', md: '90vh' },
          width: '100%',
          maxWidth: { xs: 850, sm: 850, md: 850, lg: 850 },
          display: 'flex',
          flexDirection: 'column',
          margin: '30px 10px'

        },
        '& .MuiDialog-paper': {
          borderRadius: 2,
          height: '90vh',
          maxHeight: '90vh',
        },
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
              onClick ={() => console.log('Save changes')}
              variant="contained"
              color="primary"
              sx={{ textTransform: 'none' }}
            >
              Save
            </Button>
          )}

          {event.role === 'host' && (
            <Button
              onClick={() => setEditViewOpen(() => !editViewOpen)}
              variant="contained"
              color="primary"
              sx={{ textTransform: 'none' }}
            >
              {editViewOpen ? 'Cancel' : 'Edit Event'}
            </Button>
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
