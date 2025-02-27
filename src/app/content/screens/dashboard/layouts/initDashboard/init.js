import React from "react";
import {
  Box,
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
  Typography,
} from "@mui/material";
import styles from "./Init.module.css";
import { useTheme } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";

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
export default function Init() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const createCoffeeData = (
    id,
    nome,
    categoria,
    marca,
    descricao,
    quantidade,
    valor
  ) => {
    return { id, nome, categoria, marca, descricao, quantidade, valor };
  };

  const rows = [
    createCoffeeData(
      1,
      "Café 150g - Avelã",
      "Café",
      "Marca A",
      "Descrição do café de Avelã",
      150,
      3.7
    ),
    createCoffeeData(
      2,
      "Café 150g - Baunilha",
      "Café",
      "Marca B",
      "Descrição do café de Baunilha",
      150,
      25.0
    ),
    createCoffeeData(
      3,
      "Café 150g - Caramelo",
      "Café",
      "Marca C",
      "Descrição do café de Caramelo",
      150,
      16.0
    ),
    createCoffeeData(
      4,
      "Café 150g - Tradicional",
      "Café",
      "Marca D",
      "Descrição do café Tradicional",
      150,
      6.0
    ),
    createCoffeeData(
      5,
      "Capuccino - Caseiro",
      "Capuccino",
      "Marca E",
      "Descrição do Capuccino Caseiro",
      250,
      16.0
    ),
    createCoffeeData(
      6,
      "Capuccino - Expresso",
      "Capuccino",
      "Marca F",
      "Descrição do Capuccino Expresso",
      250,
      3.2
    ),
    createCoffeeData(
      7,
      "Café 200g - Tradicional",
      "Café",
      "Marca G",
      "Descrição do café Tradicional",
      200,
      9.0
    ),
  ].sort((a, b) => (a.quantidade < b.quantidade ? -1 : 1));
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
    <Box className={styles.init}>
      <Box className={styles.init__top}>
        <Box className={styles.init__top__brown_1}></Box>
        <Box className={styles.init__top__brown_2}></Box>
        <Box className={styles.init__top__brown_3}></Box>
      </Box>

      <TableContainer component={Paper} className={styles.init__table}>
        <Typography
          typography="h6"
          style={{ fontWeight: "bold", color: "#1E3932" }}
        >
          Novos Produtos Adicionados
        </Typography>
        <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
          <TableHead>
            <TableRow>
              <TableCell style={{ fontWeight: "bold" }}>ID</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Nome</TableCell>
              <TableCell align="right" style={{ fontWeight: "bold" }}>
                Categoria
              </TableCell>
              <TableCell align="right" style={{ fontWeight: "bold" }}>
                Marca
              </TableCell>
              <TableCell align="right" style={{ fontWeight: "bold" }}>
                Descrição
              </TableCell>
              <TableCell align="right" style={{ fontWeight: "bold" }}>
                Quantidade
              </TableCell>
              <TableCell align="right" style={{ fontWeight: "bold" }}>
                Valor
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
                <TableCell style={{ width: 160 }} align="right">
                  {row.nome}
                </TableCell>
                <TableCell style={{ width: 160 }} align="right">
                  {row.categoria}
                </TableCell>
                <TableCell style={{ width: 160 }} align="right">
                  {row.marca}
                </TableCell>
                <TableCell style={{ width: 160 }} align="right">
                  {row.descricao}
                </TableCell>
                <TableCell style={{ width: 160 }} align="right">
                  {row.quantidade}
                </TableCell>
                <TableCell style={{ width: 160 }} align="right">
                  {row.valor}
                </TableCell>
              </TableRow>
            ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={7} />
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
