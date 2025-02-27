import React, { useContext, useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Drawer, List, ListItem, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Image from 'next/image';
import { useRouter } from 'next/router';
import PersonIcon from '@mui/icons-material/Person';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LoginModal from '../../Modal/Site/Login/LoginModal';
import RegisterModal from '../../Modal/Site/RegisterModal/RegisterModal';
import CartModal from '../../Modal/Site/CartModal/CartModal';
import AuthContext from '@/app/context/AuthContext';
import { CartContext } from '@/app/context/CartContext';
import DashboardIcon from '@mui/icons-material/Dashboard';
import styles from './TopbarSite.module.css';

const TopBar = () => {
  const router = useRouter();
  const { user, logout } = useContext(AuthContext);
  const { cartItems, addToCart, removeFromCart, subtractFromCart } = useContext(CartContext);
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [cartAnchorEl, setCartAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLoginOpen = () => {
    setLoginOpen(true);
    setRegisterOpen(false);
  };

  const handleLoginClose = () => {
    setLoginOpen(false);
  };

  const handleRegisterOpen = () => {
    setRegisterOpen(true);
    setLoginOpen(false);
  };

  const handleRegisterClose = () => {
    setRegisterOpen(false);
  };

  const handleCartClick = (event) => {
    setCartAnchorEl(cartAnchorEl ? null : event.currentTarget);
  };

  const handleCartClose = () => {
    setCartAnchorEl(null);
  };

  const cartOpen = Boolean(cartAnchorEl);

  const handleCheckout = () => {
    handleCartClose();
    router.push('/checkout');
  };


  const handleDashboardClick = () => {
    console.log(user.role.name)
    if (user) {
      switch (user.role.name) {
        case 'Administrador':
          router.push('/dashboard/admin');
          break;
        case 'Cliente':
          router.push('/dashboard/cliente');
      }
    }
  };

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };



  return (
    <AppBar position="static" style={{ background: '#4E392A', padding: '.5rem' }}>
      <Toolbar className={styles.topbar}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
         
        </Box>

        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center', gap: '2rem' }}>
          <Button color="inherit" onClick={() => router.push('/inicio')}>Início</Button>
          <Button color="inherit" onClick={() => router.push('/produtos')}>Produtos</Button>
          <Button color="inherit" onClick={() => router.push('/contato')}>Contato</Button>
          <Button color="inherit" onClick={() => router.push('/sobre-nos')}>Sobre Nós</Button>
        </Box>

        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', justifyContent: 'space-between' }}>
          {user ? (
            <>
              <IconButton color="inherit" onClick={handleDashboardClick}>
                <DashboardIcon />
              </IconButton>
              <Typography variant="body2" style={{ marginRight: '1rem' }}>
                {user.name}
              </Typography>
              <Button color="inherit" onClick={logout}>Logout</Button>
            </>
          ) : (
            <>
              <IconButton color="inherit" onClick={handleLoginOpen}>
                <PersonIcon />
                <Typography variant="body2" style={{ marginLeft: '0.5rem' }}>Entrar/Cadastrar</Typography>
              </IconButton>
            </>
          )}
          <IconButton color="inherit" onClick={handleCartClick}>
            <ShoppingCartIcon />
            <Typography variant="body2" style={{ marginLeft: '0.5rem' }}>Carrinho</Typography>
          </IconButton>
        </Box>

        <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center' }}>
          <IconButton color="inherit" onClick={toggleDrawer(true)}>
            <MenuIcon />
          </IconButton>
          <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
            <List onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)}>
              <ListItem button onClick={() => router.push('/inicio')}>
                <ListItemText primary="Início" />
              </ListItem>
              <ListItem button onClick={() => router.push('/produtos')}>
                <ListItemText primary="Produtos" />
              </ListItem>
              <ListItem button onClick={() => router.push('/contato')}>
                <ListItemText primary="Contato" />
              </ListItem>
              <ListItem button onClick={() => router.push('/sobre-nos')}>
                <ListItemText primary="Sobre Nós" />
              </ListItem>
              {user ? (
                <>
                  <ListItem button onClick={handleDashboardClick}>
                    <DashboardIcon style={{ marginRight: '8px' }} />
                    <ListItemText primary={user.name} />
                  </ListItem>
                  <ListItem button onClick={logout}>
                    <ListItemText primary="Logout" />
                  </ListItem>
                </>
              ) : (
                <ListItem button onClick={handleLoginOpen}>
                  <PersonIcon style={{ marginRight: '8px' }} />
                  <ListItemText primary="Entrar/Cadastrar" />
                </ListItem>
              )}
              <ListItem button onClick={handleCartClick}>
                <ShoppingCartIcon style={{ marginRight: '8px' }} />
                <ListItemText primary="Carrinho" />
              </ListItem>
            </List>
          </Drawer>
        </Box>
      </Toolbar>
      <LoginModal open={loginOpen} onClose={handleLoginClose} onRegisterOpen={handleRegisterOpen} />
      <RegisterModal open={registerOpen} onClose={handleRegisterClose} onLoginOpen={handleLoginOpen} />
      <CartModal 
        anchorEl={cartAnchorEl} 
        open={cartOpen} 
        onClose={handleCartClose} 
        cartItems={cartItems}
        onRemove={removeFromCart}
        onAdd={addToCart}
        onSubtract={subtractFromCart}
        onCheckout={handleCheckout} 
      />
    </AppBar>
  );
};

export default TopBar;
