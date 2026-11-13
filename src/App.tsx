
import React, { useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Epk from './pages/Epk';
import Media from './pages/Media';
import AdminLogin from './pages/AdminLogin';
import AdminPanel from './pages/AdminPanel';
import { Divider, Container, Box, Link } from '@mui/material';
import ScrollToTop from './shared/utils/scrollToTop';
import SocialLinks from './shared/components/SocialLinks';
import { adminUrl } from './shared/utils/url';

const App: React.FC = () => {
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);
 
  return (
      <Container sx={{ maxWidth: '100% !important' }} disableGutters >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/epk" element={<Epk />} />
          <Route path="/media" element={<Media />} />
          <Route path="/videos" element={<Navigate to="/media" replace />} />
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
          <Box sx={{ mt: 2, mb: 3 }}>
            <SocialLinks size={76} />
          </Box>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', fontSize: '0.7rem' }}>
            <Box component="small" sx={{ fontSize: 'inherit' }}>
              &copy; {new Date().getFullYear()} Rats. All rights reserved.
            </Box>
            <Link href={adminUrl} color="inherit" underline="hover" sx={{ fontSize: 'inherit' }}>
              Admin
            </Link>
          </Box>
           <ScrollToTop />
        </Box> 
       
      </Container>
  );
};

export default App;
