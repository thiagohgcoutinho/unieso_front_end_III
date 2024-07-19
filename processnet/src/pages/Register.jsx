import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, FormControl, InputLabel, Select, MenuItem, FormHelperText, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios from '../axiosConfig';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../App.css'; // Certifique-se de que o App.css contém os estilos globais e específicos

const CARGOS = ['VISTORIADOR', 'ANALISTA', 'GESTOR'];

function Register() {
  const [perfil, setPerfil] = useState('usuario');
  const [cpf, setCpf] = useState('');
  const [cpfMessage, setCpfMessage] = useState('');
  const [cpfMessageColor, setCpfMessageColor] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmSenha, setConfirmSenha] = useState('');
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cargo, setCargo] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const formatCpf = (value) => {
    return value
      .replace(/\D/g, '') // Remove todos os caracteres não numéricos
      .slice(0, 11) // Limita o número de dígitos a 11
      .replace(/(\d{3})(\d)/, '$1.$2') // Adiciona o primeiro ponto
      .replace(/(\d{3})(\d)/, '$1.$2') // Adiciona o segundo ponto
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2'); // Adiciona o traço
  };

  const formatPhone = (value) => {
    return value
      .replace(/\D/g, '') // Remove todos os caracteres não numéricos
      .slice(0, 11) // Limita o número de dígitos a 11
      .replace(/(\d{2})(\d)/, '($1) $2') // Adiciona os parênteses
      .replace(/(\d{5})(\d)/, '$1-$2') // Adiciona o traço
      .replace(/(-\d{4})\d+?$/, '$1'); // Limita o número de dígitos
  };

  const handleCpfChange = (e) => {
    const formattedCpf = formatCpf(e.target.value);
    setCpf(formattedCpf);
    setCpfMessage('');
  };

  const handleTelefoneChange = (e) => {
    const formattedPhone = formatPhone(e.target.value);
    setTelefone(formattedPhone);
  };

  const handleCpfBlur = async () => {
    const cpfOnlyDigits = cpf.replace(/\D/g, '');
    if (cpfOnlyDigits.length === 11) {
      try {
        const response = await axios.get(`/api/pessoas/verificar-cpf?cpf=${cpfOnlyDigits}`);
        if (response.status === 200) {
          setCpfMessage('Este CPF já está cadastrado.');
          setCpfMessageColor('red');
        } else if (response.status === 404) {
          setCpfMessage('Este CPF pode ser cadastrado.');
          setCpfMessageColor('green');
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setCpfMessage('Este CPF pode ser cadastrado.');
          setCpfMessageColor('green');
        } else {
          setCpfMessage('Erro ao verificar CPF.');
          setCpfMessageColor('red');
        }
      }
    } else {
      setCpfMessage('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (senha !== confirmSenha) {
      alert('As senhas não coincidem.');
      return;
    }
    try {
      const data = { 
        cpf: cpf.replace(/\D/g, ''), 
        senha, 
        nome, 
        email, 
        telefone: telefone.replace(/\D/g, ''),
        tipo: perfil === 'usuario' ? 'Usuario' : 'Funcionario' // Inclui a propriedade tipo
      };
      if (perfil === 'funcionario') {
        data.cargo = cargo;
      }
      await axios.post(`/api/${perfil}s`, data);
      setCpf('');
      setSenha('');
      setConfirmSenha('');
      setNome('');
      setEmail('');
      setTelefone('');
      setCargo('');
      toast.success('Cadastro realizado com sucesso!', {
        onClose: () => navigate('/login')
      });
    } catch (error) {
      if (error.response && error.response.data) {
        console.error('Erro ao registrar:', error.response.data); 
        alert(`Erro ao registrar: ${error.response.data.message}`);
      } else {
        console.error('Erro ao registrar:', error); 
        alert('Erro ao registrar. Tente novamente mais tarde.');
      }
    }
  };

  const formatCargo = (cargo) => {
    return cargo.charAt(0) + cargo.slice(1).toLowerCase();
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <Container maxWidth="sm" className="register-container">
      <ToastContainer className="toast-container"/>
      <Box className="register-box">
        <Typography variant="h4" gutterBottom>
          Cadastro
        </Typography>
        <form onSubmit={handleSubmit}>
          <FormControl fullWidth margin="normal">
            <InputLabel id="perfil-label">Perfil</InputLabel>
            <Select
              labelId="perfil-label"
              id="perfil"
              value={perfil}
              label="Perfil"
              onChange={(e) => setPerfil(e.target.value)}
            >
              <MenuItem value="usuario">Usuário</MenuItem>
              <MenuItem value="funcionario">Funcionário</MenuItem>
            </Select>
          </FormControl>
          {perfil === 'funcionario' && (
            <FormControl fullWidth margin="normal">
              <InputLabel id="cargo-label">Cargo</InputLabel>
              <Select
                labelId="cargo-label"
                id="cargo"
                value={cargo}
                label="Cargo"
                onChange={(e) => setCargo(e.target.value)}
              >
                {CARGOS.map((c) => (
                  <MenuItem key={c} value={c}>
                    {formatCargo(c)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          <TextField
            label="CPF"
            variant="filled"
            fullWidth
            margin="normal"
            value={cpf}
            onChange={handleCpfChange}
            onBlur={handleCpfBlur}
            InputProps={{
              disableUnderline: true,
              className: 'custom-input'
            }}
          />
          {cpfMessage && (
            <FormHelperText style={{ color: cpfMessageColor }}>{cpfMessage}</FormHelperText>
          )}
          <TextField
            label="Nome"
            variant="filled"
            fullWidth
            margin="normal"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            InputProps={{
              disableUnderline: true,
              className: 'custom-input'
            }}
          />
          <TextField
            label="Email"
            variant="filled"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              disableUnderline: true,
              className: 'custom-input'
            }}
          />
          <TextField
            label="Telefone"
            variant="filled"
            fullWidth
            margin="normal"
            value={telefone}
            onChange={handleTelefoneChange}
            InputProps={{
              disableUnderline: true,
              className: 'custom-input'
            }}
          />
          <TextField
            label="Senha"
            type={showPassword ? 'text' : 'password'}
            variant="filled"
            fullWidth
            margin="normal"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            InputProps={{
              disableUnderline: true,
              className: 'custom-input',
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleClickShowPassword} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          <TextField
            label="Confirme a Senha"
            type={showConfirmPassword ? 'text' : 'password'}
            variant="filled"
            fullWidth
            margin="normal"
            value={confirmSenha}
            onChange={(e) => setConfirmSenha(e.target.value)}
            InputProps={{
              disableUnderline: true,
              className: 'custom-input',
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleClickShowConfirmPassword} edge="end">
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          <Button type="submit" variant="contained" fullWidth className="custom-button">
            Cadastrar
          </Button>
        </form>
      </Box>
    </Container>
  );
}

export default Register;
