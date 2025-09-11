
import React from 'react';
import { Box, Typography } from '@mui/material';
import type { Vendor } from '../EventDefaultView';



interface EventVendorsViewProps {
    eventId: string;
    selectedVendor: Vendor | null;
    
}

const EventVendorsView: React.FC<EventVendorsViewProps> = ({ eventId, selectedVendor }) => {

  return (
    <Box>
      <Typography variant="h5">
        {selectedVendor?.name}
      </Typography>
    </Box>
  );
};

export default EventVendorsView;