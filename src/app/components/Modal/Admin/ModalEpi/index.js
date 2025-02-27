import React, { useState, useContext, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  IconButton,
  Grid,
  Paper,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { DeleteIcon } from "lucide-react";
import AuthContext from "@/app/context/AuthContext";
import { useCompany } from "@/app/context/CompanyContext";
import NotificationManager from "@/app/components/NotificationManager/NotificationManager";
import { fetchedEmployeesByCompany, fetchLocals, fetchMunicipios, fetchRegionals } from "./API";

const EpiRequestModal = ({ open, onClose, onSave, request }) => {
  const { user } = useContext(AuthContext);
  const { company } = useCompany();

  const [employees, setEmployees] = useState([]);
  const [epis, setEpis] = useState([]);
  const [regionals, setRegionals] = useState([]);
  const [locals, setLocals] = useState([]);
  const [municipalities, setMunicipalities] = useState([]);
  const [formData, setFormData] = useState({
    employee: "",
    regional: "",
    observations: "",
    municipio: "",
    localidade: ""
  });

  const [items, setItems] = useState([]);
  const [currentItem, setCurrentItem] = useState({
    epi: "",
    size: "",
    quantity: 1,
    reason: "",
  });

  const reasons = [
    "Primeira Entrega",
    "Substituição",
    "Danificado",
    "Extraviado"
  ];

  useEffect(() => {
    if (request) {
      setFormData({
        employee: request.employee._id,
        regional: request.regional._id,
        observations: request.observations || "",
 
      });
      setItems(request.items || []);
    } else {
      resetForm();
    }
  }, [request]);

  const resetForm = () => {
    setFormData({
      employee: "",
      regional: "",
      observations: "",
      municipio: "",
      localidade: ""
    });
    setItems([]);
    setCurrentItem({
      epi: "",
      size: "",
      quantity: 1,
      reason: "",
    });
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        // Substitua pelos seus endpoints reais
        const [employeesRes, regionals, municipalities, locals] = await Promise.all([
            fetchedEmployeesByCompany(company.name),
            fetchRegionals(),
            fetchMunicipios(),
            fetchLocals()
        ]);
        console.log(employeesRes);
        setEmployees(employeesRes);
        setRegionals(regionals);
        setLocals(locals)
        setMunicipalities(municipalities)
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        NotificationManager.error("Erro ao carregar dados necessários");
      }
    };

    if (open) {
      loadData();
    }
  }, [open]);

  const handleItemChange = (field, value) => {
    setCurrentItem(prev => {
      const updated = { ...prev, [field]: value };
      
      // Se o EPI for alterado, resetar o tamanho
      if (field === 'epi') {
        updated.size = '';
      }
      
      return updated;
    });
  };

  const handleAddItem = () => {
    if (!currentItem.epi || !currentItem.size || !currentItem.reason) {
      NotificationManager.error("Por favor, preencha todos os campos do item");
      return;
    }

    setItems(prev => [...prev, { ...currentItem, id: Date.now() }]);
    setCurrentItem({
      epi: "",
      size: "",
      quantity: 1,
      reason: "",
    });
  };

  const handleRemoveItem = (itemId) => {
    setItems(items.filter(item => item.id !== itemId));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (items.length === 0) {
      NotificationManager.error("Adicione pelo menos um item ao pedido");
      return;
    }

    if (!formData.employee || !formData.regional) {
      NotificationManager.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    const requestData = {
      ...formData,
      items,
      company: company.name,
      status: "Pendente",
      requestDate: new Date().toISOString(),
      createdBy: user.name,
    };

    try {
      let response;
      if (request) {
        // Substitua pelo seu endpoint de atualização
        response = await fetch(`/api/epi-requests/${request._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestData)
        });
      } else {
        // Substitua pelo seu endpoint de criação
        response = await fetch('/api/epi-requests', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestData)
        });
      }

      const data = await response.json();
      
      if (response.ok) {
        onSave(data);
        NotificationManager.success(`Pedido ${request ? "atualizado" : "criado"} com sucesso`);
        onClose();
      } else {
        throw new Error(data.message || "Erro ao processar pedido");
      }
    } catch (error) {
      console.error("Erro na operação:", error);
      NotificationManager.error(`Erro ao ${request ? "atualizar" : "criar"} o pedido`);
    }
  };

  const renderItemsSection = () => (
    <Grid item xs={12}>
      <Paper elevation={0} sx={{ p: 2, bgcolor: "grey.50", mt: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          Adicionar Item
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>EPI</InputLabel>
              <Select
                value={currentItem.epi}
                onChange={(e) => handleItemChange('epi', e.target.value)}
                label="EPI"
              >
                {epis.map((epi) => (
                  <MenuItem key={epi._id} value={epi._id}>
                    {epi.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Tamanho</InputLabel>
              <Select
                value={currentItem.size}
                onChange={(e) => handleItemChange('size', e.target.value)}
                label="Tamanho"
                disabled={!currentItem.epi}
              >
                {currentItem.epi && epis.find(e => e._id === currentItem.epi)?.sizes.map(size => (
                  <MenuItem key={size} value={size}>
                    {size}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              size="small"
              label="Quantidade"
              type="number"
              value={currentItem.quantity}
              onChange={(e) => handleItemChange('quantity', Math.max(1, parseInt(e.target.value) || 1))}
              InputProps={{ inputProps: { min: 1 } }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Motivo</InputLabel>
              <Select
                value={currentItem.reason}
                onChange={(e) => handleItemChange('reason', e.target.value)}
                label="Motivo"
              >
                {reasons.map(reason => (
                  <MenuItem key={reason} value={reason}>
                    {reason}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleAddItem}
              size="small"
              sx={{ 
                backgroundColor: "#3A8DFF",
                "&:hover": { backgroundColor: "#3A8DFF" }
              }}
            >
              Adicionar
            </Button>
          </Grid>
        </Grid>

        {items.length > 0 && (
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>EPI</TableCell>
                  <TableCell>Tamanho</TableCell>
                  <TableCell align="center">Quantidade</TableCell>
                  <TableCell>Motivo</TableCell>
                  <TableCell align="center">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      {epis.find(e => e._id === item.epi)?.name}
                    </TableCell>
                    <TableCell>{item.size}</TableCell>
                    <TableCell align="center">{item.quantity}</TableCell>
                    <TableCell>{item.reason}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveItem(item.id)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Grid>
  );

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "50%",
          bgcolor: "background.paper",
          borderRadius: "5px",
          boxShadow: 24,
          p: 4,
          maxHeight: "80vh",
          overflow: "auto",
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
          }}
        >
          <IoMdCloseCircleOutline />
        </IconButton>

        <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
          {request ? "Editar Pedido de EPI" : "Novo Pedido de EPI"}
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth margin="normal" size="small">
              <InputLabel>Funcionário</InputLabel>
              <Select
                value={formData.employee}
                onChange={(e) => setFormData(prev => ({ ...prev, employee: e.target.value }))}
                label="Funcionário"
              >
                {employees.map((emp) => (
                  <MenuItem key={emp._id} value={emp._id}>
                    {emp.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth margin="normal" size="small">
              <InputLabel>Regional</InputLabel>
              <Select
                value={formData.regional}
                onChange={(e) => setFormData(prev => ({ ...prev, regional: e.target.value }))}
                label="Regional"
              >
                {regionals.map((reg) => (
                  <MenuItem key={reg._id} value={reg._id}>
                    {reg.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth margin="normal" size="small">
              <InputLabel>Localidade</InputLabel>
              <Select
                value={formData.municipio}
                onChange={(e) => setFormData(prev => ({ ...prev, municipio: e.target.value }))}
                label="Município"
              >
                {municipalities.map((reg) => (
                  <MenuItem key={reg._id} value={reg._id}>
                    {reg.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth margin="normal" size="small">
              <InputLabel>Localidade</InputLabel>
              <Select
                value={formData.localidade}
                onChange={(e) => setFormData(prev => ({ ...prev, localidade: e.target.value }))}
                label="Localidade"
              >
                {locals.map((reg) => (
                  <MenuItem key={reg._id} value={reg._id}>
                    {reg.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {renderItemsSection()}

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Observações"
              value={formData.observations}
              onChange={(e) => setFormData(prev => ({ ...prev, observations: e.target.value }))}
              margin="normal"
              size="small"
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
          <Button 
            variant="contained" 
            onClick={handleSave}
            sx={{
              backgroundColor: "#3A8DFF",
              "&:hover": { backgroundColor: "#3A8DFF" }
            }}
          >
            Salvar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default EpiRequestModal;