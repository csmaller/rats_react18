import { Container } from '@mui/material';
import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import NavBar from './shared/components/NavBar';
import ScrollToTop from './shared/utils/scrollToTop';
import About from './pages/About';
import Home from './pages/Home';
import Songs from './pages/Songs';
import Contact from './pages/Contact';
import EmptyContainer from './pages/EmptyContainer';
import Tour from './pages/Tour';
import AdminLogin from './pages/AdminLogin';
import AdminPanel from './pages/AdminPanel';
import { Box, Divider, Stack, Button, Toolbar } from '@mui/material';
import { AlbumOutlined } from '@mui/icons-material';
import logo from './assets/logo_transparent.png';

const App: React.FC = () => {
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);
  const home = React.useRef(null);
  const about = React.useRef(null);
  const songs = React.useRef(null);
  const contact = React.useRef(null);
  const tour = React.useRef(null);

  const scrollIntoView = (elref: React.RefObject<HTMLElement>) => {
    const main = document.getElementById('main');

    if (main && elref.current) {
      const offsetNav = elref.current?.offsetTop + 110;
      main.scrollTo({
        behavior: 'smooth',
        top: elref.current?.getBoundingClientRect().top + main.scrollTop - 120,
      }); //<--uncomment to enable scrolling to ref
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
          <Button onClick={() => scrollIntoView(tour)}>Tour Dates</Button>
          <ScrollToTop />
        </Stack>
      </Toolbar>
      <Container>
        <Routes>
          <Route path="/" element={<EmptyContainer />} />
          <Route
            path="/admin"
            element={
              adminLoggedIn ? (
                <AdminPanel onLogout={() => setAdminLoggedIn(false)} />
              ) : (
                <AdminLogin onLogin={() => setAdminLoggedIn(true)} />
              )
            }
          />
        </Routes>

        <Divider sx={{ height: 20 }} />
        <Container className="container" ref={home}>
          <Home />
        </Container>
        <Container className="container" ref={about}>
          <AlbumOutlined />
        </Container>
        <Container className="container" ref={songs}>
          <Songs />
        </Container>
        <Container className="container" ref={contact}>
          <Contact />
        </Container>
        <Container className="container" ref={tour}>
          <Tour />
        </Container>
        {/* <Container sx={{ mt: 6, mb:6 }} ref={home}>
    <Typography variant="h4" gutterBottom>
       Upcoming Shows
      </Typography>
      <Box sx={{ mt: 4 }}>
      <iframe src="https://www.songkick.com/artists/1015740-rats" width="100%" height="600" frameBorder="0" scrolling="no"></iframe>
      </Box>
    </Container> */}
      </Container>
    </Container>
  );
};

export default App;
