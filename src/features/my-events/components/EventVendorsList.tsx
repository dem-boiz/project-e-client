import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Typography, 
  IconButton, 
  Card, 
  CardMedia, 
  CardContent,
  useMediaQuery,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Snackbar,
  Alert,
  Fab
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CloseIcon from '@mui/icons-material/Close'; 
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { getEventVendors, addVendorImage, getEventVendorImages } from '../../../service/api/api.service'; 
import type { VendorImageCreation } from '../../../types/network.types';  
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';  
 
export interface Vendor { 
  id: string,
  name: string;
  vendor_description: string;
  vendor_images: string[]; //base64 encoded image string 
  imageUrl: string; // Processed image URL for display
  imageUrls: string[]; // Array of processed image URLs for slideshow
}

interface EventVendorsListProps {
  eventId: string;
}

const EventVendorsList: React.FC<EventVendorsListProps> = ({ eventId }) => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carousel state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [touchStarted, setTouchStarted] = useState(false);

  // Used for viewing vendor details in a modal  
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Image upload state
  const [uploadedImages, setUploadedImages] = useState<{[key: string]: string}>({});
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadLoading, setUploadLoading] = useState(false); 
  
  // Fetch vendors data (simulated)
  useEffect(() => {
  const fetchVendors = async () => {
    try {
      setLoading(true);
      setError(null);

      const vendorsList = await getEventVendors(eventId);

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
        setError("Failed to load vendors");
      }
    } catch (err) {
      console.error("Error fetching vendors:", err);
      setError("Failed to load vendors");
    } finally {
      setLoading(false);
    }
  };

  if (eventId) {
    fetchVendors();
  }
}, [eventId, uploadedImages]);


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
      const currentVendor = vendors[currentIndex];
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

  // Trigger file input
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Handle vendor card click to open modal
  const handleVendorClick = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setModalOpen(true);
  };

  // Handle modal close
  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedVendor(null);
  };

  // Close success/error messages
  const handleCloseSnackbar = () => {
    setUploadSuccess(false);
    setUploadError(null);
  };

  // Show loading state
  if (loading) {
    return (
      <Box sx={{ mt: 4, mb: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Event Vendors
        </Typography>
        <Typography>Loading vendors...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 4, mb: 2, position: 'relative' }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Event Vendors
      </Typography>

      {error && (
        <Typography color="error" sx={{ mb: 1, fontSize: '0.875rem' }}>
          {error} (showing sample data)
        </Typography>
      )}
      
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
          display: "flex",
          transition: "transform 0.5s ease",
          transform: `translateX(-${currentIndex * 100}%)`,
        }}
      >
        {vendors.map((vendor) => (
          <Card
            key={vendor.id}
            onClick={() => handleVendorClick(vendor)}
            sx={{
              minWidth: "100%",
              flexShrink: 0,
              boxShadow: 2,
              cursor: "pointer",
              backgroundColor: "background.paper",
              borderRadius: 1,
              transition: "transform 0.2s ease",
              "&:hover": {
                transform: "scale(1.02)",
              },
            }}
          >
            {/* Swiper slideshow for this vendor’s images */}
            <Swiper
              key={vendor.imageUrls?.length}
              modules={[Navigation, Pagination]}
              navigation
              pagination={{ clickable: true }}
              style={{ width: "100%", height: 280 }}
            >
              {(vendor.imageUrls ?? []).map((url, index) => (
                <SwiperSlide key={index}>
                  <CardMedia
                    component="img"
                    image={url}
                    alt={`${vendor.name} ${index + 1}`}
                    sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </SwiperSlide>
              ))}
            </Swiper>

            <CardContent>
              <Typography variant="h6" gutterBottom>
                {vendor.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {vendor.vendor_description}
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
          pointerEvents: 'none',
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
            pointerEvents: 'auto',
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
            pointerEvents: 'auto',
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
      {/* Vendor Details Modal */}
      <Dialog
        open={modalOpen}
        onClose={handleModalClose}
        maxWidth="md"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: 2,
          },
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            pb: 1,
          }}
        >
          <Typography variant="h5">
            {selectedVendor?.name}
          </Typography>
          <IconButton
            onClick={handleModalClose}
            sx={{
              color: 'grey.500',
            }}
          >
            <CloseIcon />
          </IconButton>
          
        </DialogTitle>

        <DialogContent sx={{ pt: 1 }}>
          {selectedVendor && (
            <Box>
              {/* Image Upload Button */}
              <Fab
                color="primary"
                aria-label="upload image"
                onClick={handleUploadClick}
                disabled={uploadLoading}
                sx={{
                  position: 'absolute',
                  bottom: 16,
                  left: 16,        // Changed from right: 16 to left: 16
                  zIndex: 1000,
                  opacity: uploadLoading ? 0.6 : 1,
                }}
              >

              {/* Hidden file input */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                style={{ display: 'none' }}
              />
              <AddPhotoAlternateIcon />
              </Fab>
              {/* Replace single image with Swiper for cycling through vendor images */}
              <Box sx={{ mb: 2, position: 'relative' }}>
                {selectedVendor.imageUrls && selectedVendor.imageUrls.length > 0 ? (
                  <Swiper
                    key={`modal-${selectedVendor.id}-${selectedVendor.imageUrls?.length}`}
                    modules={[Navigation, Pagination]}
                    navigation={{
                      prevEl: '.modal-swiper-button-prev',
                      nextEl: '.modal-swiper-button-next',
                    }}
                    pagination={{ 
                      clickable: true,
                      el: '.modal-swiper-pagination'
                    }}
                    style={{ 
                      width: "100%", 
                      height: 400,
                      borderRadius: 8,
                      backgroundColor: '#f5f5f5'
                    }}
                  >
                    {selectedVendor.imageUrls.map((url, index) => (
                      <SwiperSlide key={index}>
                        <Box
                          component="img"
                          src={url}
                          alt={`${selectedVendor.name} ${index + 1}`}
                          onError={(e) => {
                            console.log('Image failed to load:', url);
                            // Set a placeholder image on error
                            e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0xNzUgMTUwSDIyNVYyNTBIMTc1VjE1MFoiIGZpbGw9IiNEREREREQiLz4KPHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIwIDI4QzI0LjQxODMgMjggMjggMjQuNDE4MyAyOCAyMEMyOCAxNS41ODE3IDI0LjQxODMgMTIgMjAgMTJDMTUuNTgxNyAxMiAxMiAxNS41ODE3IDEyIDIwQzEyIDI0LjQxODMgMTUuNTgxNyAyOCAyMCAyOFoiIGZpbGw9IiNEREREREQiLz4KPC9zdmc+Cg==';
                          }}
                          onLoad={() => {
                            console.log('Image loaded successfully:', url);
                          }}
                          sx={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            borderRadius: 1,
                            backgroundColor: '#f5f5f5',
                          }}
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                ) : (
                  // Fallback when no images are available
                  <Box
                    sx={{
                      width: '100%',
                      height: 400,
                      backgroundColor: '#f5f5f5',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 1,
                      border: '2px dashed #ddd'
                    }}
                  >
                    <Box sx={{ textAlign: 'center' }}>
                      <AddPhotoAlternateIcon sx={{ fontSize: 48, color: '#999', mb: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        No images available
                      </Typography>
                    </Box>
                  </Box>
                )}
                
                {/* Custom navigation buttons */}
                <div className="modal-swiper-button-prev" style={{
                  position: 'absolute',
                  top: '50%',
                  left: '10px',
                  transform: 'translateY(-50%)',
                  zIndex: 10,
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: 'white'
                }}>
                  <ChevronLeftIcon />
                </div>
                
                <div className="modal-swiper-button-next" style={{
                  position: 'absolute',
                  top: '50%',
                  right: '10px',
                  transform: 'translateY(-50%)',
                  zIndex: 10,
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: 'white'
                }}>
                  <ChevronRightIcon />
                </div>
                
                {/* Custom pagination */}
                <div className="modal-swiper-pagination" style={{
                  position: 'absolute',
                  bottom: '10px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  zIndex: 10
                }}></div>
              </Box>
              
              <Typography variant="h6" gutterBottom>
                About {selectedVendor.name}
              </Typography>
              
              <Typography variant="body1" color="text.secondary" paragraph>
                {selectedVendor.vendor_description}
              </Typography>

              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Additional Information
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Contact this vendor directly for more details about their services and availability for your event.
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleModalClose} variant="outlined">
            Close
          </Button>
          <Button variant="contained" color="primary">
            Contact Vendor
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success/Error Snackbars */}
      <Snackbar
        open={uploadSuccess}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" variant="filled">
          Image uploaded successfully!
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!uploadError}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="error" variant="filled">
          {uploadError}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EventVendorsList;