import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, Link } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import axios from '../axiosConfig';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../AuthContext';

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
        tipo: user.tipo === 'Usuario' ? 'Usuario' : 'Funcionario',
        cargo: user.cargo || null,
        telefone: user.telefone,
        email: user.email,
        cpf: user.cpf
      };

      login(userData);

      if (user.tipo === 'Funcionario') {
        if (user.cargo === 'Vistoriador' || user.cargo === 'Analista') {
          navigate('/funcionario-dashboard');
        } else if (user.cargo === 'Gestor') {
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
    <Container maxWidth="sm">
      <ToastContainer />
      <Box sx={{ mt: 5 }}>
        <Typography variant="h4" gutterBottom>
          Login
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="CPF"
            variant="outlined"
            fullWidth
            margin="normal"
            value={cpf}
            onChange={handleCpfChange}
          />
          <TextField
            label="Senha"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
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
