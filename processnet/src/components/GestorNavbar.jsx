import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Menu, MenuItem, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

function GestorNavbar() {
  const { logout } = useAuth();
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
          ProcessNet - Gestor
        </Typography>
        <Box>
          <Button color="inherit" component={Link} to="/gestor-dashboard/all-process">Processos</Button>
          <Button color="inherit" onClick={handleMenuOpen}>Cadastros</Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem component={Link} to="/gestor-dashboard/all-usuarios" onClick={handleMenuClose}>Usuários</MenuItem>
            <MenuItem component={Link} to="/gestor-dashboard/all-funcionarios" onClick={handleMenuClose}>Funcionários</MenuItem>
          </Menu>
          <Button color="inherit" component={Link} to="/gestor-dashboard/profile">Perfil</Button>
          <Button color="inherit" onClick={handleLogout}>Sair</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default GestorNavbar;
