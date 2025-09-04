import { 
    Accordion, 
    AccordionSummary,
    Box,
    Typography,
    Badge,
    AccordionDetails,
    List,
    ListItem,
    Tooltip,
    IconButton,
    CircularProgress,
    ListItemAvatar,
    Avatar,
    ListItemText
} from "@mui/material";
import type { Guest } from "./EventGuestsView";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import React from "react";

export interface PendingInvitesAccordionProps {
  expandedAccordion: string | false;
  handleAccordionChange: (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => void;
  pendingInvites: Guest[];
  loadingPendingInvites: boolean;
  loadingRevoke: string | null;
  handleRevokePendingInvite: (id: string) => Promise<void>;
}

const PendingInvitesAccordion: React.FC<PendingInvitesAccordionProps> = ({
  expandedAccordion,
  handleAccordionChange,
  handleRevokePendingInvite,
  pendingInvites,
  loadingPendingInvites,
  loadingRevoke
}) => {
    

    return (
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
          <AccordionDetails sx={{ p: 0, position: 'relative', minHeight: '50px' }}>
            {pendingInvites.length > 0 ? (
              <List>
                {pendingInvites.map((guest) => (
                  <ListItem
                    key={guest.id}
                    sx={{ py: 1 }}
                    secondaryAction={
                      <Tooltip title={loadingRevoke === guest.id ? "Cancelling..." : "Cancel Invite"}>
                        <span> {/* Wrapper span needed for disabled tooltip */}
                          <IconButton 
                            edge="end" 
                            color="error" 
                            onClick={() => handleRevokePendingInvite(guest.id)}
                            loading={loadingRevoke === guest.id}
                          >
                            {loadingRevoke === guest.id ? (
                              <CircularProgress size={20} color="inherit" />
                            ) : (
                              <DeleteIcon />
                            )}
                          </IconButton>
                        </span>
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

            {/* Loading overlay for accordion content only */}
            {loadingPendingInvites && (
              <Box 
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  bgcolor: 'rgba(0, 0, 0, 0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 1
                }}
              >
                <CircularProgress color="inherit" />
              </Box>
            )}
          </AccordionDetails>
        </Accordion>
    )
}

export default PendingInvitesAccordion;