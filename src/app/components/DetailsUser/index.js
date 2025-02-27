import {
  Avatar,
  Box,
  Button,
  Chip,
  Grid,
  LinearProgress,
  Paper,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Typography,
  Card,
  CardContent,
  IconButton,
  Divider,
  Menu,
  MenuItem,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AssignmentIcon from "@mui/icons-material/Assignment";
import SchoolIcon from "@mui/icons-material/School";
import WorkIcon from "@mui/icons-material/Work";
import AssessmentIcon from '@mui/icons-material/Assessment';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { useState } from "react";

export const EmployeeDetailView = ({ employee }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  // Mock data - você pode substituir por dados reais
  const [attendanceData] = useState([
    {
      date: '2024-01-15',
      checkIn: '08:00',
      checkOut: '17:00',
      status: 'Presente',
      totalHours: '9h'
    },
    {
      date: '2024-01-16',
      checkIn: '08:15',
      checkOut: '17:30',
      status: 'Presente',
      totalHours: '9h15m'
    },
  ]);

  const [trainingData] = useState([
    {
      name: 'Segurança no Trabalho',
      completionDate: '2024-01-10',
      progress: 100,
      certificateUrl: '#',
      status: 'Concluído'
    },
    {
      name: 'Excel Avançado',
      completionDate: '-',
      progress: 60,
      status: 'Em andamento'
    },
  ]);

  const [documents] = useState([
    {
      name: 'Contrato de Trabalho',
      type: 'PDF',
      uploadDate: '2024-01-01',
      size: '2.5 MB'
    },
    {
      name: 'Documentos Pessoais',
      type: 'ZIP',
      uploadDate: '2024-01-01',
      size: '5.1 MB'
    },
  ]);

  const [evaluations] = useState([
    {
      month: 'Janeiro 2024',
      performance: 85,
      attendance: 95,
      productivity: 88,
      comments: 'Bom desempenho geral, precisa melhorar comunicação.',
      evaluator: 'João Silva'
    },

  ]);

  

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('pt-BR');
  };


  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEditClick = () => {
    setIsEditDialogOpen(true);
    handleMenuClose();
  };

  const CustomCard = ({ title, children }) => (
    <Card sx={{ mb: 2, boxShadow: 2 }}>
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 1, fontSize: '1rem' }}>{title}</Typography>
        {children}
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ width: "100%", bgcolor: '#f5f5f5', height: 'calc(100vh - 200px)', p: 2, overflow: 'scroll'}}>
    {/* Header com informações principais */}
    <Paper sx={{ mb: 2, p: 2 }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <Avatar
          sx={{
            width: 60,
            height: 60,
            fontSize: '1.5rem',
            bgcolor: 'primary.main'
          }}
        >
          {employee?.name?.[0]}
        </Avatar>
        
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h5" sx={{ fontSize: '1.2rem' }}>
            {employee?.name} {employee?.surname}
          </Typography>
          <Typography variant="subtitle1" sx={{ fontSize: '0.9rem' }}>
            {employee?.position}
          </Typography>
          <Chip
            label={employee?.status}
            color={employee?.status === "Ativo" ? "success" : "error"}
            size="small"
          />
        </Box>
      </Stack>
    </Paper>

    {/* Tabs com altura reduzida */}
    <Tabs
      value={activeTab}
      onChange={(e, newValue) => setActiveTab(newValue)}
      sx={{
        bgcolor: 'white',
        mb: 2,
        minHeight: 40,
        '& .MuiTab-root': {
          minHeight: 40,
          py: 0,
          textTransform: 'none'
        },
      }}
    >
      <Tab label="Informações" icon={<WorkIcon sx={{ fontSize: 20 }} />} iconPosition="start" />
      <Tab label="Presença" icon={<AccessTimeIcon sx={{ fontSize: 20 }} />} iconPosition="start" />
      <Tab label="Treinamentos" icon={<SchoolIcon sx={{ fontSize: 20 }} />} iconPosition="start" />
      <Tab label="Documentos" icon={<AssignmentIcon sx={{ fontSize: 20 }} />} iconPosition="start" />
      <Tab label="Avaliações" icon={<AssessmentIcon sx={{ fontSize: 20 }} />} iconPosition="start" />
    </Tabs>

    {/* Container com scroll */}
    <Box sx={{ 
      height: 'calc(100vh - 240px)', 
      overflowY: 'auto',
      '&::-webkit-scrollbar': {
        width: '8px',
      },
      '&::-webkit-scrollbar-track': {
        background: '#f1f1f1',
      },
      '&::-webkit-scrollbar-thumb': {
        background: '#888',
        borderRadius: '4px',
      },
    }}>

{activeTab === 0 && (
          <Grid container spacing={2}>
            {/* Informações Pessoais e Profissionais em uma linha */}
            <Grid item xs={12} lg={6}>
              <CustomCard title="Informações Pessoais">
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="textSecondary">Nome</Typography>
                    <Typography variant="body2">{employee?.name || '-'}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="textSecondary">CPF</Typography>
                    <Typography variant="body2">{employee?.cpf || '-'}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="textSecondary">RG</Typography>
                    <Typography variant="body2">{employee?.rg || '-'}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="textSecondary">Telefone</Typography>
                    <Typography variant="body2">{employee?.phone || '-'}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="textSecondary">Data de Nascimento</Typography>
                    <Typography variant="body2">{formatDate(employee?.birthDate)}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="textSecondary">Data de Admissão</Typography>
                    <Typography variant="body2">{formatDate(employee?.admissionDate)}</Typography>
                  </Grid>
                </Grid>
              </CustomCard>
            </Grid>

            <Grid item xs={12} lg={6}>
              <CustomCard title="Informações Profissionais">
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="textSecondary">Cargo</Typography>
                    <Typography variant="body2">{employee?.position || '-'}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="textSecondary">Departamento</Typography>
                    <Typography variant="body2">{employee?.department || '-'}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="textSecondary">Empresa</Typography>
                    <Typography variant="body2">{employee?.company || '-'}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="textSecondary">Regional</Typography>
                    <Typography variant="body2">{employee?.codigoRegional?.name || '-'}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="textSecondary">Município</Typography>
                    <Typography variant="body2">{employee?.codigoMunicipio?.name || '-'}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="textSecondary">Código da Equipe</Typography>
                    <Typography variant="body2">{employee?.codigoEquipe || '-'}</Typography>
                  </Grid>
                </Grid>
              </CustomCard>
            </Grid>

            {/* Endereço e Informações Veiculares */}
            <Grid item xs={12} lg={6}>
              <CustomCard title="Endereço">
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <Typography variant="caption" color="textSecondary">Logradouro</Typography>
                    <Typography variant="body2">{employee?.address?.street || '-'}</Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="caption" color="textSecondary">Número</Typography>
                    <Typography variant="body2">{employee?.address?.number || '-'}</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography variant="caption" color="textSecondary">Complemento</Typography>
                    <Typography variant="body2">{employee?.address?.complement || '-'}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="textSecondary">Bairro</Typography>
                    <Typography variant="body2">{employee?.address?.neighborhood || '-'}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="textSecondary">CEP</Typography>
                    <Typography variant="body2">{employee?.address?.zipCode || '-'}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="textSecondary">Cidade</Typography>
                    <Typography variant="body2">{employee?.address?.city || '-'}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="textSecondary">Estado</Typography>
                    <Typography variant="body2">{employee?.address?.state || '-'}</Typography>
                  </Grid>
                </Grid>
              </CustomCard>
            </Grid>

            <Grid item xs={12} lg={6}>
              <CustomCard title="Informações Veiculares">
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="textSecondary">CNH</Typography>
                    <Typography variant="body2">{employee?.cnh || '-'}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="textSecondary">Validade CNH</Typography>
                    <Typography variant="body2">{formatDate(employee?.cnhValidity)}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="textSecondary">Placa do Vecículo</Typography>
                    <Typography variant="body2">{employee?.placaMoto || '-'}</Typography>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Typography variant="caption" color="textSecondary">Modelo do Veículo</Typography>
                    <Typography variant="body2">{employee?.vehicleModel || '-'}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="textSecondary">Ano do Veículo</Typography>
                    <Typography variant="body2">{employee?.vehicleYear || '-'}</Typography>
                  </Grid>
                </Grid>
              </CustomCard>
            </Grid>
          </Grid>
        )}

      {activeTab === 1 && (
        <CustomCard title="Registro de Presença">
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Data</TableCell>
                  <TableCell>Entrada</TableCell>
                  <TableCell>Saída</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {attendanceData.map((record, index) => (
                  <TableRow key={index}>
                    <TableCell>{record.date}</TableCell>
                    <TableCell>{record.checkIn}</TableCell>
                    <TableCell>{record.checkOut}</TableCell>
                    <TableCell>{record.totalHours}</TableCell>
                    <TableCell>
                      <Chip
                        label={record.status}
                        color={record.status === "Presente" ? "success" : "error"}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CustomCard>
      )}

      {activeTab === 2 && (
        <Grid container spacing={3}>
          {trainingData.map((training, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Stack spacing={2}>
                    <Typography variant="h6">{training.name}</Typography>
                    <Box>
                      <Typography variant="body2" color="textSecondary" gutterBottom>
                        Progresso
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={training.progress}
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        {training.progress}%
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="textSecondary">
                        Conclusão: {training.completionDate}
                      </Typography>
                    </Box>
                    <Box>
                      <Chip
                        label={training.status}
                        color={training.status === "Concluído" ? "success" : "warning"}
                        size="small"
                      />
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {activeTab === 3 && (
        <Grid container spacing={3}>
          {documents.map((doc, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card>
                <CardContent>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Box>
                      <Typography variant="h6">{doc.name}</Typography>
                      <Typography variant="body2" color="textSecondary">
                        {doc.type} • {doc.size}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Enviado em: {doc.uploadDate}
                      </Typography>
                    </Box>
                    <Button
                      variant="contained"
                      startIcon={<CloudUploadIcon />}
                      size="small"
                    >
                      Download
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {activeTab === 4 && (
        <Grid container spacing={3}>
          {evaluations.map((evala, index) => (
            <Grid item xs={12} key={index}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {eval.month}
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="textSecondary" gutterBottom>
                          Performance
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={evala.performance}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            bgcolor: 'rgba(0,0,0,0.1)',
                            '& .MuiLinearProgress-bar': {
                              bgcolor: evala.performance >= 80 ? 'success.main' : 'warning.main'
                            }
                          }}
                        />
                        <Typography variant="body2" sx={{ mt: 0.5 }}>
                          {evala.performance}%
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="textSecondary" gutterBottom>
                          Presença
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={evala.attendance}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            bgcolor: 'rgba(0,0,0,0.1)',
                            '& .MuiLinearProgress-bar': {
                              bgcolor: evala.attendance >= 90 ? 'success.main' : 'warning.main'
                            }
                          }}
                        />
                        <Typography variant="body2" sx={{ mt: 0.5 }}>
                          {evala.attendance}%
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="textSecondary" gutterBottom>
                          Produtividade
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={evala.productivity}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            bgcolor: 'rgba(0,0,0,0.1)',
                            '& .MuiLinearProgress-bar': {
                              bgcolor: evala.productivity >= 85 ? 'success.main' : 'warning.main'
                            }
                          }}
                        />
                        <Typography variant="body2" sx={{ mt: 0.5 }}>
                          {evala.productivity}%
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                  <Divider sx={{ my: 2 }} />
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Comentários do Avaliador
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {evala.comments}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Avaliador: <strong>{evala.evaluator}</strong>
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Dialog de Edição */}
      <Dialog
        open={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Editar Informações do Funcionário</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nome"
                defaultValue={employee?.name}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Sobrenome"
                defaultValue={employee?.surname}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="CPF"
                defaultValue={employee?.cpf}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="RG"
                defaultValue={employee?.rg}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Telefone"
                defaultValue={employee?.phone}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                defaultValue={employee?.email}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Endereço"
                defaultValue={employee?.address}
                multiline
                rows={2}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEditDialogOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={() => setIsEditDialogOpen(false)}>
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
    </Box>
  );
};

export default EmployeeDetailView;