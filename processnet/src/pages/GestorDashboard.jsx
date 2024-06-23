import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AllProcess from './AllProcess';
import AllUsuarios from './AllUsuarios';
import AllFuncionarios from './AllFuncionarios';
import Profile from './Profile';

const GestorDashboard = () => {
  return (
    <div>
      <h1>Tela de Gestor</h1>
      <Routes>
        <Route path="all-process" element={<AllProcess />} />
        <Route path="all-usuarios" element={<AllUsuarios />} />
        <Route path="all-funcionarios" element={<AllFuncionarios />} />
        <Route path="profile" element={<Profile />} />
      </Routes>
    </div>
  );
};

export default GestorDashboard;
