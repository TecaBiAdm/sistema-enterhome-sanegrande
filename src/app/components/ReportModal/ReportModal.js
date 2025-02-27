import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Typography,
  IconButton,
} from '@mui/material';
import { X } from 'lucide-react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import ptBR from 'date-fns/locale/pt-BR';

const ReportModal = ({ open, onClose, employee }) => {
  const [reportData, setReportData] = useState({
    startDate: null,
    endDate: null,
    reportType: '',
    description: '',
  });

  const handleChange = (field) => (event) => {
    setReportData({
      ...reportData,
      [field]: event.target.value,
    });
  };

  const handleDateChange = (field) => (date) => {
    setReportData({
      ...reportData,
      [field]: date,
    });
  };

  const handleSubmit = () => {
    // Aqui você pode implementar a lógica para gerar o relatório
    console.log('Dados do relatório:', reportData);
    // Adicione sua lógica de geração de relatório aqui
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Gerar Relatório</Typography>
          <IconButton onClick={onClose}>
            <X />
          </IconButton>
        </div>
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              {employee ? `Funcionário: ${employee.name}` : 'Relatório Geral'}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
              <DatePicker
                label="Data Inicial"
                value={reportData.startDate}
                onChange={handleDateChange('startDate')}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </LocalizationProvider>
          </Grid>

          <Grid item xs={12} md={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
              <DatePicker
                label="Data Final"
                value={reportData.endDate}
                onChange={handleDateChange('endDate')}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </LocalizationProvider>
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Tipo de Relatório</InputLabel>
              <Select
                value={reportData.reportType}
                onChange={handleChange('reportType')}
                label="Tipo de Relatório"
              >
                <MenuItem value="attendance">Registro de Ponto</MenuItem>
                <MenuItem value="performance">Desempenho</MenuItem>
                <MenuItem value="activities">Atividades</MenuItem>
                <MenuItem value="documents">Documentos</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Observações"
              multiline
              rows={4}
              value={reportData.description}
              onChange={handleChange('description')}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          sx={{
            backgroundColor: "#3A8DFF",
            '&:hover': {
              backgroundColor: "#2D7BE4",
            }
          }}
        >
          Gerar Relatório
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReportModal;