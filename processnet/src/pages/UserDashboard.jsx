import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import NewProcess from './NewProcess';
import ViewProcess from './ViewProcess';
import Profile from './Profile';

const UserDashboard = () => {
  return (
    <div>
      <h1>Tela de Usuário</h1>
      <Routes>
        <Route path="new-process" element={<NewProcess />} />
        <Route path="view-process" element={<ViewProcess />} />
        <Route path="profile" element={<Profile />} />
      </Routes>
    </div>
  );
};

export default UserDashboard;
