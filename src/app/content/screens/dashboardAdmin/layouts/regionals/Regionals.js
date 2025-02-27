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
  TextField,
  Typography,
  Tooltip,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import ArticleIcon from "@mui/icons-material/Article";
import { FaEdit, FaTrash } from "react-icons/fa";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import AddIcon from "@mui/icons-material/Add";
import PlanModal from "@/app/components/Modal/Admin/InventoryModal";
import ReportModal from "@/app/components/Modal/Admin/ReportModal";
import { fetchedExpenses, deleteExpenseById, fetchedExpensesByCompany } from "./API";
import jsPDF from "jspdf";
import "jspdf-autotable";
import styles from './Regionals.module.css'
import ExpenseModal from "@/app/components/Modal/Admin/CreateFinances";
import { useCompany } from "@/app/context/CompanyContext";

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


export default function Regionals() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(4);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [currentExpense, setCurrentExpense] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [selectedExpense, setSelectedExpense] = useState('');
  const [newExpense, setNewExpense] = useState({
    type: "",
    description: "",
    eventDate: "",
    paymentDate: "",
    status: "",
    attachment: null,
  });

  const { company } = useCompany(); // Acessando a empresa selecionada do contexto


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0'); // Adiciona 0 à esquerda, se necessário
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Meses começam em 0
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };


  useEffect(() => {
    // Se uma empresa for selecionada, faça a requisição para buscar as despesas
    if (company) {
      const loadExpenses = async () => {
        const expensesData = await fetchedExpensesByCompany(company.name); // Passe o nome da empresa
        setExpenses(expensesData);
        setFilteredExpenses(expensesData);
      };

      loadExpenses();
    }
  }, [company]);  // O useEffect vai rodar sempre que a empresa mudar

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenPlanModal = (expense) => {
    console.log(expense)
    setCurrentExpense(expense);
    setIsPlanModalOpen(true);
  };

  const handleClosePlanModal = () => {
    setIsPlanModalOpen(false);
    setCurrentExpense(null);
  };

  const handleOpenReportModal = () => {
    setIsReportModalOpen(true);
  };

  const handleCloseReportModal = () => {
    setIsReportModalOpen(false);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewExpense((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setNewExpense((prev) => ({ ...prev, attachment: e.target.files[0] }));
  };

  const handleSaveExpense = () => {
    setPlans((prev) => [...prev, newExpense]);
    setNewExpense({
      type: "",
      description: "",
      eventDate: "",
      paymentDate: "",
      status: "",
      attachment: null,
    });
  };

  const handleDeleteExpense = async (id) => {
    const deleted = await deleteExpenseById(id);
    if (deleted) {
      setExpenses((prevItem) => prevItem.filter((item) => item.id !== id));
      setFilteredExpenses((prevExpense) => prevExpense.filter((expense) => expense.id !== id));
      toast.success('Despesa excluída com sucesso.')
    }
  };

  function formatDateToDDMMYYYY(dateString) {
    const date = new Date(dateString); // Cria um objeto Date
    const day = String(date.getDate()).padStart(2, '0'); // Obtém o dia com dois dígitos
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Obtém o mês com dois dígitos (0-11, por isso +1)
    const year = date.getFullYear(); // Obtém o ano completo
    return `${day}/${month}/${year}`; // Retorna no formato dd/mm/aaaa
  }
  
  console.log(company)

  const generatePdf = () => {
    const doc = new jsPDF();
  
    // Obter a data e hora atual no formato desejado
    const now = new Date();
    const reportDate = `${now.toLocaleDateString("pt-BR")} ${now.toLocaleTimeString("pt-BR")}`;
  
    // Título principal
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Relatório Financeiro", 10, 10);
  
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
      "Tipo",
      "Descrição",
      "Data Evento",
      "Data Pagamento",
      "Valor",
      "Forma Pag.",
      "Situação",
      "Criado por"
    ];
  
    const tableRows = [];
  
    // Preencher as linhas da tabela
    filteredExpenses.forEach((expense) => {
      const planData = [
        expense?.type,
        expense?.description || "-",
        formatDateToDDMMYYYY(expense?.eventDate),
        formatDateToDDMMYYYY(expense?.paymentDate),
        expense?.amount.toLocaleString("pt-br", { style: "currency", currency: "BRL" }),
        expense?.paymentMethod,
        expense?.status,
        expense?.createdBy,
      ];
      tableRows.push(planData);
    });
  
    // Calcular o total da coluna "Valor"
    const totalAmount = filteredExpenses?.reduce((sum, expense) => sum + expense.amount, 0);
  
    // Gera a tabela no PDF
    doc.autoTable(tableColumn, tableRows, { startY: 40 });
  
    // Adicionar o total ao final
    const finalY = doc.lastAutoTable.finalY + 10; // Posição logo abaixo da tabela
    doc.setFont("helvetica", "bold");
    doc.text(`Total: ${totalAmount.toLocaleString("pt-br", { style: "currency", currency: "BRL" })}`, 10, finalY);
  
    // Salva o PDF com o nome especificado
    doc.save("relatorio_itens.pdf");
  };
  
  


  return (
    <Box className={styles.plans}>
      <Typography
        typography="h4"
        style={{ fontWeight: "bold", color: "#1E3932" }}
      >
        Finanças
      </Typography>
      <Typography
        typography="label"
        style={{ padding: "0 0 1rem 0", color: "#1E3932", fontSize: ".875rem" }}
      >
        Gerencie todos as suas finanças e despesas
      </Typography>

      <TableContainer component={Paper} className={styles.plans__table__container}>
        <Box className={styles.plans__table__actions_download_new}>
          <Button
            variant="contained"
            style={{ background: "#fff", color: 'black', borderRadius: '2px' }}
            className={styles.plans__search__input}
            onClick={generatePdf}
          >
            <ArticleIcon />
            Gerar Relatório
          </Button>
          <Button
            variant="contained"
            style={{ background: "#fff", color: "#000", borderRadius: '2px' }}
            className={styles.plans__search__input}
            onClick={() => handleOpenPlanModal()}
          >
            <AddIcon />
            Novo Item
          </Button>
        </Box>
        <Table className={styles.plans__table}>
          <TableHead>
            <TableRow>
              <TableCell  align="center" sx={{fontWeight: 'bold'}}>Tipo</TableCell>
              <TableCell  align="center" sx={{fontWeight: 'bold'}}>Descrição</TableCell>
              <TableCell  align="center" sx={{fontWeight: 'bold'}}>Data do Evento</TableCell>
              <TableCell  align="center" sx={{fontWeight: 'bold'}}>Data de Pagamento</TableCell>
              <TableCell  align="center" sx={{fontWeight: 'bold'}}>Valor</TableCell>
              <TableCell  align="center" sx={{fontWeight: 'bold'}}>Forma de Pagamento</TableCell>
              <TableCell  align="center" sx={{fontWeight: 'bold'}}>Situação</TableCell>
              <TableCell  align="center" sx={{fontWeight: 'bold'}}>Anexo</TableCell>
              <TableCell  align="center" sx={{fontWeight: 'bold'}}>Ações</TableCell>
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
                  <TableCell align="center">{expense.type}</TableCell>
                  <TableCell align="center">{expense.description}</TableCell>
                  <TableCell align="center">{formatDate(expense.eventDate)}</TableCell>
                  <TableCell align="center">{formatDate(expense.paymentDate)}</TableCell>
                  <TableCell align="center">{(expense.amount).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</TableCell>
                  <TableCell align="center">{expense.paymentMethod}</TableCell>
                  <TableCell align="center">
                    <Box style={{
                      backgroundColor: statusBgColor,
                      borderRadius: '8px',
                      padding: '.28rem',
                      color: statusBgColor === '#F6F794' ? 'black' : 'white'
                    }}>{expense.status}</Box>
                  </TableCell>
                  <TableCell align="center">
                    {expense.attachment ? (
                      <a href={expense.attachment} target="_blank">
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
              )
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
      <ExpenseModal
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
