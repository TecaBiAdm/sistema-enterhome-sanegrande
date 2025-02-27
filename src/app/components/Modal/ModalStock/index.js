import React, { useState, useEffect, useContext } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  IconButton,
  Grid,
} from '@mui/material';
import { IoMdCloseCircleOutline } from 'react-icons/io';
import { useCompany } from '@/app/context/CompanyContext';
import AuthContext from '@/app/context/AuthContext';
import NotificationManager from '../../NotificationManager/NotificationManager';
import { fetchSuppliersByCompany, createEpi, updateEpi, fetchedSuppliersByCompany } from './API';

const StockModal = ({ open, onClose, onSave, item }) => {
  const { company } = useCompany();
  const { user } = useContext(AuthContext);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    epi: '',
    company: company?.name || '',
    size: '',
    quantity: 0,
    pricePerUnit: '',
    supplier: '',
    notes: '',
    totalPrice: 0,
    transactions: []
  });

  useEffect(() => {
    const loadSuppliers = async () => {
      try {
        if (company?.name) {
          const suppliersData = await fetchedSuppliersByCompany(company.name);
          setSuppliers(suppliersData);
        }
      } catch (error) {
        NotificationManager.error('Erro ao carregar fornecedores');
        console.error('Error loading suppliers:', error);
      }
    };
    loadSuppliers();
  }, [company]);

  useEffect(() => {
    if (item) {
      setFormData({
        ...item,
        transactions: item.transactions || []
      });
    }
  }, [item]);

  useEffect(() => {
    const quantity = Number(formData.quantity) || 0;
    const pricePerUnit = Number(formData.pricePerUnit) || 0;
    const total = quantity * pricePerUnit;
    setFormData(prev => ({
      ...prev,
      totalPrice: total.toFixed(2)
    }));
  }, [formData.quantity, formData.pricePerUnit]);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const epiData = {
      epi: formData.epi,
      company: company?.name,
      size: formData.size,
      quantity: Number(formData.quantity),
      pricePerUnit: Number(formData.pricePerUnit),
      supplier: formData.supplier,
      totalPrice: Number(formData.totalPrice),
      notes: formData.notes,
      transactions: [
        ...formData.transactions,
        {
          type: item ? 'entrada' : 'entrada',
          quantity: Number(formData.quantity),
          date: new Date(),
          reason: item ? 'Atualização de estoque' : 'Entrada inicial',
          updatedBy: user.id
        }
      ]
    };

    setLoading(true);

    try {
      let response;
      if (item?.length > 0) {
        response = await updateEpi(epiData, item._id);
      } else {
        response = await createEpi(epiData);
      }

      if (response) {
        onSave(response);
        NotificationManager.success(
          `EPI ${item ? "atualizado" : "adicionado"} com sucesso`
        );
        handleClose();
      }
    } catch (error) {
      console.error("Erro na operação:", error);
      NotificationManager.error(
        `Erro ao ${item ? "atualizar" : "adicionar"} o EPI: ${
          error.message || "Erro desconhecido"
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      epi: '',
      company: company?.name || '',
      size: '',
      quantity: 0,
      pricePerUnit: '',
      supplier: '',
      notes: '',
      totalPrice: 0,
      transactions: []
    });
    onClose();
  };

  const getSizeOptions = () => {
    switch (formData.epi) {
      case 'Botinas':
        return Array.from({ length: 15 }, (_, i) => i + 34).map(num => num.toString());
      case 'Uniforme':
        return ['PP', 'P', 'M', 'G', 'GG', 'XG', 'XXG'];
      default:
        return [];
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '80%',
          maxWidth: '800px',
          bgcolor: 'background.paper',
          borderRadius: '5px',
          boxShadow: 24,
          p: 4,
          maxHeight: '90vh',
          overflow: 'auto',
        }}
      >
        <IconButton
          onClick={handleClose}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
          }}
        >
          <IoMdCloseCircleOutline />
        </IconButton>

        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
          {item?.length > 0 ? 'Editar EPI' : 'Adicionar EPI'}
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal" size="small" required>
                <InputLabel>EPI</InputLabel>
                <Select
                  value={formData.epi}
                  onChange={(e) => handleChange('epi', e.target.value)}
                  label="EPI"
                >
                  <MenuItem value="Botinas">Botinas</MenuItem>
                  <MenuItem value="Uniforme">Uniforme</MenuItem>
                  <MenuItem value="Protetor Solar">Protetor Solar</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {(formData.epi === 'Botinas' || formData.epi === 'Uniforme') && (
              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="normal" size="small" required>
                  <InputLabel>
                    {formData.epi === 'Botinas' ? 'Numeração' : 'Tamanho'}
                  </InputLabel>
                  <Select
                    value={formData.size}
                    onChange={(e) => handleChange('size', e.target.value)}
                    label={formData.epi === 'Botinas' ? 'Numeração' : 'Tamanho'}
                  >
                    {getSizeOptions().map((size) => (
                      <MenuItem key={size} value={size}>
                        {size}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}

            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal" size="small" required>
                <InputLabel>Fornecedor</InputLabel>
                <Select
                  value={formData.supplier}
                  onChange={(e) => handleChange('supplier', e.target.value)}
                  label="Fornecedor"
                >
                  {suppliers.map((sup) => (
                    <MenuItem key={sup._id} value={sup._id}>
                      {sup.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Quantidade"
                type="number"
                value={formData.quantity}
                onChange={(e) => handleChange('quantity', e.target.value)}
                margin="normal"
                size="small"
                required
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Preço Unitário"
                type="number"
                value={formData.pricePerUnit}
                onChange={(e) => handleChange('pricePerUnit', e.target.value)}
                margin="normal"
                size="small"
                required
                InputProps={{ 
                  inputProps: { min: 0, step: "0.01" },
                  startAdornment: 'R$ '
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Total"
                type="number"
                value={formData.totalPrice}
                margin="normal"
                size="small"
                required
                disabled
                InputProps={{ 
                  inputProps: { min: 0, step: "0.01" },
                  startAdornment: 'R$ '
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Observações"
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                margin="normal"
                size="small"
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              onClick={handleClose}
              variant="outlined"
              disabled={loading}
              sx={{
                borderColor: '#3A8DFF',
                color: '#3A8DFF',
                '&:hover': {
                  borderColor: '#3A8DFF',
                }
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="contained"
              type="submit"
              disabled={loading}
              sx={{
                backgroundColor: '#3A8DFF',
                '&:hover': { backgroundColor: '#3A8DFF' }
              }}
            >
              {loading ? 'Salvando...' : item?.length > 0? 'Atualizar' : 'Adicionar'}
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default StockModal;