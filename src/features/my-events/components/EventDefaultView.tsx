import React, { useEffect } from 'react';
import {
  Button,
  Typography,
  Box,
  Chip,
  Stack,
  DialogTitle,
  Divider,
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  Schedule as TimeIcon,
  Event as EventIcon,
  Description as DescriptionIcon,
  Edit,
} from '@mui/icons-material';
import type { Event } from '../../../types/event';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useAuth } from '../../../hooks/useAuth';
import PeopleIcon from '@mui/icons-material/People';
import ImageSlider from '../../components/ImageSlider';
import { getEventVendors, getEventVendorImages, leaveEvent } from '../../../service/api/api.service';
import { toast } from 'react-toastify';

dayjs.extend(relativeTime);

interface EventDefaultViewProps {
  event: Event;
  onEditClick?: () => void;
  onGuestsClick?: () => void;
  onVendorsClick?: (vendor: Vendor) => void;
}

export interface Vendor {
  id: string,
  name: string;
  vendor_description: string;
  vendor_images: string[]; //base64 encoded image string 
  imageUrl: string; // Processed image URL for display
  imageUrls: string[]; // Array of processed image URLs for slideshow
}

const EventDefaultView: React.FC<EventDefaultViewProps> = ({ event, onEditClick, onGuestsClick, onVendorsClick }) => {
  const { user } = useAuth();
  const [loadingVendors, setLoadingVendors] = React.useState(false);
  const [loadingLeave, setLoadingLeave] = React.useState(false);
  const [vendorError, setVendorError] = React.useState<string>();
  const [vendors, setVendors] = React.useState<Vendor[]>([]);

    

  const isHost = event.host_id === user?.id;
  const status = new Date(event.date_time) < new Date() ? 'past' : 'upcoming'; // Update status based on date

    // Fetch vendors data (simulated)
  useEffect(() => {
  const fetchVendors = async () => {
    try {
      setLoadingVendors(true);

      const vendorsList = await getEventVendors(event.id);

      if (vendorsList && vendorsList.length > 0) {
        // Fetch images for each vendor in parallel
        const processed = await Promise.all(
          vendorsList.map(async (vendor) => {
            const image_list = await getEventVendorImages(vendor.id.toString());
            console.log("Fetched images for vendor", vendor.id, image_list);

            let vendor_images: string[] = [];
            if (image_list && image_list.length > 0) {
              vendor_images = image_list.map((img) => img.image_data);
            }

            let imageUrls: string[];
            if (vendor_images.length > 0) {
              imageUrls = vendor_images.map((img, index) => {
              try {
                const url = base64ToObjectUrl(img);
                console.log(`Created URL for vendor ${vendor.id}, image ${index}:`, url);
                return url;
              } catch (error) {
                console.error(`Failed to create URL for vendor ${vendor.id}, image ${index}:`, error);
                return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0xNzUgMTUwSDIyNVYyNTBIMTc1VjE1MFoiIGZpbGw9IiNEREREREQiLz4KPHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIwIDI4QzI0LjQxODMgMjggMjggMjQuNDE4MyAyOCAyMEMyOCAxNS41ODE3IDI0LjQxODMgMTIgMjAgMTJDMTUuNTgxNyAxMiAxMiAxNS41ODE3IDEyIDIwQzEyIDI0LjQxODMgMTUuNTgxNyAyOCAyMCAyOFoiIGZpbGw9IiNEREREREQiLz4KPC9zdmc+Cg==';
              }
              });
            } else {
              imageUrls = ["/path/to/placeholder-image.png"];
            }
            console.log("Fetched imageUrls for vendor", vendor.id, imageUrls);
            return {
              ...vendor,
              vendor_images,
              imageUrls,
              imageUrl: imageUrls[0], // first one for fallback
            };
          })
        );

        setVendors(processed);
      } else {
        setVendorError("Failed to load vendors");
      }
    } catch (err) {
      console.error("Error fetching vendors:", err);
      setVendorError("Failed to load vendors");
    } finally {
      setLoadingVendors(false);
    }
  };

  if (event.id) {
    fetchVendors();
  }
}, [event]);


  const handleVendorClick = (index: number) => {
    const vendor = vendors[index];
    console.log('Clicked vendor:', vendor);
    onVendorsClick?.(vendor);
  }
  
  const handleVendorUpdate = (updatedVendor: Partial<Vendor>) => {
    // Update your vendors state here
    setVendors(prev => prev.map(vendor => 
        vendor.id === updatedVendor.id 
            ? { ...vendor, ...updatedVendor }
            : vendor
    ));
};


  // Convert base64 image string to Blob to Object URL for more efficient rendering
  function base64ToObjectUrl(base64: string, contentType = "image/png"): string {
    try {
      // Validate base64 string
      if (!base64 || typeof base64 !== 'string') {
        console.error('Invalid base64 string provided:', base64);
        throw new Error('Invalid base64 string');
      }
      
      // Remove any whitespace and validate base64 format
      const cleanBase64 = base64.trim();
      if (cleanBase64.length === 0) {
        console.error('Empty base64 string provided');
        throw new Error('Empty base64 string');
      }
      
      const byteCharacters = atob(cleanBase64);
      const byteArrays = [];
      for (let i = 0; i < byteCharacters.length; i += 512) {
        const slice = byteCharacters.slice(i, i + 512);
        const byteNumbers = new Array(slice.length);
        for (let j = 0; j < slice.length; j++) {
          byteNumbers[j] = slice.charCodeAt(j);
        }
        byteArrays.push(new Uint8Array(byteNumbers));
      }
      const blob = new Blob(byteArrays, { type: contentType });
      const objectUrl = URL.createObjectURL(blob);
      console.log('Successfully created object URL from base64');
      return objectUrl;
    } catch (error) {
      console.error('Error converting base64 to object URL:', error);
      // Return a placeholder SVG data URL
      return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0xNzUgMTUwSDIyNVYyNTBIMTc1VjE1MFoiIGZpbGw9IiNEREREREQiLz4KPHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIwIDI4QzI0LjQxODMgMjggMjggMjQuNDE4MyAyOCAyMEMyOCAxNS41ODE3IDI0LjQxODMgMTIgMjAgMTJDMTUuNTgxNyAxMiAxMiAxNS41ODE3IDEyIDIwQzEyIDI0LjQxODMgMTUuNTgxNyAyOCAyMCAyOFoiIGZpbGw9IiNEREREREQiLz4KPC9zdmc+Cg==';
    }
  }


  async function handleLeaveEvent(id: string) {
    try {
      // Call API to leave event
      setLoadingLeave(true);
      await leaveEvent(id);
      toast.success('Successfully left the event');
      // Optionally refresh event list or navigate away

    } catch (error: Error | unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Failed to leave event. ${errorMessage}`);
    } finally {
      setLoadingLeave(false);
    }
  }



  return (
    <Box sx={{ width: '100%', height: '100%', overflowY: 'auto' }}>
          <Box
            sx={{
              padding: 3,
              borderBottom: '1px solid',
              borderColor: 'divider',
              position: 'relative',
              paddingY: 1,
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
                    backgroundColor: '#121212a8',
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
                  {!isHost && (
                    <Button
                      loading={loadingLeave}
                      variant="contained"
                      startIcon={<ExitToAppIcon />}
                      onClick={() => handleLeaveEvent(event.id)}
                      sx={{
                        textTransform: 'none',
                        backgroundColor: 'primary.main',
                        '&:hover': {
                          backgroundColor: 'primary.dark',
                        },
                      }}
                    >
                      Leave
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
                      Edit
                    </Button>
                  )}

                  
                  {isHost && (
                    <Button
                      variant="contained"
                      onClick={onGuestsClick}
                      startIcon={<PeopleIcon />}
                      color="primary"
                      sx={{
                        textTransform: 'none',
                      }}
                    >
                      Guests
                    </Button>
                  )}

                </Stack>

                <Divider sx={{ marginTop: 3 }} />

              </Box>

              <ImageSlider 
                images={vendors.map(v => v.imageUrl)} 
                loading={loadingVendors} 
                error={vendorError}
                onSlideClick={handleVendorClick}
                SwiperOptions={{
                  slidesPerView: 1.25,
                  spaceBetween: 10,
          
                }}
                />

            </Stack>


          </Box>
    </Box>
  );
};

export default EventDefaultView;
