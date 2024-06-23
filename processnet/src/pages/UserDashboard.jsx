import React from 'react';
import { Routes, Route } from 'react-router-dom';
import NewProcess from './NewProcess';
import ViewProcess from './ViewProcess';
import Profile from './Profile';

const UserDashboard = () => {
  return (
    <Routes>
      <Route path="new-process" element={<NewProcess />} />
      <Route path="view-process" element={<ViewProcess />} />
      <Route path="profile" element={<Profile />} />
    </Routes>
  );
};

export default UserDashboard;
