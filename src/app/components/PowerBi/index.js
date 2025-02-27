import React from 'react';
import { Box, Typography, Card } from '@mui/material';

const PowerBIEmbed = ({ title, width, height, src }) => {
  return (
    <Card sx={{boxShadow: 3, width: '40%', height: "350px", borderRadius: '0'}}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          border: '1px solid #ddd',
          borderRadius: 0,
          overflow: 'hidden',
        }}
      >
        <iframe title="teste-sane" width="720" height="600.5" src={src} frameborder="0" allowFullScreen="true"></iframe>
      </Box>
    </Card>
  );
};

export default PowerBIEmbed;
