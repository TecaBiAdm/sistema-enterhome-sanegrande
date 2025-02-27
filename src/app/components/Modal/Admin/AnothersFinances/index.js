import React, { useState, useEffect } from "react";
import { Modal, Box, Typography, TextField, Button } from "@mui/material";
import toast from "react-hot-toast";
import { createExpense } from "../CreateFinances/API";

const OutrasDespesasModal = ({ open, onClose, onSave, item }) => {
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");
    const [paymentDate, setPaymentDate] = useState("");
    const [status, setStatus] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("");
    const [attachment, setAttachment] = useState(null);

    // Efeito para carregar dados existentes, caso o modal seja aberto para editar uma despesa
    useEffect(() => {
        if (item) {
            setDescription(item?.description || "");
            setAmount(item?.amount || "");
            setPaymentDate(item?.paymentDate || "");
            setStatus(item?.status || "");
            setPaymentMethod(item?.paymentMethod || "");
            setAttachment(item?.attachment || null);
        } else {
            resetForm();
        }
    }, [item]);

    const resetForm = () => {
        setDescription("");
        setAmount("");
        setPaymentDate("");
        setStatus("");
        setPaymentMethod("");
        setAttachment(null);
    };

    const handleSave = async () => {
        const expenseData = {
            type: "Outras Despesas",
            description,
            amount,
            paymentDate,
            status,
            paymentMethod,
            attachment,
        };

        try {
            const response = await createExpense(expenseData);
            if (response) {
                onSave(response);
                toast.success("Despesa de Outras Despesas criada com sucesso!");
            }
            onClose();
        } catch (error) {
            toast.error("Erro ao salvar a despesa de Outras Despesas.");
        }
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setAttachment(file); // Atualiza o estado com o arquivo selecionado
        }
    };

    // Função para extrair o nome do arquivo
    const getFileName = (URL_LOCAL) => {
        if (!URL_LOCAL) return "";
        const parts = URL_LOCAL.split("/");
        return parts[parts.length - 1];
    };

    // Remove o arquivo selecionado
    const handleRemoveFile = () => {
        setAttachment(null);
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "60%",
                    bgcolor: "background.paper",
                    borderRadius: "5px",
                    boxShadow: 24,
                    p: 4,
                }}
            >
                <Typography variant="h6" gutterBottom>
                    {item ? "Editar Outras Despesas" : "Adicionar Outras Despesas"}
                </Typography>

                <TextField
                    fullWidth
                    label="Descrição"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    margin="normal"
                />
                <TextField
                    fullWidth
                    label="Valor"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    margin="normal"
                />
                <TextField
                    fullWidth
                    label="Data de Pagamento"
                    type="date"
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                />
                <TextField
                    fullWidth
                    label="Status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    margin="normal"
                />
                <TextField
                    fullWidth
                    label="Método de Pagamento"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    margin="normal"
                />

                <Box sx={{ mt: 2 }}>
                    <Button variant="contained" component="label" fullWidth>
                        {attachment ? getFileName(attachment) : "Escolher arquivo"}
                        <input type="file" hidden onChange={handleFileChange} />
                    </Button>
                    {attachment && (
                        <Button variant="outlined" onClick={handleRemoveFile} fullWidth sx={{ mt: 1 }}>
                            Remover Arquivo
                        </Button>
                    )}
                </Box>

                <Box sx={{ mt: 3 }}>
                    <Button variant="contained" color="primary" onClick={handleSave}>
                        {item ? "Salvar Alterações" : "Adicionar Despesa"}
                    </Button>
                    <Button variant="outlined" onClick={onClose} sx={{ ml: 2 }}>
                        Cancelar
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default OutrasDespesasModal;
