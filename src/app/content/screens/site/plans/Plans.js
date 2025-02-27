import React from 'react';
import { useRouter } from 'next/router';
import { Container, Typography, Card, CardMedia, CardContent, Button } from '@mui/material';
import TopBar from '@/app/components/Topbar/TopbarSite';
import Footer from '@/app/components/Footer/Footer';
import { fetchPlanById } from './API';

const PlanDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const [plan, setPlan] = React.useState(null);

  React.useEffect(() => {
    if (id) {
      const getPlan = async () => {
        const planFromApi = await fetchPlanById(id);
        setPlan(planFromApi);
      };

      getPlan();
    }
  }, [id]);

  const addToCart = (plan) => {
    // Adicione o plano ao carrinho
    console.log("Adicionado ao carrinho:", plan);
  };

  if (!plan) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <TopBar />
      <Container sx={{ padding: '50px 0' }}>
        <Card>
          <CardMedia
            component="img"
            style={{ height: '300px' }}
            image={plan.image}
            title={plan.name}
          />
          <CardContent>
            <Typography gutterBottom variant="h4" component="div">
              {plan.name}
            </Typography>
            <Typography variant="body2" color={theme.palette.text.secondary}>
              {plan.description}
            </Typography>
            <Typography variant="h6" color={theme.palette.text.secondary}>
              R$ {plan.price}
            </Typography>
            <Button variant="contained" color="primary" onClick={() => addToCart(plan)}>
              Adicionar ao Carrinho
            </Button>
          </CardContent>
        </Card>
      </Container>
      <Footer />
    </div>
  );
};

export default PlanDetail;
