import React, { useState, useContext } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, Box, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { toast, Toaster } from 'react-hot-toast';
import styles from './LoginModal.module.css'; 
import { loginUser } from './API'; 
import AuthContext from '@/app/context/AuthContext';

const LoginModal = ({ open, onClose, onRegisterOpen }) => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleLogin = async () => {
    try {
      const userData = await loginUser(email, password);
      login(userData);
      toast.success('Login realizado com sucesso!');
      onClose();
    } catch (error) {
      console.error('Login failed:', error);
      toast.error('Falha no login. Verifique suas credenciais.');
    }
  };

  return (
    <>
      <Toaster />
      <Dialog open={open} onClose={onClose} classes={{ paper: styles.dialogPaper }}>
        <Box>
          <DialogTitle className={styles.dialogTitle}>
            Login
            <IconButton edge="start" color="inherit" onClick={onClose} aria-label="close" className={styles.closeButton}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
        </Box>
        
        <DialogContent className={styles.dialogContent} style={{overflow: 'hidden'}}>
          <Box className={styles.textField}>
            <TextField
              autoFocus
              margin="dense"
              id="email"
              label="Email"
              type="email"
              fullWidth
              variant="outlined"
              value={email}
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
              variant="outlined"
              value={password}
              onChange={handlePasswordChange}
            />
          </Box>
        </DialogContent>
        <DialogActions className={styles.dialogActions}>
          <Button onClick={handleLogin} className={styles.button} variant="contained" style={{backgroundColor: '#1E3932'}}>
            Entrar
          </Button>
        </DialogActions>
        <Box style={{padding: '1rem', boxSizing: 'border-box', marginTop: '-2rem'}}>
          <Typography className={styles.link} onClick={onRegisterOpen}  style={{marginTop: '1rem'}}>
            Ainda não possui uma conta? Registre-se
          </Typography>
          <Typography className={styles.link} onClick={() => console.log('Esqueci minha senha')}>
            Esqueci minha senha
          </Typography>
        </Box>
      </Dialog>
    </>
  );
};

export default LoginModal;
