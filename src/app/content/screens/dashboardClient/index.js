import React, { useState } from "react";
import { Container, Box } from "@mui/material";
import SidebarClient from "@/app/components/Sidebar/client";// Importe o componente do menu lateral
import styles from "./dashboard.module.css";
import Topbar from "@/app/components/Topbar";
import PlansClient from "./layouts/plans/Plans";
import ProductsClient from "./layouts/products/Products";
import ProfileClient from "./layouts/profile/ProfileClient";

export default function ScreenDashboardClient() {

  const [selectedComponent, setSelectedComponent] = useState("init");
  const [isMenuOpen, setIsMenuOpen] = useState(true);

  
  const handleMenuClick = (componentName) => {
    setSelectedComponent(componentName);
  };

  const handleChangeMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  

  const components = {
    Produtos: <ProductsClient/>,
    Planos: <PlansClient/>,
    Perfil: <ProfileClient/>,
 

  };

  return (
    <div>
      <Topbar/>
      <Box display="flex" className={styles.dashboardContent}>
        <SidebarClient onMenuClick={handleMenuClick} isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen}/>
        <Box flexGrow={1} sx={{width: "100%"}}>
          {components[selectedComponent]? components[selectedComponent]: <PlansClient/>}
        </Box>
      </Box>
    </div>
  );
}
