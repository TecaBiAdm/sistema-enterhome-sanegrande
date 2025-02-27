import React, { useState, useEffect, useContext } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import styles from "./Profile.module.css";
import { FaCircleUser } from "react-icons/fa6";
import AuthContext from '@/app/context/AuthContext';
import { fetchUserDetails } from './API'; // Supondo que você tenha uma função para buscar detalhes do usuário

export default function ProfileClient() {
  const { user } = useContext(AuthContext);
  const [fullName, setFullName] = useState("");
  const [cpf, setCpf] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [cep, setCep] = useState("");
  const [address, setAddress] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (user) {
      setFullName(user.name);
      setEmail(user.email);
      // Fetch additional details using user ID if necessary
      const fetchDetails = async () => {
        const details = await fetchUserDetails(user.sub);
        setCpf(details.cpf || '');
        setPhone(details.phone || '');
        setCep(details.cep || '');
        setAddress(details.address || '');
      };
      fetchDetails();
    }
  }, [user]);

  const handleSearchCep = () => {};

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = () => {
    console.log("Nome Completo:", fullName);
    console.log("CPF:", cpf);
    console.log("Telefone:", phone);
    console.log("E-mail:", email);
    console.log("CEP:", cep);
    console.log("Endereço:", address);
    console.log("Foto de Perfil:", profileImage);
    console.log("Senha:", password);
  };

  return (
    <Box className={styles.profile}>
      <Typography
        variant="h4"
        style={{ padding: "0", fontWeight: "bold", color: "#1E3932" }}
      >
        Dados do Perfil
      </Typography>

      <Typography
        typography="label"
        style={{ padding: "0 0 1rem 0", color: "#1E3932", fontSize: ".875rem" }}
      >
        Gerencie os dados do seu perfil
      </Typography>

      <Box className={styles.profile__form}>
        <Box
          display="flex"
          alignItems="center"
          className={styles.profile__box__img}
        >
          <Box className={styles.profile__img}>
            <label
              htmlFor="profile-image-input"
              className={styles.profile__imageContainer}
            >
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Foto de Perfil"
                  className={styles.profile__image}
                />
              ) : (
                <FaCircleUser className={styles.profile__icon} color="#d9d9d9"/>
              )}
            </label>
            <input
              type="file"
              id="profile-image-input"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleImageUpload}
            />
          </Box>

          <Box sx={{ width: "100%" }}>
            <Box className={styles.profile__form__box}>
              <TextField
                fullWidth
                margin="normal"
                label="Nome Completo"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
              <TextField
                fullWidth
                margin="normal"
                label="CPF"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
              />
            </Box>
            <Box className={styles.profile__form__box}>
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
            </Box>
          </Box>
        </Box>

        <Box display="flex" alignItems="center">
          <TextField
            fullWidth
            margin="normal"
            label="CEP"
            value={cep}
            onChange={(e) => setCep(e.target.value)}
          />
          <Button
            variant="contained"
            onClick={handleSearchCep}
            sx={{ marginLeft: "1rem" }}
          >
            Buscar
          </Button>
        </Box>
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
          label="Senha"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Confirmação de senha"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          variant="contained"
          onClick={handleSaveProfile}
          color="success"
          sx={{ marginTop: "1rem" }}
        >
          Salvar Alterações
        </Button>
      </Box>
    </Box>
  );
}
