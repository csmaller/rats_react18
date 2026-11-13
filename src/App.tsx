
import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Epk from './pages/Epk';
import Videos from './pages/Videos';
import AdminLogin from './pages/AdminLogin';
import AdminPanel from './pages/AdminPanel';
import { Divider, Container, Box, Link } from '@mui/material';
import ScrollToTop from './shared/utils/scrollToTop';
import { adminUrl } from './shared/utils/url';

const App: React.FC = () => {
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);
 
  return (
      <Container sx={{ maxWidth: '100% !important' }} disableGutters >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/epk" element={<Epk />} />
          <Route path="/videos" element={<Videos />} />
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
        <Box sx={{ mt: 4, mb: 2, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Divider />
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <small>&copy; {new Date().getFullYear()} Rats. All rights reserved.</small>
            <Link href={adminUrl} color="inherit" underline="hover" sx={{ fontSize: '0.8rem' }}>
              Admin
            </Link>
          </Box>
           <ScrollToTop />
        </Box> 
       
      </Container>
  );
};

export default App;
