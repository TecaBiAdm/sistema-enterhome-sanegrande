import React, { useState, useContext } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, Box, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { toast, Toaster } from 'react-hot-toast';
import { loginUser, registerUser } from './API';
import AuthContext from '@/app/context/AuthContext';
import styles from './RegisterModal.module.css'; 

const RegisterModal = ({ open, onClose, onLoginOpen }) => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [rg, setRg] = useState('');

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handlePhoneChange = (event) => {
    setPhone(event.target.value);
  };

  const handleBirthDateChange = (event) => {
    setBirthDate(event.target.value);
  };

  const handleRgChange = (event) => {
    setRg(event.target.value);
  };

  const handleRegister = async () => {
    if (!name || !email || !password || !phone || !birthDate || !rg) {
      toast.error('Preencha todos os campos.');
    } else {
      try {
        const userData = await registerUser(name, email, password, phone, birthDate, rg);
        const userDataLogin = await loginUser(email, password)
        login(userDataLogin);
        toast.success('Registro realizado com sucesso!');
        onClose();
        //window.location.reload(); 
      } catch (error) {
        console.error('Registration failed:', error);
        if (error.response && error.response.data && error.response.data.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error('Falha no registro. Verifique suas informações.');
        }
      }
    }
  };

  return (
    <>
      <Toaster />
      <Dialog open={open} onClose={onClose} classes={{ paper: styles.dialogPaper }}>
        <DialogTitle className={styles.dialogTitle}>
          Cadastro
          <IconButton edge="start" color="inherit" onClick={onClose} aria-label="close" className={styles.closeButton}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent className={styles.dialogContent} style={{overflow: 'scroll'}}>
          <Box className={styles.textField}>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Nome"
              type="text"
              fullWidth
              required
              variant="outlined"
              value={name}
              onChange={handleNameChange}
            />
          </Box>
          <Box className={styles.textField}>
            <TextField
              margin="dense"
              id="email"
              label="Email"
              type="email"
              fullWidth
              variant="outlined"
              value={email}
              required
              onChange={handleEmailChange}
            />
          </Box>
          <Box className={styles.textField}>
            <TextField
              margin="dense"
              id="password"
              label="Senha"
              type="password"
              fullWidth
              required
              variant="outlined"
              value={password}
              onChange={handlePasswordChange}
            />
          </Box>
          <Box className={styles.textField}>
            <TextField
              margin="dense"
              id="phone"
              label="Telefone"
              type="text"
              fullWidth
              required
              variant="outlined"
              value={phone}
              onChange={handlePhoneChange}
            />
          </Box>
          <Box className={styles.textField}>
            <TextField
              margin="dense"
              id="birth_date"
              label="Data de Nascimento"
              type="date"
              fullWidth
              required
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
              value={birthDate}
              onChange={handleBirthDateChange}
            />
          </Box>
          <Box className={styles.textField}>
            <TextField
              margin="dense"
              id="rg"
              label="RG"
              type="text"
              fullWidth
              required
              variant="outlined"
              value={rg}
              onChange={handleRgChange}
            />
          </Box>
        </DialogContent>
        <DialogActions className={styles.dialogActions}>
          <Button onClick={handleRegister} className={styles.button} variant="contained" style={{backgroundColor: '#1E3932', marginTop: '-1.5rem'}}>
            Cadastrar
          </Button>
        </DialogActions>
        <Typography className={styles.link} onClick={onLoginOpen}>
          Já possui uma conta? Faça Login
        </Typography>
      </Dialog>
    </>
  );
};

export default RegisterModal;
