
  import React, { useState } from 'react';
  import {
    Box,
    Stack,
    TextField,
    Button,
    Typography,
    Alert,
    Divider,
    InputAdornment,

  } from '@mui/material';
  import EmailIcon from '@mui/icons-material/Email';
  import { EventApiService } from '../../../../service/api/api.service';
  import { toast } from 'react-toastify';
  import ShareableLinkAccordion from '../ShareableLinkAccordian';
  import PendingInvitesAccordion from '../PendingInvitesAccordian';
  import ParticipantsAccordion from '../ParticipantsAccordian';
  import type { User } from '../../../../types/network.types';

  // No longer needed as we use inline mock data in useEffect


  const validateEmail = (email: string) => {
    if (!email) return true;
    // Simple email regex
    return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
  };

  export interface Invite {
    id: string;
    email?: string;
    label?: string;
    status?: 'accepted' | 'pending';
  }




  const ManageVendorsView: React.FC<{ eventId: string }> = ({ eventId }) => {
    const [currentVendors, setCurrentVendors] = useState<User[]>([]);
    const [email, setEmail] = useState('');
    const [label, setLabel] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [sendInviteLoading, setSendInviteLoading] = useState(false);
    const [expandedAccordion, setExpandedAccordion] = useState<string | false>('');
    const [loadingRevoke, setLoadingRevoke] = useState<string | null>(null);
    const [pendingInvites, setPendingInvites] = useState<Invite[]>([]);
    const [loadingPendingInvites, setLoadingPendingInvites] = useState(false);
    const [loadingCurrentVendors, setLoadingCurrentVendors] = useState(false);

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


    const getCurrentVendors = React.useCallback(async () => {
        try {
            console.log('Fetching current vendors for event:', eventId);
            setLoadingCurrentVendors(true);
            const vendors = await EventApiService.getEventVendors(eventId);
            setCurrentVendors(vendors);
        } catch (error) {
            console.error('Error fetching current vendors:', error);
        } finally {
            setLoadingCurrentVendors(false);
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


    const handleRevokeAccess = async (id: string, type: string) => {
        // Set the loading state for this specific invite button
        setLoadingRevoke(id);
        try {
            // Add a small delay to simulate API call
            await EventApiService.revokeAccess(eventId, id, type);
            setCurrentVendors((prev) => prev.filter((g) => g.id !== id));
        } catch (error) {
            toast.error('Failed to revoke vendor access.');
            console.error(error);
        } finally {
            // Clear the loading state when done
            setLoadingRevoke(null);
        }
    };


    React.useEffect(() => {
      getCurrentVendors();
    }, [getCurrentVendors]);

    React.useEffect(() => {
      getPendingInvites();
    }, [getPendingInvites]);



    const handleAccordionChange = (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
      setExpandedAccordion(isExpanded ? panel : false);
    };


    const handleSendEmailInvite = async () => {
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
        await EventApiService.inviteVendor(eventId, email, label);
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
          Invite A Vendor
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
              onClick={handleSendEmailInvite}
              loading={sendInviteLoading}
              sx={{ alignSelf: 'flex-end', minWidth: 120, height: '48px' }}
            >
              Send Invite
            </Button>
            {success && <Alert sx={{ width: '100%'}} severity="success">{success}</Alert>}
          </Box>

        </Stack>

        <Divider sx={{ my: 3 }} />

        <ShareableLinkAccordion onNewLink={handleNewLinkCreated} eventId={eventId} accessType='vendor'/>

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

        {/* Current Vendors Accordion */}

        <ParticipantsAccordion
          type="vendors"
          loadingParticipants={loadingCurrentVendors}
          handleRevokeAccess={handleRevokeAccess}
          expandedAccordion={expandedAccordion}
          handleAccordionChange={handleAccordionChange}
          participants={currentVendors}
          loadingRevoke={loadingRevoke}
        /> 
        


      </Box>

    );
  };


export default ManageVendorsView;
