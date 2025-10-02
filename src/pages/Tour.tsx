import { Container, Typography } from '@mui/material';
import React from 'react';
import { tourDates } from '../data/tourDates';

const Tour: React.FC = () => {
  return (
    <div>
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Tour Dates
        </Typography>
        <div>
          {tourDates.map((date) => {
            const formattedDate = new Date(date.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            });
            return <div key={date.date}>{`Date: ${formattedDate}`}</div>;
          })}
        </div>
      </Container>
    </div>
  );
};

export default Tour;
