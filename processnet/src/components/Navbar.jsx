import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Menu, MenuItem, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const [userType, setUserType] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const type = localStorage.getItem('userType');
    setUserType(type);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userType');
    localStorage.removeItem('userCargo');
    setUserType(null);
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
        {userType === 'usuario' ? (
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
        ) : (
          <Box>
            <Button color="inherit" component={Link} to="/">Home</Button>
            <Button color="inherit" component={Link} to="/login">Login</Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
