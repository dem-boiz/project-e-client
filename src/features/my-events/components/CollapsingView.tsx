import { ArrowBackIos } from "@mui/icons-material"
import { Box, DialogActions, DialogContent, IconButton, Collapse, type CollapseProps } from "@mui/material"





export interface CollapsingViewProps {
    onBackClick?: () => void;
    children: React.ReactNode;
    collapseProps: Omit<CollapseProps, 'children'>; 
}

const CollapsingView = ({ onBackClick, children, collapseProps }: CollapsingViewProps) => {
    return (
        <Collapse
            {...collapseProps}
        >
            <Box sx={{ 
                width: '100%', 
                borderRadius: 2, 
                overflow: 'hidden', 
                position: 'absolute',
                backgroundColor: 'blue',
                zIndex: collapseProps.in ? 1200 : -1, // Ensure it appears above other content when collapsing in

            }}>

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
        </Collapse>
    )
}

export default CollapsingView;