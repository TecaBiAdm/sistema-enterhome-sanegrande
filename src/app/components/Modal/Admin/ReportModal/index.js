import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
} from "@mui/material";

const ReportModal = ({ open, onClose }) => {
  const handleGenerateReport = () => {
    console.log("Relatório gerado");
    onClose();
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
          borderRadius: "5px",
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Gerar Relatório
        </Typography>
        <Typography variant="body1" gutterBottom>
          Tem certeza de que deseja gerar o relatório?
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Button variant="contained" color="success" onClick={handleGenerateReport}>
            Gerar Relatório
          </Button>
          <Button variant="contained" color="error" onClick={onClose} sx={{ ml: 2 }}>
            Cancelar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ReportModal;
