import React from 'react';
import { Typography, Box, Container } from '@mui/material';
import { Routes, Route } from 'react-router-dom';
import AllProcess from './AllProcess';
import AllUsuarios from './AllUsuarios';
import AllFuncionarios from './AllFuncionarios';
import Profile from './Profile';
import { useAuth } from '../AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../App.css'; // Certifique-se de que o App.css contém os estilos globais e específicos

const GestorDashboard = () => {
  const { user } = useAuth();

  return (
    <Container className="dashboard-container">
      <ToastContainer className="toast-container" />
      <Box className="dashboard-content" sx={{ mt: 5 }}>
        <Typography variant="h4" component="h1" gutterBottom className="dashboard-welcome">
          Seja bem-vindo, {user?.nome}!
        </Typography>
        <Typography variant="body1" gutterBottom className="dashboard-text">
          O ProcessNet é um sistema avançado de gerenciamento de processos, projetado para facilitar e otimizar a gestão de processos dentro da sua organização. Aqui você pode visualizar todos os processos, gerenciar usuários e funcionários, e atualizar suas informações pessoais.
        </Typography>
        <Routes>
          <Route path="all-process" element={<AllProcess />} />
          <Route path="all-usuarios" element={<AllUsuarios />} />
          <Route path="all-funcionarios" element={<AllFuncionarios />} />
          <Route path="profile" element={<Profile />} />
        </Routes>
      </Box>
    </Container>
  );
};

export default GestorDashboard;
