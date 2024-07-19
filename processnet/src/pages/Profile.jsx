import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Modal } from '@mui/material';
import { useAuth } from '../AuthContext';
import axios from '../axiosConfig';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../App.css';

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
      const cleanedTelefone = editedUser.telefone.replace(/\D/g, '');
      const userData = {
        nome: editedUser.nome,
        cpf: editedUser.cpf,
        email: editedUser.email,
        senha: editedUser.senha,
        telefone: cleanedTelefone,
        tipo: editedUser.tipo,
      };

      const response = await axios.put(`/api/pessoas/update/${user.idPessoa}`, userData);
      login(response.data);
      toast.success('Perfil atualizado com sucesso!');
      setIsEditMode(false);
    } catch (error) {
      console.error('Erro ao atualizar pessoa:', error);
      toast.error('Erro ao atualizar perfil. Tente novamente.');
    }
  };

  return (
    <Box className="profile-container">
      <ToastContainer className="toast-container" />
      <Box className="profile-box">
        <Typography variant="h4" component="h1" gutterBottom>
          Meus Dados
        </Typography>
        <Box className="profile-content">
          <Typography variant="body1"><strong>CPF:</strong> {user?.cpf}</Typography>
          <Typography variant="body1"><strong>Nome:</strong> {user?.nome}</Typography>
          <Typography variant="body1"><strong>Telefone:</strong> {user?.telefone}</Typography>
          <Typography variant="body1"><strong>E-mail:</strong> {user?.email}</Typography>
          <Typography variant="body1"><strong>Tipo:</strong> {user?.tipo}</Typography>
          {user?.tipo === 'Funcionario' && (
            <Typography variant="body1"><strong>Cargo:</strong> {user?.cargo}</Typography>
          )}
        </Box>
        <Button variant="contained" color="primary" onClick={handleEditClick} className="profile-edit-button">
          Editar
        </Button>
      </Box>
      <Modal open={isEditMode} onClose={handleClose}>
        <Box className="modal-box">
          <Typography variant="h6" component="h2" gutterBottom>
            Editar Cadastro
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
            <Typography variant="body1" sx={{ mr: 2 }}><strong>Nome:</strong></Typography>
            <TextField
              value={editedUser.nome}
              fullWidth
              margin="normal"
              onChange={(e) => setEditedUser({ ...editedUser, nome: e.target.value })}
              variant="filled"
              InputProps={{ disableUnderline: true, className: 'custom-input' }}
              sx={{ flex: 1 }}
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
            <Typography variant="body1" sx={{ mr: 2 }}><strong>Telefone:</strong></Typography>
            <TextField
              value={editedUser.telefone}
              fullWidth
              margin="normal"
              onChange={(e) => setEditedUser({ ...editedUser, telefone: e.target.value })}
              variant="filled"
              InputProps={{ disableUnderline: true, className: 'custom-input' }}
              sx={{ flex: 1 }}
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
            <Typography variant="body1" sx={{ mr: 2 }}><strong>E-mail:</strong></Typography>
            <TextField
              value={editedUser.email}
              fullWidth
              margin="normal"
              onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
              variant="filled"
              InputProps={{ disableUnderline: true, className: 'custom-input' }}
              sx={{ flex: 1 }}
            />
          </Box>
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
