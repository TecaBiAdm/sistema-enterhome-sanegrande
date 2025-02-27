import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  Box,
  TextField,
  Grid,
  Typography,
} from "@mui/material";
import { createProduct, updateProduct } from "./API";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";

const ProductModal = ({ open, onClose, onSave, product }) => {
  const [productData, setProductData] = useState({
    name: "",
    price: "",
    bar_code: "",
    description: "",
    quantity: "",
    image: "",
  });

  useEffect(() => {
    if (product) {
      setProductData(product);
    } else {
      setProductData({
        name: "",
        price: "",
        bar_code: "",
        description: "",
        quantity: "",
        image: "",
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData({
      ...productData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductData({
          ...productData,
          image: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    try {
      const formattedProductData = {
        ...productData,
        price: parseFloat(productData.price),
        quantity: parseInt(productData.quantity),
      };

      if (product) {
        const updatedProduct = await updateProduct(product.id, formattedProductData);
        toast.success("Produto atualizado com sucesso");
        setProductData({
          name: "",
          price: "",
          bar_code: "",
          description: "",
          quantity: "",
          image: "",
        });
        onSave(updatedProduct);
      } else {
        const createdProduct = await createProduct(formattedProductData);
        toast.success("Produto criado com sucesso");
        onSave(createdProduct);
      }
      onClose();
    } catch (error) {
      toast.error("Erro ao salvar o produto");
      console.error("Erro ao salvar o produto:", error);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          width: 600,
          bgcolor: "background.paper",
          boxShadow: 24,
          borderRadius: "5px",
          p: 4,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <Typography variant="h6" gutterBottom sx={{ borderBottom: '2px solid black' }}>
          {product ? "Editar Produto" : "Criar Novo Produto"}
        </Typography>
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <TextField
              fullWidth
              margin="normal"
              label="Nome do Produto"
              name="name"
              value={productData.name}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              margin="normal"
              label="Preço"
              name="price"
              type="number"
              value={productData.price}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              margin="normal"
              label="Código de Barras"
              name="bar_code"
              value={productData.bar_code}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              margin="normal"
              label="Descrição"
              name="description"
              value={productData.description}
              onChange={handleChange}
              required
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              margin="normal"
              label="Quantidade"
              name="quantity"
              type="number"
              value={productData.quantity}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={6}>
            {productData.image && (
              <Box
                sx={{
                  mt: 2,
                  mb: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}
              >
                <img
                  src={productData.image}
                  alt="Produto"
                  style={{ maxWidth: '100%', maxHeight: 200 }}
                />
              </Box>
            )}
            <Button
              variant="outlined"
              component="label"
              fullWidth
              sx={{ mt: 2 }}
            >
              {productData.image ? "Editar Imagem" : "Upload Imagem"}
              <input
                type="file"
                name="image"
                onChange={handleImageChange}
                hidden
              />
            </Button>
          </Grid>
        </Grid>
        <Box sx={{ mt: 2 }}>
          <Button onClick={handleSubmit} variant="contained" color="success">
            {product ? "Salvar Alterações" : "Cadastrar Produto"}
          </Button>
          <Button variant="contained" color="error" onClick={onClose} sx={{ ml: 2 }}>
            Cancelar
          </Button>
        </Box>
        <Toaster />
      </Box>
    </Modal>
  );
};

export default ProductModal;
