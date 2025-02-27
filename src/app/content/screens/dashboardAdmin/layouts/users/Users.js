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
import { useTheme } from "@mui/material/styles";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import ArticleIcon from '@mui/icons-material/Article';
import AddIcon from '@mui/icons-material/Add';
import CreateUserModal from "@/app/components/Modal/Admin/CreateUserModal";
import { FaEdit, FaTrash } from "react-icons/fa";
import { fetchUsers, deleteUser } from './API';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import styles from "./Users.module.css";

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

export default function Users() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const getUsers = async () => {
      const usersFromApi = await fetchUsers();
      setUsers(usersFromApi);
    };

    getUsers();
  }, []);

  const refreshUsers = async () => {
    const usersFromApi = await fetchUsers();
    setUsers(usersFromApi);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - users.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenCreateUserModal = () => {
    setUserToEdit(null);
    setIsCreateUserModalOpen(true);
  };

  const handleOpenEditUserModal = (user) => {
    setUserToEdit(user);
    setIsCreateUserModalOpen(true);
  };

  const handleDeleteUser = async (id) => {
    try {
      await deleteUser(id);
      setUsers(users.filter(user => user.id !== id));
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
    }
  };

  const handleGenerateReport = () => {
    const doc = new jsPDF();

    doc.text('Relatório de Usuários', 14, 20);
    doc.autoTable({
      head: [['ID', 'Nome', 'Email', 'Cargo']],
      body: users.map(user => [
        user.id,
        user.name,
        user.email,
        user.roleId === 1 ? 'Administrador' : user.roleId === 2 ? 'Cliente' : 'Funcionário'
      ]),
      startY: 30,
    });

    doc.save('relatorio_usuarios.pdf');
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box className={styles.users}>
      <Typography typography="h4" style={{ fontWeight: "bold", color: "#1E3932" }}>
        Usuários
      </Typography>
      <Typography typography="label" style={{ padding: '0 0 1rem 0', color: "#1E3932", fontSize: '.875rem' }}>
        Gerencie todos os usuários
      </Typography>
      <TableContainer component={Paper} className={styles.users__table}>
        <Box className={styles.users__table__top}>
          <Box className={styles.users__table__search}>
            <TextField
              maxRows="1"
              id="outlined-basic"
              label="Pesquise os usuários"
              variant="outlined"
              className={styles.users__table__input}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button
              style={{ background: '#D9D9D9', color: '#000' }}
              variant="contained"
              className={styles.users__table__button}
            >
              Pesquisar
            </Button>
          </Box>
          <Box className={styles.users__table__actions}>
            <Button
              variant="contained"
              style={{ background: '#4E392A' }}
              className={styles.users__search__input}
              onClick={handleGenerateReport}
            >
              <ArticleIcon />
              Gerar Relatório
            </Button>
            <Button
              variant="contained"
              style={{ background: '#1E3932' }}
              className={styles.users__search__input}
              onClick={handleOpenCreateUserModal}
            >
              <AddIcon />
              Novo Usuário
            </Button>
          </Box>
        </Box>
        <Table aria-label="custom pagination table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }} align="left">ID</TableCell>
              <TableCell sx={{ fontWeight: "bold" }} align="left">Nome</TableCell>
              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                E-mail
              </TableCell>
              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Cargo
              </TableCell>
              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Ação
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : filteredUsers
            ).map((user) => (
              <TableRow key={user.id}>
                <TableCell component="th" scope="row" align="left">
                  {user.id}
                </TableCell>
                <TableCell component="th" scope="row" align="left">
                  {user.name}
                </TableCell>
                <TableCell align="left">
                  {user.email}
                </TableCell>
                <TableCell align="left">
                  {user.roleName}
                </TableCell>
                <TableCell style={{display: 'flex', gap: '1rem'}}>
                  <Tooltip title="Editar usuário">
                    <span>
                      <FaEdit style={{ cursor: "pointer" }} onClick={() => handleOpenEditUserModal(user)} />
                    </span>
                  </Tooltip>
                  <Tooltip title="Excluir usuário">
                    <span>
                      <FaTrash style={{ cursor: "pointer" }} color="red" onClick={() => handleDeleteUser(user.id)}/>
                    </span>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={5} />
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: "Todos", value: -1 }]}
                colSpan={5}
                count={filteredUsers.length}
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
      <CreateUserModal
        open={isCreateUserModalOpen}
        onClose={() => setIsCreateUserModalOpen(false)}
        userToEdit={userToEdit}
        refreshUsers={refreshUsers}
      />
    </Box>
  );
}
