
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
    Alert,
    Divider,
    InputAdornment,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Badge,
  } from '@mui/material';
  import DeleteIcon from '@mui/icons-material/Delete';
  import EmailIcon from '@mui/icons-material/Email';
  import PersonIcon from '@mui/icons-material/Person';
  import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
  import { EventApiService } from '../../../../service/api/api.service';
  import { toast } from 'react-toastify';
  import ShareableLinkAccordion from './ShareableLinkAccordian';
import PendingInvitesAccordion from './PendingInvitesAccordian';


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
    const [email, setEmail] = useState('');
    const [label, setLabel] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [sendInviteLoading, setSendInviteLoading] = useState(false);
    const [expandedAccordion, setExpandedAccordion] = useState<string | false>('');
    const [loadingRevoke, setLoadingRevoke] = useState<string | null>(null);
    const [pendingInvites, setPendingInvites] = useState<Guest[]>([]);
    const [loadingPendingInvites, setLoadingPendingInvites] = useState(false);

    const getPendingInvites = React.useCallback(async () => {
        try {
        const invites = await EventApiService.getPendingInvites(eventId);
        setPendingInvites(invites);
        } catch (error) {
        console.error('Error fetching pending invites:', error);
        } finally {
        setLoadingPendingInvites(false);
        }
    }, [eventId]);


    const handleRevokePendingInvite = async (id: string) => {
        // Set the loading state for this specific invite button
        setLoadingRevoke(id);
        
        try {
        // Add a small delay to simulate API call
        await EventApiService.revokePendingInvite(eventId, id);
        setPendingInvites((prev) => prev.filter((g) => g.id !== id));
        } catch (error) {
        toast.error('Failed to revoke pending invite.');
        console.error(error);
        } finally {
        // Clear the loading state when done
        setLoadingRevoke(null);
        }
    };


    React.useEffect(() => {
      // Define functions inside useEffect to avoid dependency issues
      const getCurrentGuests = async () => {
        try {
          //const guests = await EventApiService.getCurrentGuests(eventId);
          setCurrentGuests([]);
        } catch (error) {
          console.error('Error fetching current guests:', error);
        }
      };

      // Call the functions to fetch data
      getCurrentGuests();
      getPendingInvites();
    }, [eventId, getPendingInvites]);

    const handleAccordionChange = (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
      setExpandedAccordion(isExpanded ? panel : false);
    };


    const handleEmailInvite = async () => {
      setError('');
      setSuccess('');
      if (email && !validateEmail(email)) {
        setError('Please enter a valid email address.');
        return;
      }
      if (!email) {
        setError('Please provide at least a label or an email.');
        return;
      }
      setSendInviteLoading(true);
      // Simulate API call

      try {
        await EventApiService.inviteGuest(eventId, email, label);
        toast.success('Invite successfully sent!');
        handleNewLinkCreated();
        setEmail('');
        setLabel('');
        setSuccess('Invite successfully sent!');
        } catch (error) {
          setError('Failed to send invite.');
          console.error(error);
          toast.error('Failed to send invite.');
        } finally {
          setSendInviteLoading(false);
        }
    };





    const handleNewLinkCreated = () => {
      setLoadingPendingInvites(true);
      getPendingInvites();
    }

  

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
              error={!!error}
              helperText={error || ' '}
              label="Email"
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
          <Box sx={{ 
            display: 'flex', 
            gap: 2, 
            height: 'fit-content', 
          }}>
            <Button
              
              variant="contained"
              color="primary"
              onClick={handleEmailInvite}
              loading={sendInviteLoading}
              sx={{ alignSelf: 'flex-end', minWidth: 120, height: '48px' }}
            >
              Send Invite
            </Button>
            {success && <Alert sx={{ width: '100%'}} severity="success">{success}</Alert>}
          </Box>

        </Stack>

        <Divider sx={{ my: 3 }} />

        <ShareableLinkAccordion onNewLink={handleNewLinkCreated} eventId={eventId} />

        <Divider sx={{ my: 5 }} />

        {/* Pending Invites Accordion */}
        <PendingInvitesAccordion
          handleRevokePendingInvite={handleRevokePendingInvite}
          loadingPendingInvites={loadingPendingInvites}
          expandedAccordion={expandedAccordion}
          handleAccordionChange={
            (panel: string) => (__: React.SyntheticEvent, isExpanded: boolean) => setExpandedAccordion(isExpanded ? panel : false)
          }
          pendingInvites={pendingInvites}
          loadingRevoke={loadingRevoke}
        />

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
                        <IconButton edge="end" color="error" onClick={() => handleRevokePendingInvite(guest.id)}>
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
        

      </Box>

    );
  };


export default EventGuestsView;
