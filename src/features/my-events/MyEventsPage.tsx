import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Stack,
} from '@mui/material';
import EventTile from './components/EventTile';
import type { Event } from '../../types/event';
import EventTileExpanded from './components/EventTileExpanded';
import { getAllEvents } from '../../service/api/api.service';


const MyEventsPage: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [expandedOpen, setExpandedOpen] = useState(false);
  const [ events, setEvents ] = useState<Event[]>([]); // Assuming mockEvents is an array of Event objects


  const handleTileClick = (event: Event) => {
    setSelectedEvent(event);
    setExpandedOpen(true);
  };

  const handleCloseExpanded = () => {
    setExpandedOpen(false);
    setSelectedEvent(null);
  };

  const handleEventChanged = (change: 'DELETE' | 'UPDATE', event: Event) => {
    if (change === 'DELETE') {
      setEvents((prevEvents) => prevEvents.filter((e) => e.id !== event.id));
    } else if (change === 'UPDATE') {
      setEvents((prevEvents) => prevEvents.map((e) => (e.id === event.id ? event : e)));
    }
  }

  const updateEvents = async () => {
    try {
      const events = await getAllEvents();
      console.log('Fetched events:', events);
      setEvents(events);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    }
  };

  useEffect(() => {
    updateEvents();
  }, [])

  // TODO: Refactor my events page to !!! IMPROVE MOBILE EXPERIENCE !!!...
  // remove use of dialogs.. they take up too much space on mobile
  // instead, use a transition screen on the my events-page with the iniial screen being the 
  // list of event tiles... On event tile click, transition to the detailed view of the event.. From here,
  // the user can transition to the edit menu, or, guest list, etc..


  return (
    <Box
      sx={{
        height: '100vh', // Fixed height instead of minHeight
        backgroundColor: 'background.default',
        overflowY: 'auto', // Enable vertical scrolling
        padding: { xs: 2, sm: 3 },
        paddingTop: { xs: 10, sm: 12 }, // Extra top padding to account for hamburger menu
        paddingBottom: 0, // Remove bottom padding from here
      }}
    >
      <Container 
        maxWidth="xl"
        sx={{
          paddingBottom: { xs: 25, sm: 25, md: 25, lg: 25 }, // Move bottom padding here, inside the scrollable area
        }}
      >
        <Stack spacing={4}>
          {/* Page Header */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="h3"
              component="h1"
              sx={{
                fontWeight: 100,
                letterSpacing: '0.2em',
                color: 'text.primary',
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                marginBottom: 1,
              }}
            >
              MY EVENTS
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: 'text.secondary',
                fontSize: '1.1rem',
                maxWidth: '600px',
                margin: '0 auto',
              }}
            >
              Manage and view all your upcoming events
            </Typography>
          </Box>

          {/* Events Grid */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(1, 1fr)', // 1 column on mobile
                sm: 'repeat(2, 1fr)', // 1 column on small screens
                md: 'repeat(2, 1fr)', // 2 columns on medium screens
                lg: 'repeat(4, 1fr)', // 4 columns on large screens
              },
              gap: 3,
            }}
          >
            {events.map((event) => (
              <EventTile
                key={event.id}
                event={event}
                onClick={() => handleTileClick(event)}
              />
            ))}
          </Box>

          {/* Empty State */}
          {events.length === 0 && (
            <Box
              sx={{
                textAlign: 'center',
                padding: 6,
                backgroundColor: 'background.paper',
                borderRadius: 2,
                border: '1px dashed',
                borderColor: 'divider',
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: 'text.secondary',
                  marginBottom: 1,
                }}
              >
                No events found
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: 'text.secondary',
                }}
              >
                Create your first event or join an existing one to get started
              </Typography>
            </Box>
          )}
        </Stack>
      </Container>

      {/* Expanded Event Modal */}


      <EventTileExpanded
        event={selectedEvent}
        open={expandedOpen}
        onClose={handleCloseExpanded}
        onEventChanged={handleEventChanged}
      />
    </Box>
  );
};

export default MyEventsPage;
