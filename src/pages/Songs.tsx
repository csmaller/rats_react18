import { Typography } from '@mui/material';
import React from 'react';

const About: React.FC = () => {
  return (
    <div>
      <Typography variant="h4" component="h1" gutterBottom>
        Songs Page
      </Typography>
      <Typography variant="body1" gutterBottom>
        This is the songs page of the Rats application.
      </Typography>
    </div>
  );
};

export default About;
