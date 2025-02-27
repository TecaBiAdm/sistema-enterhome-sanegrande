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
  Tabs,
  Tab,
  Typography,
  Tooltip,
  CircularProgress,
  Checkbox,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import FilterListIcon from "@mui/icons-material/FilterList";
import ArticleIcon from "@mui/icons-material/Article";
import {
  FaEye,
  FaCheck,
  FaTimes,
  FaEdit,
  FaHistory,
  FaTrash,
} from "react-icons/fa";
import { useCompany } from "@/app/context/CompanyContext";
import TablePaginationActions from "./Table/TablePaginationActions";
import FilterDrawer from "@/app/components/FilterDrawer/FilterDrawer";
import EpiFilterDrawer from "@/app/components/FilterDrawerEpi/FilterDrawerEpi";
import HeaderDashboard from "@/app/components/HeaderDashboard";
import EpiRequestModal from "@/app/components/Modal/Admin/ModalEpi";
import StockModal from "@/app/components/Modal/ModalStock";
import { deleteEpiById, fetchedEpis } from "./API";
import { CheckBox } from "@mui/icons-material";

const EpiManagement = () => {
  const theme = useTheme();
  const { company } = useCompany();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  // States
  const [activeTab, setActiveTab] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [requests, setRequests] = useState([]);
  const [currentEpi, setCurrentEpi] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [epiToDelete, setEpiToDelete] = useState(null);
  const [selectedEpis, setSelectedEpis] = useState([]);
  const [filteredEpis, setFilteredEpis] = useState([]);
  const [filters, setFilters] = useState({
    status: "",
    department: "",
    regional: "",
    startDate: "",
    endDate: "",
  });

  const buttonStyles = {
    backgroundColor: "#3A8DFF",
    color: "#ffffff",
    borderRadius: "8px",
    "&:hover": {
      backgroundColor: "#3A8DFF",
    },
  };

  const handleDeleteEmployee = async (ids) => {
    try {
      const idsArray = Array.isArray(ids) ? ids : [ids];

      for (const id of idsArray) {
        await deleteEpiById(id);
      }

      const loadEmployees = async () => {
        const employeesData = await fetchedEpis(company.name);
        const activeEmployees = employeesData.filter(
          (employee) => !employee.deletedAt
        );

        setFilteredEpis(activeEmployees);
      };

      await loadEmployees();
      setSelectedEpis([]);
      toast.success(`${idsArray.length} EPI(s) deletado(s) com sucesso!`);
    } catch (error) {
      toast.error("Erro ao deletar EPI(s)!");
    }
  };

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [episToDelete, setEpisToDelete] = useState(null);

  // Handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterChange = (field) => (event) => {
    if (field === "reset") {
      setFilters({
        status: "",
        department: "",
        regional: "",
        startDate: "",
        endDate: "",
      });
      setFilteredRequests(requests);
      return;
    }

    setFilters({
      ...filters,
      [field]: event.target.value,
    });
  };

  const applyFilters = () => {
    const filtered = requests.filter((req) => {
      return (
        (!filters.status || req.status === filters.status) &&
        (!filters.department ||
          req.employee.department === filters.department) &&
        (!filters.regional || req.regional.name === filters.regional) &&
        (!filters.startDate ||
          new Date(req.requestDate) >= new Date(filters.startDate)) &&
        (!filters.endDate ||
          new Date(req.requestDate) <= new Date(filters.endDate))
      );
    });
    setFilteredRequests(filtered);
  };

  // Load data
  useEffect(() => {
    if (company) {
      const loadRequests = async () => {
        setIsLoading(true);
        try {
          const response = await fetchedEpis(company.name);
          setRequests(response);
          setFilteredRequests(response);
        } catch (error) {
          console.error("Erro ao carregar pedidos de EPI", error);
        } finally {
          setIsLoading(false);
        }
      };
      loadRequests();
    }
  }, [company.length]);

  const handleOpenPlanModal = (expense) => {
    setCurrentEpi(expense);
    setIsModalOpen(true);
    setIsPlanModalOpen(true);
  };

  const handleClosePlanModal = () => {
    setIsPlanModalOpen(false);
    setCurrentEpi(null);
  };

  const handleCloseReportModal = () => {
    setIsReportModalOpen(false);
  };

  const handleSaveExpense = () => {
    setEmployees((prev) => [...prev, newEmployee]);
  };

  const paginatedRequests = filteredRequests.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleDeleteClick = (e, epis) => {
    e.stopPropagation();
    setEpisToDelete(epis);
    handleDeleteEmployee();
  };

  const handleSaveInventory = async (formData) => {
    try {
      // Add your API call here to save the inventory item
      // Example:
      // await fetch('/api/inventory', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // });

      handleCloseModal();
      // Refresh your inventory data here
    } catch (error) {
      console.error("Error saving inventory:", error);
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        backgroundColor: theme.palette.background.default,
        p: 2,
        mt: -6,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <HeaderDashboard
        subtitle={"Gerencie todos os Epi's da"}
        title={"EPI's"}
      />
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, val) => setActiveTab(val)}>
          <Tab label="Pedidos" />
          <Tab label="Estoque" />
          <Tab label="Relatórios" />
        </Tabs>
      </Box>

      {activeTab === 0 && (
        <>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              p: 2,
              flexWrap: "wrap",
            }}
          >
            <Button
              variant="contained"
              sx={buttonStyles}
              onClick={handleOpenPlanModal}
              startIcon={<AddIcon />}
            >
              Novo Pedido
            </Button>

            <Button
              variant="outlined"
              onClick={() => setFilterDrawerOpen(true)}
              startIcon={<FilterListIcon />}
            >
              Filtros
            </Button>

            <Button
              variant="contained"
              startIcon={<ArticleIcon />}
              onClick={() => {
                /* Handle export */
              }}
            >
              Exportar
            </Button>
          </Box>

          <TableContainer
            sx={{
              flexGrow: 1,
              overflow: "auto",
              minHeight: 0,
              maxHeight: "calc(100vh - 350px)",
            }}
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    Data
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    Funcionário
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    Departamento
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    Regional
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    Items
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    Status
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    Ações
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {/*!isLoading ? (
                  filteredRequests.map((request) => (
                    <TableRow key={request._id}>
                      <TableCell align="center">
                        {new Date(request.requestDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell align="center">
                        {request.employee.name}
                      </TableCell>
                      <TableCell align="center">
                        {request.employee.department}
                      </TableCell>
                      <TableCell align="center">
                        {request.regional.name}
                      </TableCell>
                      <TableCell align="center">
                        {request.items.length}
                      </TableCell>
                      <TableCell align="center">
                        <Box
                          sx={{
                            backgroundColor: getStatusColor(request.status),
                            color: "#000",
                            height: "35px",
                            borderRadius: "9px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {request.status}
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Box
                          sx={{
                            display: "flex",
                            gap: 2,
                            justifyContent: "center",
                          }}
                        >
                          <Tooltip title="Ver Detalhes">
                            <span>
                              <FaEye style={{ cursor: "pointer" }} />
                            </span>
                          </Tooltip>
                          {request.status === "Pendente" && (
                            <>
                              <Tooltip title="Aprovar">
                                <span>
                                  <FaCheck
                                    style={{
                                      cursor: "pointer",
                                      color: "green",
                                    }}
                                  />
                                </span>
                              </Tooltip>
                              <Tooltip title="Rejeitar">
                                <span>
                                  <FaTimes
                                    style={{ cursor: "pointer", color: "red" }}
                                  />
                                </span>
                              </Tooltip>
                            </>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          height: "200px",
                        }}
                      >
                        <CircularProgress />
                      </Box>
                    </TableCell>
                  </TableRow>
                )*/}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[
                      5,
                      10,
                      25,
                      { label: "Todos", value: -1 },
                    ]}
                    colSpan={7}
                    count={filteredRequests.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    ActionsComponent={TablePaginationActions}
                  />
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>

          <EpiRequestModal
            open={isPlanModalOpen}
            onClose={handleClosePlanModal}
            onSave={handleSaveExpense}
            epi={currentEpi}
          />

          <EpiFilterDrawer
            open={filterDrawerOpen}
            onClose={() => setFilterDrawerOpen(false)}
            filters={filters}
            onFilterChange={handleFilterChange}
            onApplyFilters={applyFilters}
            requests={requests}
            buttonStyles={buttonStyles}
          />
        </>
      )}

      {activeTab === 1 && (
        <>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              p: 2,
              flexWrap: "wrap",
            }}
          >
            <Button
              variant="contained"
              sx={buttonStyles}
              onClick={handleOpenModal}
              startIcon={<AddIcon />}
            >
              Adicionar ao Estoque
            </Button>

            <Button
              variant="outlined"
              onClick={() => setFilterDrawerOpen(true)}
              startIcon={<FilterListIcon />}
            >
              Filtros
            </Button>

            {selectedEpis.length > 0 && (
              <>
                <Button variant="contained" startIcon={<ArticleIcon />}>
                  Exportar Selecionados
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<FaTrash />}
                  onClick={() => {
                    setIsDeleteModalOpen(true);
                    setEpiToDelete(selectedEpis);
                  }}
                >
                  Excluir Selecionados ({selectedEpis.length})
                </Button>
              </>
            )}
          </Box>

          <TableContainer
            sx={{
              flexGrow: 1,
              overflow: "auto",
              minHeight: 0,
              maxHeight: "calc(100vh - 350px)",
            }}
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <CheckBox
                      checked={selectedEpis.length === filteredEpis.length}
                      indeterminate={
                        selectedEpis.length > 0 &&
                        selectedEpis.length < filteredEpis.length
                      }
                      onChange={(event) => {
                        if (event.target.checked) {
                          setSelectedEpis(filteredEpis.map((emp) => emp._id));
                        } else {
                          setSelectedEpis([]);
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    EPI
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    Tamanho
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    Quantidade
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    Preço Unitário
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    Total
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    Fornecedor
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    Última Atualização
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    Ações
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {!isLoading ? (
                  filteredRequests.map((item) => (
                    <TableRow key={item._id}>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedEpis.includes(item._id)}
                          onChange={(event) => {
                            event.stopPropagation();
                            if (event.target.checked) {
                              setSelectedEpis([...selectedEpis, item._id]);
                            } else {
                              setSelectedEpis(
                                selectedEpis.filter((id) => id !== item._id)
                              );
                            }
                          }}
                          onClick={(event) => event.stopPropagation()}
                        />
                      </TableCell>
                      <TableCell align="center">{item.epi}</TableCell>
                      <TableCell align="center">{item.size || "N/A"}</TableCell>
                      <TableCell align="center">
                        <Box

                        >
                          {item.quantity}
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(item?.pricePerUnit)}
                      </TableCell>
                      <TableCell align="center">
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(item.totalPrice)}
                      </TableCell>
                      <TableCell align="center">
                        {item.supplier?.name}
                      </TableCell>
                      <TableCell align="center">
                        {new Date(item.lastUpdated).toLocaleDateString()}
                      </TableCell>
                      <TableCell align="center">
                        <Box
                          sx={{
                            display: "flex",
                            gap: 2,
                            justifyContent: "center",
                          }}
                        >
                          <Tooltip title="Editar">
                            <span>
                              <FaEdit
                                style={{ cursor: "pointer", color: "#3A8DFF" }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setCurrentEpi(item);
                                  handleOpenPlanModal(item);
                                }}
                              />
                            </span>
                          </Tooltip>
                          <Tooltip title="Excluir">
                            <span>
                              <FaTrash
                                style={{ cursor: "pointer" }}
                                color="red"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteClick(e, item);
                                }}
                              />
                            </span>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          height: "200px",
                        }}
                      >
                        <CircularProgress />
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    colSpan={9}
                    count={filteredRequests.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    ActionsComponent={TablePaginationActions}
                  />
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>

          <StockModal
            open={isModalOpen}
            onClose={handleCloseModal}
            onSave={handleSaveInventory}
            item={currentEpi}
          />

          <EpiFilterDrawer
            open={filterDrawerOpen}
            onClose={() => setFilterDrawerOpen(false)}
            filters={filters}
            onFilterChange={handleFilterChange}
            onApplyFilters={applyFilters}
          />
        </>
      )}
    </Box>
  );
};

export default EpiManagement;
