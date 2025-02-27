import React, { useState, useContext, useEffect } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  IconButton,
  Divider,
  Paper,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import InputMask from 'react-input-mask';
import CloseIcon from "@mui/icons-material/Close";
import BusinessIcon from "@mui/icons-material/Business";
import ContactsIcon from "@mui/icons-material/Contacts";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AuthContext from "@/app/context/AuthContext";
import { useCompany } from "@/app/context/CompanyContext";
import NotificationManager from "@/app/components/NotificationManager/NotificationManager";
import { createSupplier, updateSupplier } from './API';

const SupplierModal = ({ open, onClose, onSave, item }) => {
  const { user } = useContext(AuthContext);
  const { company } = useCompany();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const [formData, setFormData] = useState({
    name: '',
    cnpj: '',
    email: '',
    phone: '',
    contact: '',
    address: {
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
      cep: ''
    }
  });

  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState('empresa');

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || '',
        cnpj: item.cnpj || '',
        email: item.email || '',
        phone: item.phone || '',
        contact: item.contact || '',
        address: {
          street: item.address?.street || '',
          number: item.address?.number || '',
          complement: item.address?.complement || '',
          neighborhood: item.address?.neighborhood || '',
          city: item.address?.city || '',
          state: item.address?.state || '',
          cep: item.address?.cep || ''
        }
      });
    } else {
      setFormData({
        name: '',
        cnpj: '',
        email: '',
        phone: '',
        contact: '',
        address: {
          street: '',
          number: '',
          complement: '',
          neighborhood: '',
          city: '',
          state: '',
          cep: ''
        }
      });
    }
  }, [item]);

  const validateCNPJ = (cnpj) => {
    cnpj = cnpj.replace(/[^\d]/g, '');
    
    if (cnpj.length !== 14) return false;
    
    if (/^(\d)\1{13}$/.test(cnpj)) return false;
    
    let tamanho = cnpj.length - 2;
    let numeros = cnpj.substring(0, tamanho);
    let digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;
    
    for (let i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--;
      if (pos < 2) pos = 9;
    }
    
    let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado !== parseInt(digitos.charAt(0))) return false;
    
    tamanho = tamanho + 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;
    
    for (let i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--;
      if (pos < 2) pos = 9;
    }
    
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    
    return resultado === parseInt(digitos.charAt(1));
  };

  const validatePhone = (phone) => {
    const phoneNumber = phone.replace(/[^\d]/g, '');
    return phoneNumber.length >= 10 && phoneNumber.length <= 11;
  };

  const validateCEP = (cep) => {
    const cepNumber = cep.replace(/[^\d]/g, '');
    return cepNumber.length === 8;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('address.')) {
      const addressField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const searchCEP = async (cep) => {
    if (cep.length === 8) {
      try {
        setLoading(true);
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        
        if (!data.erro) {
          setFormData(prev => ({
            ...prev,
            address: {
              ...prev.address,
              street: data.logradouro,
              neighborhood: data.bairro,
              city: data.localidade,
              state: data.uf,
              cep: cep
            }
          }));
        } else {
          NotificationManager.error('CEP não encontrado');
        }
      } catch (error) {
        NotificationManager.error('Erro ao buscar CEP');
      } finally {
        setLoading(false);
      }
    }
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Validações
      /*if (!formData.name || !formData.cnpj || !formData.email || !formData.phone) {
        NotificationManager.error('Preencha todos os campos obrigatórios');
        return;
      }*/

      /*const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        NotificationManager.error('Email inválido');
        return;
      }

      if (!validateCNPJ(formData.cnpj)) {
        NotificationManager.error('CNPJ inválido');
        return;
      }

      if (!validatePhone(formData.phone)) {
        NotificationManager.error('Telefone inválido');
        return;
      }

      if (!validateCEP(formData.address.cep)) {
        NotificationManager.error('CEP inválido');
        return;
      }*/

      const supplierData = {
        name: formData.name,
        cnpj: formData.cnpj.replace(/[^\d]/g, ''),
        email: formData.email,
        phone: formData.phone.replace(/[^\d]/g, ''),
        contact: formData.contact,
        company: company?.name,
        createdBy: user?.name,
        updateBy: user?.name,
        address: {
          street: formData.address.street,
          number: formData.address.number,
          complement: formData.address.complement || '',
          neighborhood: formData.address.neighborhood,
          city: formData.address.city,
          state: formData.address.state,
          cep: formData.address.cep.replace(/[^\d]/g, '')
        }
      };

      setLoading(true);
      const response = item 
        ? await updateSupplier(supplierData, item._id)
        : await createSupplier(supplierData);

      if (response && response._id) {  // Verifica se a resposta contém o _id do fornecedor
        onSave(response);  // Passa diretamente o objeto do fornecedor
        NotificationManager.success(`Fornecedor ${item ? 'atualizado' : 'criado'} com sucesso`);
        onClose();
      } else {
        throw new Error('Resposta inválida do servidor');
      }
    } catch (error) {
      console.error('Erro completo:', error);
      NotificationManager.error(`Erro ao ${item ? 'atualizar' : 'criar'} fornecedor: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal 
      open={open} 
      onClose={onClose}
      fullScreen={fullScreen}
    >
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: fullScreen ? '100%' : '80%',
        maxWidth: '900px',
        bgcolor: 'background.paper',
        borderRadius: '10px',
        boxShadow: 24,
        overflow: 'hidden',
        maxHeight: '90vh',
      }}>
        <Box sx={{ position: 'relative' }}>
          <Box 
            sx={{ 
              backgroundColor: '#5E899D',
              py: 2, 
              px: 3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Typography variant="h6" component="h2" sx={{ color: 'white', fontWeight: 500 }}>
              {item ? "Editar Fornecedor" : "Novo Fornecedor"}
            </Typography>
            <IconButton 
              onClick={onClose}
              size="small"
              sx={{ color: 'white' }}
              aria-label="fechar"
            >
              <CloseIcon />
            </IconButton>
          </Box>

          <form onSubmit={handleSubmit}>
            <Box sx={{ px: 3, py: 3, overflow: 'auto', maxHeight: 'calc(90vh - 140px)' }}>
              <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
                <Paper
                  elevation={0}
                  sx={{
                    display: 'flex',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    border: '1px solid #e0e0e0',
                  }}
                >
                  <Button
                    onClick={() => setActiveSection('empresa')}
                    sx={{
                      px: 3,
                      py: 1,
                      borderRadius: 0,
                      backgroundColor: activeSection === 'empresa' ? '#5E899D' : 'transparent',
                      color: activeSection === 'empresa' ? 'white' : '#666',
                      '&:hover': {
                        backgroundColor: activeSection === 'empresa' ? '#4A7185' : '#f5f5f5',
                      },
                    }}
                    startIcon={<BusinessIcon />}
                  >
                    Dados da Empresa
                  </Button>
                  <Button
                    onClick={() => setActiveSection('contato')}
                    sx={{
                      px: 3,
                      py: 1,
                      borderRadius: 0,
                      backgroundColor: activeSection === 'contato' ? '#5E899D' : 'transparent',
                      color: activeSection === 'contato' ? 'white' : '#666',
                      '&:hover': {
                        backgroundColor: activeSection === 'contato' ? '#4A7185' : '#f5f5f5',
                      },
                    }}
                    startIcon={<ContactsIcon />}
                  >
                    Contato
                  </Button>
                  <Button
                    onClick={() => setActiveSection('endereco')}
                    sx={{
                      px: 3,
                      py: 1,
                      borderRadius: 0,
                      backgroundColor: activeSection === 'endereco' ? '#5E899D' : 'transparent',
                      color: activeSection === 'endereco' ? 'white' : '#666',
                      '&:hover': {
                        backgroundColor: activeSection === 'endereco' ? '#4A7185' : '#f5f5f5',
                      },
                    }}
                    startIcon={<LocationOnIcon />}
                  >
                    Endereço
                  </Button>
                </Paper>
              </Box>

              {activeSection === 'empresa' && (
                <Box>
                  <Typography variant="subtitle1" component="h3" sx={{ mb: 2, fontWeight: 500, color: '#424242' }}>
                    <BusinessIcon fontSize="small" sx={{ mr: 1, verticalAlign: 'text-bottom', color: '#5E899D' }} />
                    Informações da Empresa
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Nome da Empresa"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        variant="outlined"
                        size="small"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '&.Mui-focused fieldset': {
                              borderColor: '#5E899D',
                            },
                          },
                          '& .MuiInputLabel-root.Mui-focused': {
                            color: '#5E899D',
                          },
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <InputMask
                        mask="99.999.999/9999-99"
                        value={formData.cnpj}
                        onChange={handleChange}
                      >
                        {(inputProps) => (
                          <TextField
                            {...inputProps}
                            fullWidth
                            label="CNPJ"
                            name="cnpj"
                            variant="outlined"
                            size="small"
                            required
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                '&.Mui-focused fieldset': {
                                  borderColor: '#5E899D',
                                },
                              },
                              '& .MuiInputLabel-root.Mui-focused': {
                                color: '#5E899D',
                              },
                            }}
                          />
                        )}
                      </InputMask>
                    </Grid>
                  </Grid>
                </Box>
              )}

              {activeSection === 'contato' && (
                <Box>
                  <Typography variant="subtitle1" component="h3" sx={{ mb: 2, fontWeight: 500, color: '#424242' }}>
                    <ContactsIcon fontSize="small" sx={{ mr: 1, verticalAlign: 'text-bottom', color: '#5E899D' }} />
                    Informações de Contato
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        variant="outlined"
                        size="small"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '&.Mui-focused fieldset': {
                              borderColor: '#5E899D',
                            },
                          },
                          '& .MuiInputLabel-root.Mui-focused': {
                            color: '#5E899D',
                          },
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <InputMask
                        mask={formData.phone.length > 10 ? "(99) 99999-9999" : "(99) 9999-9999"}
                        value={formData.phone}
                        onChange={handleChange}
                      >
                        {(inputProps) => (
                          <TextField
                            {...inputProps}
                            fullWidth
                            label="Telefone"
                            name="phone"
                            variant="outlined"
                            size="small"
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                '&.Mui-focused fieldset': {
                                  borderColor: '#5E899D',
                                },
                              },
                              '& .MuiInputLabel-root.Mui-focused': {
                                color: '#5E899D',
                              },
                            }}
                          />
                        )}
                      </InputMask>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Nome do Responsável"
                        name="contact"
                        value={formData.contact}
                        onChange={handleChange}
                        variant="outlined"
                        size="small"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '&.Mui-focused fieldset': {
                              borderColor: '#5E899D',
                            },
                          },
                          '& .MuiInputLabel-root.Mui-focused': {
                            color: '#5E899D',
                          },
                        }}
                      />
                    </Grid>
                  </Grid>
                </Box>
              )}

              {activeSection === 'endereco' && (
                <Box>
                  <Typography variant="subtitle1" component="h3" sx={{ mb: 2, fontWeight: 500, color: '#424242' }}>
                    <LocationOnIcon fontSize="small" sx={{ mr: 1, verticalAlign: 'text-bottom', color: '#5E899D' }} />
                    Endereço
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                      <InputMask
                        mask="99999-999"
                        value={formData.address.cep}
                        onChange={(e) => {
                          handleChange(e);
                          if (e.target.value.replace(/[^\d]/g, '').length === 8) {
                            searchCEP(e.target.value.replace(/[^\d]/g, ''));
                          }
                        }}
                      >
                        {(inputProps) => (
                          <TextField
                            {...inputProps}
                            fullWidth
                            label="CEP"
                            name="address.cep"
                            variant="outlined"
                            size="small"
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                '&.Mui-focused fieldset': {
                                  borderColor: '#5E899D',
                                },
                              },
                              '& .MuiInputLabel-root.Mui-focused': {
                                color: '#5E899D',
                              },
                            }}
                          />
                        )}
                      </InputMask>
                    </Grid>

                    <Grid item xs={12} md={8}>
                      <TextField
                        fullWidth
                        label="Rua"
                        name="address.street"
                        value={formData.address.street}
                        onChange={handleChange}
                        variant="outlined"
                        size="small"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '&.Mui-focused fieldset': {
                              borderColor: '#5E899D',
                            },
                          },
                          '& .MuiInputLabel-root.Mui-focused': {
                            color: '#5E899D',
                          },
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="Número"
                        name="address.number"
                        value={formData.address.number}
                        onChange={handleChange}
                        variant="outlined"
                        size="small"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '&.Mui-focused fieldset': {
                              borderColor: '#5E899D',
                            },
                          },
                          '& .MuiInputLabel-root.Mui-focused': {
                            color: '#5E899D',
                          },
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} md={8}>
                      <TextField
                        fullWidth
                        label="Complemento"
                        name="address.complement"
                        value={formData.address.complement}
                        onChange={handleChange}
                        variant="outlined"
                        size="small"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '&.Mui-focused fieldset': {
                              borderColor: '#5E899D',
                            },
                          },
                          '& .MuiInputLabel-root.Mui-focused': {
                            color: '#5E899D',
                          },
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="Bairro"
                        name="address.neighborhood"
                        value={formData.address.neighborhood}
                        onChange={handleChange}
                        variant="outlined"
                        size="small"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '&.Mui-focused fieldset': {
                              borderColor: '#5E899D',
                            },
                          },
                          '& .MuiInputLabel-root.Mui-focused': {
                            color: '#5E899D',
                          },
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="Cidade"
                        name="address.city"
                        value={formData.address.city}
                        onChange={handleChange}
                        variant="outlined"
                        size="small"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '&.Mui-focused fieldset': {
                              borderColor: '#5E899D',
                            },
                          },
                          '& .MuiInputLabel-root.Mui-focused': {
                            color: '#5E899D',
                          },
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="Estado"
                        name="address.state"
                        value={formData.address.state}
                        onChange={handleChange}
                        variant="outlined"
                        size="small"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '&.Mui-focused fieldset': {
                              borderColor: '#5E899D',
                            },
                          },
                          '& .MuiInputLabel-root.Mui-focused': {
                            color: '#5E899D',
                          },
                        }}
                      />
                    </Grid>
                  </Grid>
                </Box>
              )}
            </Box>

            <Divider />
            
            <Box sx={{ px: 3, py: 2, display: 'flex', justifyContent: 'space-between' }}>
              <Button 
                onClick={onClose} 
                disabled={loading}
                variant="outlined"
                color="inherit"
                sx={{ 
                  borderColor: '#e0e0e0',
                  color: '#666',
                  '&:hover': {
                    backgroundColor: '#f5f5f5',
                    borderColor: '#bdbdbd'
                  }
                }}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{ 
                  backgroundColor: '#5E899D',
                  '&:hover': {
                    backgroundColor: '#4A7185',
                  },
                  px: 3
                }}
              >
                {loading ? "Salvando..." : item ? "Atualizar" : "Salvar"}
              </Button>
            </Box>
          </form>
        </Box>
      </Box>
    </Modal>
  );
};

export default SupplierModal;