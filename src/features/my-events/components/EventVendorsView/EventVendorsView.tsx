import React from 'react';
import { Box, Typography, Paper, Divider, Chip } from '@mui/material';
import type { Vendor } from '../EventDefaultView';
import ImageSlider from '../../../components/ImageSlider';

interface EventVendorsViewProps {
    eventId: string;
    selectedVendor: Vendor | null;
}

const EventVendorsView: React.FC<EventVendorsViewProps> = ({ selectedVendor }) => {
  
  // Handle case when no vendor is selected
  if (!selectedVendor) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '400px',
          backgroundColor: 'background.paper',
          borderRadius: 2,
          border: '2px dashed',
          borderColor: 'divider',
        }}
      >
        <Typography 
          variant="h6" 
          color="text.secondary"
          sx={{ textAlign: 'center' }}
        >
          Select a vendor to view details
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        maxWidth: '100%',
        mx: 'auto',
      }}
    >
      {/* Image Slider Section */}
      <Paper
        elevation={2}
        sx={{
          borderRadius: 3,
          overflow: 'hidden',
          mb: 3,
          backgroundColor: 'background.paper',
        }}
      >
        <Box
          sx={{
            position: 'relative',
            height: { xs: 300, sm: 400, md: 450 },
            width: '100%',
          }}
        >
          <ImageSlider images={selectedVendor.imageUrls || []} />
        </Box>
      </Paper>

      {/* Vendor Information Section */}
      <Paper
        elevation={1}
        sx={{
          p: { xs: 2, sm: 3, md: 4 },
          borderRadius: 3,
          backgroundColor: 'background.paper',
        }}
      >
        {/* Header Section */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 600,
              color: 'primary.main',
              mb: 1,
              fontSize: { xs: '1.75rem', sm: '2rem', md: '2.25rem' },
            }}
          >
            {selectedVendor.name}
          </Typography>
          
          {/* Vendor ID Chip */}
          <Chip
            label={`Vendor ID: ${selectedVendor.id}`}
            size="small"
            variant="outlined"
            sx={{
              fontSize: '0.75rem',
              height: 24,
            }}
          />
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Description Section */}
        {selectedVendor.vendor_description && (
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="h6"
              component="h2"
              sx={{
                fontWeight: 500,
                mb: 2,
                color: 'text.primary',
              }}
            >
              About This Vendor
            </Typography>
            <Typography
              variant="body1"
              sx={{
                lineHeight: 1.7,
                color: 'text.secondary',
                fontSize: '1rem',
              }}
            >
              {selectedVendor.vendor_description}
            </Typography>
          </Box>
        )}

        {/* Image Count Info */}
        {selectedVendor.imageUrls && selectedVendor.imageUrls.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Divider sx={{ mb: 2 }} />
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              📸 
              <span>
                {selectedVendor.imageUrls.length} 
                {selectedVendor.imageUrls.length === 1 ? ' image' : ' images'} available
              </span>
            </Typography>
          </Box>
        )}

        {/* Additional Information Section */}
        <Paper
          variant="outlined"
          sx={{
            p: 3,
            backgroundColor: 'grey.50',
            borderRadius: 2,
            mt: 3,
          }}
        >
          <Typography
            variant="h6"
            component="h3"
            sx={{
              fontWeight: 500,
              mb: 2,
              color: 'text.primary',
            }}
          >
            Contact Information
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ lineHeight: 1.6 }}
          >
            For inquiries about services, pricing, and availability, please contact this vendor directly. 
            They will be able to provide you with detailed information tailored to your event needs.
          </Typography>
        </Paper>
      </Paper>
    </Box>
  );
};

export default EventVendorsView;