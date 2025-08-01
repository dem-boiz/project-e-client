import React, { useState, useEffect } from 'react';
import * as z from "zod";
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
  TextField,
  Alert,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import {
  Close as CloseIcon,
  Star as HostIcon,
  Event as EventIcon,
  People as PeopleIcon,
  QrCode as QrCodeIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Message as MessageIcon,
} from '@mui/icons-material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import type { Event } from '../../../types/event';
import dayjs, { Dayjs } from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import EventPassQR from './EventPassQR';

dayjs.extend(relativeTime);

// Zod schema matching CreateEventPage structure
const editEventSchema = z.object({
  name: z.string().min(1, "Event name is required"),
  description: z.string().optional(),
  location: z.string().optional(),
  date: z.string()
    .min(1, "Date is required")
    .refine((dateString) => {
      const date = new Date(dateString);
      return date > new Date();
    }, "Event date must be in the future"),
  capacity: z.number().min(1, "Capacity must be at least 1").max(10000, "Capacity cannot exceed 10,000").optional(),
  isPrivate: z.boolean(),
});

type EditFormData = z.infer<typeof editEventSchema>;

interface EventTileExpandedProps {
  event: Event | null;
  open: boolean;
  onClose: () => void;
}

const EventTileExpanded: React.FC<EventTileExpandedProps> = ({ event, open, onClose }) => {
  const [qrOpen, setQrOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const { register, handleSubmit, control, reset, watch, formState: { errors } } = useForm<EditFormData>({
    resolver: zodResolver(editEventSchema),
    defaultValues: {
      name: '',
      description: '',
      location: '',
      date: '',
      capacity: 100,
      isPrivate: false,
    },
  });

  const isPrivate = watch('isPrivate');
  
  // Reset form when event changes or modal opens
  useEffect(() => {
    if (event && open) {
      reset({
        name: event.name,
        description: event.description || '',
        location: event.location || '',
        date: event.date,
        capacity: event.capacity || 100,
        isPrivate: event.isPrivate,
      });
      setIsEditMode(false);
      setSaveSuccess(false);
    }
  }, [event, open, reset]);
  
  if (!event) return null;

  const isHost = event.role === 'host';

  const handleEditToggle = () => {
    if (isEditMode) {
      // Save mode - submit form
      handleSubmit(onSave)(); // get validation functiona and call it
    } else {
      // Edit mode - enable editing
      setIsEditMode(true);
      setSaveSuccess(false);
    }
  };

  const onSave = (data: EditFormData) => {
    console.log('Saving event data:', data);
    
    // Simulate successful save
    setIsEditMode(false);
    setSaveSuccess(true);
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };

  return (

  );
};

export default EventTileExpanded;
