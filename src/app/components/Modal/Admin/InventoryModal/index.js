import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@mui/material";
import toast from "react-hot-toast";
import 'react-toastify/dist/ReactToastify.css';
import { createItem, updateItem, fetchRegionals} from "./API"; 
import { Toaster } from "react-hot-toast";

const InventoryModal = ({ open, onClose, onSave, item }) => {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [description, setDescription] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [patrimonyNumber, setPatrimonyNumber] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [condition, setCondition] = useState("");
  const [location, setLocation] = useState("");
  const [observations, setObservations] = useState("");
  
  // Estado para guardar o código da regional e a lista de regionais
  const [regionalCode, setRegionalCode] = useState("");
  const [regionals, setRegionals] = useState([]);

  useEffect(() => {
    // Carrega os dados do item no modal para edição, se o item existir
    if (item) {
      setName(item.name);
      setQuantity(item.quantity);
      setDescription(item.description);
      setSerialNumber(item.serialNumber);
      setPatrimonyNumber(item.patrimonyNumber);
      setBrand(item.brand);
      setModel(item.model);
      setCondition(item.condition);
      setLocation(item.location);
      setObservations(item.observations);
      setRegionalCode(item.regionalCode); 
    } else {
      resetForm();
    }
  }, [item]);

  // Função para resetar o formulário ao criar um novo item
  const resetForm = () => {
    setName("");
    setQuantity(1);
    setDescription("");
    setSerialNumber("");
    setPatrimonyNumber("");
    setBrand("");
    setModel("");
    setCondition("");
    setLocation("");
    setObservations("");
    setRegionalCode("");
  };

  // Carrega as regionais a partir da API ao abrir o modal
  useEffect(() => {
    const loadRegionals = async () => {
      try {
        const fetchedRegionals = await fetchRegionals(); // Chama a função para buscar as regionais
        setRegionals(fetchedRegionals);
      } catch (error) {
        toast.error("Erro ao carregar regionais");
      }
    };

    if (open) {
      loadRegionals();
    }
  }, [open]);

  const handleSaveItem = async () => {
    /*if (!name || !description || !serialNumber || !patrimonyNumber || !brand || !model || !condition || !location || !regionalCode) {
      toast.error("Todos os campos obrigatórios devem ser preenchidos");
      return;
    }*/

    const itemData = {
      name,
      quantity,
      description,
      serialNumber,
      patrimonyNumber,
      brand,
      model,
      condition,
      location,
      observations,
      regionalCode 
    };

    try {
      if (item) {
        const updatedItem = await updateItem(item.id, itemData);
        if (updatedItem) {
          onSave(updatedItem);
          toast.success("Item atualizado com sucesso");
        } else {
          toast.error("Erro ao atualizar item");
        }
      } else {
        const createdItem = await createItem(itemData);
        if (createdItem) {
          onSave(createdItem);
          toast.success("Item criado com sucesso");
        }
      }
      onClose();
    } catch (error) {
      toast.error("Erro ao salvar o item");
    }
  };

  return (
    <>
      <Toaster />
      <Modal open={open} onClose={onClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 800,
            bgcolor: "background.paper",
            borderRadius: '5px',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" gutterBottom sx={{ borderBottom: '2px solid black' }}>
            {item ? "Editar Item" : "Adicionar Novo Item"}
          </Typography>

          <Box style={{display: 'flex', flexDirection: 'row', gap: '1rem'}}>
            <TextField
              label="Nome do Item"
              fullWidth
              margin="normal"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              label="Quantidade"
              type="number"
              fullWidth
              margin="normal"
              required
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
            <TextField
              label="Descrição"
              fullWidth
              margin="normal"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Box>

          <Box style={{display: 'flex', flexDirection: 'row', gap: '1rem'}}>
            <TextField
              label="Número de Série"
              fullWidth
              margin="normal"
              required
              value={serialNumber}
              onChange={(e) => setSerialNumber(e.target.value)}
            />
            <TextField
              label="Número do Patrimônio"
              fullWidth
              margin="normal"
              required
              value={patrimonyNumber}
              onChange={(e) => setPatrimonyNumber(e.target.value)}
            />
            <TextField
              label="Marca"
              fullWidth
              margin="normal"
              required
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
            />
          </Box>
          
          <Box style={{display: 'flex', flexDirection: 'row', gap: '1rem'}}>
          <TextField
            label="Modelo"
            fullWidth
            margin="normal"
            required
            value={model}
            onChange={(e) => setModel(e.target.value)}
          />
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Estado de Conservação</InputLabel>
            <Select
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
            >
              <MenuItem value="Ruim">Ruim</MenuItem>
              <MenuItem value="Ruim">Em condições razoáveis</MenuItem>
              <MenuItem value="Bom">Bom</MenuItem>
              <MenuItem value="Novo">Novo</MenuItem>
              <MenuItem value="Usado">Usado</MenuItem>
              <MenuItem value="Danificado">Danificado</MenuItem>
              
            </Select>
          </FormControl>
          <TextField
            label="Localização"
            fullWidth
            margin="normal"
            required
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          </Box>

          <FormControl fullWidth margin="normal" required>
            <InputLabel>Regional</InputLabel>
            <Select
              value={regionalCode}
              onChange={(e) => setRegionalCode(e.target.value)}
            >
              {regionals.map((regional) => (
                <MenuItem key={regional.regionalCode} value={regional.regionalCode}>
                  {regional.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          
          <TextField
            label="Observações"
            fullWidth
            margin="normal"
            value={observations}
            onChange={(e) => setObservations(e.target.value)}
          />
          <Box sx={{ mt: 2 }}>
            <Button variant="contained" color="primary" onClick={handleSaveItem}>
              {item ? "Salvar Alterações" : "Criar Item"}
            </Button>
            <Button variant="contained" color="primary" onClick={onClose} sx={{ ml: 2 }}>
              Cancelar
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default InventoryModal;
