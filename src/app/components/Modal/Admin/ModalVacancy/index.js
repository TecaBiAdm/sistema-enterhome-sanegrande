import React, { useState, useEffect, useContext, use } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  IconButton,
  Tooltip,
} from "@mui/material";
import toast from "react-hot-toast";
import AuthContext from "@/app/context/AuthContext";
import { fetchedEmployeesByCompany, createExpense, updateExpense } from "./API";
import { useCompany } from "@/app/context/CompanyContext";
import NotificationManager from "@/app/components/NotificationManager/NotificationManager";
import { IoMdCloseCircleOutline } from "react-icons/io";
import InfoIcon from "@mui/icons-material/Info";

const FeriasModal = ({ open, onClose, onSave, item }) => {
  const { user } = useContext(AuthContext);
  const { company } = useCompany();

  const [employeeName, setEmployeeName] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [employeePosition, setEmployeePosition] = useState("");
  const [startDate, setStartDate] = useState("");
  const [status, setStatus] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [endDate, setEndDate] = useState("");
  const [holidayValue, setHolidayValue] = useState("");
  const [amount, setAmount] = useState("");
  const [additionalPayments, setAdditionalPayments] = useState("");
  const [attachment, setAttachment] = useState(null);

  const [employees, setEmployees] = useState([]);
  const [filteredEmployess, setFilteredEmployess] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");

  const [createdBy, setCreatedBy] = useState("");

  useEffect(() => {
    if (item) {
      setAmount(item?.amount || "");
      setEmployeeName(item?.employee?.name || "");
      setSelectedEmployee(item?.employee?._id || "");
      setStatus(item?.status || "");
      setStartDate(item?.startDate ? item?.startDate.split("T")[0] : ""); // Formatando a data
      setEndDate(item?.endDate ? item?.endDate.split("T")[0] : ""); // Formatando a data
      setHolidayValue(item?.holidayValue || "");
      setAdditionalPayments(item?.additionalPayments || "");
      setAttachment(item?.attachment || null);
      setSelectedStatus(item?.status || "");
    } else {
      resetForm();
    }
  }, [item]);

  useEffect(() => {
    const loadEmployees = async () => {
      const employeesData = await fetchedEmployeesByCompany(company?.name);
      const activeEmployees = employeesData.filter(
        (employee) => !employee.deletedAt
      );
      setEmployees(activeEmployees);
      setFilteredEmployess(activeEmployees);
    };
    loadEmployees();
  }, []); // O useEffect vai rodar sempre que a empresa mudar

  const handleTypeChange = (event) => {
    setSelectedEmployee(event.target.value);
  };

  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value);
  };

  const resetForm = () => {
    setEmployeeName("");
    setEmployeePosition("");
    setStartDate("");
    setEndDate("");
    setHolidayValue("");
    setAdditionalPayments("");
    setAttachment(null);
    setAmount("");
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0]; // Pega o primeiro arquivo
    console.log(file);
    if (file) {
      setAttachment(file); // Atualiza o estado com o nome do arquivo
    }
  };

  const handleRemoveFile = () => {
    setAttachment(null); // Remove o arquivo selecionado
  };

  const handleSaveExpense = (e) => {
    e.preventDefault();
    if (item) {
      handleUpdateExpense(); // Se existir item, chama a função de atualização
    } else {
      handleCreateExpense(); // Caso contrário, chama a função de criação
    }
  };

  const formatDate = (date) => {
    const newDate = new Date(date);

    // Formata a data no formato pt-BR (somente a data)
    const formattedDate = newDate.toLocaleDateString("pt-BR", {
      timeZone: "UTC",
    });

    // Formata o horário no formato HH:MM:SS
    const formattedTime = newDate.toLocaleTimeString("pt-BR", {
      timeZone: "UTC",
      hour12: false, // Para garantir que o horário seja exibido no formato de 24 horas
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    return `${formattedDate} ${formattedTime}`;
  };

  const handleUpdateExpense = async () => {
    const expenseData = new FormData();

    expenseData.append("type", "Vacation");
    expenseData.append("amount", amount);
    expenseData.append("createdBy", user?.name); // Adicionando o usuário que criou
    expenseData.append("updateBy", user?.name); // Inicialmente, o usuário de criação é o mesmo para a atualização
    expenseData.append("company", company?.name);
    expenseData.append("employee", selectedEmployee);
    expenseData.append("startDate", startDate);
    expenseData.append("endDate", endDate);
    expenseData.append("holidayValue", amount);
    expenseData.append("additionalPayments", additionalPayments);
    if (attachment) expenseData.append("attachment", attachment); // Anexando o arquivo, se houver
    expenseData.append("status", selectedStatus);

    try {
      const response = await updateExpense(expenseData, item?.id);
      if (response) {
        onSave(response);
        NotificationManager.success("Despesa atualizada com sucesso");
      } else {
        NotificationManager.error("Erro ao editar a despesa");
      }
      onClose();
    } catch (error) {
      NotificationManager.error("Erro ao editar a despesa");
    }
  };

  const handleCreateExpense = async () => {
    const expenseData = new FormData();

    expenseData.append("type", "Vacation");
    expenseData.append("amount", amount);
    expenseData.append("createdBy", user?.name); // Adicionando o usuário que criou
    expenseData.append("updateBy", user?.name); // Inicialmente, o usuário de criação é o mesmo para a atualização
    expenseData.append("company", company?.name);
    expenseData.append("employee", selectedEmployee);
    expenseData.append("startDate", startDate);
    expenseData.append("endDate", endDate);
    expenseData.append("holidayValue", amount);
    expenseData.append("additionalPayments", additionalPayments);
    if (attachment) expenseData.append("attachment", attachment);
    expenseData.append("status", selectedStatus);

    try {
      const response = await createExpense(expenseData);
      if (response) {
        onSave(response);
        NotificationManager.success("Despesa criada com sucesso");
      } else {
        NotificationManager.error("Erro ao criar a despesa");
      }
      onClose();
    } catch (error) {
      NotificationManager.error("Erro ao criar a despesa");
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          height: "auto",
          transform: "translate(-50%, -50%)",
          width: "40%",
          bgcolor: "background.paper",
          borderRadius: "5px",
          boxShadow: 24,
          p: 4,
        }}
      >
        {/* Botão para fechar o modal */}
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
          }}
        >
          <IoMdCloseCircleOutline />
        </IconButton>

        <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
          {item
            ? "Editar Despesa de Férias"
            : "Adicionar Nova Despesa de Férias"}
        </Typography>

        {item?.createdBy && item?.updateBy && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              paddingBottom: ".5rem",
            }}
          >
            <Tooltip
              title={
                <Box
                  sx={{
                    fontSize: ".75rem",
                    boxSizing: "border-box",
                    padding: ".5rem",
                  }}
                >
                  <div>
                    Criado por: {item?.createdBy} em{" "}
                    {formatDate(item?.createdAt)}
                  </div>
                  <div>
                    Atualizado por: {item?.updateBy} em{" "}
                    {formatDate(item?.updatedAt)}
                  </div>
                </Box>
              }
              arrow
            >
              <InfoIcon sx={{ cursor: "pointer", fontSize: "1.25rem" }} />
            </Tooltip>
          </Box>
        )}

        <FormControl fullWidth>
          <InputLabel>Funcionário</InputLabel>
          <Select
            value={selectedEmployee}
            onChange={handleTypeChange}
            label="Tipo de Despesa"
          >
            {employees?.map((employee) => (
              <MenuItem value={employee?._id} key={employee?._id}>
                {employee?.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          label="Data de Início das Férias"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          fullWidth
          label="Data de Término das Férias"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />

        <FormControl fullWidth sx={{ marginTop: ".8rem" }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={selectedStatus}
            onChange={handleStatusChange}
            label="Selecione o Status"
          >
            <MenuItem value={"Pendente"}>Pendente</MenuItem>
            <MenuItem value={"Paga"}>Paga</MenuItem>
            <MenuItem value={"Cancelada"}>Cancelada</MenuItem>
            <MenuItem value={"Atrasada"}>Atrasada</MenuItem>
          </Select>
        </FormControl>
        <TextField
          fullWidth
          label="Valor das Férias"
          type="number"
          value={amount}
          required
          onChange={(e) => setAmount(e.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Pagamentos Adicionais"
          type="number"
          value={additionalPayments}
          onChange={(e) => setAdditionalPayments(e.target.value)}
          margin="normal"
        />

        {/* Exibe o nome do arquivo ou link para download se houver um arquivo */}
        {attachment ? (
          <Box>
            <Typography variant="body2">
              Arquivo:{" "}
              {attachment?.name
                ? attachment?.name
                : attachment.split("/").pop()}
            </Typography>
          </Box>
        ) : (
          <Typography variant="body2">Nenhum arquivo anexado.</Typography>
        )}

        {/* Campo de upload de arquivo */}
        <Button variant="contained" component="label" sx={{ marginTop: 2 }}>
          {attachment ? "Substituir Arquivo" : "Adicionar Arquivo"}
          <input type="file" hidden onChange={handleFileChange} />
        </Button>

        <Box sx={{ mt: 3 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={(e) => handleSaveExpense(e)}
          >
            Salvar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default FeriasModal;
