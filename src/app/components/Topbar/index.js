import React, { useContext, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  AppBar, 
  Toolbar, 
  Avatar, 
  Typography, 
  IconButton, 
  Menu, 
  MenuItem 
} from "@mui/material";
import { styled } from "@mui/material/styles";
import LogoutIcon from '@mui/icons-material/Logout';
import BusinessIcon from '@mui/icons-material/Business';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: '#f8f9fa',
  boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
  color: '#333',
}));

const LogoContainer = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
});

const UserSection = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  marginLeft: 'auto',
});

export default function ProfessionalTopbar() {
  const { user, logout } = useContext(AuthContext);
  const { company, setSelectedCompany } = useCompany();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const companies = [
    { name: "Sanegrande", id: 1, logo: LogoSanegrande },
    { name: "Enter Home", id: 2, logo: LogoEnterHome },
  ];

  const handleCompanyMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCompanySelect = (selectedCompany) => {
    setSelectedCompany(selectedCompany);
    setAnchorEl(null);
  };

  return (
    <StyledAppBar position="fixed">
      <Toolbar>
        <LogoContainer>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Avatar 
              src={company?.logo} 
              alt={`${company?.name} Logo`}
              sx={{ width: 45, height: 45 }}
            />
          </motion.div>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {company?.name}
          </Typography>
        </LogoContainer>

        <UserSection>
          <IconButton onClick={handleCompanyMenu}>
            <BusinessIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
          >
            {companies.map((comp) => (
              <MenuItem 
                key={comp.id} 
                onClick={() => handleCompanySelect(comp)}
              >
                <Avatar 
                  src={comp.logo} 
                  sx={{ width: 30, height: 30, mr: 2 }} 
                />
                {comp.name}
              </MenuItem>
            ))}
          </Menu>

          <Typography variant="body1">
            {user?.name || "Minha Conta"}
          </Typography>

          <IconButton onClick={logout} color="error">
            <LogoutIcon />
          </IconButton>
        </UserSection>
      </Toolbar>
    </StyledAppBar>
  );
}