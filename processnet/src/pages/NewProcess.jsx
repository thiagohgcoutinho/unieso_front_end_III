import React, { useState } from 'react';
import { Box, Typography, TextField, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from '../axiosConfig';
import { useAuth } from '../AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const formatCNPJ = (value) => {
  return value
    .replace(/\D/g, '') // Remove todos os caracteres não numéricos
    .slice(0, 14) // Limita o número de dígitos a 14
    .replace(/(\d{2})(\d)/, '$1.$2') // Adiciona o primeiro ponto
    .replace(/(\d{3})(\d)/, '$1.$2') // Adiciona o segundo ponto
    .replace(/(\d{3})(\d{4})(\d)/, '$1/$2-$3'); // Adiciona a barra e o traço
};

const NewProcess = () => {
  const [tipoProcesso, setTipoProcesso] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [endereco, setEndereco] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const novoProcesso = {
      tipoProcesso: tipoProcesso,
      cnpj: cnpj.replace(/\D/g, ''), // Remove a formatação do CNPJ
      endereco,
      responsavel: {
        idPessoa: user?.idPessoa // Certifique-se de que o ID do usuário está sendo passado
      }
    };

    console.log('Novo Processo:', JSON.stringify(novoProcesso, null, 2));

    try {
      const response = await axios.post('/api/processos', novoProcesso);
      console.log('Processo criado:', response.data);
      toast.success('Processo criado com sucesso!');
      setTimeout(() => {
        navigate('/user-dashboard'); // Redireciona para UserDashboard após 3 segundos
      }, 3000);
    } catch (error) {
      console.error('Erro ao criar processo:', error.response?.data || error.message);
      toast.error(`Erro ao criar processo: ${error.response?.data || error.message}. Por favor, tente novamente.`);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <ToastContainer />
      <Typography variant="h4" component="h1" gutterBottom>
        Solicitar novo processo
      </Typography>
      <form onSubmit={handleSubmit}>
        <FormControl component="fieldset" sx={{ mb: 3 }}>
          <FormLabel component="legend">Tipo de Processo</FormLabel>
          <RadioGroup
            name="tipoProcesso"
            value={tipoProcesso}
            onChange={(e) => setTipoProcesso(e.target.value)}
          >
            <FormControlLabel value="VISTORIA" control={<Radio />} label="Vistoria Técnica" />
            <FormControlLabel value="ANALISE" control={<Radio />} label="Análise de Projeto" />
          </RadioGroup>
        </FormControl>
        <TextField
          label="CNPJ"
          variant="outlined"
          fullWidth
          margin="normal"
          value={cnpj}
          onChange={(e) => setCnpj(formatCNPJ(e.target.value))}
        />
        <TextField
          label="Endereço"
          variant="outlined"
          fullWidth
          margin="normal"
          value={endereco}
          onChange={(e) => setEndereco(e.target.value)}
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Enviar
        </Button>
      </form>
    </Box>
  );
};

export default NewProcess;
