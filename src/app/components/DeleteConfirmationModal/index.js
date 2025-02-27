import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box
} from '@mui/material';

const DeleteConfirmationModal = ({ open, onClose, onConfirm, employeeName }) => {
  const [confirmationText, setConfirmationText] = useState('');
  
  const handleSubmit = () => {
    if (confirmationText === employeeName) {
      onConfirm();
      onClose();
      setConfirmationText('');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ color: 'error.main' }}>Excluir Funcionário</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Essa ação não pode ser desfeita. Isso irá excluir permanentemente o funcionário <strong>{employeeName}</strong>.
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Digite <strong>{employeeName}</strong> para confirmar.
          </Typography>
          <TextField
            fullWidth
            value={confirmationText}
            onChange={(e) => setConfirmationText(e.target.value)}
            error={confirmationText !== '' && confirmationText !== employeeName}
            helperText={confirmationText !== '' && confirmationText !== employeeName ? 'Nome não corresponde' : ''}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          variant="contained"
          color="error"
          disabled={confirmationText !== employeeName}
          onClick={handleSubmit}
        >
          Confirmar Exclusão
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmationModal;