import React from 'react';
import { Typography, Box, Container } from '@mui/material';
import { Routes, Route } from 'react-router-dom';
import SelectProcess from './SelectProcess';
import CheckProcess from './CheckProcess';
import Profile from './Profile';
import { useAuth } from '../AuthContext';
import '../App.css'; // Certifique-se de que o App.css contém os estilos globais e específicos

const FuncionarioDashboard = () => {
  const { user } = useAuth();

  return (
    <Container className="dashboard-container">
      <Box className="dashboard-content" sx={{ mt: 5 }}>
        <Typography variant="h4" component="h1" gutterBottom className="dashboard-welcome">
          Seja bem-vindo, {user?.nome}!
        </Typography>
        <Typography variant="body1" gutterBottom className="dashboard-text">
          O ProcessNet é um sistema avançado de gerenciamento de processos, projetado para facilitar e otimizar a gestão de processos dentro da sua organização. Aqui você pode selecionar e verificar processos, além de atualizar suas informações pessoais.
        </Typography>
        <Routes>
          <Route path="select-process" element={<SelectProcess />} />
          <Route path="check-process" element={<CheckProcess />} />
          <Route path="profile" element={<Profile />} />
        </Routes>
      </Box>
    </Container>
  );
};

export default FuncionarioDashboard;
