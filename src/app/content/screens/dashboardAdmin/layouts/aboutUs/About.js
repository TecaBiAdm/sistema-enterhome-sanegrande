import React, { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import styles from "./About.module.css";
import PlanModal from "@/app/components/Modal/Admin/InventoryModal";
import ReportModal from "@/app/components/Modal/Admin/ReportModal";
import "froala-editor/css/froala_style.min.css";
import "froala-editor/css/froala_editor.pkgd.min.css";
//import FroalaEditor from "react-froala-wysiwyg";

export default function About() {
  const [pageTitle, setPageTitle] = useState("");
  const [pageDescription, setPageDescription] = useState("");
  const [images, setImages] = useState([]);

  const handleAddImage = (e) => {
    const newImages = Array.from(e.target.files);
    setImages([...images, ...newImages]);
  };

  const handleRemoveImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const handleClearImages = () => {
    setImages([]);
  };

  const handleSavePage = () => {
    console.log("Título da Página:", pageTitle);
    console.log("Descrição da Página:", pageDescription);
    console.log("Imagens da Página:", images);
  };

  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const handleOpenPlanModal = () => {
    setIsPlanModalOpen(true);
  };

  const handleClosePlanModal = () => {
    setIsPlanModalOpen(false);
  };

  const handleOpenReportModal = () => {
    setIsReportModalOpen(true);
  };

  const handleCloseReportModal = () => {
    setIsReportModalOpen(false);
  };

  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [image3, setImage3] = useState(null);

  const handleImageChange = (event, setImage) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setImage(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  return (
    <Box className={styles.about}>
      <Typography variant="h4" style={{ fontWeight: "bold", color: "#1E3932" }}>
        Página - Sobre Nós
      </Typography>
      <Typography
        typography="label"
        style={{ padding: "0 0 1rem 0", color: "#1E3932", fontSize: ".875rem" }}
      >
        Gerencie todos as informações da página Sobre nós
      </Typography>
      <Box className={styles.about__page}>
        <TextField
          fullWidth
          margin="normal"
          label="Título da Página"
          value={pageTitle}
          onChange={(e) => setPageTitle(e.target.value)}
        />

        <Typography sx={{ marginTop: "1rem", fontSize: ".875rem" }}>
          Descrição da página
        </Typography>
        {/*<FroalaEditor/>*/}

   
      </Box>
      <Button
          variant="contained"
          onClick={handleSavePage}
          color="success"
          sx={{ marginTop: "1rem" }}
        >
          Salvar Página
        </Button>

      {/* Modal para criar novo plano */}
      <PlanModal open={isPlanModalOpen} onClose={handleClosePlanModal} />
      {/* Modal para gerar relatório */}
      <ReportModal open={isReportModalOpen} onClose={handleCloseReportModal} />
    </Box>
  );
}
