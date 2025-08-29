
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
  } from '@mui/material';
  import ContentCopyIcon from '@mui/icons-material/ContentCopy';
  import DeleteIcon from '@mui/icons-material/Delete';
  import EmailIcon from '@mui/icons-material/Email';
  import PersonIcon from '@mui/icons-material/Person';
  import LinkIcon from '@mui/icons-material/Link';
  import { EventApiService } from '../../../service/api/api.service';
  import { toast } from 'react-toastify';
  


  // Dummy API simulation
  const fetchGuests = async () => {
    return [
      { id: '1', email: 'contact@example.com', label: '' },
      { id: '2', email: '', label: 'VIP Guest' },
    ];
  };


  const validateEmail = (email: string) => {
    if (!email) return true;
    // Simple email regex
    return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
  };

  interface Guest {
    id: string;
    email?: string;
    label?: string;
  }

  const EventGuestsView: React.FC<{ eventId: string }> = ({ eventId }) => {
    const [guests, setGuests] = useState<Guest[]>([]);
    const [email, setEmail] = useState('');
    const [label, setLabel] = useState('');
    const [inviteLink] = useState('');
    const [linkCopied, setLinkCopied] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    React.useEffect(() => {
      fetchGuests().then(setGuests);
    }, []);

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
        };

        setGuests((prev) => [...prev, newGuest]);
        setEmail('');
        setLabel('');
        setSuccess('Invite sent successfully!');
        } catch (error) {
          setError('Failed to send invite.');
          console.error(error);
          toast.error('Failed to send invite.');
        }
    };

    const handleCopyLink = () => {
      navigator.clipboard.writeText(inviteLink);
      setLinkCopied(true);
    };

    const handleRevoke = (id: string) => {
      setGuests((prev) => prev.filter((g) => g.id !== id));
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

        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
          Current Guests
        </Typography>
        <List>
          {guests.map((guest) => (
            <ListItem
              key={guest.id}
              sx={{ py: 1 }}
              secondaryAction={
                <Tooltip title="Revoke Invite">
                  <IconButton edge="end" color="error" onClick={() => handleRevoke(guest.id)}>
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
