import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField
} from '@mui/material';

const EpiFilterDrawer = ({
  open,
  onClose,
  filters,
  onFilterChange,
  onApplyFilters,
  requests,
  buttonStyles
}) => {
  // Extrair valores únicos dos pedidos
  const getDepartments = () => {
    if (!requests) return [];
    return [...new Set(requests.map(req => req.employee?.department))]
      .filter(Boolean)
      .sort();
  };

  const getRegionals = () => {
    if (!requests) return [];
    return [...new Set(requests.map(req => req.regional?.name))]
      .filter(Boolean)
      .sort();
  };

  const statusOptions = [
    "Pendente",
    "Aprovado",
    "Entregue",
    "Rejeitado"
  ];

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { width: "400px", p: 3 }
      }}
    >
      <Box sx={{ width: '100%' }}>
        <Typography variant="h6" sx={{ mb: 3 }}>
          Filtros
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={filters.status}
              label="Status"
              onChange={onFilterChange('status')}
            >
              <MenuItem value="">Todos</MenuItem>
              {statusOptions.map(status => (
                <MenuItem key={status} value={status}>{status}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Departamento</InputLabel>
            <Select
              value={filters.department}
              label="Departamento"
              onChange={onFilterChange('department')}
            >
              <MenuItem value="">Todos</MenuItem>
              {getDepartments().map(dept => (
                <MenuItem key={dept} value={dept}>{dept}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Regional</InputLabel>
            <Select
              value={filters.regional}
              label="Regional"
              onChange={onFilterChange('regional')}
            >
              <MenuItem value="">Todas</MenuItem>
              {getRegionals().map(regional => (
                <MenuItem key={regional} value={regional}>{regional}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Data Inicial"
            type="date"
            value={filters.startDate}
            onChange={onFilterChange('startDate')}
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            fullWidth
            label="Data Final"
            type="date"
            value={filters.endDate}
            onChange={onFilterChange('endDate')}
            InputLabelProps={{ shrink: true }}
          />
        </Box>

        <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
          <Button
            fullWidth
            variant="contained"
            sx={buttonStyles}
            onClick={() => {
              onApplyFilters();
              onClose();
            }}
          >
            Aplicar Filtros
          </Button>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => onFilterChange('reset')()}
          >
            Limpar Filtros
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default EpiFilterDrawer;