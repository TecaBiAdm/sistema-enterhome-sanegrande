import React from 'react';
import { useRouter } from 'next/router';
import { Button, Typography, Box } from '@mui/material';

const NotAuthorized = () => {
  const router = useRouter();

  return (
    <Box sx={{ textAlign: 'center', mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        Acesso Negado
      </Typography>
      <Typography variant="body1" gutterBottom>
        Você não tem permissão para acessar esta página.
      </Typography>
      <Button variant="contained" color="primary" onClick={() => router.push('/inicio')}>
        Voltar para a página inicial
      </Button>
    </Box>
  );
};

export default NotAuthorized;
