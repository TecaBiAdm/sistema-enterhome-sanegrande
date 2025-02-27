import React from 'react';
import { useRouter } from 'next/router';
import { Box, Typography, Button } from '@mui/material';

const UnauthorizedPage = () => {
  const router = useRouter();

  const handleGoBack = () => {
    router.push('/inicio');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        textAlign: 'center',
      }}
    >
      <Typography variant="h4" gutterBottom>
        Acesso Negado
      </Typography>
      <Typography variant="body1" gutterBottom>
        Você não tem permissão para acessar esta URL_LOCAL.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={handleGoBack}
        sx={{ marginTop: '20px', background: '#1E3932' }}
      >
        Voltar ao Início
      </Button>
    </Box>
  );
};

export default UnauthorizedPage;
