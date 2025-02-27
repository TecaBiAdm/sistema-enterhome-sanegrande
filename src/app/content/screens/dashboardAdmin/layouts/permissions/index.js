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
  IconButton,
  Modal,
} from "@mui/material";

import styles from "./Permissions.module.css";
import { useTheme } from "@mui/material/styles";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import ArticleIcon from "@mui/icons-material/Article";
import AddIcon from "@mui/icons-material/Add";
import { FaEdit, FaTrash } from "react-icons/fa";
import { fetchPermissions, createPermission, updatePermission, deletePermission } from './API';

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

export default function Permissions() {
  const [permissions, setPermissions] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [permissionToEdit, setPermissionToEdit] = useState(null);
  const [newPermissionName, setNewPermissionName] = useState("");

  useEffect(() => {
    const getPermissions = async () => {
      const permissionsFromApi = await fetchPermissions();
      setPermissions(permissionsFromApi);
    };

    getPermissions();
  }, []);

  const handleOpenModal = (permission) => {
    setPermissionToEdit(permission);
    setNewPermissionName(permission ? permission.name : "");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setPermissionToEdit(null);
    setNewPermissionName("");
  };

  const handleSavePermission = async () => {
    if (permissionToEdit) {
      await updatePermission(permissionToEdit.id, newPermissionName);
    } else {
      await createPermission(newPermissionName);
    }
    const permissionsFromApi = await fetchPermissions();
    setPermissions(permissionsFromApi);
    handleCloseModal();
  };

  const handleDeletePermission = async (id) => {
    await deletePermission(id);
    const permissionsFromApi = await fetchPermissions();
    setPermissions(permissionsFromApi);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - permissions.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box className={styles.permissions}>
      <Typography
        typography="h4"
        style={{ fontWeight: "bold", color: "#1E3932" }}
      >
        Permissões
      </Typography>
      <Typography
        typography="label"
        style={{ padding: '0 0 1rem 0', color: "#1E3932", fontSize: '.875rem' }}
      >
        Gerencie todas as permissões
      </Typography>
      <TableContainer component={Paper} className={styles.permissions__table}>
        <Box className={styles.permissions__table__top}>
          <Box className={styles.permissions__table__search}>
            <TextField
              maxRows="1"
              id="outlined-basic"
              label="Pesquise as permissões"
              variant="outlined"
              className={styles.permissions__table__input}
            />
            <Button
              style={{ background: "#D9D9D9", color: "#000" }}
              variant="contained"
              className={styles.permissions__table__button}
            >
              Pesquisar
            </Button>
          </Box>
          <Box className={styles.permissions__table__actions}>
            <Button
              variant="contained"
              style={{ background: "#1E3932" }}
              className={styles.permissions__search__input}
              onClick={() => handleOpenModal(null)}
            >
              <AddIcon />
              Nova Permissão
            </Button>
          </Box>
        </Box>
        <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>ID</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Nome</TableCell>
              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Ações
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? permissions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : permissions
            ).map((permission) => (
              <TableRow key={permission.id}>
                <TableCell component="th" scope="row">
                  {permission.id}
                </TableCell>
                <TableCell component="th" scope="row">
                  {permission.name}
                </TableCell>
                <TableCell style={{display: 'flex', gap: '1rem'}}>
                  <Tooltip title="Editar permissão">
                    <span>
                      <FaEdit style={{ cursor: "pointer" }} onClick={() => handleOpenModal(permission)} />
                    </span>
                  </Tooltip>
                  <Tooltip title="Excluir permissão">
                    <span>
                      <FaTrash style={{ cursor: "pointer" }} color="red" onClick={() => handleDeletePermission(permission.id)} />
                    </span>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={3} />
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: "Todos", value: -1 }]}
                colSpan={3}
                count={permissions.length}
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
      <Modal open={isModalOpen} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            borderRadius: '5px',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" gutterBottom sx={{borderBottom: '2px solid black'}}>
            {permissionToEdit ? "Editar Permissão" : "Nova Permissão"}
          </Typography>
          <TextField
            label="Nome da Permissão"
            fullWidth
            margin="normal"
            required={true}
            value={newPermissionName}
            onChange={(e) => setNewPermissionName(e.target.value)}
          />
          <Box sx={{ mt: 2 }}>
            <Button variant="contained" color="success" onClick={handleSavePermission}>
              {permissionToEdit ? "Salvar Alterações" : "Criar Permissão"}
            </Button>
            <Button variant="contained" color="error" onClick={handleCloseModal} sx={{ ml: 2 }}>
              Cancelar
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}
