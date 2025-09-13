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
import React from "react";
import type { Vendor } from "../EventDefaultView";

export interface ParticipantsAccordionProps {
  type: 'guests' | 'vendors';
  expandedAccordion: string | false;
  handleAccordionChange: (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => void;
  participants: Guest[] | Vendor[];
  loadingParticipants: boolean;
  loadingRevoke: string | null;
  handleRevokeAccess: (id: string) => Promise<void>;
}

    const ParticipantsAccordion: React.FC<ParticipantsAccordionProps> = ({
    type,
    expandedAccordion,
    handleAccordionChange,
    handleRevokeAccess,
    participants,
    loadingParticipants,
    loadingRevoke
    }) => {

    const getParticipantName = (participant: Guest | Vendor): string => {
        return participant.name || 'Unnamed';
    }

    const getSecondaryText = (participant: Guest | Vendor): string => {
        if ('email' in participant && participant.email) {
            return participant.email;
        } else return 'No Email Provided';
    }

    return (
        <Accordion 
          expanded={expandedAccordion === 'participants'} 
          onChange={handleAccordionChange('participants')}
          sx={{ mb: 2, bgcolor: 'rgba(255, 255, 255, 0.03)' }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="pending-invites-content"
            id="pending-invites-header"
          >
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                {type === 'guests' ? 'Current Guests' : 'Vendors'}
              </Typography>
              <Badge 
                badgeContent={participants.length} 
                color="warning"
                sx={{ mr: 2 }}
              />
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 0, position: 'relative', minHeight: '50px' }}>
            {participants.length > 0 ? (
              <List>
                {participants.map((participant) => (
                  <ListItem
                    key={participant.id}
                    sx={{ py: 1 }}
                    secondaryAction={
                      <Tooltip title={loadingRevoke === participant.id ? "Cancelling..." : "Cancel Invite"}>
                        <span> {/* Wrapper span needed for disabled tooltip */}
                          <IconButton 
                            edge="end" 
                            color="error" 
                            onClick={() => handleRevokeAccess(participant.id)}
                            loading={loadingRevoke === participant.id}
                          >
                            {loadingRevoke === participant.id ? (
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
                        <PersonIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={getParticipantName(participant)}
                      secondary={getSecondaryText(participant)}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography sx={{ p: 2, color: 'text.secondary' }}>
                No {type === 'guests' ? 'guests' : 'vendors'} found. Try inviting some!
              </Typography>
            )}

            {/* Loading overlay for accordion content only */}
            {loadingParticipants && (
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

export default ParticipantsAccordion;