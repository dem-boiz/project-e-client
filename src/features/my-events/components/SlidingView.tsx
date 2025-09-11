import { ArrowBackIos } from "@mui/icons-material"
import { Box, DialogActions, DialogContent, IconButton, Slide, type SlideProps } from "@mui/material"
import React from "react"; 


export interface SlidingViewProps {
    type?: 'default' | 'edit' | 'guest'; // Different types of sliding views
    onBackClick?: () => void;
    children: React.ReactNode;
    slideProps: Omit<SlideProps, 'children'>; 
    // Removed isTransitioning prop
}

const SlidingView = ({ onBackClick, children, slideProps, type }: SlidingViewProps) => {

    return (
        <Slide
            timeout={750}
            {...slideProps}
        >
            <Box
                sx={{ 
                    width: '100%', 
                    borderRadius: 2, 
                    overflow: 'hidden',
                    overflowY: type === 'default' ? (
                        slideProps.in ? 'auto' : 'hidden'
                    ) : 'auto',
                    height: '100%',
                    position: 'absolute',
                    zIndex: slideProps.in ? 1200 : -1, // Ensure it appears above other content when sliding in
                    backgroundColor: 'background.default',
                }}
            >
                {onBackClick && (
                    <DialogActions
                        sx={{
                            padding: 3, 
                            borderColor: 'divider',
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'start'
                        }}
                    >
                        <IconButton onClick={onBackClick}>
                            <ArrowBackIos />
                        </IconButton>
                    </DialogActions>
                )}
                <DialogContent
                    sx={{ 
                        padding: 0, 
                        position: 'relative', 
                        overflowX: 'hidden' 
                    }} 
                >
                    {children}
                </DialogContent>
            </Box>
        </Slide>
    )
}

export default SlidingView;