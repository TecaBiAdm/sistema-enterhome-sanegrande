import React, { useEffect, useState } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@mui/material";
import { createUser, updateUser, fetchRoles } from './API';

const CreateUserModal = ({ open, onClose, userToEdit, refreshUsers }) => {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [roleId, setRoleId] = useState("");
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const fetchRolesData = async () => {
      try {
        const rolesData = await fetchRoles();
        console.log(rolesData)
        setRoles(rolesData);
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchRolesData();

    if (userToEdit) {
      setUserName(userToEdit.name);
      setUserEmail(userToEdit.email);
      setRoleId(userToEdit.roleId);
    }
  }, [userToEdit]);

  const handleCreateUser = async () => {
    try {
      if (userToEdit) {
        await updateUser(userToEdit.id, {
          name: userName,
          email: userEmail,
          password: userPassword,
          roleId: roleId
        });
      } else {
        await createUser({
          name: userName,
          email: userEmail,
          password: userPassword,
          roleId: roleId
        });
      }
      refreshUsers();
      onClose();
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          borderRadius: '5px',
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h6" gutterBottom sx={{borderBottom: '2px solid black'}}>
          {userToEdit ? "Editar Usuário" : "Criar Novo Usuário"}
        </Typography>
        <TextField
          label="Nome do usuário"
          fullWidth
          margin="normal"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Cargo</InputLabel>
          <Select
            value={roleId}
            onChange={(e) => setRoleId(e.target.value)}
          >
            {roles.map((role) => (
              <MenuItem key={role.id} value={role.id}>{role.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="E-mail"
          fullWidth
          margin="normal"
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
        />
        <TextField
          label="Senha"
          type="password"
          fullWidth
          margin="normal"
          value={userPassword}
          onChange={(e) => setUserPassword(e.target.value)}
        />
    
        <Box sx={{ mt: 2 }}>
          <Button variant="contained" color="success" onClick={handleCreateUser}>
            {userToEdit ? "Salvar Alterações" : "Criar usuário"}
          </Button>
          <Button variant="contained" color="error" onClick={onClose} sx={{ ml: 2 }}>
            Cancelar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default CreateUserModal;
