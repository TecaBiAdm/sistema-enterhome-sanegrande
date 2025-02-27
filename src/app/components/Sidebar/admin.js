import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Collapse,
  Select,
  MenuItem,
} from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import Image from "next/image";
import { useCompany } from "@/app/context/CompanyContext";
import AuthContext from "@/app/context/AuthContext";
import {
  KeyboardArrowDown,
  KeyboardArrowRight,
  Dashboard,
  EventNote,
  AssignmentTurnedIn,
  Group,
  AccountBalanceWallet,
  ShoppingCart,
  DirectionsCar,
  Inventory,
  Logout,
  Phone,
} from "@mui/icons-material";
import Suppliers from "@/app/content/screens/dashboardAdmin/layouts/suppliers/Suppliers";
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

const StyledListItemButton = styled(ListItemButton)(({ theme, active }) => ({
  marginBottom: '4px',
  borderRadius: '12px',
  padding: '10px 16px',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.04),
    '& .MuiListItemIcon-root': {
      color: theme.palette.primary.main,
    },
  },
  ...(active && {
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
    '& .MuiListItemIcon-root': {
      color: theme.palette.primary.main,
    },
    '& .MuiListItemText-primary': {
      color: theme.palette.primary.main,
      fontWeight: 600,
    },
  }),
}));

const StyledListItemIcon = styled(ListItemIcon)(({ theme }) => ({
  minWidth: '36px',
  color: theme.palette.grey[600],
  '& svg': {
    fontSize: '20px',
  },
}));

const SubMenuItem = styled(ListItemButton)(({ theme, active }) => ({
  padding: '8px 16px 8px 52px',
  borderRadius: '12px',
  marginBottom: '2px',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.04),
  },
  ...(active && {
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
    color: theme.palette.primary.main,
    fontWeight: 600,
  }),
}));

const CompanySelect = styled(Select)(({ theme }) => ({
  '& .MuiSelect-select': {
    padding: '8px 32px 8px 0',
    fontSize: '1.5rem',
    fontWeight: 600,
    color: theme.palette.text.primary,
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  '&:before, &:after, &:hover:not(.Mui-disabled):before': {
    borderBottom: 'none',
  },
  '& .MuiSelect-icon': {
    color: theme.palette.text.primary,
    right: 0,
  },
}));

const SidebarAdmin = ({ onMenuClick, isMenuOpen }) => {
  const [selectedMenuItem, setSelectedMenuItem] = useState("");
  const [openMenus, setOpenMenus] = useState({});
  const { user, logout } = useContext(AuthContext);
  const { company, setSelectedCompany } = useCompany();

  const companies = [
    { name: "Sanegrande", id: "1", logo: "/icons/logo-sanegrande.png" },
    { name: "Enter Home", id: "2", logo: "/icons/logo-enterhome.png" }
  ];

  const menuGroups = {
    main: [
      { icon: <Dashboard />, label: "Início" },
      { icon: <EventNote />, label: "Calendário" },
      { icon: <AssignmentTurnedIn />, label: "Tarefas" },
    ],
    rh: {
      icon: <Group />,
      label: "Recursos Humanos",
      items: ["Férias", "Rescisão", "Afastamento", "Contratação", "Funcionário", "EPI"]
    },
    financeiro: {
      icon: <AccountBalanceWallet />,
      label: "Financeiro",
      items: ["Controle", "Contas a Receber", "Fluxo de Caixa", "Relatórios"]
    },
    other: [
      { icon: <ShoppingCart />, label: "Compras" },
      { icon: <LocalShippingIcon />, label: "Fornecedores" },
      { icon: <Phone />, label: "Coletores" },
      { icon: <DirectionsCar />, label: "Veículos" },
      { icon: <Inventory />, label: "Inventário" },
    ]
  };

  const updateURL = (menuOption) => {
    if (typeof window !== "undefined") {
      window.location.hash = menuOption.toLowerCase();
    }
    setSelectedMenuItem(menuOption);
  };

  const toggleSubmenu = (menu) => {
    setOpenMenus(prev => ({ ...prev, [menu]: !prev[menu] }));
  };

  useEffect(() => {
    if (!company?.name) {
      setSelectedCompany({ name: "Sanegrande", id: "1" });
    }
  }, [company, setSelectedCompany]);

  if (!isMenuOpen) return null;

  return (
    <Box
      sx={{
        width: 280,
        height: '100vh',
        bgcolor: 'background.paper',
        borderRight: '1px solid',
        borderColor: 'divider',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)',
      }}
    >
      <Box
        sx={{
          p: 3,
          borderBottom: '1px solid',
          borderColor: 'divider',
          background: 'white',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              width: 220,
              height: 55,
              borderRadius: '10px',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'grey.50',
            }}
          >
            <Image
              src={company?.name === "Sanegrande" ? "/icons/logo-sanegrande-2.png" : "/icons/logo-enterhome-3.png"}
              alt={`Logo - ${company?.name}`}
              width={190}
              height={60}
              style={{ objectFit: "contain" }}
            />
          </Box>
         
        </Box>
      </Box>

      <List sx={{ flex: 1, overflow: 'auto', p: 2 }}>
        {menuGroups.main.map((item) => (
          <StyledListItemButton
            key={item.label}
            active={selectedMenuItem === item.label}
            onClick={() => {
              onMenuClick(item.label);
              updateURL(item.label);
            }}
          >
            <StyledListItemIcon>{item.icon}</StyledListItemIcon>
            <ListItemText primary={item.label} />
          </StyledListItemButton>
        ))}

        <Box sx={{ my: 1 }}>
          {['rh', 'financeiro'].map((groupKey) => {
            const group = menuGroups[groupKey];
            return (
              <Box key={groupKey}>
                <StyledListItemButton
                  onClick={() => toggleSubmenu(groupKey)}
                  active={selectedMenuItem.startsWith(group.label)}
                >
                  <StyledListItemIcon>{group.icon}</StyledListItemIcon>
                  <ListItemText primary={group.label} />
                  {openMenus[groupKey] ? <KeyboardArrowDown /> : <KeyboardArrowRight />}
                </StyledListItemButton>
                <Collapse in={openMenus[groupKey]} timeout="auto">
                  <List component="div" disablePadding>
                    {group.items.map((item) => (
                      <SubMenuItem
                        key={item}
                        active={selectedMenuItem === item}
                        onClick={() => {
                          onMenuClick(item);
                          updateURL(item);
                        }}
                      >
                        <ListItemText 
                          primary={item}
                          primaryTypographyProps={{
                            fontSize: '0.9rem',
                          }}
                        />
                      </SubMenuItem>
                    ))}
                  </List>
                </Collapse>
              </Box>
            );
          })}
        </Box>

        {menuGroups.other.map((item) => (
          <StyledListItemButton
            key={item.label}
            active={selectedMenuItem === item.label}
            onClick={() => {
              onMenuClick(item.label);
              updateURL(item.label);
            }}
          >
            <StyledListItemIcon>{item.icon}</StyledListItemIcon>
            <ListItemText primary={item.label} />
          </StyledListItemButton>
        ))}
      </List>

      <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
        <StyledListItemButton onClick={logout}>
          <StyledListItemIcon>
            <Logout />
          </StyledListItemIcon>
          <ListItemText primary="Sair" />
        </StyledListItemButton>
      </Box>
    </Box>
  );
};

export default SidebarAdmin;