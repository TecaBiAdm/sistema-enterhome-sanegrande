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

const FilterDrawer = ({ 
  open, 
  onClose, 
  filters, 
  onFilterChange, 
  onApplyFilters, 
  employees,
  buttonStyles 
}) => {
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
            <InputLabel>Departamento</InputLabel>
            <Select
              value={filters.department}
              onChange={(e) => onFilterChange('department')(e)}
              label="Departamento"
            >
              <MenuItem value="">Todos</MenuItem>
              {[...new Set(employees.map(emp => emp.department))]
                .filter(Boolean)
                .map(dept => (
                  <MenuItem key={dept} value={dept}>{dept}</MenuItem>
                ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={filters.status}
              onChange={(e) => onFilterChange('status')(e)}
              label="Status"
            >
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value="Ativo">Ativo</MenuItem>
              <MenuItem value="Inativo">Inativo</MenuItem>
              <MenuItem value="Afastado">Afastado</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Regional</InputLabel>
            <Select
              value={filters.regional}
              onChange={(e) => onFilterChange('regional')(e)}
              label="Regional"
            >
              <MenuItem value="">Todas</MenuItem>
              {[...new Set(employees.map(emp => emp.codigoRegional?.name))]
                .filter(Boolean)
                .map(regional => (
                  <MenuItem key={regional} value={regional}>{regional}</MenuItem>
                ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Município</InputLabel>
            <Select
              value={filters.municipality}
              onChange={(e) => onFilterChange('municipality')(e)}
              label="Município"
            >
              <MenuItem value="">Todos</MenuItem>
              {[...new Set(employees.map(emp => emp.codigoMunicipio?.name))]
                .filter(Boolean)
                .map(municipality => (
                  <MenuItem key={municipality} value={municipality}>{municipality}</MenuItem>
                ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Equipe</InputLabel>
            <Select
              value={filters.team}
              onChange={(e) => onFilterChange('team')(e)}
              label="Equipe"
            >
              <MenuItem value="">Todas</MenuItem>
              {[...new Set(employees.map(emp => emp.codigoEquipe))]
                .filter(Boolean)
                .map(team => (
                  <MenuItem key={team} value={team}>{team}</MenuItem>
                ))}
            </Select>
          </FormControl>

          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => {
                onFilterChange('reset')();
                onClose();
              }}
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

export default FilterDrawer;