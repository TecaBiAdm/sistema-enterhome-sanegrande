import React, { useEffect, useState, useContext } from 'react';
import { Container, Grid, Card, CardMedia, CardContent, Typography, Box, IconButton, Button } from '@mui/material';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { useRouter } from 'next/router';
import styles from './home.module.css';
import TopBar from '@/app/components/Topbar/TopbarSite';
import Footer from '@/app/components/Footer/Footer';
import { fetchProducts, fetchPlans } from './API';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { CartContext } from '@/app/context/CartContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 1024 },
    items: 3,
  },
  desktop: {
    breakpoint: { max: 1024, min: 768 },
    items: 2,
  },
  tablet: {
    breakpoint: { max: 768, min: 464 },
    items: 1,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
};

const truncateText = (text, length) => {
  return text.length > length ? `${text.substring(0, length)}...` : text;
};

const CoffeeCode = () => {
  const [products, setProducts] = useState([]);
  const [plans, setPlans] = useState([]);
  const { addToCart } = useContext(CartContext);
  const router = useRouter();

  useEffect(() => {
    const getProducts = async () => {
      const productsFromApi = await fetchProducts();
      setProducts(productsFromApi);
    };

    const getPlans = async () => {
      const plansFromApi = await fetchPlans();
      setPlans(plansFromApi);
    };

    getProducts();
    getPlans();
  }, []);

  const planImages = {
    "Plano Básico": "https://images.pexels.com/photos/4829069/pexels-photo-4829069.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    "Plano Standard": "https://images.pexels.com/photos/4820654/pexels-photo-4820654.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    "Plano Premium": "https://images.pexels.com/photos/4829072/pexels-photo-4829072.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  };

  const handlePlanClick = (plan) => {
    router.push({
      pathname: '/plano/[id]',
      query: { id: plan.id },
    }, `/plano/${plan.id}`);
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    //toast.success(`${product.name} adicionado ao carrinho!`);
  };

  return (
    <div>
      <TopBar />
      <Box className={styles.home__background}>
        <Container>
        </Container>
      </Box>
      <Container sx={{ padding: '50px 0' }}>
        <Typography variant="h5" gutterBottom>
          MAIS VENDIDOS
        </Typography>
        <Typography variant="body1" gutterBottom>
          Explore nossos cafés mais vendidos e descubra os favoritos dos nossos clientes.
        </Typography>
        <div style={{ width: '55%', height: '4px', backgroundColor: '#1E3932' }}></div>
        <Carousel
          responsive={responsive}
          infinite={true}
          autoPlay={true}
          autoPlaySpeed={3000}
          itemClass={styles.carouselItem}
        >
          {products.map((product, index) => (
            <div key={index}>
              <Card className={styles.productCard}>
                <CardMedia
                  component="img"
                  className={styles.productImage}
                  image={product.image}
                  title={product.name}
                  style={{ height: '250px', objectFit: 'contain' }}
                />
                <CardContent>
                  <Typography gutterBottom variant="h6" component="div">
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color={theme.palette.text.secondary}>
                    R$ {product.price}
                  </Typography>
                  <Typography variant="body2" color={theme.palette.text.secondary}>
                    {truncateText(product.description, 60)}
                  </Typography>
                  <IconButton className={styles.addToCartButton} onClick={() => handleAddToCart(product)}>
                    <AddShoppingCartIcon />
                  </IconButton>
                </CardContent>
              </Card>
            </div>
          ))}
        </Carousel>
        <Carousel
          responsive={responsive}
          infinite={true}
          autoPlay={true}
          autoPlaySpeed={3000}
          itemClass={styles.carouselItem}
        >
          {products.map((product, index) => (
            <div key={index}>
              <Card className={styles.productCard}>
                <CardMedia
                  component="img"
                  className={styles.productImage}
                  image={product.image}
                  title={product.name}
                  style={{ height: '250px', objectFit: 'contain' }}
                />
                <CardContent>
                  <Typography gutterBottom variant="h6" component="div">
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color={theme.palette.text.secondary}>
                    R$ {product.price}
                  </Typography>
                  <Typography variant="body2" color={theme.palette.text.secondary}>
                    {truncateText(product.description, 60)}
                  </Typography>
                  <IconButton className={styles.addToCartButton} onClick={() => handleAddToCart(product)}>
                    <AddShoppingCartIcon />
                  </IconButton>
                </CardContent>
              </Card>
            </div>
          ))}
        </Carousel>

        <Typography variant="h5" gutterBottom style={{marginTop: '8rem'}}>
          NOSSOS PLANOS
        </Typography>
        <Typography variant="body1" gutterBottom>
          Escolha o plano que melhor se adapta ao seu paladar e aproveite nossos cafés selecionados.
        </Typography>
        <div style={{ width: '60%', height: '4px', backgroundColor: '#1E3932' }}></div>
        <Grid container spacing={4} style={{ paddingTop: '2rem' }}>
          {plans.map((plan, index) => (
            <Grid item key={index} xs={12} sm={6} md={4}>
              <Card style={{ textAlign: 'center', height: '400px' }} onClick={() => handlePlanClick(plan)}>
                <CardMedia
                  component="img"
                  style={{ height: '200px' }}
                  image={planImages[plan.name]}
                  title={plan.name}
                />
                <CardContent style={{ textAlign: 'center' }}>
                  <Typography gutterBottom variant="h6" component="div">
                    {plan.name}
                  </Typography>
                  <Typography variant="body2" color={theme.palette.text.secondary}>
                    {truncateText(plan.description, 60)}
                  </Typography>
                  <Typography variant="body2" color={theme.palette.text.secondary}>
                    R$ {plan.price}
                  </Typography>
                </CardContent>
                <Button size="small" fullWidth style={{ background: '#2C544A', color: 'white', width: '90%' }} onClick={() => handlePlanClick(plan)}>
                  Assinar
                </Button>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
      <ToastContainer />
      <Footer />
    </div>
  );
};

export default CoffeeCode;
