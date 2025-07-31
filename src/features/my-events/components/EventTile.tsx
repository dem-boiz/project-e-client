import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Stack,
} from '@mui/material';
import {
  Star as HostIcon,
  LocationOn as LocationIcon,
  People as PeopleIcon,
  Schedule as TimeIcon,
} from '@mui/icons-material';
import type { Event } from '../../../types/event';
import dayjs from 'dayjs';

interface EventTileProps {
  event: Event;
  onClick: () => void;
}

const EventTile: React.FC<EventTileProps> = ({ event, onClick }) => {
  const eventDate = dayjs(event.date);
  const isHost = event.role === 'host';

  return (
    <Card
      onClick={onClick}
      sx={{
        height: '375px',
        cursor: 'pointer',
        backgroundColor: 'background.paper',
        border: '1px solid transparent',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 25px rgba(92, 131, 116, 0.3)',
          borderColor: 'primary.main',
        },
      }}
    >
      <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column', padding: 2 }}>
        {/* Header with title and host indicator */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 1 }}>
          <Typography
            variant="h6"
            sx={{
              color: 'text.primary',
              fontWeight: 500,
              fontSize: '1.1rem',
              lineHeight: 1.3,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              flex: 1,
              marginRight: 1,
            }}
          >
            {event.name}
          </Typography>
          {isHost && (
            <HostIcon
              sx={{
                color: 'primary.main',
                fontSize: '1.2rem',
                flexShrink: 0,
              }}
            />
          )}
        </Box>

        {/* Date and Time */}
        <Stack direction="row" alignItems="center" spacing={0.5} sx={{ marginBottom: 1 }}>
          <TimeIcon sx={{ color: 'text.secondary', fontSize: '1rem' }} />
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              fontSize: '0.875rem',
            }}
          >
            {eventDate.format('MMM DD, YYYY • h:mm A')}
          </Typography>
        </Stack>

        {/* Location */}
        {event.location && (
          <Stack direction="row" alignItems="center" spacing={0.5} sx={{ marginBottom: 1 }}>
            <LocationIcon sx={{ color: 'text.secondary', fontSize: '1rem' }} />
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                fontSize: '0.875rem',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                flex: 1,
              }}
            >
              {event.location}
            </Typography>
          </Stack>
        )}

        {/* Spacer to push attendee info to bottom */}
        <Box sx={{ flex: 1 }} />

        {/* Bottom info: Attendee count and event type */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          {event.attendeeCount !== undefined && (
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <PeopleIcon sx={{ color: 'text.secondary', fontSize: '1rem' }} />
              <Typography
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  fontSize: '0.875rem',
                }}
              >
                {event.attendeeCount} attending
              </Typography>
            </Stack>
          )}
          
          <Chip
            label={event.isPrivate ? 'Private' : 'Public'}
            size="small"
            sx={{
              backgroundColor: event.isPrivate ? 'rgba(255, 193, 7, 0.2)' : 'rgba(76, 175, 80, 0.2)',
              color: event.isPrivate ? '#FFC107' : '#4CAF50',
              fontSize: '0.75rem',
              height: '24px',
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default EventTile;
