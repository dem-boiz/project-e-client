import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Typography, 
  IconButton, 
  Card, 
  CardMedia, 
  CardContent,
  useMediaQuery,
  useTheme 
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

interface Vendor {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
}

interface EventVendorsListProps {
  eventId: string;
}

// Mock data for now - will be replaced with API calls later
const mockVendors: Vendor[] = [
  {
    id: '1',
    name: 'Elegant Catering',
    description: 'Providing high-quality catering services for all occasions with a variety of cuisines.',
    imageUrl: 'https://source.unsplash.com/random/800x600/?catering',
  },
  {
    id: '2',
    name: 'Sound Solutions',
    description: 'Professional audio equipment and DJ services for events of any size.',
    imageUrl: 'https://source.unsplash.com/random/800x600/?dj',
  },
  {
    id: '3',
    name: 'Floral Designs',
    description: 'Beautiful floral arrangements tailored for your special event.',
    imageUrl: 'https://source.unsplash.com/random/800x600/?flowers',
  },
  {
    id: '4',
    name: 'Event Photography',
    description: 'Capturing your special moments with professional photography services.',
    imageUrl: 'https://source.unsplash.com/random/800x600/?photography',
  },
];

const EventVendorsList: React.FC<EventVendorsListProps> = ({ eventId }) => {
  const [vendors, setVendors] = useState<Vendor[]>(mockVendors);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [touchStarted, setTouchStarted] = useState(false);

  // Fetch vendors data (simulated)
  useEffect(() => {
    // In the future, this would be an API call to get vendors based on eventId
    // For now, we're using mock data
    setVendors(mockVendors);
  }, [eventId]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % vendors.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + vendors.length) % vendors.length);
  };

  const handleMouseEnter = () => {
    if (!isMobile) {
      setShowControls(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      setShowControls(false);
    }
  };

  const handleTouchStart = () => {
    if (isMobile) {
      setTouchStarted(true);
      setShowControls(true);
      // Auto-hide controls after 3 seconds
      setTimeout(() => {
        if (touchStarted) {
          setShowControls(false);
          setTouchStarted(false);
        }
      }, 3000);
    }
  };

  if (!vendors.length) {
    return null;
  }

  return (
    <Box sx={{ mt: 4, mb: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Event Vendors
      </Typography>
      
      <Box
        ref={carouselRef}
        sx={{
          position: 'relative',
          width: '100%',
          overflow: 'hidden',
          borderRadius: 1,
          '&:hover': {
            '& .carousel-controls': {
              opacity: 1,
            },
          },
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
      >
        <Box
          sx={{
            display: 'flex',
            transition: 'transform 0.5s ease',
            transform: `translateX(-${currentIndex * 100}%)`,
          }}
        >
          {vendors.map((vendor) => (
            <Card
              key={vendor.id}
              sx={{
                minWidth: '100%',
                flexShrink: 0,
                boxShadow: 2,
                cursor: 'pointer',
                backgroundColor: 'background.paper',
                borderRadius: 1,
              }}
            >
              <CardMedia
                component="img"
                height="280"
                image={vendor.imageUrl}
                alt={vendor.name}
                sx={{
                  objectFit: 'cover',
                }}
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {vendor.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {vendor.description}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* Navigation arrows */}
        <Box
          className="carousel-controls"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            opacity: showControls ? 1 : 0,
            transition: 'opacity 0.3s ease',
            pointerEvents: 'none', // Makes the box not interfere with card clicks
          }}
        >
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            sx={{
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
              },
              ml: 1,
              pointerEvents: 'auto', // Makes the button clickable
            }}
          >
            <ChevronLeftIcon />
          </IconButton>
          
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            sx={{
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
              },
              mr: 1,
              pointerEvents: 'auto', // Makes the button clickable
            }}
          >
            <ChevronRightIcon />
          </IconButton>
        </Box>

        {/* Dots indicator */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mt: 1,
          }}
        >
          {vendors.map((_, index) => (
            <Box
              key={index}
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: index === currentIndex ? 'primary.main' : 'grey.400',
                mx: 0.5,
                transition: 'background-color 0.3s ease',
              }}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default EventVendorsList;
