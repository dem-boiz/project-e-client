import React from 'react';
import {
  Button,
  Typography,
  Box,
  Chip,
  Stack,
  DialogTitle,
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  Schedule as TimeIcon,
  Event as EventIcon,
  Description as DescriptionIcon,
  People as PeopleIcon,
  Edit,
} from '@mui/icons-material';
import type { Event } from '../../../types/event';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useAuth } from '../../../hooks/useAuth';

dayjs.extend(relativeTime);

interface EventDefaultViewProps {
  event: Event | null;
  onEditClick?: () => void;
  onGuestsClick?: () => void;
}

const EventDefaultView: React.FC<EventDefaultViewProps> = ({ event, onEditClick, onGuestsClick }) => {
  const { user } = useAuth();
  
  if (!event) return null;
  
  const isHost = event.host_id === user?.id;
  const status = new Date(event.date_time) < new Date() ? 'past' : 'upcoming'; // Update status based on date
  return (
    <Box sx={{ width: '100%', height: '100%', overflowY: 'auto' }}>
          <Box
            sx={{
              padding: 3,
              borderBottom: '1px solid',
              borderColor: 'divider',
              position: 'relative',
              paddingY: 1,
              backgroundColor: 'background.default',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'flex-start', marginBottom: 0, paddingRight: 6 }}>
              <DialogTitle 
                sx={{
                  color: 'text.primary',
                  fontSize: { xs: '1.5rem', sm: '2rem', md: '2.1rem' },
                  fontWeight: 500,
                  lineHeight: 1,
                  flex: 1,
                }}
              >
                {event.name}
              </DialogTitle>
            </Box>
          </Box>

          <Box sx={{ padding: 3 }}>
            <Stack spacing={4}>
              {/* Event Photo */}
              <Box
                  sx={{
                    width: '100%',
                    height: 450,
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

              {/* Event Chips */}
              <Stack direction="row" gap={2} flexWrap="wrap" sx={{ marginTop: 2 }}>

                <Chip
                  label={status.charAt(0).toUpperCase() + status.slice(1)}
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

              {/* Description */}
              <Box>
                <Typography variant="h6" sx={{ color: 'text.primary', marginBottom: 1, display: 'flex', alignItems: 'center' }}>
                  <DescriptionIcon sx={{ marginRight: 1, color: 'primary.main' }} />
                  What?
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


              {/* Date & Time + Location fields*/}
              <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" sx={{ color: 'text.primary', marginBottom: 1, display: 'flex', alignItems: 'center' }}>
                    <TimeIcon sx={{ marginRight: 1, color: 'primary.main' }} />
                    When?
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '1rem' }}>
                    {dayjs(event.date_time).format('MMMM DD, YYYY')} at {dayjs(event.date_time).format('h:mm A')}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', marginTop: 0.5 }}>
                    {dayjs(event.date_time).fromNow()}
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


                  {/* Leaving an event button */}
                  {isHost && (
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

                  {isHost && (
                    <Button
                      variant="contained"
                      onClick={onEditClick}
                      startIcon={<Edit />}
                      color="primary"
                      sx={{
                        textTransform: 'none',
                      }}
                    >
                      Edit Event
                    </Button>
                  )}

                  
                  {isHost && (
                    <Button
                      variant="contained"
                      onClick={onGuestsClick}
                      startIcon={<Edit />}
                      color="primary"
                      sx={{
                        textTransform: 'none',
                      }}
                    >
                      Guests
                    </Button>
                  )}

                </Stack>
              </Box>
            </Stack>
          </Box>
    </Box>
  );
};

export default EventDefaultView;
