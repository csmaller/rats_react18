import { Container } from '@mui/material';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar';
import About from './pages/About';
import Home from './pages/Home';
import Songs from './pages/Songs';
import Tour from './pages/Tour';

const App: React.FC = () => {
  return (
    <>
      <NavBar />
      <Container>
        <Routes>
          <Route path="/about" element={<About />} />
          <Route path="/songs" element={<Songs />} />
          <Route path="/tour" element={<Tour />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </Container>
    </>
  );
};

export default App;
