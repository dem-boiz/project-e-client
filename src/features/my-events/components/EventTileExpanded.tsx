import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Stack,
  Divider,
  IconButton,
} from '@mui/material';
import {
  Close as CloseIcon,
  Star as HostIcon,
  LocationOn as LocationIcon,
  People as PeopleIcon,
  Schedule as TimeIcon,
  Event as EventIcon,
  Description as DescriptionIcon,
  QrCode as QrCodeIcon,
} from '@mui/icons-material';
import type { Event } from '../../../types/event';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import EventPassQR from './EventPassQR';

dayjs.extend(relativeTime);

interface EventTileExpandedProps {
  event: Event | null;
  open: boolean;
  onClose: () => void;
}

const EventTileExpanded: React.FC<EventTileExpandedProps> = ({ event, open, onClose }) => {
  const [qrOpen, setQrOpen] = useState(false);
  
  if (!event) return null;

  const eventDate = dayjs(event.date);
  const isHost = event.role === 'host';

  return (
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
            <Typography
              variant="h4"
              sx={{
                color: 'text.primary',
                fontWeight: 500,
                lineHeight: 1.3,
                flex: 1,
              }}
            >
              {event.name}
            </Typography>
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
          </Stack>
        </Box>

        {/* Content */}
        <Box sx={{ padding: 3 }}>
          <Stack spacing={3}>
            {/* Date and Time */}
            <Box>
              <Typography variant="h6" sx={{ color: 'text.primary', marginBottom: 1, display: 'flex', alignItems: 'center' }}>
                <TimeIcon sx={{ marginRight: 1, color: 'primary.main' }} />
                Date & Time
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '1rem' }}>
                {eventDate.format('MMMM DD, YYYY')} at {eventDate.format('h:mm A')}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', marginTop: 0.5 }}>
                {eventDate.fromNow()}
              </Typography>
            </Box>

            {/* Location */}
            {event.location && (
              <Box>
                <Typography variant="h6" sx={{ color: 'text.primary', marginBottom: 1, display: 'flex', alignItems: 'center' }}>
                  <LocationIcon sx={{ marginRight: 1, color: 'primary.main' }} />
                  Location
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '1rem' }}>
                  {event.location}
                </Typography>
              </Box>
            )}

            {/* Attendees */}
            {event.attendeeCount !== undefined && (
              <Box>
                <Typography variant="h6" sx={{ color: 'text.primary', marginBottom: 1, display: 'flex', alignItems: 'center' }}>
                  <PeopleIcon sx={{ marginRight: 1, color: 'primary.main' }} />
                  Attendees
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '1rem' }}>
                  {event.attendeeCount} {event.attendeeCount === 1 ? 'person' : 'people'} attending
                  {event.capacity && ` (${event.capacity} max capacity)`}
                </Typography>
              </Box>
            )}

            {/* Description */}
            {event.description && (
              <>
                <Divider />
                <Box>
                  <Typography variant="h6" sx={{ color: 'text.primary', marginBottom: 1, display: 'flex', alignItems: 'center' }}>
                    <DescriptionIcon sx={{ marginRight: 1, color: 'primary.main' }} />
                    Description
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: 'text.secondary',
                      fontSize: '1rem',
                      lineHeight: 1.6,
                      whiteSpace: 'pre-wrap',
                    }}
                  >
                    {event.description}
                  </Typography>
                </Box>
              </>
            )}

            {/* Event Pass (if available) */}
            {event.eventPass && (
              <Box>
                <Typography variant="h6" sx={{ color: 'text.primary', marginBottom: 2 }}>
                  Event Pass
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<QrCodeIcon />}
                  onClick={() => setQrOpen(true)}
                  sx={{
                    textTransform: 'none',
                    backgroundColor: 'primary.main',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    },
                  }}
                >
                  View Event Pass
                </Button>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'text.secondary',
                    marginTop: 1,
                    fontSize: '0.875rem',
                  }}
                >
                  Show QR code at event entrance for access
                </Typography>
              </Box>
            )}
          </Stack>
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
            variant="contained"
            color="primary"
            sx={{
              textTransform: 'none',
              marginLeft: 1,
            }}
          >
            Manage Event
          </Button>
        )}
      </DialogActions>

      {/* Event Pass QR Code Modal */}
      <EventPassQR
        open={qrOpen}
        onClose={() => setQrOpen(false)}
        eventName={event.name}
        eventPassData={event.eventPass}
      />
    </Dialog>
  );
};

export default EventTileExpanded;
