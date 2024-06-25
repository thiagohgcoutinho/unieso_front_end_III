import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Modal } from '@mui/material';
import { useAuth } from '../AuthContext';
import axios from '../axiosConfig';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Profile = () => {
  const { user, login } = useAuth();
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedUser, setEditedUser] = useState({ ...user });

  useEffect(() => {
    setEditedUser({ ...user });
  }, [user]);

  const handleEditClick = () => {
    setIsEditMode(true);
  };

  const handleClose = () => {
    setIsEditMode(false);
    setEditedUser({ ...user });
  };

  const handleSave = async () => {
    try {
      const cleanedTelefone = editedUser.telefone.replace(/\D/g, ''); // Remove todos os caracteres não numéricos
      const userData = {
        nome: editedUser.nome,
        cpf: editedUser.cpf,
        email: editedUser.email,
        senha: editedUser.senha,
        telefone: cleanedTelefone,
        tipo: editedUser.tipo // Incluindo o tipo no JSON
      };

      const response = await axios.put(`/api/pessoas/update/${user.idPessoa}`, userData);
      login(response.data); // Atualiza o usuário no contexto de autenticação
      toast.success('Perfil atualizado com sucesso!');
      setIsEditMode(false);
    } catch (error) {
      console.error('Erro ao atualizar pessoa:', error);
      toast.error('Erro ao atualizar perfil. Tente novamente.');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <ToastContainer />
      <Typography variant="h4" component="h1" gutterBottom>
        Meu cadastro
      </Typography>
      <Box sx={{ mt: 2 }}>
        <Typography variant="body1"><strong>CPF:</strong> {user?.cpf}</Typography>
        <Typography variant="body1"><strong>Nome:</strong> {user?.nome}</Typography>
        <Typography variant="body1"><strong>Telefone:</strong> {user?.telefone}</Typography>
        <Typography variant="body1"><strong>E-mail:</strong> {user?.email}</Typography>
        <Typography variant="body1"><strong>Tipo:</strong> {user?.tipo}</Typography>
        {user?.tipo === 'Funcionario' && (
          <Typography variant="body1"><strong>Cargo:</strong> {user?.cargo}</Typography>
        )}
      </Box>
      <Box sx={{ mt: 2 }}>
        <Button variant="contained" color="primary" onClick={handleEditClick}>
          Editar
        </Button>
      </Box>
      
      <Modal open={isEditMode} onClose={handleClose}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
          <Typography variant="h6" component="h2" gutterBottom>
            Editar Cadastro
          </Typography>
          <TextField
            label="Nome"
            value={editedUser.nome}
            fullWidth
            margin="normal"
            onChange={(e) => setEditedUser({ ...editedUser, nome: e.target.value })}
          />
          <TextField
            label="Telefone"
            value={editedUser.telefone}
            fullWidth
            margin="normal"
            onChange={(e) => setEditedUser({ ...editedUser, telefone: e.target.value })}
          />
          <TextField
            label="E-mail"
            value={editedUser.email}
            fullWidth
            margin="normal"
            onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            <Button onClick={handleClose} sx={{ mr: 2 }}>
              Cancelar
            </Button>
            <Button onClick={handleSave} variant="contained" color="primary">
              Salvar
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default Profile;
