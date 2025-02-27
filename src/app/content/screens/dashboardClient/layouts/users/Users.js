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
  Typography,
} from "@mui/material";

import styles from "./users.module.css";
import { useTheme } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import ArticleIcon from '@mui/icons-material/Article';
import AddIcon from '@mui/icons-material/Add';
import CreateUserModal from "@/app/components/Modal/Admin/CreateUserModal";

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
  const [rowsPerPage, setRowsPerPage] = useState(5);

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
export default function Users() {
  function createData(id, name, email, password, position) {
    return { id, name, email, password, position };
  }

  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false); 
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const rows = [
    createData(1,"João Silva", "joao.silva@example.com",  "Funcionário"),
    createData(2, "Maria Santos", "maria.santos@example.com", "Admin"),
    createData(3, "Pedro Oliveira", "pedro.oliveira@example.com", "Cliente"),
    createData(4, "Ana Costa", "ana.costa@example.com", "Estoque"),
    createData(5, "Laura Ferreira", "laura.ferreira@example.com", "Admin"),
    createData(6, "Carlos Martins", "carlos.martins@example.com", "Estoque"),
    createData(7, "Camila Almeida", "camila.almeida@example.com", "Funcionário"),
    createData(8, "Rafael Sousa", "rafael.sousa@example.com", "Funcionário"),
    createData(9, "Fernanda Lima", "fernanda.lima@example.com", "Admin")

  ].sort((a, b) => (a.id < b.id ? -1 : 1));

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenCreateUserModal = () => {
    setIsCreateUserModalOpen(true);
  };

  const handleCloseCreateUserModal = () => {
    setIsCreateUserModalOpen(false);
  };


  return (
    <Box className={styles.users}>
      <Typography typography="h4" style={{ padding: "1rem", fontWeight: "bold", color: "#1E3932"}}>
        Usuários
      </Typography>
      <TableContainer component={Paper} className={styles.users__table}>
        <Box className={styles.users__table__top}>
            <Box className={styles.users__table__search}>
                <TextField maxRows="1" id="outlined-basic" label="Pesquise os planos" variant="outlined" className={styles.users__table__input} />
                <Button style={{background: '#D9D9D9', color: '#000'}} variant="contained" className={styles.users__table__button}>Pesquisar</Button>
            </Box>
            <Box className={styles.users__table__actions}>
                <Button variant="contained" style={{background: '#4E392A'}} className={styles.users__search__input} >
                    <ArticleIcon/>
                    Gerar Relatório
                </Button>
                <Button variant="contained" style={{background: '#1E3932'}} className={styles.users__search__input} onClick={handleOpenCreateUserModal}>
                    <AddIcon/>
                    Novo Usuário
                </Button>
            </Box>
        </Box>
        <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>ID</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Nome</TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                E-mail
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                Cargo
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : rows
            ).map((row) => (
              <TableRow key={row.name}>
                <TableCell component="th" scope="row">
                  {row.id}
                </TableCell>
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell style={{ width: 160 }} align="right">
                  {row.email}
                </TableCell>
                <TableCell style={{ width: 160 }} align="right">
                  {row.position}
                </TableCell>
              </TableRow>
            ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: "Todos", value: -1 }]}
                colSpan={6}
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
       {/* Modal para gerar relatório */}
       <CreateUserModal open={isCreateUserModalOpen} onClose={handleCloseCreateUserModal} />
    </Box>
  );
}
