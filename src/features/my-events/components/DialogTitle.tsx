import Typography from "@mui/material/Typography";

const DialogTitle = ({ title }: { title: string }) => (
  <Typography
    variant="h4"
    sx={{
      color: 'text.primary',
      fontSize: { xs: '1.5rem', sm: '2rem', md: '2.1rem' },
      fontWeight: 500,

                  lineHeight: 1.3,
                  flex: 1,
                }}
              >
                {title}
    </Typography>
)

export default DialogTitle;