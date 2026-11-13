import { Box, Container, Typography } from '@mui/material';

export default function Lineup() {
  return (
    <Box component="section" id="lineup" sx={{ py: { xs: 8, md: 12 } }}>
      <Container maxWidth="md">
        <Typography variant="h3" component="h2">
          Lineup
        </Typography>
        <Box sx={{ width: 72, height: 2, my: 2, backgroundColor: 'secondary.main' }} />
        <Typography color="text.secondary">
          Photos and roles land here once the band adds them.
        </Typography>
      </Container>
    </Box>
  );
}
