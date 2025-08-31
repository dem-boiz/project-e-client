import { 
    AccordionDetails, 
    AccordionSummary,
    AccordionActions,
    Alert, 
    Box, 
    CircularProgress, 
    IconButton, 
    InputAdornment, 
    Snackbar, 
    TextField, 
    Tooltip, 
    Typography, 
    Button,
    Divider
} from "@mui/material"
import Accordion from "@mui/material/Accordion"
import { useEffect, useState } from "react";
import LinkIcon from '@mui/icons-material/Link';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import PersonIcon from '@mui/icons-material/Person';
import { EventApiService } from "../../../../service/api/api.service";


export interface ShareableLinkAccordionProps {
    eventId: string;
    onNewLink: () => void;
}


const ShareableLinkAccordion: React.FC<ShareableLinkAccordionProps> = ({ eventId, onNewLink }) => {

    const [expandedShareLink, setExpandedShareLink] = useState<boolean>(false);
    const [shareableLinkDesc, setShareableLinkDesc] = useState<string>('Get a one time use shareable link');
    const [loadingShareLinkState, setLoadingShareLinkState] = useState<'success' | 'loading' | 'idle' | 'error'>('idle');
    const [shareLinkLabel, setShareLinkLabel] = useState<string>('');
    const [linkCopied, setLinkCopied] = useState(false);
    const [inviteLink, setInviteLink] = useState('');
    const [generateLinkButtonDesc, setGenerateLinkButtonDesc] = useState<string>('Generate Link');


    const handleCopyLink = () => {
      navigator.clipboard.writeText(inviteLink);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    };

    const handleShareLinkGenerate = async (_?: React.SyntheticEvent<Element, Event>, _open?: boolean) => {
      try {
        setLoadingShareLinkState('loading');
        const result = await EventApiService.getInviteLink(eventId);
        const inviteLabel = result.label;
        setInviteLink(`https://example.com/invite/${inviteLabel}`);
        setLoadingShareLinkState('success');
        setExpandedShareLink(true);
        setShareLinkLabel(inviteLabel);

      } catch (error) {
        console.error('Error setting invite link:', error);
        setLoadingShareLinkState('error');
      }
  
    };


    useEffect(() => {
        if (loadingShareLinkState === 'success') {
            setShareableLinkDesc('Invite link generated!');
            setGenerateLinkButtonDesc('Create Another Link');
            onNewLink();
        } else if (loadingShareLinkState === 'error') {
            setShareableLinkDesc('Failed to generate link. Try again later.');
            setGenerateLinkButtonDesc('Try Again');
        } else if (loadingShareLinkState === 'idle') {
            setShareableLinkDesc('Get a shareable link');
            setGenerateLinkButtonDesc('Generate Link');
        }
    }, [loadingShareLinkState, onNewLink]);



    return (
        <Accordion expanded={expandedShareLink} onChange={() => {
            if (!expandedShareLink)
                handleShareLinkGenerate()
        }}>
            <AccordionSummary
              sx={{ 
                ":hover:not(.Mui-disabled)": {
                    ...(loadingShareLinkState === 'idle' || (!expandedShareLink && loadingShareLinkState === 'error') ? {
                        backgroundColor: 'rgba(255, 255, 255, 0.05)'
                    } : {
                        cursor: 'default',
                    })
                } 
              }}
            >
              <LinkIcon sx={{ mr: 1, mt: 0.15 }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                {shareableLinkDesc}
              </Typography>

              {loadingShareLinkState === 'loading' ? 
                  (
                    <CircularProgress
                      size={24}
                      sx={{ ml: 1 }}
                    />
                  ) : loadingShareLinkState === 'error' ? (
                    <ErrorOutlineIcon color="error" sx={{ ml: 1 }} />
                  ) : loadingShareLinkState === 'success' ? (
                    <CheckCircleOutlineIcon color="success" sx={{ ml: 1 }} />
                  ) : null
              }

            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1, 
                    flexDirection: 'column',
                    
                }}>

                <TextField
                    required
                    helperText="Set a custom invite label for easier guest management"
                    value={shareLinkLabel}
                    onChange={(e) => setShareLinkLabel(e.target.value)}
                    label="Invite label"
                    variant="standard"
                    fullWidth
                    slotProps={{
                      input: {
                        disabled: loadingShareLinkState === 'loading' || loadingShareLinkState === 'error',

                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonIcon />
                          </InputAdornment>
                        ),
                      },
                    }}
                />


                <Divider sx={{ my: 1 }} />
                <TextField
                  value={inviteLink}
                  variant="outlined"
                  fullWidth
                  slotProps={{
                    input: {
                      disabled: loadingShareLinkState === 'loading' || loadingShareLinkState === 'error',

                      startAdornment: (
                        <InputAdornment position="start">
                          <LinkIcon />
                        </InputAdornment>
                      ),
                      endAdornment: (
                      <InputAdornment position="end">

                        {

                            linkCopied ? (
                                <CheckCircleOutlineIcon color="success" sx={{ mr: 1 }} />
                            ) : (
                                <Tooltip title="Copy link">
                                <IconButton onClick={handleCopyLink} disabled={!inviteLink || loadingShareLinkState === 'loading'}>
                                    <ContentCopyIcon />
                                </IconButton>
                                </Tooltip>
                            )
                        }
  
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
            </AccordionDetails>
            <AccordionActions>
                {expandedShareLink && (
                    <Button 
                        variant="contained"
                    
                        onClick={() => handleShareLinkGenerate()}>
                        {generateLinkButtonDesc}
                    </Button>
                )}
            </AccordionActions>
        </Accordion>
    )
}

export default ShareableLinkAccordion;