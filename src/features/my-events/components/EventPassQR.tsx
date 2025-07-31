import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
} from '@mui/material';
import {
  Close as CloseIcon,
  QrCode as QrCodeIcon,
} from '@mui/icons-material';

interface EventPassQRProps {
  open: boolean;
  onClose: () => void;
  eventName: string;
  eventPassData?: string;
}

const EventPassQR: React.FC<EventPassQRProps> = ({ open, onClose, eventName, eventPassData }) => {
  // Generate a dummy QR code pattern based on the event pass data
  const generateQRPattern = (data: string) => {
    const size = 25; // 25x25 grid
    const pattern: boolean[][] = [];
    
    // Simple pseudo-random pattern based on the data string
    let seed = 0;
    for (let i = 0; i < data.length; i++) {
      seed += data.charCodeAt(i);
    }
    
    // Linear congruential generator for pseudo-random numbers
    let random = seed;
    const next = () => {
      random = (random * 1103515245 + 12345) & 0x7fffffff;
      return random / 0x7fffffff;
    };
    
    for (let y = 0; y < size; y++) {
      pattern[y] = [];
      for (let x = 0; x < size; x++) {
        // Add corner squares (finder patterns)
        if ((x < 7 && y < 7) || (x >= size - 7 && y < 7) || (x < 7 && y >= size - 7)) {
          pattern[y][x] = (x === 0 || x === 6 || y === 0 || y === 6 || (x >= 2 && x <= 4 && y >= 2 && y <= 4));
        } else {
          pattern[y][x] = next() > 0.5;
        }
      }
    }
    
    return pattern;
  };

  const qrPattern = eventPassData ? generateQRPattern(eventPassData) : [];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          backgroundColor: 'background.paper',
          borderRadius: 2,
        },
      }}
    >
      <DialogContent sx={{ padding: 4, textAlign: 'center' }}>
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

        <Box sx={{ marginBottom: 3 }}>
          <QrCodeIcon sx={{ fontSize: '2rem', color: 'primary.main', marginBottom: 1 }} />
          <Typography
            variant="h5"
            sx={{
              color: 'text.primary',
              fontWeight: 500,
              marginBottom: 1,
            }}
          >
            Event Pass
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              maxWidth: '300px',
              margin: '0 auto',
            }}
          >
            {eventName}
          </Typography>
        </Box>

        {/* QR Code Display */}
        <Box
          sx={{
            display: 'inline-block',
            padding: 2,
            backgroundColor: 'white',
            borderRadius: 2,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            marginBottom: 3,
          }}
        >
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: `repeat(25, 8px)`,
              gap: 0,
              width: '200px',
              height: '200px',
            }}
          >
            {qrPattern.map((row, y) =>
              row.map((cell, x) => (
                <Box
                  key={`${x}-${y}`}
                  sx={{
                    width: '8px',
                    height: '8px',
                    backgroundColor: cell ? '#000000' : '#ffffff',
                  }}
                />
              ))
            )}
          </Box>
        </Box>

        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            fontSize: '0.75rem',
            fontStyle: 'italic',
          }}
        >
          Show this QR code at the event entrance for free access
        </Typography>
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
    </Dialog>
  );
};

export default EventPassQR;
