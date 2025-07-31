import React, { useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Stack,
} from '@mui/material';
import EventTile from './components/EventTile';
import EventTileExpanded from './components/EventTileExpanded';
import { mockEvents } from '../../types/event';
import type { Event } from '../../types/event';

const MyEventsPage: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [expandedOpen, setExpandedOpen] = useState(false);

  const handleTileClick = (event: Event) => {
    setSelectedEvent(event);
    setExpandedOpen(true);
  };

  const handleCloseExpanded = () => {
    setExpandedOpen(false);
    setSelectedEvent(null);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: 'background.default',
        padding: { xs: 2, sm: 3 },
        paddingTop: { xs: 10, sm: 12 }, // Extra top padding to account for hamburger menu
      }}
    >
      <Container maxWidth="xl">
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
                xs: 'repeat(2, 1fr)', // 2 columns on mobile
                sm: 'repeat(2, 1fr)', // 2 columns on small screens
                md: 'repeat(3, 1fr)', // 3 columns on medium screens
                lg: 'repeat(4, 1fr)', // 4 columns on large screens
              },
              gap: 3,
            }}
          >
            {mockEvents.map((event) => (
              <EventTile
                key={event.id}
                event={event}
                onClick={() => handleTileClick(event)}
              />
            ))}
          </Box>

          {/* Empty State */}
          {mockEvents.length === 0 && (
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
      />
    </Box>
  );
};

export default MyEventsPage;
