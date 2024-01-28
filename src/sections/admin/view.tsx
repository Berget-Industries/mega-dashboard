import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

export default function OverviewAnalyticsView() {
  return (
    <Container maxWidth="xl">
      <Typography
        variant="h4"
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        Admin 🛠️
      </Typography>
    </Container>
  );
}
