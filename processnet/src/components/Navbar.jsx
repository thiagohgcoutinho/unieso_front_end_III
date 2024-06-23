import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Menu, MenuItem, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

function Navbar() {
  const { userType, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="fixed">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          ProcessNet
        </Typography>
        {userType === null ? (
          <Box>
            <Button color="inherit" component={Link} to="/">Home</Button>
            <Button color="inherit" component={Link} to="/login">Login</Button>
          </Box>
        ) : userType === 'usuario' ? (
          <Box>
            <Button color="inherit" onClick={handleMenuOpen}>Processo</Button>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem component={Link} to="/user-dashboard/new-process" onClick={handleMenuClose}>Solicitar Processo</MenuItem>
              <MenuItem component={Link} to="/user-dashboard/view-process" onClick={handleMenuClose}>Acompanhar Processo</MenuItem>
            </Menu>
            <Button color="inherit" component={Link} to="/user-dashboard/profile">Perfil</Button>
            <Button color="inherit" onClick={handleLogout}>Sair</Button>
          </Box>
        ) : userType === 'VISTORIADOR' || userType === 'ANALISTA' ? (
          <Box>
            <Button color="inherit" onClick={handleMenuOpen}>Processo</Button>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem component={Link} to="/select-process" onClick={handleMenuClose}>Selecionar Processo</MenuItem>
              <MenuItem component={Link} to="/check-process" onClick={handleMenuClose}>Verificar Processo</MenuItem>
            </Menu>
            <Button color="inherit" component={Link} to="/profile">Perfil</Button>
            <Button color="inherit" onClick={handleLogout}>Sair</Button>
          </Box>
        ) : userType === 'GESTOR' ? (
          <Box>
            <Button color="inherit" component={Link} to="/all-process">Processos</Button>
            <Button color="inherit" onClick={handleMenuOpen}>Cadastros</Button>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem component={Link} to="/all-usuarios" onClick={handleMenuClose}>Usuários</MenuItem>
              <MenuItem component={Link} to="/all-funcionarios" onClick={handleMenuClose}>Funcionários</MenuItem>
            </Menu>
            <Button color="inherit" component={Link} to="/profile">Perfil</Button>
            <Button color="inherit" onClick={handleLogout}>Sair</Button>
          </Box>
        ) : null}
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
