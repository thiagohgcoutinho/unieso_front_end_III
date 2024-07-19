import React, { useState } from 'react';
import { Container, Box, Typography, Link, TextField, Button } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import axios from '../axiosConfig';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../AuthContext';
import '../App.css';

function Login() {
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const formatCpf = (value) => {
    return value
      .replace(/\D/g, '') // Remove todos os caracteres não numéricos
      .slice(0, 11) // Limita o número de dígitos a 11
      .replace(/(\d{3})(\d)/, '$1.$2') // Adiciona o primeiro ponto
      .replace(/(\d{3})(\d)/, '$1.$2') // Adiciona o segundo ponto
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2'); // Adiciona o traço
  };

  const handleCpfChange = (e) => {
    const formattedCpf = formatCpf(e.target.value);
    setCpf(formattedCpf);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cpfOnlyDigits = cpf.replace(/\D/g, '');
    try {
      const response = await axios.post('/api/pessoas/authenticate', { cpf: cpfOnlyDigits, senha });
      const user = response.data;

      const userData = {
        idPessoa: user.idPessoa,
        nome: user.nome,
        tipo: user.tipo.charAt(0).toUpperCase() + user.tipo.slice(1).toLowerCase(), // Padronizando o tipo
        cargo: user.cargo ? user.cargo.toUpperCase() : null,
        telefone: user.telefone,
        email: user.email,
        cpf: user.cpf
      };

      login(userData);

      if (userData.tipo === 'Funcionario') {
        if (userData.cargo === 'VISTORIADOR' || userData.cargo === 'ANALISTA') {
          navigate('/funcionario-dashboard');
        } else if (userData.cargo === 'GESTOR') {
          navigate('/gestor-dashboard');
        }
      } else {
        navigate('/user-dashboard');
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          if (window.confirm('CPF não cadastrado. Deseja se cadastrar?')) {
            navigate('/register');
          } else {
            setCpf('');
            setSenha('');
          }
        } else if (error.response.status === 401) {
          toast.error('Senha incorreta. Por favor, tente novamente.');
          setSenha('');
        }
      } else {
        console.error('Erro ao autenticar:', error);
        toast.error('Erro ao autenticar. Verifique seu CPF e senha.');
      }
    }
  };

  return (
    <Container maxWidth="sm" className="login-container">
      <ToastContainer className="toast-container"/>
      <Box className="login-box">
        <img src="/processnet.jpeg" alt="ProcessNet Logo" className="login-logo" />
        <Typography variant="h4" gutterBottom>
          Login
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="CPF"
            variant="filled"
            fullWidth
            margin="normal"
            value={cpf}
            onChange={handleCpfChange}
            InputProps={{
              disableUnderline: true,
              className: 'custom-input'
            }}
          />
          <TextField
            label="Senha"
            type="password"
            variant="filled"
            fullWidth
            margin="normal"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            InputProps={{
              disableUnderline: true,
              className: 'custom-input'
            }}
          />
          <Button type="submit" variant="contained" fullWidth className="custom-button">
            Entrar
          </Button>
        </form>
        <Box sx={{ mt: 2 }}>
          <Link component={RouterLink} to="/register">
            Não possui cadastro? Cadastre-se aqui
          </Link>
        </Box>
      </Box>
    </Container>
  );
}

export default Login;
