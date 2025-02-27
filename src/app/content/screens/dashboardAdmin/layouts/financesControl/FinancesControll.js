import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  Tooltip,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import { FaEdit, FaTrash } from "react-icons/fa";
import toast from "react-hot-toast";

import ReportModal from "@/app/components/Modal/Admin/ReportModal";
import { deleteExpenseById, fetchedExpensesByCompany } from "./API";
import jsPDF from "jspdf";
import "jspdf-autotable";
import styles from "./FinancesControll.module.css";
import DescriptionIcon from "@mui/icons-material/Description";
import { useCompany } from "@/app/context/CompanyContext";
import FeriasModal from "@/app/components/Modal/Admin/ModalVacancy";
import AddCircleIcon from "@mui/icons-material/AddCircle";

function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="primeira página"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="página anterior"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="próxima página"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

export default function FinancesControll() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(4);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [currentExpense, setCurrentExpense] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [selectedExpense, setSelectedExpense] = useState("");
  const [newExpense, setNewExpense] = useState({
    type: "",
    description: "",
    eventDate: "",
    paymentDate: "",
    status: "",
    attachment: null,
  });

  const { company } = useCompany(); // Acessando a empresa selecionada do contexto

  const formatDate = (date) => {
    const newDate = new Date(date);
    return newDate.toLocaleDateString("pt-BR", { timeZone: "UTC" }); // Ajuste o idioma conforme necessário
  };

  useEffect(() => {
    // Carrega despesas ao selecionar uma empresa ou editar uma despesa
    if (company) {
      const loadExpenses = async () => {
        const expensesData = await fetchedExpensesByCompany(company.name);
        setExpenses(expensesData);
        console.log(expensesData);
        // Filtra despesas com type == "Termination"
        const filtered = expensesData.filter(
          (expense) => expense.type == "Vacation"
        );
        console.log(filtered);
        setFilteredExpenses(filtered);
      };

      loadExpenses();
    }
  }, [company, currentExpense]); // Adicione currentExpense para recarregar após edição

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenPlanModal = (expense) => {
    console.log(expense);
    setCurrentExpense(expense);
    setIsPlanModalOpen(true);
  };

  const handleClosePlanModal = () => {
    setIsPlanModalOpen(false);
    setCurrentExpense(null);
  };

  const handleCloseReportModal = () => {
    setIsReportModalOpen(false);
  };

  const handleSaveExpense = (updatedExpense) => {
    setExpenses((prevExpenses) =>
      prevExpenses?.map((expense) =>
        expense.id === updatedExpense.id ? updatedExpense : expense
      )
    );

    console.log(expenses);
  };

  const handleDeleteExpense = async (id) => {
    const deleted = await deleteExpenseById(id);
    if (deleted) {
      setExpenses((prevItem) => prevItem.filter((item) => item.id !== id));
      setFilteredExpenses((prevExpense) =>
        prevExpense.filter((expense) => expense.id !== id)
      );
      toast.success("Despesa excluída com sucesso.");
    }
  };

  function formatDateToDDMMYYYY(dateString) {
    const date = new Date(dateString); // Cria um objeto Date
    const day = String(date.getDate()).padStart(2, "0"); // Obtém o dia com dois dígitos
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Obtém o mês com dois dígitos (0-11, por isso +1)
    const year = date.getFullYear(); // Obtém o ano completo
    return `${day}/${month}/${year}`; // Retorna no formato dd/mm/aaaa
  }

  const generatePdf = () => {
    const doc = new jsPDF();

    // Obter a data e hora atual no formato desejado
    const now = new Date();
    const reportDate = `${now.toLocaleDateString(
      "pt-BR"
    )} ${now.toLocaleTimeString("pt-BR")}`;

    // Título principal
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Relatório Financeiro - Férias", 10, 10);

    // Nome da empresa
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(`Empresa: ${company.name}`, 10, 20);

    // Data e hora de geração do relatório
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(`Gerado em: ${reportDate}`, 10, 30);

    // Colunas do relatório
    const tableColumn = [
      "Funcionário",
      "Descrição",
      "Data Início",
      "Data Fim",
      "Valor",
      "Situação",
      "Criado por",
    ];

    const tableRows = [];

    // Preencher as linhas da tabela
    filteredExpenses.forEach((expense) => {
      const planData = [
        expense?.employee?.name,
        expense?.type == "Vacation" ? "Férias" : "-" || "-",
        formatDateToDDMMYYYY(expense?.startDate),
        formatDateToDDMMYYYY(expense?.endDate),
        expense?.amount.toLocaleString("pt-br", {
          style: "currency",
          currency: "BRL",
        }),
        expense?.status,
        expense?.createdBy,
      ];
      tableRows.push(planData);
    });

    // Calcular o total da coluna "Valor"
    const totalAmount = filteredExpenses?.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );

    // Gera a tabela no PDF
    doc.autoTable(tableColumn, tableRows, { startY: 40 });

    // Adicionar o total ao final
    const finalY = doc.lastAutoTable.finalY + 10; // Posição logo abaixo da tabela
    doc.setFont("helvetica", "bold");
    doc.text(
      `Total: ${totalAmount.toLocaleString("pt-br", {
        style: "currency",
        currency: "BRL",
      })}`,
      10,
      finalY
    );

    // Salva o PDF com o nome especificado
    doc.save("relatorio_itens.pdf");
  };

  const theme = useTheme();

  return (
    <Box className={styles.plans}>
      <Box
        sx={{
          borderBottom: "1px solid #d9d9d9",
          padding: ".0",
          marginTop: "-1rem",
        }}
      >
        <Typography
          typography="h4"
          style={{ fontWeight: "bold", color: "#1E3932" }}
        >
          Controle de Férias
        </Typography>
        <Typography
          typography="label"
          style={{
            padding: "0 0 1rem 0",
            color: "#1E3932",
            fontSize: ".875rem",
          }}
        >
          Gerencie as férias dos funcionários da{" "}
          <Typography variant="p" sx={{ fontWeight: "bold" }}>
            {company?.name}
          </Typography>
        </Typography>
      </Box>

      <TableContainer className={styles.plans__table__container}>
        <Box className={styles.plans__table__actions_download_new}>
          <Button
            variant="contained"
            style={{ background: "#fff", color: "black", borderRadius: "2px" }}
            className={styles.plans__search__input}
            onClick={generatePdf}
          >
            <DescriptionIcon
              sx={{ color: theme.palette.grey[600], width: "20px" }}
            />
            Gerar Relatório
          </Button>
          <Button
            variant="contained"
            style={{ background: "#fff", color: "black", borderRadius: "2px" }}
            className={styles.plans__search__input}
            onClick={() => handleOpenPlanModal()}
          >
            <AddCircleIcon
              sx={{ color: theme.palette.grey[600], width: "20px" }}
            />
            Criar
          </Button>
        </Box>
        <Table className={styles.plans__table}>
          <TableHead>
            <TableRow>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Funcionário
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Descrição
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Data Início
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Data Fim
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Valor
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Situação
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Anexo
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Ações
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredExpenses.map((expense) => {
              let statusBgColor = "";
              if (expense.status === "Paga") {
                statusBgColor = "#8BE78B";
              } else if (expense.status === "Pendente") {
                statusBgColor = "#F6F794";
              } else if (expense.status === "Atrasada") {
                statusBgColor = "red";
              } else if (expense.status === "Cancelada") {
                statusBgColor = "red";
              }

              return (
                <TableRow key={expense._id}>
                  <TableCell align="center">
                    {expense?.employee?.name}
                  </TableCell>
                  <TableCell align="center">
                    {expense?.type == "Vacation" ? "Férias" : ""}
                  </TableCell>
                  <TableCell align="center">
                    {formatDate(expense?.startDate)}
                  </TableCell>
                  <TableCell align="center">
                    {formatDate(expense?.endDate)}
                  </TableCell>
                  <TableCell align="center">
                    {expense?.amount?.toLocaleString("pt-br", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </TableCell>
                  <TableCell align="center">
                    <Box
                      style={{
                        backgroundColor: statusBgColor,
                        borderRadius: "8px",
                        padding: ".28rem",
                        color: statusBgColor === "#F6F794" ? "black" : "white",
                      }}
                    >
                      {expense.status}
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    {expense.attachment ? (
                      <a href={`${expense.attachment}`} target="_blank">
                        Ver Anexo
                      </a>
                    ) : (
                      "Nenhum"
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <Box className={styles.plans__table__actions}>
                      <Tooltip title="Editar Item">
                        <span>
                          <FaEdit
                            style={{ cursor: "pointer" }}
                            onClick={() => handleOpenPlanModal(expense)}
                          />
                        </span>
                      </Tooltip>
                      <Tooltip title="Excluir">
                        <span>
                          <FaTrash
                            style={{ cursor: "pointer" }}
                            color="red"
                            onClick={() => handleDeleteExpense(expense.id)}
                          />
                        </span>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: "Todos", value: -1 }]}
                colSpan={5}
                count={filteredExpenses.length}
                rowsPerPage={rowsPerPage}
                page={page}
                slotProps={{
                  select: {
                    inputProps: {
                      "aria-label": "Linhas por página",
                    },
                    native: true,
                  },
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
      {/* Modal para criar ou editar plano */}
      <FeriasModal
        open={isPlanModalOpen}
        onClose={handleClosePlanModal}
        onSave={handleSaveExpense}
        item={currentExpense}
      />

      {/* Modal para gerar relatório */}
      <ReportModal open={isReportModalOpen} onClose={handleCloseReportModal} />
    </Box>
  );
}
