import React from "react";
import {
  Box,
  Typography,
} from "@mui/material";
import styles from "./Init.module.css";
import { useContext } from "react";
import AuthContext from "@/app/context/AuthContext";
import PowerBIEmbed from "@/app/components/PowerBi";
export default function Init() {

  const { user, logout } = useContext(AuthContext);

  return (
    <Box className={styles.init}>
  <Box className={styles.init__top}>
    <Box className={styles.init__notifications} sx={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      {/* Componente Circular para a Imagem do Usuário */}
      <Box
        sx={{
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          overflow: 'hidden',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          border: '2px solid #ddd', // Borda para destaque
          backgroundColor: '#f0f0f0', // Fundo padrão caso não haja imagem
        }}
      >
        {/*user?.profileImage ? (
          <img
            src={user.profileImage}
            alt={`${user?.name || 'Usuário'}`}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        ) : (
          <Typography sx={{ fontSize: '0.8rem', color: '#666' }}>U</Typography>
        )*/}
      </Box>
      {/* Texto de Saudação */}
      <Typography sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}>Olá, {user?.name} !</Typography>
    </Box>
  </Box>
  <Box sx={{
    display: 'flex',
    flexDirection: 'row',
    marginTop: '1.5rem'
  }}>
 <PowerBIEmbed src={'https://app.powerbi.com/reportEmbed?reportId=f404ec3e-8c21-4f67-876d-28b6fcb79e7b&autoAuth=true&ctid=06738f6b-6721-49b2-908b-ddeed51824ff'}/>
  </Box>
 
</Box>

  );
}
