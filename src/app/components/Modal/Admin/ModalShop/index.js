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
  TableCell,
  TableRow,
  TableHead,
  TableBody,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";
import { Edit, Delete } from "@mui/icons-material";
import AuthContext from "@/app/context/AuthContext";
import { useCompany } from "@/app/context/CompanyContext";
import NotificationManager from "@/app/components/NotificationManager/NotificationManager";
import HistorySection from "./HistorySection";
import {
  createPurchase,
  fetchedSuppliersByCompany,
  updatePurchase,
} from "./API";

// Item form initial state
const initialItemState = {
  name: "",
  type: "",
  quantity: "",
  unitPrice: "",
  totalPrice: "",
};

const PurchaseModal = ({ open, onClose, onSave, item }) => {
  const { user } = useContext(AuthContext);
  const { company } = useCompany();
  
  // Form state
  const [formData, setFormData] = useState({
    materialType: "",
    supplier: "",
    entrancy: "",
    recurrence: "",
    entrancyPaymentDate: "",
    totalPrice: "",
    paymentMethod: "",
    installments: "",
    installmentValue: "",
    dueDate: "",
    purchaseDate: "",
    deliveryDate: "",
    nextPurchaseDate: "",
    attachment: null,
    installmentDates: [],
  });
  
  // Items state
  const [items, setItems] = useState([]);
  const [currentItem, setCurrentItem] = useState(initialItemState);
  const [editingItemId, setEditingItemId] = useState(null);
  const [editingItem, setEditingItem] = useState({});
  
  // Suppliers state
  const [suppliers, setSuppliers] = useState([]);

  // Handle form input changes
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  // Calculate values when dependencies change
  useEffect(() => {
    if (formData.totalPrice && formData.installments && formData.installments > 0) {
      const total = parseFloat(formData.totalPrice);
      const entrada = parseFloat(formData.entrancy) || 0;
      const numParcelas = parseFloat(formData.installments);
      const valorParcela = (total - entrada) / numParcelas;
      
      handleChange("installmentValue", valorParcela.toFixed(2));
    }
  }, [formData.totalPrice, formData.installments, formData.entrancy]);
  
  // Update installment dates when installments change
  useEffect(() => {
    if (formData.installments > 0) {
      const newDates = Array(parseInt(formData.installments))
        .fill("")
        .map((_, index) => formData.installmentDates[index] || "");
      handleChange("installmentDates", newDates);
    } else {
      handleChange("installmentDates", []);
    }
  }, [formData.installments]);
  
  // Load suppliers
  useEffect(() => {
    const loadSuppliers = async () => {
      const suppliersData = await fetchedSuppliersByCompany(company?.name);
      setSuppliers(suppliersData);
    };
    
    if (company?.name) {
      loadSuppliers();
    }
  }, [company]);
  
  // Set form data when item changes
  useEffect(() => {
    if (item) {
      setFormData({
        materialType: item?.materialType || "",
        supplier: item?.supplier?._id || "",
        entrancy: item?.entrancy || "",
        recurrence: item?.recurrence || "",
        entrancyPaymentDate: item?.entrancyPaymentDate ? item.entrancyPaymentDate.split("T")[0] : "",
        totalPrice: item?.totalPrice || "",
        paymentMethod: item?.paymentMethod || "",
        installments: item?.installments || "",
        installmentValue: item?.installmentValue || "",
        dueDate: item?.dueDate ? item.dueDate.split("T")[0] : "",
        purchaseDate: item?.purchaseDate ? item.purchaseDate.split("T")[0] : "",
        deliveryDate: item?.deliveryDate ? item.deliveryDate.split("T")[0] : "",
        nextPurchaseDate: item?.nextPurchaseDate ? item.nextPurchaseDate.split("T")[0] : "",
        attachment: item?.attachment || null,
        installmentDates: item?.installmentDates || [],
      });
      setItems(item?.items || []);
    } else {
      resetForm();
    }
  }, [item]);
  
  // Reset form
  const resetForm = () => {
    setFormData({
      materialType: "",
      supplier: "",
      entrancy: "",
      entrancyPaymentDate: "",
      totalPrice: "",
      paymentMethod: "",
      recurrence: "", 
      installments: "",
      installmentValue: "",
      dueDate: "",
      purchaseDate: "",
      deliveryDate: "",
      nextPurchaseDate: "",
      attachment: null,
      installmentDates: [],
    });
    setItems([]);
    setCurrentItem(initialItemState);
  };
  
  // Handle item form changes
  const handleItemChange = (field, value) => {
    setCurrentItem(prev => {
      const updated = { ...prev, [field]: value };
      
      // Automatically calculate total price
      if (field === "quantity" || field === "unitPrice") {
        const quantity = field === "quantity" ? value : prev.quantity;
        const unitPrice = field === "unitPrice" ? value : prev.unitPrice;
        
        if (quantity && unitPrice) {
          updated.totalPrice = (parseFloat(quantity) * parseFloat(unitPrice)).toFixed(2);
        }
      }
      
      return updated;
    });
  };
  
  // Add new item
  const handleAddItem = () => {
   
      NotificationManager.error("Por favor, preencha todos os campos do item");
      
    
    const newItems = [...items, { ...currentItem, id: Date.now() }];
    setItems(newItems);
    setCurrentItem(initialItemState);
    calculateTotalPrice(newItems);
  };
  
  // Remove item
  const handleRemoveItem = (itemId) => {
    const updatedItems = items.filter(item => item._id !== itemId);
    setItems(updatedItems);
    calculateTotalPrice(updatedItems);
  };
  
  // Start editing item
  const handleEditItem = (item) => {
    setEditingItemId(item._id);
    setEditingItem(item);
  };
  
  // Save edited item
  const handleSaveEditedItem = () => {
    if (!editingItem.name || !editingItem.quantity || !editingItem.unitPrice) {
      NotificationManager.error("Por favor, preencha todos os campos do item");
      return;
    }
    
    const updatedItems = items.map(item =>
      item._id === editingItemId
        ? {
            ...editingItem,
            totalPrice: (parseFloat(editingItem.quantity) * parseFloat(editingItem.unitPrice)).toFixed(2),
          }
        : item
    );
    
    setItems(updatedItems);
    calculateTotalPrice(updatedItems);
    setEditingItemId(null);
    setEditingItem({});
  };
  
  // Cancel editing item
  const handleCancelEdit = () => {
    setEditingItemId(null);
    setEditingItem({});
  };
  
  // Handle edited item changes
  const handleEditItemChange = (field, value) => {
    setEditingItem(prev => ({ ...prev, [field]: value }));
  };
  
  // Calculate total price
  const calculateTotalPrice = (currentItems) => {
    const total = currentItems.reduce(
      (sum, item) => sum + (parseFloat(item.totalPrice) || 0),
      0
    );
    handleChange("totalPrice", total.toFixed(2));
  };
  
  // Handle installment date change
  const handleInstallmentDateChange = (index, value) => {
    const newDates = [...formData.installmentDates];
    newDates[index] = value;
    handleChange("installmentDates", newDates);
  };
  
  // Handle file change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleChange("attachment", file);
    }
  };
  
  // Save purchase
  const handleSave = async (e) => {
    e.preventDefault();
    
    if (items.length === 0) {
      NotificationManager.error("Adicione pelo menos um item à compra");
      return;
    }
    
    if (!formData.materialType) {
      NotificationManager.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }
    
    const purchaseData = new FormData();
    
    // Basic purchase data
    purchaseData.append("materialType", formData.materialType);
    purchaseData.append("items", JSON.stringify(items));
    purchaseData.append("buyer", company?.name || "");
    purchaseData.append("supplier", formData.supplier);
    purchaseData.append("entrancy", formData.entrancy);
    purchaseData.append("recurrence", formData.recurrence);
    purchaseData.append("totalPrice", formData.totalPrice);
    purchaseData.append("paymentMethod", formData.paymentMethod);
    purchaseData.append("installments", formData.installments);
    purchaseData.append("installmentValue", formData.installmentValue);
    
    // Dates
    purchaseData.append("entrancyPaymentDate", formData.entrancyPaymentDate ? new Date(formData.entrancyPaymentDate).toISOString() : "");
    purchaseData.append("dueDate", formData.dueDate ? new Date(formData.dueDate).toISOString() : "");
    purchaseData.append("purchaseDate", formData.purchaseDate ? new Date(formData.purchaseDate).toISOString() : "");
    purchaseData.append("deliveryDate", formData.deliveryDate ? new Date(formData.deliveryDate).toISOString() : "");
    purchaseData.append("nextPurchaseDate", formData.nextPurchaseDate ? new Date(formData.nextPurchaseDate).toISOString() : "");
    
    // User and company info
    purchaseData.append("createdBy", user?.name || "");
    purchaseData.append("updatedBy", user?.name || "");
    purchaseData.append("company", company?.name || "");
    
    // Installment dates
    if (formData.installmentDates && Array.isArray(formData.installmentDates)) {
      purchaseData.append("installmentDates", JSON.stringify(formData.installmentDates));
    }
    
    // Track history changes for updates
    if (item) {
      const changes = [];
      if (item.materialType !== formData.materialType) {
        changes.push({ field: 'materialType', oldValue: item.materialType, newValue: formData.materialType });
      }
      if (item.supplier !== formData.supplier) {
        changes.push({ field: 'supplier', oldValue: item.supplier, newValue: formData.supplier });
      }
      
      if (changes.length > 0) {
        purchaseData.append("history", JSON.stringify([{
          action: 'update',
          user: user?.name || '',
          changes,
          timestamp: new Date()
        }]));
      }
    }
    
    // Handle notifications
    const notifications = [{
      type: 'recompra',
      sentAt: new Date(),
      nextPurchaseDate: formData.nextPurchaseDate || '',
      status: 'pending',
      emailTo: user?.email || ''
    }];
    
    notifications.forEach((notification, index) => {
      purchaseData.append(`notifications[${index}][type]`, notification.type);
      purchaseData.append(`notifications[${index}][sentAt]`, notification.sentAt.toISOString());
      purchaseData.append(`notifications[${index}][nextPurchaseDate]`, formData.nextPurchaseDate);
      purchaseData.append(`notifications[${index}][status]`, notification.status);
      purchaseData.append(`notifications[${index}][emailTo]`, notification.emailTo);
    });
    
    // Attachment
    if (formData.attachment instanceof File) {
      purchaseData.append("attachment", formData.attachment);
    }
    
    try {
      let response;
      if (item) {
        response = await updatePurchase(purchaseData, item._id);
      } else {
        response = await createPurchase(purchaseData);
      }
      
      if (response?.data || response) {
        onSave(response.data || response);
        NotificationManager.success(`Compra ${item ? "atualizada" : "criada"} com sucesso`);
        onClose();
      } else {
        throw new Error("Resposta inválida do servidor");
      }
    } catch (error) {
      console.error("Erro na operação:", error);
      NotificationManager.error(`Erro ao ${item ? "atualizar" : "criar"} a compra: ${error.message || "Erro desconhecido"}`);
    }
  };
  
  // Render items section
  const renderItemsSection = () => (
    <Box sx={{ mt: 3, mb: 3 }}>
      <Typography variant="subtitle1" fontWeight="500" gutterBottom>
        Itens
      </Typography>
      <Paper variant="outlined" sx={{ p: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              size="small"
              label="Nome do Item"
              value={currentItem.name}
              onChange={(e) => handleItemChange("name", e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              size="small"
              label="Tipo"
              value={currentItem.type}
              onChange={(e) => handleItemChange("type", e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              size="small"
              label="Quantidade"
              type="number"
              value={currentItem.quantity}
              onChange={(e) => handleItemChange("quantity", e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              size="small"
              label="Valor Unitário"
              type="number"
              value={currentItem.unitPrice}
              onChange={(e) => handleItemChange("unitPrice", e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              size="small"
              label="Total"
              type="number"
              value={currentItem.totalPrice}
              InputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={12} md={1}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleAddItem}
              size="small"
            >
              Adicionar
            </Button>
          </Grid>
        </Grid>

        {items.length > 0 && (
          <TableContainer sx={{ mt: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Nome</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell align="right">Quantidade</TableCell>
                  <TableCell align="right">Valor Unit.</TableCell>
                  <TableCell align="right">Total</TableCell>
                  <TableCell align="center">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id || item._id}>
                    {editingItemId === item._id ? (
                      // Editing row
                      <>
                        <TableCell>
                          <TextField
                            fullWidth
                            size="small"
                            value={editingItem.name}
                            onChange={(e) => handleEditItemChange("name", e.target.value)}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            fullWidth
                            size="small"
                            value={editingItem.type}
                            onChange={(e) => handleEditItemChange("type", e.target.value)}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            fullWidth
                            size="small"
                            type="number"
                            value={editingItem.quantity}
                            onChange={(e) => handleEditItemChange("quantity", e.target.value)}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            fullWidth
                            size="small"
                            type="number"
                            value={editingItem.unitPrice}
                            onChange={(e) => handleEditItemChange("unitPrice", e.target.value)}
                          />
                        </TableCell>
                        <TableCell align="right">
                          R$ {(editingItem.quantity * editingItem.unitPrice).toFixed(2)}
                        </TableCell>
                        <TableCell align="center">
                          <Button size="small" color="primary" onClick={handleSaveEditedItem}>
                            Salvar
                          </Button>
                          <Button size="small" color="error" onClick={handleCancelEdit}>
                            Cancelar
                          </Button>
                        </TableCell>
                      </>
                    ) : (
                      // Display row
                      <>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.type}</TableCell>
                        <TableCell align="right">{item.quantity}</TableCell>
                        <TableCell align="right">R$ {parseFloat(item.unitPrice).toFixed(2)}</TableCell>
                        <TableCell align="right">R$ {parseFloat(item.totalPrice).toFixed(2)}</TableCell>
                        <TableCell align="center">
                          <IconButton size="small" onClick={() => handleEditItem(item)} color="primary">
                            <Edit fontSize="small" />
                          </IconButton>
                          <IconButton size="small" onClick={() => handleRemoveItem(item._id)} color="error">
                            <Delete fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
  
  // Render installment dates section
  const renderInstallmentDates = () => {
    if (!formData.installments || formData.installments <= 0) return null;
    
    return (
      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle1" fontWeight="500" gutterBottom>
          Datas das Parcelas
        </Typography>
        <Paper variant="outlined" sx={{ p: 2 }}>
          <Grid container spacing={2}>
            {formData.installmentDates.map((date, index) => (
              <Grid item xs={12} md={4} key={index}>
                <TextField
                  fullWidth
                  size="small"
                  label={`${index + 1}ª Parcela`}
                  type="date"
                  value={date ? new Date(date).toISOString().split("T")[0] : ""}
                  onChange={(e) => handleInstallmentDateChange(index, e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Box>
    );
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", md: "70%", lg: "60%" },
          maxWidth: "900px",
          bgcolor: "background.paper",
          borderRadius: 1,
          boxShadow: 24,
          p: 3,
          maxHeight: "90vh",
          overflow: "auto",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h6" fontWeight="600">
            {item ? "Editar Compra" : "Nova Compra"}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
        
        <Divider sx={{ mb: 3 }} />
        
        {/* Basic Info */}
        <Typography variant="subtitle1" fontWeight="500" gutterBottom>
          Informações Básicas
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Tipo de Material"
              value={formData.materialType}
              onChange={(e) => handleChange("materialType", e.target.value)}
              size="small"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Comprador"
              value={company?.name || ""}
              size="small"
              disabled
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth size="small">
              <InputLabel>Fornecedor</InputLabel>
              <Select
                value={formData.supplier}
                onChange={(e) => handleChange("supplier", e.target.value)}
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
        </Grid>
        
        {/* Items Section */}
        {renderItemsSection()}
        
        {/* Payment Info */}
        <Typography variant="subtitle1" fontWeight="500" gutterBottom>
          Informações de Pagamento
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Valor Total"
              type="number"
              value={formData.totalPrice}
              InputProps={{ readOnly: true }}
              size="small"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Forma de Pagamento</InputLabel>
              <Select
                value={formData.paymentMethod}
                onChange={(e) => handleChange("paymentMethod", e.target.value)}
                label="Forma de Pagamento"
              >
                <MenuItem value="Dinheiro">Dinheiro</MenuItem>
                <MenuItem value="Cartão de Crédito">Cartão de Crédito</MenuItem>
                <MenuItem value="Cartão de Débito">Cartão de Débito</MenuItem>
                <MenuItem value="Boleto">Boleto</MenuItem>
                <MenuItem value="PIX">PIX</MenuItem>
                <MenuItem value="Entrada + Pix Parcelas">Entrada + Pix Parcelas</MenuItem>
                <MenuItem value="Entrada + Boleto Parcelas">Entrada + Boleto Parcelas</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Entrada"
              type="number"
              size="small"
              value={formData.entrancy}
              onChange={(e) => handleChange("entrancy", e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Data Pagamento Entrada"
              type="date"
              size="small"
              value={formData.entrancyPaymentDate}
              onChange={(e) => handleChange("entrancyPaymentDate", e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Qtd. Parcelas"
              type="number"
              value={formData.installments}
              size="small"
              onChange={(e) => handleChange("installments", e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Valor Parcela"
              type="number"
              size="small"
              value={formData.installmentValue}
              onChange={(e) => handleChange("installmentValue", e.target.value)}
              InputProps={{ readOnly: true }}
            />
          </Grid>
        </Grid>
        
        {/* Installment Dates */}
        {renderInstallmentDates()}
        
        {/* Dates */}
        <Typography variant="subtitle1" fontWeight="500" gutterBottom sx={{ mt: 3 }}>
          Datas
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              size="small"
              label="Data da Compra"
              type="date"
              value={formData.purchaseDate}
              onChange={(e) => handleChange("purchaseDate", e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              size="small"
              label="Data de Entrega"
              type="date"
              value={formData.deliveryDate}
              onChange={(e) => handleChange("deliveryDate", e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              size="small"
              label="Data da Próxima Compra"
              type="date"
              value={formData.nextPurchaseDate}
              onChange={(e) => handleChange("nextPurchaseDate", e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Recorrência</InputLabel>
              <Select
                value={formData.recurrence}
                onChange={(e) => handleChange("recurrence", e.target.value)}
                label="Recorrência"
              >
                <MenuItem value="Semanal">Semanal</MenuItem>
                <MenuItem value="Quinzenal">Quinzenal</MenuItem>
                <MenuItem value="Mensal">Mensal</MenuItem>
                <MenuItem value="2 Meses">2 Meses</MenuItem>
                <MenuItem value="3 Meses">3 Meses</MenuItem>
                <MenuItem value="Mediante Necessidade">Mediante Necessidade</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        
        {/* Attachment */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle1" fontWeight="500" gutterBottom>
            Anexo
          </Typography>
          {formData.attachment && (
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <Typography variant="body2" sx={{ mr: 1 }}>
                Arquivo: {formData.attachment?.name ? formData.attachment.name : formData.attachment.split("/").pop()}
              </Typography>
              <IconButton
                onClick={() => window.open(formData.attachment, "_blank")}
                size="small"
                color="primary"
              >
                <DownloadIcon fontSize="small" />
              </IconButton>
            </Box>
          )}
          <Button
            variant="outlined"
            component="label"
            size="small"
            startIcon={<DownloadIcon />}
          >
            {formData.attachment ? "Substituir Arquivo" : "Anexar Nota Fiscal"}
            <input type="file" hidden onChange={handleFileChange} />
          </Button>
        </Box>
        
        {/* History Section */}
        {item?.history && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" fontWeight="500" gutterBottom>
              Histórico
            </Typography>
            <HistorySection history={item.history} />
          </Box>
        )}
        
        <Divider sx={{ my: 3 }} />
        
        {/* Actions */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
          <Button variant="outlined" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="contained" color="primary" onClick={handleSave}>
            {item ? "Atualizar" : "Criar"} Compra
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default PurchaseModal;