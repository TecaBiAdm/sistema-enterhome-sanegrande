import React, { useState } from "react";
import { Menu, MenuItem, Button } from "@mui/material";

const DropdownMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget); // Define o elemento de referência para o menu
  };

  const handleClose = () => {
    setAnchorEl(null); // Fecha o menu
  };

  const handleItemClick = (item) => {
    console.log("Item selecionado:", item);
    handleClose();
  };

  return (
    <div>
      {/* Botão que ativa o menu */}
      <Button variant="contained" onClick={handleOpen}>
        Abrir Menu
      </Button>

      {/* Menu suspenso */}
      <Menu
        anchorEl={anchorEl} // Define a âncora do menu
        open={Boolean(anchorEl)} // Mostra o menu se anchorEl estiver definido
        onClose={handleClose} // Fecha o menu ao clicar fora
      >
        {/* Itens do menu */}
        <MenuItem onClick={() => handleItemClick("Item 1")}>Item 1</MenuItem>
        <MenuItem onClick={() => handleItemClick("Item 2")}>Item 2</MenuItem>
      </Menu>
    </div>
  );
};

export default DropdownMenu;
