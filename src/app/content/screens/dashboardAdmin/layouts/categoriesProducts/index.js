import React from "react";
import { useState } from "react";
import {
  Box,
  Button,
  List,
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
  Tooltip,
  Typography,
} from "@mui/material";

import styles from "./Categories.module.css";
import { useTheme } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import ArticleIcon from "@mui/icons-material/Article";
import { FaEdit, FaTrash } from "react-icons/fa";
import AddIcon from "@mui/icons-material/Add";
import PlanModal from "@/app/components/Modal/Admin/InventoryModal";
import ReportModal from "@/app/components/Modal/Admin/ReportModal";

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

export function CustomPaginationActionsTable() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
}

export default function CategoriesProducts() {
  function createData(name, description, value, status) {
    return { name, description};
  }
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const rows = [
    createData("Plano Iniciante", "Descrição"),
    createData("Plano Premium", "Descrição"),
    createData("Plano Café do Mês", "Descrição"),
  ].sort((a, b) => (a.calories < b.calories ? -1 : 1));

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

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

  return (
    <Box className={styles.plans}>
      <Typography
        typography="h4"
        style={{ fontWeight: "bold", color: "#1E3932" }}
      >
        Categorias
      </Typography>

      <Typography
        typography="label"
        style={{ padding: "0 0 1rem 0", color: "#1E3932", fontSize: ".875rem" }}
      >
        Gerencie todas as categorias dos seus produtos
      </Typography>
      <TableContainer component={Paper} className={styles.plans__table}>
        <Box className={styles.plans__table__top}>
          <Box className={styles.plans__table__search}>
            <TextField
              maxRows="1"
              id="outlined-basic"
              label="Pesquise os planos"
              variant="outlined"
              className={styles.plans__table__input}
            />
            <Button
              style={{ background: "#D9D9D9", color: "#000" }}
              variant="contained"
              className={styles.plans__table__button}
            >
              Pesquisar
            </Button>
          </Box>
          <Box className={styles.plans__table__actions}>
            <Button
              variant="contained"
              style={{ background: "#4E392A" }}
              className={styles.plans__search__input}
              onClick={handleOpenReportModal}
            >
              <ArticleIcon />
              Gerar Relatório
            </Button>
            <Button
              variant="contained"
              style={{ background: "#1E3932" }}
              className={styles.plans__search__input}
              onClick={handleOpenPlanModal}
            >
              <AddIcon />
              Nova Categoria
            </Button>
          </Box>
        </Box>
        <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Nome</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Descrição</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Ação</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : rows
            ).map((row) => (
              <TableRow key={row.name}>
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell>{row.description}</TableCell>
                <TableCell>
                <Tooltip title="Editar categoria">
                    <span>
                      <FaEdit style={{ cursor: "pointer" }} />{" "}
                    </span>
                  </Tooltip>

                  <Tooltip title="Excluir categoria">
                    <span>
                      <FaTrash style={{ cursor: "pointer" }} color="red" />
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
                count={rows.length}
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
      {/* Modal para criar novo plano */}
      <PlanModal open={isPlanModalOpen} onClose={handleClosePlanModal} />

      {/* Modal para gerar relatório */}
      <ReportModal open={isReportModalOpen} onClose={handleCloseReportModal} />
    </Box>
  );
}
