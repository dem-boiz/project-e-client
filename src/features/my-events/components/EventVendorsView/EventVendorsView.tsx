import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, Paper, Divider, Chip, DialogTitle, Fab, TextField } from '@mui/material';
import type { Vendor } from '../EventDefaultView';
import ImageSlider from '../../../components/ImageSlider';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import EditIcon from '@mui/icons-material/Edit';
import DoneIcon from '@mui/icons-material/Done';
import type { VendorImageCreation, VendorInformationUpdate } from '../../../../types/network.types';
import { addVendorImage, updateVendorDescription } from '../../../../service/api/api.service';
interface EventVendorsViewProps {
    eventId: string;
    selectedVendor: Vendor | null;
}

const EventVendorsView: React.FC<EventVendorsViewProps> = ({ eventId, selectedVendor }) => {
    // Edit mode state
    const [editMode, setEditMode] = useState(false);
    
    // Vendor description editing state
    const [editedDescription, setEditedDescription] = useState('');
    
    // Image upload state
    const [uploadedImages, setUploadedImages] = useState<{[key: string]: string}>({});
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploadLoading, setUploadLoading] = useState(false); 
    const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
    
    // Initialize edited description when selectedVendor changes
    useEffect(() => {
        if (selectedVendor?.vendor_description) {
            setEditedDescription(selectedVendor.vendor_description);
        } else {
            setEditedDescription('');
        }
    }, [selectedVendor]);
    
    // Toggle edit mode
    const handleEditToggle = () => {
        if (editMode) {
            // Exiting edit mode - save changes
            handleSaveChanges();
        }
        setEditMode(!editMode);
    };

    // Placeholder function for saving changes
    const handleSaveChanges = async () => {
        try {
            // TODO: Implement API call to save vendor description
            console.log('Saving vendor description:', {
                vendorId: selectedVendor?.id,
                description: editedDescription
            });
            
            // API Call to update vendor description
            const new_desc: VendorInformationUpdate = {
                event_vendor_id: selectedVendor?.id || '',
                description: editedDescription
            };
            console.log('Vendor description saved successfully: ', new_desc);
            await updateVendorDescription(new_desc);
            
            console.log('Vendor description saved successfully: ', new_desc);
        } catch (error) {
            console.error('Error saving vendor description:', error);
            // Handle error (show toast notification, etc.)
        }
    };

    // Handle description text change
    const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEditedDescription(event.target.value);
    };

    // Convert file to base64
    const fileToBase64 = (file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          if (typeof reader.result === 'string') {
            // Remove the data URL prefix to get just the base64 string
            const base64 = reader.result.split(',')[1];
            resolve(base64);
          } else {
            reject(new Error('Failed to convert file to base64'));
          }
        };
        reader.onerror = (error) => reject(error);
      });
    };
    
   // Trigger file input
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  
  // Handle file upload
    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (!files || files.length === 0) return;
  
      try {
        setUploadError(null);
        const file = files[0];
  
        // Validate file type
        if (!file.type.startsWith('image/')) {
          setUploadError('Please select a valid image file');
          return;
        }
  
        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          setUploadError('Image size must be less than 5MB');
          return;
        }
  
        // Convert to base64 and create object URL
        const base64 = await fileToBase64(file);
        const objectUrl = URL.createObjectURL(file);
  
        // For demo purposes, associate with the current vendor or create a new one
        const currentVendor = selectedVendor;
        if (currentVendor) {
          setUploadedImages(prev => ({
            ...prev,
            [currentVendor.id]: objectUrl
          }));
  
          // Update the vendor's image in the API (you would implement this)
          const vendorImageData: VendorImageCreation = {
            event_vendor_id: currentVendor.id,
            image_data: base64
          };
          await addVendorImage(vendorImageData);
  
          setUploadSuccess(true);
        }
  
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (err) {
        console.error('Error uploading image:', err);
        setUploadError('Failed to upload image. Please try again.');
      }
    };

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
        <Box sx={{ mb: 1 }}>
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
            {}
          </Typography>
          
          {/* Vendor Name */}
          <DialogTitle 
                sx={{
                  color: 'text.primary',
                  fontSize: { xs: '1.5rem', sm: '2rem', md: '2.1rem' },
                  fontWeight: 500,
                  lineHeight: 1,
                  flex: 2,
                  paddingLeft: 0,
                }}
              >
                {selectedVendor.name}
              </DialogTitle>
        </Box>

        <Divider sx={{ my: 1 }} />

        {/* Description Section */}
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
          
          {editMode ? (
            <TextField
              fullWidth
              multiline
              rows={4}
              value={editedDescription}
              onChange={handleDescriptionChange}
              placeholder="Enter vendor description..."
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  fontSize: '1rem',
                  lineHeight: 1.7,
                },
              }}
            />
          ) : (
            <Typography
              variant="body1"
              sx={{
                lineHeight: 1.7,
                color: 'text.secondary',
                fontSize: '1rem',
                minHeight: '1.5rem', // Ensure some height even if empty
              }}
            >
              {selectedVendor.vendor_description || 'No description available'}
            </Typography>
          )}
        </Box>
 
        {/* Additional Information Section */}
        <Paper
          variant="outlined"
          sx={{
            p: 3,
            backgroundColor: 'background.paper',
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

      {/* Image Slider Section */}
      <Paper
        elevation={2}
        sx={{
          borderRadius: 3,
          overflow: 'hidden',
          mb: 2,
          backgroundColor: 'background.paper',
        }}
      >
        <Box
          sx={{
            position: 'relative',
            height: { xs: 300, sm: 400, md: 450 },
            width: '90%', 
            margin: '0 auto',
            paddingTop: 3
          }}
        >
          <ImageSlider images={selectedVendor.imageUrls || []} />
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
        </Box> 
      </Paper>

      {/* Edit Button */}
      <Fab
        color="secondary"
        aria-label="edit mode"
        onClick={handleEditToggle}
        sx={{
          position: 'absolute',
          bottom: 16,
          right: 16,
          zIndex: 1000,
        }}
      >
        {editMode ? <DoneIcon /> : <EditIcon />}
      </Fab>

      {/* Image Upload Button - Only visible in edit mode */}
      {editMode && (
        <Fab
          color="primary"
          aria-label="upload image"
          onClick={handleUploadClick}
          disabled={uploadLoading}
          sx={{
            position: 'absolute',
            bottom: 16,
            left: 16,
            zIndex: 1000,
            opacity: uploadLoading ? 0.6 : 1,
          }}
        >
          <AddPhotoAlternateIcon />
        </Fab>
      )}

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        style={{ display: 'none' }}
      />
    </Box>
  );
};

export default EventVendorsView;