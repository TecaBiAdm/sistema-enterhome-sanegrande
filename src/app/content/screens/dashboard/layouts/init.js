import React from "react";
import { Box, List, Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TablePagination, TableRow, Typography } from "@mui/material";
import styles from './Init.module.css'
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';

function TablePaginationActions(props) {
    const theme = useTheme();
    const { count, page, rowsPerPage, onPageChange } = props;
  
    const handleFirstPageButtonClick = (
      event
    ) => {
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
          {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
        </IconButton>
        <IconButton
          onClick={handleBackButtonClick}
          disabled={page === 0}
          aria-label="previous page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
        </IconButton>
        <IconButton
          onClick={handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="next page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
        </IconButton>
        <IconButton
          onClick={handleLastPageButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="last page"
        >
          {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
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
  
    const handleChangePage = (
      event,
      newPage
    ) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (
      event
    ) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    };
}
export default function Init(){

    function createData(name, calories, fat) {
        return { name, calories, fat };
      }
      const [page, setPage] = React.useState(0);
      const [rowsPerPage, setRowsPerPage] = React.useState(5);
      const rows = [
        createData('Café 150g - Avelã', 305, 3.7),
        createData('Café 150g - Baunilha', 452, 25.0),
        createData('Café 150g - Caramelo', 262, 16.0),
        createData('Café 150g - Tradicional', 159, 6.0),
        createData('Capuccino - Caseiro', 356, 16.0),
        createData('Capuccino - Expresso', 408, 3.2),
        createData('Café 200g - Tradicional', 237, 9.0),
      ].sort((a, b) => (a.calories < b.calories ? -1 : 1));
      
      const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const handleChangePage = (
    event,
    newPage
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };


    return(
        <Box className={styles.init}>
            <Box className={styles.init__top}>
                <Box className={styles.init__top__brown_1}>
                   
                </Box>
                <Box className={styles.init__top__brown_2}>
                    
                </Box>
                <Box className={styles.init__top__brown_3}>
                    
                </Box>
            </Box>

            <TableContainer component={Paper}  className={styles.init__table}>
              <Typography typography="h6">Novos Produtos</Typography>
              <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
                <TableHead>
                  <TableRow>
                    <TableCell>Nome</TableCell>
                    <TableCell align="right">Categoria</TableCell>
                    <TableCell align="right">Marca</TableCell>
                    <TableCell align="right">Descrição</TableCell>
                    <TableCell align="right">Quantidade</TableCell>
                    <TableCell align="right">Valor</TableCell>
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
                      <TableCell style={{ width: 160 }} align="right">
                          {row.calories}
                      </TableCell>
                      <TableCell style={{ width: 160 }} align="right">
                          {row.fat}
                      </TableCell>
                      <TableCell style={{ width: 160 }} align="right">
                          {row.fat}
                      </TableCell>
                      <TableCell style={{ width: 160 }} align="right">
                          {row.fat}
                      </TableCell>
                      <TableCell style={{ width: 160 }} align="right">
                          {row.fat}
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
                        rowsPerPageOptions={[5, 10, 25, { label: 'Todos', value: -1 }]}
                        colSpan={6}
                        count={rows.length}
                        rowsPerPage={rowsPerPage}
                        labelRowsPerPage={"Linhas por Página"}
                        page={page}
                        slotProps={{
                          pagination: {
                            labelRowsPerPage: "Linhas por Página",
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
    )
}