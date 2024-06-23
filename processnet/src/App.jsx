import React from 'react';
import { Box } from '@mui/material';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import FuncionarioDashboard from './pages/FuncionarioDashboard';
import GestorDashboard from './pages/GestorDashboard';
import ProcessDetail from './pages/ProcessDetail';
import Navbar from './components/Navbar';
import theme from './theme';
import { AuthProvider } from './AuthContext';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Navbar />
        <Box sx={{ display: 'flex', mt: '64px' }}>
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              bgcolor: 'background.default',
              p: 3,
            }}
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/user-dashboard/*" element={<UserDashboard />} />
              <Route path="/funcionario-dashboard/*" element={<FuncionarioDashboard />} />
              <Route path="/gestor-dashboard/*" element={<GestorDashboard />} />
              <Route path="/processos/:id" element={<ProcessDetail />} />
            </Routes>
          </Box>
        </Box>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
