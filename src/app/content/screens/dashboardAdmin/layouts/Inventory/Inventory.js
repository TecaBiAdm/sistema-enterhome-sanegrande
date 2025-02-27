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
} from "@mui/material";
import styles from "./Inventory.module.css";
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
import { fetchItems, fetchRegionals, deleteItemById} from "./API";
import jsPDF from "jspdf";
import "jspdf-autotable";
import HeaderDashboard from "@/app/components/HeaderDashboard";

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
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
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
        aria-label="next page"
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

export default function Inventory() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(4);
  const [plans, setPlans] = useState([]);
  const [filteredPlans, setFilteredPlans] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [currentPlan, setCurrentPlan] = useState([]);
  const [regionals, setRegionals] = useState([]);
  const [selectedRegional, setSelectedRegional] = useState('');

  useEffect(() => {
    const getItems = async () => {
      const plansFromApi = await fetchItems();
      setPlans(plansFromApi);
      setFilteredPlans(plansFromApi);
    };

    const getRegionals = async () => {
      const regionalsFromApi = await fetchRegionals();  
      setRegionals(regionalsFromApi);
    };

    getItems();
    getRegionals();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenPlanModal = (plan) => {
    setCurrentPlan(plan);
    setIsPlanModalOpen(true);
  };

  const handleClosePlanModal = () => {
    setIsPlanModalOpen(false);
    setCurrentPlan(null);
  };

  const handleOpenReportModal = () => {
    setIsReportModalOpen(true);
  };

  const handleCloseReportModal = () => {
    setIsReportModalOpen(false);
  };

  const handleSavePlan = (savedPlan) => {
    if (currentPlan) {
      setPlans((prevPlans) =>
        prevPlans.map((plan) => (plan.id === savedPlan.id ? savedPlan : plan))
      );
    } else {
      setPlans((prevPlans) => [...prevPlans, savedPlan]);
    }
    setFilteredPlans(plans); 
  };

  const handleDeleteItem = async (id) => {
    const deleted = await deleteItemById(id);
    if (deleted) {
      setPlans((prevItem) => prevItem.filter((item) => item.id !== id));
      setFilteredPlans((prevItem) => prevItem.filter((item) => item.id !== id));
      toast.success('Item excluído com sucesso')
    }
  };

  const handleRegionalChange = (event) => {
    setSelectedRegional(event.target.value);
    const filtered = plans.filter((plan) => plan.regionalCode === event.target.value);
    setFilteredPlans(filtered);
  };

  const handleSearch = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    const filtered = plans.filter((plan) =>
      plan.name.toLowerCase().includes(value.toLowerCase()) ||
      plan.description.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredPlans(filtered);
  };

  const generatePdf = () => {
    const doc = new jsPDF();
    doc.text("Relatório de Itens", 10, 10);
  
    // Colunas do relatório
    const tableColumn = [
      "Nome", 
      "Quantidade", 
      "Descrição", 
      "Nº Patrimônio", 
      "Marca", 
      "Modelo", 
      "Condição", 
      "Localização", 
    ];
  
    const tableRows = [];
  
    filteredPlans.forEach(plan => {
      const planData = [
        plan.name, // Nome
        plan.quantity || "-", // Quantidade (com fallback para "-" se não houver valor)
        plan.description || "-", // Descrição
        plan.patrimonyNumber || "-", // Número de Patrimônio
        plan.brand || "-", // Marca
        plan.model || "-", // Modelo
        plan.condition || "-", // Condição
        plan.location || "-", // Localização
      ];
      tableRows.push(planData);
    });
  
    // Gera a tabela no PDF
    doc.autoTable(tableColumn, tableRows, { startY: 20 });
  
    // Salva o PDF com o nome especificado
    doc.save("relatorio_itens.pdf");
  };
  


  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredPlans.length) : 0;

  return (
    <Box className={styles.plans}>
      <Toaster />
      <HeaderDashboard
        subtitle="Gerencie todos os itens da empresa"
        title="Inventário"
      />


      <TableContainer className={styles.plans__table}>
        <Box className={styles.plans__table__top}>
          <Box className={styles.plans__table__search}>
            <Typography variant="p">Filtrar por Regional</Typography>
            <Select
              value={selectedRegional}
              onChange={handleRegionalChange}
              displayEmpty
              fullWidth
            >
              <MenuItem value="">
                Selecione uma regional
              </MenuItem>
              {regionals.map((regional) => (
                <MenuItem key={regional.regionalCode} value={regional.regionalCode}>
                  {regional.name}
                </MenuItem>
              ))}
            </Select>
            
          </Box>
          <Box className={styles.plans__table__actions}>
            <Button
              variant="contained"
              style={{ background: "#fff", color: 'black', borderRadius: '2px'}}
              className={styles.plans__search__input}
              onClick={generatePdf}
            >
              <ArticleIcon />
              Gerar Relatório
            </Button>
            <Button
              variant="contained"
              style={{ background: "#fff", color: "#000", borderRadius: '2px'}}
              className={styles.plans__search__input}
              onClick={() => handleOpenPlanModal()}
            >
              <AddIcon />
              Novo Item
            </Button>
          </Box>
        </Box>
        <Table sx={{ minWidth: 500}} aria-label="custom pagination table" >
          <TableHead>
            <TableRow>
            
              <TableCell style={{ fontWeight: "normal" }}>Nome</TableCell>
              <TableCell style={{ fontWeight: "normal" }}>Quantidade</TableCell>
              <TableCell style={{ fontWeight: "normal" }}>Estado de Conservação</TableCell>
              <TableCell style={{ fontWeight: "normal" }}>Localização</TableCell>
              <TableCell style={{ fontWeight: "normal" }}>Marca</TableCell>
              <TableCell style={{ fontWeight: "normal" }}>Modelo</TableCell>
              <TableCell style={{ fontWeight: "normal" }}>Nº Série</TableCell>
              <TableCell style={{ fontWeight: "normal" }}>Nº Patrimônio</TableCell>
              <TableCell style={{ fontWeight: "normal" }}>Ação</TableCell>
            
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? filteredPlans.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : filteredPlans
            ).map((plan) => (
              <TableRow key={plan.id}>
                <TableCell component="th" scope="row">
                  {plan.name}
                </TableCell>
                <TableCell>{plan.quantity}</TableCell>
                <TableCell>{plan.condition}</TableCell>
                <TableCell>
                  {plan.location}
                </TableCell>
                <TableCell>
                  {plan.brand}
                </TableCell>
                <TableCell>
                  {plan.model}
                </TableCell>

                <TableCell>
                  {plan.serialNumber}
                </TableCell>
                <TableCell>
                  {plan.patrimonyNumber}
                </TableCell>
    
                <TableCell style={{display: 'flex', gap: '1rem'}}>
                  <Tooltip title="Editar Item">
                    <span>
                      <FaEdit
                        style={{ cursor: "pointer" }}
                        onClick={() => handleOpenPlanModal(plan)}
                      />
                    </span>
                  </Tooltip>
                  <Tooltip title="Excluir">
                    <span>
                      <FaTrash
                        style={{ cursor: "pointer" }}
                        color="red"
                        onClick={() => handleDeleteItem(plan.id)}
                      />
                    </span>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={8} />
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: "Todos", value: -1 }]}
                colSpan={5}
                count={filteredPlans.length}
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
      <PlanModal
        open={isPlanModalOpen}
        onClose={handleClosePlanModal}
        onSave={handleSavePlan}
        item={currentPlan}
      />

      {/* Modal para gerar relatório */}
      <ReportModal open={isReportModalOpen} onClose={handleCloseReportModal} />
    </Box>
  );
}
