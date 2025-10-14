import { Box, Button, Container, Stack, Typography, Divider,Toolbar } from '@mui/material';
import React, { useRef, useState } from 'react';
import Loader from '../shared/components/Loader';
import About from './About';
import Video from '../shared/components/Video';
import Songs from './Songs';
import Contact from './Contact';
import Tour from './Tour';
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
          py: 2,
        }}
      >
        <Box
          component="img"
          sx={{
            mr: 3,
            height: 80,
            width: 100,
          }}
          alt="rats logo."
          src={logo}
        />
        <Stack direction="row" spacing={2}>
          <Button onClick={() => scrollIntoView(home)}>Home</Button>
          <Button onClick={() => scrollIntoView(about)}>About</Button>
          <Button onClick={() => scrollIntoView(songs)}>Songs</Button>
          <Button onClick={() => scrollIntoView(contact)}>Contact</Button>
          {/* <Button onClick={() => scrollIntoView(tour)}>Tour Dates</Button> */}
          <ScrollToTop />
        </Stack>
      </Toolbar>
        <Container className="container home" ref={home}>
          <Video/>
          <Divider sx={{ height: 20 }} />
        </Container>
        <Container className="container" ref={about}>
          <About />
          <Divider sx={{ height: 20 }} />
        </Container>
        <Container className="container" ref={songs}>
          <Songs />
          <Divider sx={{ height: 20 }} />
        </Container>
        <Container className="container" ref={contact}>
          <Contact />
          <Divider sx={{ height: 20 }} />
        </Container>
        <Container className="container" ref={tour}>
          <Tour />
        </Container>
      
    </Container>
  );
};

export default Home;
