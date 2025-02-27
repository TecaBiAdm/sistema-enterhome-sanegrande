import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
  Divider,
  IconButton,
  Paper,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import NetworkWifiIcon from "@mui/icons-material/NetworkWifi";
import BuildIcon from "@mui/icons-material/Build";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import ptBR from "date-fns/locale/pt-BR";
import toast from "react-hot-toast";
import {
  fetchedEmployeesByCompany,
  fetchLocals,
  fetchMunicipios,
  fetchRegionals,
  createCollector,
  updateCollector,
} from "./API";
import { useCompany } from "@/app/context/CompanyContext";

const initialFormState = {
  mei: "",
  mac: "",
  employee: "",
  registration: "",
  model: "Motorola Moto G34",
  status: "Inativo",
  condition: "",
  description: "",
  employee: "",
  company: "",
  lastMaintenance: null,
};

export default function CollectorModal({ open, onClose, onSave, collector }) {
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [regionals, setRegionals] = useState([]);
  const [municipalities, setMunicipalities] = useState([]);
  const [filteredMunicipalities, setFilteredMunicipalities] = useState([]);
  const [locations, setLocations] = useState([]);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [activeSection, setActiveSection] = useState("dados");
  const { company } = useCompany();
  
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    if (collector) {
      setFormData({
        ...initialFormState,
        ...collector,
        lastMaintenance: collector.lastMaintenance
          ? new Date(collector.lastMaintenance)
          : null,
      });
      if (collector.codigoRegional) {
        updateMunicipalities(collector.codigoRegional);
      }
      if (collector.codigoMunicipio) {
        updateLocations(collector.codigoMunicipio);
      }
    } else {
      resetForm();
    }
  }, [collector]);

  const resetForm = () => {
    setFormData({ ...initialFormState, company: company?.name });
    setErrors({});
    setFilteredMunicipalities([]);
    setFilteredLocations([]);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [regionalData, municipioData, localData] = await Promise.all([
          fetchRegionals(),
          fetchMunicipios(),
          fetchLocals(),
        ]);

        const prioritizeMatriz = (data) =>
          data
            .sort((a, b) => a.name.localeCompare(b.name))
            .sort((a, b) => {
              if (a.name === "Matriz") return -1;
              if (b.name === "Matriz") return 1;
              return 0;
            });

        setRegionals(prioritizeMatriz(regionalData));
        setMunicipalities(prioritizeMatriz(municipioData));
        setLocations(prioritizeMatriz(localData));
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        toast.error("Erro ao carregar dados iniciais");
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const loadEmployees = async () => {
      if (company?.name) {
        const employeesData = await fetchedEmployeesByCompany(company.name);
        setEmployees(employeesData);
      }
    };
    loadEmployees();
  }, [company]);

  const updateMunicipalities = (regionalId) => {
    if (regionalId) {
      const filtered = municipalities.filter(
        (mun) =>
          mun.codigoRegional?._id === regionalId ||
          mun.codigoRegional === regionalId
      );
      setFilteredMunicipalities(filtered);
      if (!collector) {
        setFormData((prev) => ({
          ...prev,
          codigoMunicipio: "",
          codigoLocal: "",
        }));
      }
    } else {
      setFilteredMunicipalities([]);
      setFormData((prev) => ({
        ...prev,
        codigoMunicipio: "",
        codigoLocal: "",
      }));
    }
  };

  const updateLocations = (municipioId) => {
    if (municipioId) {
      const filtered = locations.filter(
        (local) =>
          local.codigoMunicipio?._id === municipioId ||
          local.codigoMunicipio === municipioId
      );
      setFilteredLocations(filtered);
      if (!collector) {
        setFormData((prev) => ({ ...prev, codigoLocal: "" }));
      }
    } else {
      setFilteredLocations([]);
      setFormData((prev) => ({ ...prev, codigoLocal: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    //if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null && formData[key] !== undefined) {
          formDataToSend.append(key, formData[key]);
        }
      });

      if (collector?._id) {
        await updateCollector(formDataToSend, collector._id);
      } else {
        await createCollector(formDataToSend);
      }
      
      onSave();
      onClose();
      toast.success(
        collector ? "Coletor atualizado com sucesso!" : "Coletor criado com sucesso!"
      );
    } catch (error) {
      console.error("Erro ao salvar coletor:", error);
      toast.error("Erro ao salvar coletor");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Ativo': return '#4caf50';
      case 'Inativo': return '#f44336';
      case 'Em Manutenção': return '#ff9800';
      default: return '#757575';
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      fullScreen={fullScreen}
      PaperProps={{
        elevation: 5,
        sx: { 
          borderRadius: '10px',
          overflow: 'hidden'
        }
      }}
    >
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
            {collector ? "Editar Coletor" : "Novo Coletor"}
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
          <DialogContent sx={{ px: 3, py: 3 }}>
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
                  onClick={() => setActiveSection('dados')}
                  sx={{
                    px: 3,
                    py: 1,
                    borderRadius: 0,
                    backgroundColor: activeSection === 'dados' ? '#5E899D' : 'transparent',
                    color: activeSection === 'dados' ? 'white' : '#666',
                    '&:hover': {
                      backgroundColor: activeSection === 'dados' ? '#4A7185' : '#f5f5f5',
                    },
                  }}
                  startIcon={<AssignmentIndIcon />}
                >
                  Dados Pessoais
                </Button>
                <Button
                  onClick={() => setActiveSection('dispositivo')}
                  sx={{
                    px: 3,
                    py: 1,
                    borderRadius: 0,
                    backgroundColor: activeSection === 'dispositivo' ? '#5E899D' : 'transparent',
                    color: activeSection === 'dispositivo' ? 'white' : '#666',
                    '&:hover': {
                      backgroundColor: activeSection === 'dispositivo' ? '#4A7185' : '#f5f5f5',
                    },
                  }}
                  startIcon={<PhoneAndroidIcon />}
                >
                  Dispositivo
                </Button>
                <Button
                  onClick={() => setActiveSection('status')}
                  sx={{
                    px: 3,
                    py: 1,
                    borderRadius: 0,
                    backgroundColor: activeSection === 'status' ? '#5E899D' : 'transparent',
                    color: activeSection === 'status' ? 'white' : '#666',
                    '&:hover': {
                      backgroundColor: activeSection === 'status' ? '#4A7185' : '#f5f5f5',
                    },
                  }}
                  startIcon={<BuildIcon />}
                >
                  Status
                </Button>
              </Paper>
            </Box>

            {activeSection === 'dados' && (
              <Box>
                <Typography variant="subtitle1" component="h3" sx={{ mb: 2, fontWeight: 500, color: '#424242' }}>
                  <AssignmentIndIcon fontSize="small" sx={{ mr: 1, verticalAlign: 'text-bottom', color: '#5E899D' }} />
                  Informações do Funcionário
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth margin="dense" error={!!errors.employee} variant="outlined">
                      <InputLabel>Funcionário</InputLabel>
                      <Select
                        value={formData.employee}
                        onChange={(e) =>
                          setFormData({ ...formData, employee: e.target.value })
                        }
                        required
                        label="Funcionário"
                        sx={{
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: errors.employee ? 'error.main' : '#e0e0e0',
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#5E899D',
                          },
                        }}
                      >
                        {employees.map((employee) => (
                          <MenuItem key={employee._id} value={employee._id}>
                            {employee.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Matrícula"
                      variant="outlined"
                      margin="dense"
                      value={formData.registration}
                      onChange={(e) =>
                        setFormData({ ...formData, registration: e.target.value })
                      }
                      error={!!errors.registration}
                      helperText={errors.registration}
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
                  </Grid>
                </Grid>
              </Box>
            )}

            {activeSection === 'dispositivo' && (
              <Box>
                <Typography variant="subtitle1" component="h3" sx={{ mb: 2, fontWeight: 500, color: '#424242' }}>
                  <PhoneAndroidIcon fontSize="small" sx={{ mr: 1, verticalAlign: 'text-bottom', color: '#5E899D' }} />
                  Informações do Dispositivo
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="IMEI"
                      variant="outlined"
                      margin="dense"
                      value={formData.mei}
                      onChange={(e) =>
                        setFormData({ ...formData, mei: e.target.value })
                      }
                      error={!!errors.mei}
                      helperText={errors.mei}
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
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="MAC Address"
                      variant="outlined"
                      margin="dense"
                      value={formData.mac}
                      onChange={(e) =>
                        setFormData({ ...formData, mac: e.target.value })
                      }
                      error={!!errors.mac}
                      helperText={errors.mac || "Formato: XX:XX:XX:XX:XX:XX"}
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

                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth margin="dense" variant="outlined">
                      <InputLabel>Operadora de Dados</InputLabel>
                      <Select
                        value={formData.operadoraDados || ''}
                        label="Operadora de Dados"
                        onChange={(e) =>
                          setFormData({ ...formData, operadoraDados: e.target.value })
                        }
                        sx={{
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#5E899D',
                          },
                        }}
                      >
                        <MenuItem value="Vivo">Vivo</MenuItem>
                        <MenuItem value="Claro">Claro</MenuItem>
                        <MenuItem value="Tim">Tim</MenuItem>
                        <MenuItem value="Oi">Oi</MenuItem>
                        <MenuItem value="Sem Chip">Sem Chip</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Modelo"
                      variant="outlined"
                      margin="dense"
                      value={formData.model}
                      disabled
                      sx={{
                        backgroundColor: '#f5f5f5',
                      }}
                    />
                  </Grid>
                </Grid>
              </Box>
            )}

            {activeSection === 'status' && (
              <Box>
                <Typography variant="subtitle1" component="h3" sx={{ mb: 2, fontWeight: 500, color: '#424242' }}>
                  <BuildIcon fontSize="small" sx={{ mr: 1, verticalAlign: 'text-bottom', color: '#5E899D' }} />
                  Status e Condição
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth margin="dense" variant="outlined">
                      <InputLabel>Status</InputLabel>
                      <Select
                        value={formData.status}
                        label="Status"
                        onChange={(e) =>
                          setFormData({ ...formData, status: e.target.value })
                        }
                        sx={{
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#5E899D',
                          },
                        }}
                      >
                        <MenuItem value="Ativo" sx={{ color: '#4caf50' }}>Ativo</MenuItem>
                        <MenuItem value="Inativo" sx={{ color: '#f44336' }}>Inativo</MenuItem>
                        <MenuItem value="Em Manutenção" sx={{ color: '#ff9800' }}>Em Manutenção</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth error={!!errors.condition} required margin="dense" variant="outlined">
                      <InputLabel>Condição</InputLabel>
                      <Select
                        value={formData.condition}
                        label="Condição"
                        onChange={(e) =>
                          setFormData({ ...formData, condition: e.target.value })
                        }
                        sx={{
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#5E899D',
                          },
                        }}
                      >
                        <MenuItem value="Novo">Novo</MenuItem>
                        <MenuItem value="Bom">Bom</MenuItem>
                        <MenuItem value="Regular">Regular</MenuItem>
                        <MenuItem value="Ruim">Ruim</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <LocalizationProvider
                      dateAdapter={AdapterDateFns}
                      adapterLocale={ptBR}
                    >
                      <DatePicker
                        label="Última Manutenção"
                        value={formData.lastMaintenance}
                        onChange={(newDate) =>
                          setFormData({ ...formData, lastMaintenance: newDate })
                        }
                        slotProps={{ 
                          textField: { 
                            fullWidth: true,
                            margin: "dense",
                            variant: "outlined",
                            sx: {
                              '& .MuiOutlinedInput-root': {
                                '&.Mui-focused fieldset': {
                                  borderColor: '#5E899D',
                                },
                              },
                              '& .MuiInputLabel-root.Mui-focused': {
                                color: '#5E899D',
                              },
                            }
                          } 
                        }}
                      />
                    </LocalizationProvider>
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Descrição"
                      variant="outlined"
                      margin="dense"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      multiline
                      rows={3}
                      placeholder="Adicione observações ou detalhes sobre o coletor..."
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

            {formData.status && (
              <Box sx={{ 
                mt: 3, 
                display: 'flex', 
                alignItems: 'center',
                backgroundColor: '#f5f5f5',
                padding: '10px 16px',
                borderRadius: '8px'
              }}>
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    backgroundColor: getStatusColor(formData.status),
                    mr: 1.5
                  }}
                />
                <Typography variant="body2" component="span" sx={{ fontWeight: 500 }}>
                  Status atual: {formData.status}
                </Typography>
              </Box>
            )}
          </DialogContent>

          <Divider />
          
          <DialogActions sx={{ px: 3, py: 2, justifyContent: 'space-between' }}>
            <Button 
              onClick={onClose} 
              disabled={isSubmitting}
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
              disabled={isSubmitting}
              sx={{ 
                backgroundColor: '#5E899D',
                '&:hover': {
                  backgroundColor: '#4A7185',
                },
                px: 3
              }}
            >
              {isSubmitting ? "Salvando..." : collector ? "Atualizar" : "Salvar"}
            </Button>
          </DialogActions>
        </form>
      </Box>
    </Dialog>
  );
}