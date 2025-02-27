import React, { useContext } from 'react';
import { Popover, Typography, Box, Button, Divider, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useRouter } from 'next/router';
import styles from './CartModal.module.css'; 
import { CartContext } from '@/app/context/CartContext';

const CartModal = ({ anchorEl, open, onClose }) => {
  const { cartItems, addToCart, removeFromCart, subtractFromCart } = useContext(CartContext);
  const router = useRouter();

  const handleCheckout = () => {
    onClose();
    router.push('/checkout');
  };

  const totalAmount = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      className={styles.popover}
    >
      <Box className={styles.cartContent}>
        {cartItems.length > 0 ? (
          cartItems.map((item, index) => (
            <Box key={index} className={styles.cartItem}>
              <img src={item.image} alt={item.name} className={styles.productImage} />
              <Box className={styles.productDetails}>
                <Typography variant="body2" className={styles.productName}>
                  {item.name}
                </Typography>
                <Divider className={styles.divider} />
                <Box className={styles.quantityControl}>
                  <IconButton 
                    onClick={() => subtractFromCart(item.id)}
                    className={styles.quantityButton}
                  >
                    <RemoveIcon />
                  </IconButton>
                  <Typography variant="body2" className={styles.productQtd}>
                    {item.quantity}
                  </Typography>
                  <IconButton 
                    onClick={() => addToCart(item)}
                    className={styles.quantityButton}
                  >
                    <AddIcon />
                  </IconButton>
                </Box>
                <Typography variant="body2" className={styles.productPrice}>
                  {(item.price * item.quantity).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}
                </Typography>
              </Box>
              <IconButton 
                className={styles.removeButton} 
                onClick={() => removeFromCart(item.id)}
                style={{ marginLeft: 'auto' }}
              >
                <CloseIcon />
              </IconButton>
              <Divider className={styles.divider} />
            </Box>
          ))
        ) : (
          <Typography variant="body2" className={styles.emptyCart}>
            Carrinho vazio
          </Typography>
        )}
        <Box className={styles.checkoutBox}>
          <Typography variant="body2" className={styles.totalText}>
            TOTAL: {totalAmount.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}
          </Typography>
        </Box>
        <Button onClick={handleCheckout} className={styles.checkoutButton} style={{background: '#1E3932', color: 'white', marginTop: '1rem'}} variant="contained">
          Ir para o Checkout
        </Button>
      </Box>
    </Popover>
  );
};

export default CartModal;
