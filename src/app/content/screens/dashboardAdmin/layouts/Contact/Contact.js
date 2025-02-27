import React, { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import styles from "./Contact.module.css";
import 'froala-editor/css/froala_style.min.css';

export default function Contact() {
  const [contactName, setContactName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [googleMaps, setGoogleMaps] = useState("");

  const handleSaveContact = () => {
    console.log("Nome:", contactName);
    console.log("Endereço:", address);
    console.log("Telefone:", phone);
    console.log("E-mail:", email);
    console.log("Descrição:", description);
    console.log("Google Maps:", googleMaps);
  };

  return (
    <Box className={styles.contact}>
      <Typography variant="h4" style={{fontWeight: "bold", color: "#1E3932"}}>
        Página - Contato
      </Typography>
      <Typography typography="label" style={{padding: '0 0 1rem 0', color: "#1E3932", fontSize: '.875rem'}}>
        Gerencie todos os informações da página de contato
      </Typography>
      <Box className={styles.contact__page}>
        <TextField
          fullWidth
          margin="normal"
          label="Nome"
          value={contactName}
          onChange={(e) => setContactName(e.target.value)}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Endereço"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Telefone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <TextField
          fullWidth
          margin="normal"
          label="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Typography sx={{ marginTop: '1rem', fontSize: '.875rem' }}>Descrição</Typography>
       
       
        <TextField
          fullWidth
          margin="normal"
          label="Link Google Maps"
          value={googleMaps}
          onChange={(e) => setGoogleMaps(e.target.value)}
        />
        <Button variant="contained" onClick={handleSaveContact} color="success" sx={{ marginTop: '1rem' }}>
          Salvar Página
        </Button>
      </Box>
    </Box>
  );
}
