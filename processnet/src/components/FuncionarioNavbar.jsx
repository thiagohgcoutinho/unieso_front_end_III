import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Menu, MenuItem, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

function FuncionarioNavbar() {
  const { user, logout } = useAuth();
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
          ProcessNet - {user.cargo}
        </Typography>
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
      </Toolbar>
    </AppBar>
  );
}

export default FuncionarioNavbar;
