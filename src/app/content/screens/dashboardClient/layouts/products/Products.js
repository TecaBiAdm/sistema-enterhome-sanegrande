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

import styles from "./Products.module.css";
import { useTheme } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import ArticleIcon from "@mui/icons-material/Article";
import AddIcon from "@mui/icons-material/Add";
import { FaEdit, FaTrash } from "react-icons/fa";
import ProductModal from "@/app/components/Modal/Admin/CreateProductsModal";

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
export default function ProductsClient() {
  function createData(name, calories, fat) {
    return { name, calories, fat };
  }
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false); 
  // Função para criar um objeto de dados de café
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
      3,
      3.7
    ),
    createCoffeeData(
      2,
      "Café 150g - Baunilha",
      "Café",
      "Marca B",
      "Descrição do café de Baunilha",
      1,
      25.0
    ),
    createCoffeeData(
      3,
      "Café 150g - Caramelo",
      "Café",
      "Marca C",
      "Descrição do café de Caramelo",
      1,
      16.0
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

  const handleOpenCreateProductModal = () => {
    console.log(isProductModalOpen)
    setIsProductModalOpen(true);
  };

  const handleCloseProductModal = () => {
    setIsProductModalOpen(false);
  };
 

  return (
    <Box className={styles.product}>
      <Typography
        typography="h4"
        style={{fontWeight: "bold", color: "#1E3932"}}
      >
        Meus Produtos
      </Typography>

      <Typography typography="label" style={{padding: '0 0 1rem 0', color: "#1E3932", fontSize: '.875rem'}}>
        Visualize seus produtos já adquiridos conosco
      </Typography>
      <TableContainer component={Paper} className={styles.product__table}>
        <Box className={styles.product__table__top}>
          <Box className={styles.product__table__search}>
            <TextField
              maxRows="1"
              id="outlined-basic"
              label="Pesquise os produtos"
              variant="outlined"
              className={styles.product__table__input}
            />
            <Button
              style={{ background: "#D9D9D9", color: "#000" }}
              variant="contained"
              className={styles.product__table__button}
            >
              Pesquisar
            </Button>
          </Box>
        </Box>
        <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>ID</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Nome</TableCell>
              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Categoria
              </TableCell>
              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Marca
              </TableCell>
              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Descrição
              </TableCell>
              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Quantidade
              </TableCell>
              <TableCell align="left" sx={{ fontWeight: "bold" }}>
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
                <TableCell component="th" scope="row">
                  {row.nome}
                </TableCell>
                <TableCell style={{ width: 160 }} align="left">
                  {row.categoria}
                </TableCell>
                <TableCell style={{ width: 160 }} align="left">
                  {row.marca}
                </TableCell>
                <TableCell style={{ width: 160 }} align="left">
                  {row.descricao}
                </TableCell>
                <TableCell style={{ width: 160 }} align="left">
                  {row.quantidade}
                </TableCell>
                <TableCell style={{ width: 160 }} align="left">
                  {(row.valor).toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}
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
                colSpan={8}
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
        {/* Modal para criar produto */}
        <ProductModal open={isProductModalOpen} onClose={handleCloseProductModal} />
    </Box>
  );
}
