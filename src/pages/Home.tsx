import { Box, Button, Container, Stack, Divider,Toolbar } from '@mui/material';
import React, { useRef, useState } from 'react';
// import About from './About';
import Video from '../shared/components/Video';
import Songs from './Songs';
import Contact from './Contact';
// import Tour from './Tour';
import ScrollToTop from '../shared/utils/scrollToTop';
import logo from '../assets/logo_transparent.png';

const Home = () => {
 
  const home = useRef(null);
  const about = useRef(null);
  const songs = useRef(null);
  const contact = useRef(null);
  const tour = useRef(null);

  const scrollIntoView = (elref: React.RefObject<HTMLElement>) => {
    const main = document.getElementById('main');

    if (main && elref.current) {
      const offsetNav = elref.current?.offsetTop + 110;
      
      main.scrollTo({
        behavior: 'smooth',
        top: elref.current?.getBoundingClientRect().top + main.scrollTop - 120,
      }); 
    }
  };

  return (
    <Container
      id="main"
      sx={{
        overflowY: 'scroll',
        height: '100vh',
        width: '100%',
        maxWidth: '100% !important',
        scrollBehavior: 'smooth',
        scrollSnapType: 'y mandatory',
        '& > *': { scrollSnapAlign: 'start' },
      }}
    >
       <Toolbar
        sx={{
          position: 'absolute',
          top: 0,
          zIndex: 1000,
          backgroundColor: 'black',
          borderBottom: 3,
          borderColor: 'divider',
          width: '100%',
          py: { xs: 1, md: 2 },
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 1, sm: 0 },
        }}
      >
        <Box
          component="img"
          sx={{
            mr: { xs: 0, sm: 3 },
            height: { xs: 60, md: 80 },
            width: { xs: 75, md: 100 },
          }}
          alt="rats logo."
          src={logo}
        />
        <Stack 
          direction={{ xs: 'column', sm: 'row' }} 
          spacing={{ xs: 1, sm: 2 }}
          sx={{ width: { xs: '100%', sm: 'auto' } }}
        >
          <Button 
            onClick={() => scrollIntoView(home)}
            sx={{ fontSize: { xs: '0.8rem', sm: '1rem' } }}
          >
            Home
          </Button>
          <Button 
            onClick={() => scrollIntoView(contact)}
            sx={{ fontSize: { xs: '0.8rem', sm: '1rem' } }}
          >
            Contact
          </Button>
          <Button 
            onClick={() => scrollIntoView(songs)}
            sx={{ fontSize: { xs: '0.8rem', sm: '1rem' } }}
          >
            Songs
          </Button>
          <ScrollToTop />
        </Stack>
      </Toolbar>
        <Container 
          className="container home" 
          ref={home}
          sx={{ pt: { xs: 15, sm: 12, md: 10 } }}
        >
          <Video/>
          <Divider sx={{ height: 20, mt: 4 }} />
        </Container>
       <Container 
          className="container" 
          ref={contact}
          sx={{ px: { xs: 1, sm: 3 } }}
        >
          <Contact />
          <Divider sx={{ height: 20, mt: 4 }} />
        </Container>
        <Container 
          className="container" 
          ref={songs}
          sx={{ px: { xs: 1, sm: 3 } }}
        >
          <Songs />
          <Divider sx={{ height: 20, mt: 4 }} />
        </Container>
        
        {/* <Container className="container" ref={tour}>
          <Tour />
        </Container> */}
      
    </Container>
  );
};

export default Home;
