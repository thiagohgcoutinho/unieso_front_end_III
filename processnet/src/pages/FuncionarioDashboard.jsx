import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SelectProcess from './SelectProcess';
import CheckProcess from './CheckProcess';
import Profile from './Profile';

const FuncionarioDashboard = () => {
  return (
    <div>
      <h1>Tela de Funcionário</h1>
      <Routes>
        <Route path="select-process" element={<SelectProcess />} />
        <Route path="check-process" element={<CheckProcess />} />
        <Route path="profile" element={<Profile />} />
      </Routes>
    </div>
  );
};

export default FuncionarioDashboard;
