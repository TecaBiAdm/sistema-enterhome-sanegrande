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
import { createRole, createPermission, associateRolePermission, fetchPermissions, updateRole, updateRolePermission } from './API';

const CreatePositionModal = ({ open, onClose, roleToEdit, refreshRoles }) => {
  const [roleName, setRoleName] = useState("");
  const [permissionName, setPermissionName] = useState("");
  const [permissions, setPermissions] = useState([]);
  const [selectedPermission, setSelectedPermission] = useState("");

  useEffect(() => {
    const getPermissions = async () => {
      const permissionsFromApi = await fetchPermissions();
      setPermissions(permissionsFromApi);
    };

    getPermissions();
  }, []);

  useEffect(() => {
    if (roleToEdit) {
      setRoleName(roleToEdit.name);
      if (roleToEdit.permissions && roleToEdit.permissions.length > 0) {
        setSelectedPermission(roleToEdit.permissions[0].id);
      }
    }
  }, [roleToEdit]);

  const handleCreateOrUpdatePosition = async () => {
    console.log(roleToEdit)
    console.log(selectedPermission)
    try {
      if (roleToEdit) {
        await updateRole(roleToEdit.id, roleName);
        await updateRolePermission(roleToEdit.id, selectedPermission);
      } else {
        const newRole = await createRole(roleName);
        await associateRolePermission(newRole.id, selectedPermission);
      }
      refreshRoles();
      onClose();
    } catch (error) {
      console.error('Erro ao criar ou atualizar cargo:', error);
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
          {roleToEdit ? "Editar Cargo" : "Criar Novo Cargo"}
        </Typography>
        <TextField
          label="Nome do Cargo"
          fullWidth
          margin="normal"
          value={roleName}
          onChange={(e) => setRoleName(e.target.value)}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Permissão</InputLabel>
          <Select
            value={selectedPermission}
            onChange={(e) => setSelectedPermission(e.target.value)}
          >
            {permissions.map(permission => (
              <MenuItem key={permission.id} value={permission.id}>
                {permission.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Box sx={{ mt: 2 }}>
          <Button variant="contained" color="success" onClick={handleCreateOrUpdatePosition}>
            {roleToEdit ? "Atualizar Cargo" : "Criar Cargo"}
          </Button>
          <Button variant="contained" color="error" onClick={onClose} sx={{ ml: 2 }}>
            Cancelar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default CreatePositionModal;
