import { Box, Container, Divider, Typography } from '@mui/material';
import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import BandNav, { HomeSection } from '../shared/components/BandNav';
import Video from '../shared/components/Video';
import Songs from './Songs';
import Contact from './Contact';
import Epk from './Epk';
import logo from '../assets/logo_transparent.png';

const Home = () => {
  const { hash } = useLocation();
  const home = useRef<HTMLDivElement>(null);
  const contact = useRef<HTMLDivElement>(null);
  const songs = useRef<HTMLDivElement>(null);
  const epk = useRef<HTMLDivElement>(null);

  const sections: Record<HomeSection, React.RefObject<HTMLDivElement | null>> = {
    home,
    contact,
    songs,
    epk,
  };

  const scrollToSection = (section: React.RefObject<HTMLDivElement | null>) => {
    const main = document.getElementById('main');
    const target = section.current;

    if (!main || !target) {
      return;
    }

    const top =
      target.getBoundingClientRect().top - main.getBoundingClientRect().top + main.scrollTop - 88;

    main.scrollTo({
      behavior: 'smooth',
      top: Math.max(0, top),
    });
  };

  const go = (section: HomeSection) => {
    scrollToSection(sections[section]);
  };

  useEffect(() => {
    const id = hash.replace('#', '') as HomeSection;

    if (!sections[id]) {
      return;
    }

    const timer = window.setTimeout(() => scrollToSection(sections[id]), 50);

    return () => window.clearTimeout(timer);
  }, [hash]);

  return (
    <Container
      id="main"
      sx={{
        overflowY: 'scroll',
        height: '100vh',
        width: '100%',
        maxWidth: '100% !important',
        scrollBehavior: 'smooth',
      }}
    >
      <BandNav overlay onSection={go} />
        <Container
          className="container home"
          ref={home}
          sx={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            pt: { xs: 10, md: 12 },
            pb: 6,
          }}
        >
          <Box
            component="img"
            src={logo}
            alt="Rage Against the Supremes"
            sx={{ width: { xs: 'min(86vw, 340px)', md: 'min(52vw, 520px)' }, height: 'auto' }}
          />
          <Typography variant="h3" component="h1" sx={{ mt: 3, letterSpacing: '0.04em' }}>
            Ski Town Party Music
          </Typography>
          <Typography sx={{ mt: 1.5, maxWidth: 560, color: 'text.secondary', fontStyle: 'italic' }}>
            The most dangerous cover band in the world.
          </Typography>
        </Container>
        <Container className="container" sx={{ px: { xs: 1, sm: 4 } }}>
          <Video />
          <Divider sx={{ height: 20 }} />
        </Container>
       <Container 
          className="container" 
          ref={contact}
          sx={{ px: { xs: 1, sm: 4} }}
        >
          <Contact />
          <Divider sx={{ height: 20 }} />
        </Container>
        
        <Container
          className="container" 
          ref={songs}
          sx={{ px: { xs: 1, sm: 4 } }}
        >
          <Songs />
          <Divider sx={{ height: 20}} />
        </Container>
        <Container className="container" ref={epk} sx={{ px: { xs: 1, sm: 4 } }}>
          <Epk embedded />
        </Container>
      
    </Container>
  );
};

export default Home;
