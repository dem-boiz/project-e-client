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
  IconButton,
} from '@mui/material';
import {
  Close as CloseIcon,
  Star as HostIcon,
  LocationOn as LocationIcon,
  Schedule as TimeIcon,
  Event as EventIcon,
  Description as DescriptionIcon,
  People as PeopleIcon,
  QrCode as QrCodeIcon,
} from '@mui/icons-material';
import type { Event } from '../../../types/event';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import EventPassQR from './EventPassQR';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

dayjs.extend(relativeTime);

interface EventTileExpandedProps {
  event: Event | null;
  open: boolean;
  onClose: () => void;
}

const EventTileExpanded: React.FC<EventTileExpandedProps> = ({ event, open, onClose }) => {
  const [qrOpen, setQrOpen] = useState(false);
  
  if (!event) return null;

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
              {event.attendeeCount !== undefined && (
                <Chip
                  label={`${event.attendeeCount} attending`}
                  icon={<PeopleIcon />}
                  sx={{
                    backgroundColor: 'rgba(92, 131, 116, 0.1)',
                    color: 'text.secondary',
                  }}
                />
              )}
            </Stack>
          </Box>

          <Box sx={{ padding: 3 }}>
            <Stack spacing={4}>

                {/* Event Photo */}
                <Box>
                  <Box
                    sx={{
                      width: '100%',
                      height: 300,
                      borderRadius: 2,
                      overflow: 'hidden',
                      backgroundColor: 'grey.50',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid',
                      borderColor: 'divider',
                      position: 'relative',
                    }}
                  >
                    {(event as Event & { photoUrl?: string }).photoUrl ? (
                      <Box
                        component="img"
                        src={(event as Event & { photoUrl?: string }).photoUrl}
                        alt={event.name}
                        sx={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                        onError={(e) => {
                          // Hide broken images and show placeholder
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    ) : null}
                    
                    {/* Placeholder when no image or image fails to load */}
                    {!(event as Event & { photoUrl?: string }).photoUrl && (
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          color: 'text.secondary',
                          textAlign: 'center',
                        }}
                      >
                        <EventIcon sx={{ fontSize: '3rem', marginBottom: 1, opacity: 0.5 }} />
                        <Typography variant="body2" sx={{ opacity: 0.7 }}>
                          No event photo
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Box>

                {/* Top Row: Date & Time + Location */}
                <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ color: 'text.primary', marginBottom: 1, display: 'flex', alignItems: 'center' }}>
                      <TimeIcon sx={{ marginRight: 1, color: 'primary.main' }} />
                      When?
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '1rem' }}>
                      {dayjs(event.date).format('MMMM DD, YYYY')} at {dayjs(event.date).format('h:mm A')}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', marginTop: 0.5 }}>
                      {dayjs(event.date).fromNow()}
                    </Typography>
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ color: 'text.primary', marginBottom: 1, display: 'flex', alignItems: 'center' }}>
                      <LocationIcon sx={{ marginRight: 1, color: 'primary.main' }} />
                      Where?
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '1rem' }}>
                      {event.location || 'No location specified'}
                    </Typography>
                  </Box>
                </Box>

                {/* Description */}
                <Box>
                  <Typography variant="h6" sx={{ color: 'text.primary', marginBottom: 1, display: 'flex', alignItems: 'center' }}>
                    <DescriptionIcon sx={{ marginRight: 1, color: 'primary.main' }} />
                    About the Event
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
                    {event.description || 'No description provided'}
                  </Typography>
                </Box>

                {/* Action Bar */}
                <Box
                  sx={{
                    marginTop: 4,
                    padding: 3,

                  }}
                >

                  <Stack
                    direction="row"
                    spacing={2}
                    justifyContent="center"
                    alignItems="center"
                  >
                    {/* View Event Pass Button */}
                    {event.eventPass && (
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
                    )}

                    {/* Message Host Button (only for guests) */}
                    {!isHost && (
                      <Button
                        variant="contained"
                        startIcon={<ExitToAppIcon />}
                        sx={{
                          textTransform: 'none',
                          backgroundColor: 'primary.main',
                          '&:hover': {
                            backgroundColor: 'primary.dark',
                          },
                        }}
                      >
                        Leave Event
                      </Button>
                    )}
                  </Stack>
                </Box>
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
