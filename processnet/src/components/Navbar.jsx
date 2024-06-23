import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Menu, MenuItem, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const formatCargo = (cargo) => {
  return cargo.charAt(0) + cargo.slice(1).toLowerCase();
};

function Navbar() {
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('User:', user);
  }, [user]);

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
          ProcessNet {user && ` - ${user.name} - ${user.type.includes('Funcionário') ? `Funcionário (${formatCargo(user.cargo)})` : user.type}`}
        </Typography>
        {!user ? (
          <Box>
            <Button color="inherit" component={Link} to="/">Home</Button>
            <Button color="inherit" component={Link} to="/login">Login</Button>
          </Box>
        ) : user.type === 'Usuário' ? (
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
        ) : (user.cargo === 'VISTORIADOR' || user.cargo === 'ANALISTA') ? (
          <Box>
            <Button color="inherit" onClick={handleMenuOpen}>Processo</Button>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem component={Link} to="/funcionario-dashboard/select-process" onClick={handleMenuClose}>Selecionar Processo</MenuItem>
              <MenuItem component={Link} to="/funcionario-dashboard/check-process" onClick={handleMenuClose}>Verificar Processo</MenuItem>
            </Menu>
            <Button color="inherit" component={Link} to="/funcionario-dashboard/profile">Perfil</Button>
            <Button color="inherit" onClick={handleLogout}>Sair</Button>
          </Box>
        ) : user.cargo === 'GESTOR' ? (
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
        ) : null}
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
