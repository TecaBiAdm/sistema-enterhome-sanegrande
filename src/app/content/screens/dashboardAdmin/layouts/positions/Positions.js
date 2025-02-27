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
  Tooltip,
  Typography,
} from "@mui/material";

import styles from "./Positions.module.css";
import { useTheme } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import ArticleIcon from "@mui/icons-material/Article";
import AddIcon from "@mui/icons-material/Add";
import CreatePositionModal from "@/app/components/Modal/Admin/CreatePosition";
import { FaEdit, FaTrash } from "react-icons/fa";
import { fetchRoles, deleteRole } from './API';

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

export default function Positions() {
  const [roles, setRoles] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isPositionModalOpen, setIsPositionModalOpen] = useState(false);
  const [roleToEdit, setRoleToEdit] = useState(null);

  useEffect(() => {
    const getRoles = async () => {
      const rolesFromApi = await fetchRoles();
      setRoles(rolesFromApi);
    };

    getRoles();
  }, []);

  const refreshRoles = async () => {
    const rolesFromApi = await fetchRoles();
    setRoles(rolesFromApi);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - roles.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenPositionModal = () => {
    setRoleToEdit(null);
    setIsPositionModalOpen(true);
  };

  const handleOpenEditPositionModal = (role) => {
    setRoleToEdit(role);
    setIsPositionModalOpen(true);
  };

  const handleDeletePosition = async (id) => {
    try {
      await deleteRole(id);
      setRoles(roles.filter(role => role.id !== id));
    } catch (error) {
      console.error('Erro ao excluir cargo:', error);
    }
  };

  const handleClosePositionModal = () => {
    setIsPositionModalOpen(false);
  };

  return (
    <Box className={styles.positions}>
      <Typography
        typography="h4"
        style={{ fontWeight: "bold", color: "#1E3932" }}
      >
        Cargos
      </Typography>
      <Typography typography="label" style={{ padding: '0 0 1rem 0', color: "#1E3932", fontSize: '.875rem' }}>
        Gerencie todos os seus cargos
      </Typography>
      <TableContainer component={Paper} className={styles.positions__table}>
        <Box className={styles.positions__table__top}>
          <Box className={styles.positions__table__search}>
            <TextField
              maxRows="1"
              id="outlined-basic"
              label="Pesquise os cargos"
              variant="outlined"
              className={styles.positions__table__input}
            />
            <Button
              style={{ background: "#D9D9D9", color: "#000" }}
              variant="contained"
              className={styles.positions__table__button}
            >
              Pesquisar
            </Button>
          </Box>
          <Box className={styles.positions__table__actions}>
            <Button
              variant="contained"
              style={{ background: "#1E3932" }}
              className={styles.positions__search__input}
              onClick={handleOpenPositionModal}
            >
              <AddIcon />
              Novo Cargo
            </Button>
          </Box>
        </Box>
        <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>ID</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Nome</TableCell>
              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Permissão
              </TableCell>
              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Ações
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? roles.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : roles
            ).map((role) => (
              <TableRow key={role.id}>
                <TableCell component="th" scope="row">
                  {role.id}
                </TableCell>
                <TableCell component="th" scope="row">
                  {role.name}
                </TableCell>
                <TableCell align="left">
                  {role.permissions && role.permissions.map(p => p.name).join(', ')}
                </TableCell>
                <TableCell style={{display: 'flex', gap: '1rem'}}>
                  <Tooltip title="Editar cargo">
                    <span>
                      <FaEdit style={{ cursor: "pointer" }} onClick={() => handleOpenEditPositionModal(role)} />
                    </span>
                  </Tooltip>
                  <Tooltip title="Excluir cargo">
                    <span>
                      <FaTrash style={{ cursor: "pointer" }} color="red" onClick={() => handleDeletePosition(role.id)} />
                    </span>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={4} />
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: "Todos", value: -1 }]}
                colSpan={4}
                count={roles.length}
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
      <CreatePositionModal
        open={isPositionModalOpen}
        onClose={handleClosePositionModal}
        roleToEdit={roleToEdit}
        refreshRoles={refreshRoles}
      />
    </Box>
  );
}
