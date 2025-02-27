import React from "react";
import { Container, Typography, Box, IconButton } from "@mui/material";
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';

export default function Footer() {
  return (
    <Box
      sx={{
        backgroundColor: "#2C544A",
        color: "white",
        padding: "20px 0",
        textAlign: "left",
        marginTop: '8rem'
      }}
    >
      <Container>
        <Typography variant="body1" gutterBottom>
          Entre em contato
        </Typography>
        <Typography variant="body2">coffeecode@sac.com.br</Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "left",
            gap: "10px",
            marginTop: "10px",
          }}
        >
          <IconButton href="https://www.instagram.com" target="_blank" sx={{ color: "white" }}>
            <InstagramIcon />
          </IconButton>
          <IconButton href="https://www.facebook.com" target="_blank" sx={{ color: "white" }}>
            <FacebookIcon />
          </IconButton>
          <IconButton href="https://www.twitter.com" target="_blank" sx={{ color: "white" }}>
            <TwitterIcon />
          </IconButton>
        </Box>
      </Container>
    </Box>
  );
}
