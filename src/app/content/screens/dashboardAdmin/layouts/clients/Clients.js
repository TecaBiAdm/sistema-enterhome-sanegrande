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
  IconButton
} from "@mui/material";
import { format } from 'date-fns';
import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import styles from "./Clients.module.css";
import { useTheme } from "@mui/material/styles";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import ArticleIcon from '@mui/icons-material/Article';
import { FaEdit, FaTrash } from "react-icons/fa";
import { fetchUsers, updateClient, deleteClient } from './API';
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

export default function Clients() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  useEffect(() => {
    const getClients = async () => {
      const usersFromApi = await fetchUsers();
      setClients(usersFromApi);
    };

    getClients();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenReportModal = () => {
    setIsReportModalOpen(true);
  };

  const handleCloseReportModal = () => {
    setIsReportModalOpen(false);
  };

  const handleEditClient = (client) => {
    // Implementar a lógica para editar o cliente
  };

  const handleDeleteClient = async (id) => {
    if (await deleteClient(id)) {
      setClients(clients.filter(client => client.id !== id));
    }
  };

  const handleGenerateReport = () => {
    const doc = new jsPDF();
    doc.text("Relatório de Clientes", 20, 10);
    doc.autoTable({
      head: [['ID', 'Nome', 'RG', 'Telefone', 'Data de Nascimento', 'Endereço', 'Email']],
      body: clients.map(client => [
        client.id,
        client.name,
        client.rg,
        client.phone,
        format(new Date(client.birth_date), 'dd/MM/yyyy'),
        client.address,
        client.email
      ]),
    });
    doc.save('relatorio_clientes.pdf');
  };

  const filteredClients = clients.filter(client =>
    client.name? client.name.toLowerCase().includes(searchTerm.toLowerCase()) : ''
  );

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredClients.length) : 0;

  return (
    <Box className={styles.clients}>
      <Typography typography="h4" style={{ fontWeight: "bold", color: "#1E3932" }}>
        Clientes
      </Typography>
      <Typography typography="label" style={{ padding: '0 0 1rem 0', color: "#1E3932", fontSize: '.875rem' }}>
        Gerencie todos as informações dos seus clientes
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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
              onClick={handleGenerateReport}
            >
              <ArticleIcon />
              Gerar Relatório
            </Button>
          </Box>
        </Box>
        <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>ID</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Nome</TableCell>
              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                RG
              </TableCell>
              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Telefone
              </TableCell>
              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Data de nascimento
              </TableCell>
              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Endereço
              </TableCell>
              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Email
              </TableCell>
              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Ação
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? filteredClients.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : filteredClients
            ).map((client) => (
              <TableRow key={client.id}>
                <TableCell component="th" scope="row">
                  {client.id}
                </TableCell>
                <TableCell component="th" scope="row">
                  {client.name}
                </TableCell>
                <TableCell style={{ width: 160 }} align="left">
                  {client.rg}
                </TableCell>
                <TableCell style={{ width: 160 }} align="left">
                  {client.phone}
                </TableCell>
                <TableCell>
                  {format(new Date(client.birth_date), 'dd/MM/yyyy')}
                </TableCell>
                <TableCell style={{ width: 160 }} align="left">
                  {client.address}
                </TableCell>
                <TableCell style={{ width: 160 }} align="left">
                  {client.email}
                </TableCell>
                <TableCell>
                  <Tooltip title="Editar cliente">
                    <span>
                      <FaEdit style={{ cursor: "pointer" }} onClick={() => handleEditClient(client)} />{" "}
                    </span>
                  </Tooltip>
                  <Tooltip title="Excluir cliente">
                    <span>
                      <FaTrash style={{ cursor: "pointer" }} color="red" onClick={() => handleDeleteClient(client.id)} />
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
                colSpan={8}
                count={filteredClients.length}
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
      <ReportModal open={isReportModalOpen} onClose={handleCloseReportModal} />
    </Box>
  );
}
