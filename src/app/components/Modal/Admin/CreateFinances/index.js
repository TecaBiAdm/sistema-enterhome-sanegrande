import React, { useState, useEffect, useContext } from "react";
import {
    Modal,
    Box,
    Typography,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from "@mui/material";
import toast from "react-hot-toast";
import AuthContext from "@/app/context/AuthContext";
import { useCompany } from "@/app/context/CompanyContext";
import FeriasModal from "../ModalVacancy/index"; // Importar o modal de férias
import RescisaoModal from "../ModalRecision/index"; // Importar o modal de rescisão
import OutrasDespesasModal from "../AnothersFinances";

const ExpenseModal = ({ open, onClose, onSave, item }) => {
    const { user } = useContext(AuthContext);
    const { company } = useCompany();

    // Estado para controle do tipo de despesa
    const [selectedType, setSelectedType] = useState("");
    const [openSpecificModal, setOpenSpecificModal] = useState(false);

    const handleTypeChange = (event) => {
        setSelectedType(event.target.value);
        setOpenSpecificModal(true);
    };

    const handleClose = () => {
        setSelectedType(""); // Limpar tipo de despesa
        setOpenSpecificModal(false); // Fechar modal específico
        onClose(); // Fechar o modal principal
    };

    // Modal Principal para Seleção do Tipo de Despesa
    return (
        <>
            {/* Modais Específicos - Férias e Rescisão */}
            {selectedType === "Ferias" && (
                <FeriasModal
                    open={openSpecificModal}
                    onClose={handleClose}
                    onSave={onSave}
                    item={item}
                />
            )}
            {selectedType === "Rescisao" && (
                <RescisaoModal
                    open={openSpecificModal}
                    onClose={handleClose}
                    onSave={onSave}
                    item={item}
                />
            )}
            {selectedType === "Outros" && (
                <OutrasDespesasModal
                    open={openSpecificModal}
                    onClose={handleClose}
                    onSave={onSave}
                    item={item}
                />
            )}

        </>
    );
};

export default ExpenseModal;
