import React, { useContext, useEffect, useState } from 'react';
import { Container, Typography, Box, TextField, Button, Divider } from '@mui/material';
import { CartContext } from '@/app/context/CartContext';
import AuthContext from '@/app/context/AuthContext';
import TopBar from '@/app/components/Topbar/TopbarSite';
import Footer from '@/app/components/Footer/Footer';
import styles from './checkout.module.css';

const Checkout = () => {
  const { cartItems } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
  });


  useEffect(() => {
    if (user) {
      setUserData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const handleCheckout = () => {
    console.log('Finalizando pedido', cartItems);
    console.log('Dados do usuário', userData);
  };

  return (
    <div>
      <TopBar />
      <Container sx={{ padding: '50px 0' }}>
        <Typography variant="h4" gutterBottom>
          CHECKOUT
        </Typography>
        <Divider style={{ width: '20%', height: '4px', background: '#1E3932' }} />
        {cartItems.map((item, index) => (
          <Box key={index} className={styles.checkoutItem}>
            <img src={item.image} alt={item.name} className={styles.productImage} />
            <Typography variant="body1" className={styles.productName}>
              {item.name}
            </Typography>
            <Typography variant="body1" className={styles.productQuantity}>
              QTD: {item.quantity}
            </Typography>
            <Divider className={styles.divider} />
            <Typography variant="body1" className={styles.productPrice}>
              {(item.price * item.quantity).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}
            </Typography>
          </Box>
        ))}
        <Box className={styles.totalAmount}>
          <Typography variant="h6">
            Total: {cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}
          </Typography>
        </Box>
        <Box className={styles.checkoutForm}>
          <Box style={{ display: 'flex', flexDirection: 'row', gap: '1rem' }}>
            <TextField
              label="Nome Completo"
              fullWidth
              margin="normal"
              name="name"
              value={userData.name}
              onChange={handleChange}
            />
            <TextField
              label="Email"
              fullWidth
              margin="normal"
              name="email"
              value={userData.email}
              onChange={handleChange}
            />
          </Box>
          <Box style={{ display: 'flex', flexDirection: 'row', gap: '1rem' }}>
            <TextField
              label="Telefone"
              fullWidth
              margin="normal"
              name="phone"
              value={userData.phone}
              onChange={handleChange}
            />
            <TextField
              label="Endereço"
              fullWidth
              margin="normal"
              name="address"
              onChange={handleChange}
            />
          </Box>
          <Box style={{ display: 'flex', flexDirection: 'row', gap: '1rem' }}>
            <TextField
              label="Validade"
              fullWidth
              margin="normal"
              name="expiration"
              onChange={handleChange}
            />
            <TextField
              label="Número do Cartão"
              fullWidth
              margin="normal"
              name="cardNumber"
              onChange={handleChange}
            />
          </Box>
          <TextField
            label="CVV"
            fullWidth
            margin="normal"
            name="cvv"
            onChange={handleChange}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleCheckout}
            style={{ background: '#1E3932' }}
          >
            Finalizar Pedido
          </Button>
        </Box>
      </Container>
      <Footer />
    </div>
  );
};

export default Checkout;
