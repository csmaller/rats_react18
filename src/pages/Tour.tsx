import { Box, Button, Container, Typography } from '@mui/material';
import { scrollToId } from '../shared/utils/scrollTo';

export default function Tour() {
  return (
    <Box component="section" id="shows" sx={{ py: { xs: 8, md: 12 } }}>
      <Container maxWidth="md">
        <Typography variant="h3" component="h2">
          Shows
        </Typography>
        <Box sx={{ width: 72, height: 2, my: 2, backgroundColor: 'secondary.main' }} />
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          No dates posted yet. If you want RATS on your stage, book the band.
        </Typography>
        <Button variant="contained" onClick={() => scrollToId('contact')}>
          Book the band
        </Button>
      </Container>
    </Box>
  );
}
