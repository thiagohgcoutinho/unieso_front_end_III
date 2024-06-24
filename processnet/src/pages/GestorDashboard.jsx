import React from 'react';
import { Typography, Box } from '@mui/material';
import { Routes, Route } from 'react-router-dom';
import AllProcess from './AllProcess';
import AllUsuarios from './AllUsuarios';
import AllFuncionarios from './AllFuncionarios';
import Profile from './Profile';
import { useAuth } from '../AuthContext';

const GestorDashboard = () => {
  const { user } = useAuth();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Seja bem-vindo ao ProcessNet
      </Typography>
      <Routes>
        <Route path="all-process" element={<AllProcess />} />
        <Route path="all-usuarios" element={<AllUsuarios />} />
        <Route path="all-funcionarios" element={<AllFuncionarios />} />
        <Route path="profile" element={<Profile />} />
      </Routes>
    </Box>
  );
};

export default GestorDashboard;
