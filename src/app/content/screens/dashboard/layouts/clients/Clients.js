import React from "react";
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

import styles from "./Clients.module.css";
import { useTheme } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import ArticleIcon from '@mui/icons-material/Article';
import AddIcon from '@mui/icons-material/Add';

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

  // Avoid a layout jump when reaching the last page with empty rows.
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
export default function Clients() {
  function createData(id, name, rg, cpf, phone, birthdate, adress, email, password ) {
    return { id, name, rg, cpf, phone, birthdate, adress, email, password };
  }
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const rows = [
    createData(1, "Antônio Silva", "9876543", "456.789.123-10", "+55 11 91234-5678", "1984-02-12", "Rua das Flores, 123", "antonio.silva@example.com", "silva123"),
    createData(2, "Juliana Oliveira", "5432167", "654.321.987-10", "+55 11 92345-6789", "1979-09-08", "Avenida Central, 456", "juliana.oliveira@example.com", "juliana456"),
    createData(3, "Lucas Pereira", "3217654", "321.654.987-10", "+55 11 93456-7890", "1993-12-20", "Rua dos Pássaros, 789", "lucas.pereira@example.com", "lucas789"),
    createData(4, "Patrícia Santos", "6543217", "789.123.456-10", "+55 11 94567-8901", "1986-06-30", "Avenida das Árvores, 321", "patricia.santos@example.com", "patricia123"),
    createData(5, "Gabriel Souza", "4321765", "147.258.369-10", "+55 11 95678-9012", "1990-11-18", "Rua dos Coqueiros, 987", "gabriel.souza@example.com", "souza123"),
    createData(6, "Ana Paula Lima", "3217654", "258.369.147-10", "+55 11 96789-0123", "1982-04-12", "Avenida dos Girassóis, 654", "anapaula.lima@example.com", "anapaula456"),
    createData(7, "Paulo Martins", "7654321", "369.147.258-10", "+55 11 97890-1234", "1997-07-05", "Rua das Pedras, 147", "paulo.martins@example.com", "paulo789"),
    createData(8, "Isabela Costa", "5432167", "147.258.369-10", "+55 11 98901-2345", "1980-10-28", "Avenida dos Pinheiros, 258", "isabela.costa@example.com", "isabela123"),
    createData(9, "Marcos Lima", "3217654", "369.147.258-10", "+55 11 98901-2345", "1996-01-05", "Rua das Rosas, 369", "marcos.lima@example.com", "marcos123"),
    createData(10, "Renata Oliveira", "7654321", "369.147.258-10", "+55 11 98901-2345", "1983-04-28", "Avenida dos Lírios, 147", "renata.oliveira@example.com", "renata123")

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

  return (
    <Box className={styles.clients}>
      <Typography typography="h4" style={{ padding: "1rem", fontWeight: "bold", color: "#1E3932"}}>
        Clientes
      </Typography>
      <TableContainer component={Paper} className={styles.clients__table}>
        <Box className={styles.clients__table__top}>
          <Box className={styles.clients__table__search}>
            <TextField
              maxRows="1"
              id="outlined-basic"
              label="Pesquise clientes"
              variant="outlined"
              className={styles.clients__table__input}
            />
            <Button
              style={{ background: "#D9D9D9", color: "#000" }}
              variant="contained"
              className={styles.clients__table__button}
            >
              Pesquisar
            </Button>
          </Box>
          <Box className={styles.clients__table__actions}>
            <Button
              variant="contained"
              style={{ background: "#4E392A" }}
              className={styles.clients__search__input}
            >
              <ArticleIcon />
              Gerar Relatório
            </Button>
            <Button
              variant="contained"
              style={{ background: "#1E3932" }}
              className={styles.clients__search__input}
            >
              <AddIcon />
              Novo Produto
            </Button>
          </Box>
        </Box>
        <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>ID</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Nome</TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                RG
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                CPF
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                Telefone
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                Data de nascimento
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                Endereço
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                Email
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                Senha
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
                  {row.rg}
                </TableCell>
                <TableCell style={{ width: 160 }} align="right">
                  {row.cpf}
                </TableCell>
                <TableCell style={{ width: 160 }} align="right">
                  {row.phone}
                </TableCell>
                <TableCell style={{ width: 160 }} align="right">
                  {row.birthdate}
                </TableCell>
                <TableCell style={{ width: 160 }} align="right">
                  {row.adress}
                </TableCell>
                <TableCell style={{ width: 160 }} align="right">
                  {row.email}
                </TableCell>
                <TableCell style={{ width: 160 }} align="right">
                  {row.password}
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
                colSpan={7}
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
    </Box>
  );
}
