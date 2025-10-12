import { Container} from '@mui/material';
import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar';
import About from './pages/About';
import Home from './pages/Home';
import Songs from './pages/Songs';
import Contact from './pages/Contact';
import Tour from './pages/Tour';
import AdminLogin from './pages/AdminLogin';
import AdminPanel from './pages/AdminPanel';
import { Box, Divider, Typography } from '@mui/material';

const App: React.FC = () => {
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);
  const test = React.useRef(null);

  return (
    <>
      <NavBar />
      <Container>
        {/* <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/songs" element={<Songs />} />
          <Route path="/contact" element={<Contact/>} />  */}
          {/* <Route
            path="/admin"
            element={
              adminLoggedIn ? (
                <AdminPanel onLogout={() => setAdminLoggedIn(false)} />
              ) : (
                <AdminLogin onLogin={() => setAdminLoggedIn(true)} />
              )
            }
          /> */}
        {/* /</Routes> */}
        <Home />
        <Divider sx={{ height:20}} />
    <Container sx={{ mt: 6, mb:6 }} ref={test}>
    <Typography variant="h4" gutterBottom>
       Upcoming Shows
      </Typography>
      <Box sx={{ mt: 4 }}>
      <iframe src="https://www.songkick.com/artists/1015740-rats" width="100%" height="600" frameBorder="0" scrolling="no"></iframe>
      </Box>
    </Container>
      </Container>
    </>
  );
};

export default App;
