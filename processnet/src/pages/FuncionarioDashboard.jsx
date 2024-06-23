import React from 'react';
import { Typography, Box } from '@mui/material';
import { Routes, Route } from 'react-router-dom';
import SelectProcess from './SelectProcess';
import CheckProcess from './CheckProcess';
import Profile from './Profile';
import { useAuth } from '../AuthContext';

const FuncionarioDashboard = () => {
  const { user } = useAuth();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Seja bem-vindo ao ProcessNet
      </Typography>
      <Typography variant="h5" component="h2">
        {user?.name}
      </Typography>
      <Routes>
        <Route path="select-process" element={<SelectProcess />} />
        <Route path="check-process" element={<CheckProcess />} />
        <Route path="profile" element={<Profile />} />
      </Routes>
    </Box>
  );
};

export default FuncionarioDashboard;
