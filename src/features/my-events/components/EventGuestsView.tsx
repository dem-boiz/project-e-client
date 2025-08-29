
  import React, { useState } from 'react';
  import {
    Box,
    Stack,
    TextField,
    Button,
    Tooltip,
    IconButton,
    Typography,
    List,
    ListItem,
    ListItemAvatar,
    Avatar,
    ListItemText,
    Snackbar,
    Alert,
    Divider,
    InputAdornment,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Badge,
  } from '@mui/material';
  import ContentCopyIcon from '@mui/icons-material/ContentCopy';
  import DeleteIcon from '@mui/icons-material/Delete';
  import EmailIcon from '@mui/icons-material/Email';
  import PersonIcon from '@mui/icons-material/Person';
  import LinkIcon from '@mui/icons-material/Link';
  import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
  import { EventApiService } from '../../../service/api/api.service';
  import { toast } from 'react-toastify';
  


  // No longer needed as we use inline mock data in useEffect


  const validateEmail = (email: string) => {
    if (!email) return true;
    // Simple email regex
    return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
  };

  export interface Guest {
    id: string;
    email?: string;
    label?: string;
    status?: 'accepted' | 'pending';
  }

  const EventGuestsView: React.FC<{ eventId: string }> = ({ eventId }) => {
    const [currentGuests, setCurrentGuests] = useState<Guest[]>([]);
    const [pendingInvites, setPendingInvites] = useState<Guest[]>([]);
    const [email, setEmail] = useState('');
    const [label, setLabel] = useState('');
    const [inviteLink] = useState('');
    const [linkCopied, setLinkCopied] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [expandedAccordion, setExpandedAccordion] = useState<string | false>('currentGuests');


    React.useEffect(() => {
      // Define functions inside useEffect to avoid dependency issues
      const getCurrentGuests = async () => {
        try {
          const guests = await EventApiService.getCurrentGuests(eventId);
          setCurrentGuests(guests);
        } catch (error) {
          console.error('Error fetching current guests:', error);
        }
      };

      const getPendingInvites = async () => {
        try {
          const invites = await EventApiService.getPendingInvites(eventId);
          setPendingInvites(invites);
        } catch (error) {
          console.error('Error fetching pending invites:', error);
        }
      };

      // Call the functions to fetch data
      getCurrentGuests();
      getPendingInvites();
    }, [eventId]);

    const handleAccordionChange = (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
      setExpandedAccordion(isExpanded ? panel : false);
    };

    const handleInvite = async () => {
      setError('');
      setSuccess('');
      if (email && !validateEmail(email)) {
        setError('Please enter a valid email address.');
        return;
      }
      if (!label && !email) {
        setError('Please provide at least a label or an email.');
        return;
      }
      setLoading(true);
      // Simulate API call

      try {
        await EventApiService.inviteGuest(eventId, email, label);
        toast.success('Invite sent successfully!');
        const newGuest: Guest = {
          id: Math.random().toString(36).slice(2),
          email: email || '',
          label: label || '',
          status: 'pending',
        };

        setPendingInvites(prev => [...prev, newGuest]);
        setEmail('');
        setLabel('');
        setSuccess('Invite sent successfully!');
        } catch (error) {
          setError('Failed to send invite.');
          console.error(error);
          toast.error('Failed to send invite.');
        } finally {
          setLoading(false);
        }
    };

    const handleCopyLink = () => {
      navigator.clipboard.writeText(inviteLink);
      setLinkCopied(true);
    };

    const handleRevoke = (id: string, status: 'accepted' | 'pending') => {
      if (status === 'accepted') {
        setCurrentGuests((prev) => prev.filter((g) => g.id !== id));
      } else {
        setPendingInvites((prev) => prev.filter((g) => g.id !== id));
      }
      setSuccess('Invite revoked.');
    };

    return (
      <Box
        sx={{
          padding: 3,
          borderBottom: '1px solid',
          borderColor: 'divider',
          position: 'relative',
        }}
      >
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
          Invite A Guest
        </Typography>
        <Stack spacing={2}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Email (optional)"
              value={email}
              onChange={e => setEmail(e.target.value)}
              variant="outlined"
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(255,255,255,0.05)',
                },
              }}
            />
          </Box>

          <Button
            variant="contained"
            color="primary"
            onClick={handleInvite}
            disabled={loading}
            sx={{ alignSelf: 'flex-start', minWidth: 120 }}
          >
            Send Invite
          </Button>
          {error && <Alert severity="error">{error}</Alert>}
          {success && <Alert severity="success">{success}</Alert>}
        </Stack>

        <Divider sx={{ my: 3 }} />

        {/* Current Guests Accordion */}
        <Accordion 
          expanded={expandedAccordion === 'currentGuests'} 
          onChange={handleAccordionChange('currentGuests')}
          sx={{ mb: 2, bgcolor: 'rgba(255, 255, 255, 0.03)' }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="current-guests-content"
            id="current-guests-header"
          >
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                Current Guests
              </Typography>
              <Badge 
                badgeContent={currentGuests.length} 
                color="primary"
                sx={{ mr: 2 }}
              />
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 0 }}>
            {currentGuests.length > 0 ? (
              <List>
                {currentGuests.map((guest) => (
                  <ListItem
                    key={guest.id}
                    sx={{ py: 1 }}
                    secondaryAction={
                      <Tooltip title="Revoke Access">
                        <IconButton edge="end" color="error" onClick={() => handleRevoke(guest.id, 'accepted')}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    }
                  >
                    <ListItemAvatar>
                      <Avatar>
                        {guest.email ? <EmailIcon /> : <PersonIcon />}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={guest.label || guest.email || 'Unnamed'}
                      secondary={guest.email && guest.label ? guest.email : guest.email || guest.label}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography sx={{ p: 2, color: 'text.secondary' }}>
                No guests have accepted invites yet.
              </Typography>
            )}
          </AccordionDetails>
        </Accordion>
        
        {/* Pending Invites Accordion */}
        <Accordion 
          expanded={expandedAccordion === 'pendingInvites'} 
          onChange={handleAccordionChange('pendingInvites')}
          sx={{ mb: 2, bgcolor: 'rgba(255, 255, 255, 0.03)' }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="pending-invites-content"
            id="pending-invites-header"
          >
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                Pending Invites
              </Typography>
              <Badge 
                badgeContent={pendingInvites.length} 
                color="warning"
                sx={{ mr: 2 }}
              />
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 0 }}>
            {pendingInvites.length > 0 ? (
              <List>
                {pendingInvites.map((guest) => (
                  <ListItem
                    key={guest.id}
                    sx={{ py: 1 }}
                    secondaryAction={
                      <Tooltip title="Cancel Invite">
                        <IconButton edge="end" color="error" onClick={() => handleRevoke(guest.id, 'pending')}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    }
                  >
                    <ListItemAvatar>
                      <Avatar>
                        {guest.email ? <EmailIcon /> : <PersonIcon />}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={guest.label || guest.email || 'Unnamed'}
                      secondary={guest.email && guest.label ? guest.email : guest.email || guest.label}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography sx={{ p: 2, color: 'text.secondary' }}>
                No pending invites.
              </Typography>
            )}
          </AccordionDetails>
        </Accordion>

        <Divider sx={{ my: 3 }} />

        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
          Link to share
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TextField
            value={inviteLink}
            variant="outlined"
            fullWidth
            slotProps={{
              input: {
                endAdornment: (
                <InputAdornment position="end">
                  <Tooltip title="Copy link">
                    <IconButton onClick={handleCopyLink} disabled={!inviteLink}>
                      <ContentCopyIcon />
                    </IconButton>
                  </Tooltip>
                  <LinkIcon sx={{ ml: 1 }} />
                </InputAdornment>
                ),
                readOnly: true
              },
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'rgba(255,255,255,0.05)',
              },
            }}
          />
        </Box>
        <Snackbar
          open={linkCopied}
          autoHideDuration={2000}
          onClose={() => setLinkCopied(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert severity="info" sx={{ width: '100%' }}>
            Link copied!
          </Alert>
        </Snackbar>
      </Box>
    );
  };


export default EventGuestsView;
