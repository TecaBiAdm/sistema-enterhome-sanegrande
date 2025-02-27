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
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Stack,
  Checkbox,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ArticleIcon from "@mui/icons-material/Article";
import { FaEdit, FaTrash } from "react-icons/fa";
import toast from "react-hot-toast";
import { CircularProgress } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import FilterListIcon from "@mui/icons-material/FilterList";
import ReportModal from "@/app/components/Modal/Admin/ReportModal";
import * as XLSX from "xlsx";
import { fetchedEmployeesByCompany, deleteEmployeeById } from "./API/API";
import jsPDF from "jspdf";
import "jspdf-autotable";
import styles from "./Employees.module.css";
import { useCompany } from "@/app/context/CompanyContext";
import EmployeeModal from "@/app/components/Modal/Admin/ModalEmployee";
import DeleteConfirmationModal from "@/app/components/DeleteConfirmationModal";
import { EmployeeDetailView } from "@/app/components/DetailsUser";
import TablePaginationActions from "./Table/TablePaginationActions";
import TitleDashboardComponent from "@/app/components/TitleDashboardComponent/TitleDashboardComponent";
import EmployeeStats from "./Cards/StatsCard";
import FilterDrawer from "@/app/components/FilterDrawer/FilterDrawer";
import { Filter } from "lucide-react";
import HeaderDashboard from "@/app/components/HeaderDashboard";

export default function Employees() {
  const theme = useTheme();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [filteredEmployess, setFilteredEmployess] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [newEmployee, setNewEmployee] = useState({
    type: "",
    description: "",
    eventDate: "",
    paymentDate: "",
    status: "",
    attachment: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const { company } = useCompany();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);

  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [filters, setFilters] = useState({
    department: "",
    status: "",
    regional: "",
    municipality: "",
    team: "",
  });

  const handleFilterChange = (field) => (event) => {
    if (field === "reset") {
      setFilters({
        department: "",
        status: "",
        regional: "",
        municipality: "",
        team: "",
      });
      setFilteredEmployess(employees);
      return;
    }

    setFilters({
      ...filters,
      [field]: event.target.value,
    });
  };

  const applyFilters = () => {
    const filtered = employees.filter((emp) => {
      return (
        (!filters.department || emp.department === filters.department) &&
        (!filters.status || emp.status === filters.status) &&
        (!filters.regional || emp.codigoRegional?.name === filters.regional) &&
        (!filters.municipality ||
          emp.codigoMunicipio?.name === filters.municipality) &&
        (!filters.team || emp.codigoEquipe === filters.team)
      );
    });
    setFilteredEmployess(filtered);
  };

  const handleDeleteClick = (e, employee) => {
    e.stopPropagation();
    setEmployeeToDelete(employee);
    setIsDeleteModalOpen(true);
  };

  const buttonStyles = {
    backgroundColor: "#3A8DFF",
    color: "#ffffff",
    borderRadius: "8px",
    "&:hover": {
      backgroundColor: "#3A8DFF",
    },
  };

  const [viewMode, setViewMode] = useState("list");

  useEffect(() => {
    if (company) {
      const loadEmployees = async () => {
        setIsLoading(true);
        try {
          const employeesData = await fetchedEmployeesByCompany(company.name);
          const activeEmployees = employeesData.filter(
            (employee) => !employee.deletedAt
          );
          setEmployees(activeEmployees);
          setFilteredEmployess(activeEmployees);
        } catch (error) {
          console.error("Erro ao carregar funcionários", error);
        } finally {
          setIsLoading(false);
        }
      };
      loadEmployees();
    }
  }, [company, currentEmployee]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenPlanModal = (expense) => {
    setCurrentEmployee(expense);
    setIsPlanModalOpen(true);
  };

  const handleClosePlanModal = () => {
    setIsPlanModalOpen(false);
    setCurrentEmployee(null);
  };

  const handleCloseReportModal = () => {
    setIsReportModalOpen(false);
  };

  const handleSaveExpense = () => {
    setEmployees((prev) => [...prev, newEmployee]);
  };

  const handleExportSelected = () => {
    const selectedData = filteredEmployess.filter((emp) =>
      selectedEmployees.includes(emp._id)
    );

    const now = new Date();
    const reportDate = `${now.toLocaleDateString(
      "pt-BR"
    )} ${now.toLocaleTimeString("pt-BR")}`;

    const wsData = [
      ["Relatório de Funcionários Selecionados"],
      [`Empresa: ${company.name}`],
      [`Gerado em: ${reportDate}`],
      [],
      [
        "Nome",
        "Equipe",
        "Telefone",
        "Regional",
        "Município",
        "Localidade",
        "Placa Moto",
        "Departamento",
        "Cargo",
        "Status",
      ],
      ...selectedData.map((emp) => [
        `${emp.name}`,
        emp.codigoEquipe,
        emp.phone,
        emp.codigoRegional?.name,
        emp.codigoMunicipio?.name,
        emp.codigoLocal?.name,
        emp.placaMoto,
        emp.department,
        emp.position,
        emp.status,
      ]),
    ];

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Funcionários");
    XLSX.writeFile(wb, "funcionarios_selecionados.xlsx");
  };

  const handleDeleteEmployee = async (ids) => {
    try {
      const idsArray = Array.isArray(ids) ? ids : [ids];

      for (const id of idsArray) {
        await deleteEmployeeById(id);
      }

      const loadEmployees = async () => {
        const employeesData = await fetchedEmployeesByCompany(company.name);
        const activeEmployees = employeesData.filter(
          (employee) => !employee.deletedAt
        );
        setEmployees(activeEmployees);
        setFilteredEmployess(activeEmployees);
      };

      await loadEmployees();
      setSelectedEmployees([]);
      toast.success(
        `${idsArray.length} funcionário(s) deletado(s) com sucesso!`
      );
    } catch (error) {
      toast.error("Erro ao deletar funcionário(s)!");
    }
  };

  // New functions for enhanced features
  const handleAdvancedFilter = () => {
    const filtered = employees.filter((emp) => {
      return (
        (!advancedFilters.department ||
          emp.department === advancedFilters.department) &&
        (!advancedFilters.position ||
          emp.position === advancedFilters.position) &&
        (!advancedFilters.status || emp.status === advancedFilters.status) &&
        (!advancedFilters.location ||
          emp.codigoLocal?.name === advancedFilters.location)
      );
    });
    setFilteredEmployess(filtered);
  };

  const handleViewEmployeeDetails = (employee) => {
    setSelectedEmployee(employee);
    setViewMode("detail");
  };

  // Função para obter apenas os itens da página atual
  const paginatedEmployees = filteredEmployess.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box 
      sx={{ 
        height: '100vh',
        backgroundColor: theme.palette.background.default,
        p: 2,
        mt: -6,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}
    >
      <HeaderDashboard
        subtitle={"Gerencie todos os funcionários da"}
        title={"Funcionários"}
      />
      
      <Box sx={{ padding: 0, mt: 3 }}>
        {isLoading ? (
          <CircularProgress />
        ) : (
          <EmployeeStats employees={employees} />
        )}
      </Box>

      <FilterDrawer
        open={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        filters={filters}
        onFilterChange={handleFilterChange}
        onApplyFilters={applyFilters}
        employees={employees}
        buttonStyles={buttonStyles}
      />

      {viewMode === "list" ? (
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          flexGrow: 1,
          minHeight: 0,
          mt: 2
        }}>
          <Box sx={{ 
            display: "flex", 
            gap: 2, 
            p: 2,
            flexWrap: 'wrap'
          }}>
            <Button
              variant="contained"
              sx={buttonStyles}
              onClick={handleOpenPlanModal}
              startIcon={<AddIcon />}
            >
              Novo Funcionário
            </Button>

            <Button
              variant="outlined"
              onClick={() => setFilterDrawerOpen(true)}
              startIcon={<FilterListIcon />}
            >
              Filtros
            </Button>
            
            {selectedEmployees.length > 0 && (
              <>
                <Button
                  variant="contained"
                  startIcon={<ArticleIcon />}
                  onClick={() => handleExportSelected()}
                >
                  Exportar Selecionados
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<FaTrash />}
                  onClick={() => {
                    setIsDeleteModalOpen(true);
                    setEmployeeToDelete(selectedEmployees);
                  }}
                >
                  Excluir Selecionados ({selectedEmployees.length})
                </Button>
              </>
            )}
          </Box>

          <TableContainer sx={{ 
            flexGrow: 1,
            overflow: 'auto',
            minHeight: 0,
            maxHeight: 'calc(100vh - 350px)',
            '& .MuiTable-root': {
              minWidth: 1200,
            },
            '& .MuiTableHead-root': {
              position: 'sticky',
              top: 0,
              backgroundColor: theme.palette.background.paper,
              zIndex: 2,
            }
          }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedEmployees.length === filteredEmployess.length}
                      indeterminate={selectedEmployees.length > 0 && selectedEmployees.length < filteredEmployess.length}
                      onChange={(event) => {
                        if (event.target.checked) {
                          setSelectedEmployees(filteredEmployess.map((emp) => emp._id));
                        } else {
                          setSelectedEmployees([]);
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>Nome</TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>Equipe</TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>Telefone</TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>Regional</TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>Município</TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>Localidade</TableCell>
                  
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>Departamento</TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>Cargo</TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>Status</TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {!isLoading ? (
                  paginatedEmployees
                    ?.filter((employee) => employee?.codigoRegional && employee?.codigoLocal)
                    .map((employee) => (
                      <TableRow
                        key={employee._id}
                        onClick={() => handleViewEmployeeDetails(employee)}
                        sx={{
                          cursor: "pointer",
                          "&:hover": { bgcolor: "action.hover" },
                        }}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={selectedEmployees.includes(employee._id)}
                            onChange={(event) => {
                              event.stopPropagation();
                              if (event.target.checked) {
                                setSelectedEmployees([...selectedEmployees, employee._id]);
                              } else {
                                setSelectedEmployees(selectedEmployees.filter((id) => id !== employee._id));
                              }
                            }}
                            onClick={(event) => event.stopPropagation()}
                          />
                        </TableCell>
                        <TableCell align="center">{employee?.name}</TableCell>
                        <TableCell align="center">{employee?.codigoEquipe}</TableCell>
                        <TableCell align="center">{employee?.phone}</TableCell>
                        <TableCell align="center">{employee?.codigoRegional?.name}</TableCell>
                        <TableCell align="center">{employee?.codigoMunicipio?.name}</TableCell>
                        <TableCell align="center">{employee?.codigoLocal?.name}</TableCell>
                      
                        <TableCell align="center">{employee?.department}</TableCell>
                        <TableCell align="center">{employee?.position}</TableCell>
                        <TableCell align="center">
                          <Box
                            sx={{
                              backgroundColor: (() => {
                                switch (employee?.status) {
                                  case "Ativo": return "#C8E6C9";
                                  case "Inativo": return "#FFCDD2";
                                  case "Afastado": return "#FBBC04";
                                  default: return "#FFFFFF";
                                }
                              })(),
                              color: "#000",
                              height: "35px",
                              borderRadius: "9px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            {employee?.status}
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
                            <Tooltip title="Editar Funcionário">
                              <span>
                                <FaEdit
                                  style={{ cursor: "pointer" }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpenPlanModal(employee);
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
                                    handleDeleteClick(e, employee);
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
                    <TableCell colSpan={12}>
                      <Box sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "200px"
                      }}>
                        <CircularProgress />
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25, { label: "Todos", value: -1 }]}
                    colSpan={12}
                    count={filteredEmployess.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    sx={{
                      position: 'sticky',
                      bottom: 0,
                      backgroundColor: theme.palette.background.paper,
                      zIndex: 2
                    }}
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
      ) : (
        <Box sx={{ mt: 2 }}>
          <Button
            variant="outlined"
            onClick={() => setViewMode("list")}
            sx={{ mb: 2 }}
          >
            Voltar para lista
          </Button>
          <EmployeeDetailView employee={selectedEmployee} />
        </Box>
      )}

      <EmployeeModal
        open={isPlanModalOpen}
        onClose={handleClosePlanModal}
        onSave={handleSaveExpense}
        employee={currentEmployee}
      />

      <DeleteConfirmationModal
        open={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setEmployeeToDelete(null);
        }}
        onConfirm={() => handleDeleteEmployee(employeeToDelete._id)}
        employeeName={`${employeeToDelete?.name} ${employeeToDelete?.surname}`}
      />

      <ReportModal 
        open={isReportModalOpen} 
        onClose={handleCloseReportModal} 
      />
    </Box>
  );
}