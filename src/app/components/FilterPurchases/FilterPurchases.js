import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Stack,
} from '@mui/material';
import { X as CloseIcon } from 'lucide-react';

const FilterPurchases = ({ 
  open, 
  onClose, 
  filters, 
  onFilterChange, 
  onApplyFilters, 
  purchases,
  buttonStyles 
}) => {
  const handleFilterChange = (field) => (event) => {
    if (field === 'reset') {
      onFilterChange({
        materialType: '',
        supplier: '',
        month: '',
        year: ''
      });
      return;
    }
    
    const value = event?.target?.value ?? event;
    onFilterChange({
      ...filters,
      [field]: value
    });
  };

  const years = Array.from(
    { length: 5 },
    (_, i) => new Date().getFullYear() - i
  );

  const months = [
    { value: 1, label: 'Janeiro' },
    { value: 2, label: 'Fevereiro' },
    { value: 3, label: 'Março' },
    { value: 4, label: 'Abril' },
    { value: 5, label: 'Maio' },
    { value: 6, label: 'Junho' },
    { value: 7, label: 'Julho' },
    { value: 8, label: 'Agosto' },
    { value: 9, label: 'Setembro' },
    { value: 10, label: 'Outubro' },
    { value: 11, label: 'Novembro' },
    { value: 12, label: 'Dezembro' }
  ];

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
    >
      <Box sx={{ width: 300, p: 3 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 3 
        }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Filtros Avançados
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Stack spacing={2}>
          <FormControl fullWidth>
            <InputLabel>Ano</InputLabel>
            <Select
              value={filters.year || ''}
              onChange={handleFilterChange('year')}
              label="Ano"
            >
              <MenuItem value="">Todos</MenuItem>
              {years.map(year => (
                <MenuItem key={year} value={year}>{year}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Mês</InputLabel>
            <Select
              value={filters.month || ''}
              onChange={handleFilterChange('month')}
              label="Mês"
            >
              <MenuItem value="">Todos</MenuItem>
              {months.map(month => (
                <MenuItem key={month.value} value={month.value}>
                  {month.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Material</InputLabel>
            <Select
              value={filters.materialType || ''}
              onChange={handleFilterChange('materialType')}
              label="Material"
            >
              <MenuItem value="">Todos</MenuItem>
              {[...new Set(purchases.map(emp => emp.materialType))]
                .filter(Boolean)
                .map(dept => (
                  <MenuItem key={dept} value={dept}>{dept}</MenuItem>
                ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Fornecedor</InputLabel>
            <Select
              value={filters.supplier || ''}
              onChange={handleFilterChange('supplier')}
              label="Fornecedor"
            >
              <MenuItem value="">Todos</MenuItem>
              {[...new Set(purchases.map(emp => emp.supplier.name))]
                .filter(Boolean)
                .map(dept => (
                  <MenuItem key={dept} value={dept}>{dept}</MenuItem>
                ))}
            </Select>
          </FormControl>

          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <Button
              variant="outlined"
              onClick={() => handleFilterChange('reset')()}
            >
              Limpar
            </Button>
            <Button
              fullWidth
              variant="contained"
              onClick={() => {
                onApplyFilters();
                onClose();
              }}
              sx={buttonStyles}
            >
              Aplicar
            </Button>
          </Box>
        </Stack>
      </Box>
    </Drawer>
  );
};

export default FilterPurchases;