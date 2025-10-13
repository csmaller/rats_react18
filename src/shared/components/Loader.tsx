import { Box, CircularProgress } from '@mui/material';

const Loader = () => {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,0.7)',
        zIndex: 1,
      }}
    >
      <CircularProgress />
    </Box>
  );
};

export default Loader;
