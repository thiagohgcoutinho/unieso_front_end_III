import React from 'react';
import { Typography, Box } from '@mui/material';
import { Routes, Route } from 'react-router-dom';
import NewProcess from './NewProcess';
import ViewProcess from './ViewProcess';
import Profile from './Profile';
import { useAuth } from '../AuthContext';

const UserDashboard = () => {
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
        <Route path="new-process" element={<NewProcess />} />
        <Route path="view-process" element={<ViewProcess />} />
        <Route path="profile" element={<Profile />} />
      </Routes>
    </Box>
  );
};

export default UserDashboard;
