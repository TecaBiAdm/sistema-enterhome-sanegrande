import React, { useState, useEffect, useContext } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  FormHelperText,
} from "@mui/material";
import { IoMdCloseCircleOutline } from "react-icons/io";
import {
  fetchRegionals,
  fetchMunicipios,
  fetchLocals,
  createEmployee,
  updateEmployee,
  fetchAddressByCep,
} from "./API";
import toast from "react-hot-toast";
import AuthContext from "@/app/context/AuthContext";
import { useCompany } from "@/app/context/CompanyContext";

const EmployeeModal = ({ open, onClose, onSave, employee }) => {

  const { company, setSelectedCompany } = useCompany();



  const initialFormState = {
    name: "",
    phone: "",
    cpf: "",
    rg: "",
    cnh: "",
    cnhValidity: "",
    cep: "",
    street: "",
    neighborhood: "",
    number: "",
    city: "",
    state: "",
    complement: "",
    codigoRegional: "",
    codigoMunicipio: "",
    company: "Sanegrande",
    codigoLocal: "",
    status: "Inativo",
    position: "",
    department: "",
    placaMoto: "",
    codigoEquipe: "",
    vehicleModel: "",
    vehicleYear: "",
    birthDate: "",
    admissionDate: ""
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [regionals, setRegionals] = useState([]);
  const [municipalities, setMunicipalities] = useState([]);
  const [filteredMunicipalities, setFilteredMunicipalities] = useState([]);
  const [locations, setLocations] = useState([]);
  const [filteredLocations, setFilteredLocations] = useState([]);


  const fetchAddressByCep = async (cep) => {
    try {
      const cleanCep = cep.replace(/\D/g, '');
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data = await response.json();
      
      if (!data.erro) {
        setFormData(prev => ({
          ...prev,
          street: data.logradouro,
          neighborhood: data.bairro,
        }));
      } else {
        toast.error('CEP não encontrado');
      }
    } catch (error) {
      toast.error('Erro ao buscar CEP');
      console.error(error);
    }
  };



   // Formatting functions
   const formatCPF = (value) => {
    const numbers = value.replace(/\D/g, "");
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4").slice(0, 14);
  };

  const formatRG = (value) => {
    const numbers = value.replace(/\D/g, "");
    return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{1})/, "$1.$2.$3-$4").slice(0, 12);
  };

  const formatCNH = (value) => {
    return value.replace(/\D/g, "").slice(0, 11);
  };

  const formatCEP = (value) => {
    const numbers = value.replace(/\D/g, "");
    return numbers.replace(/(\d{5})(\d{3})/, "$1-$2").slice(0, 9);
  };



  // Format date to YYYY-MM-DD for input fields
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    } catch (error) {
      console.error("Error formatting date:", error);
      return "";
    }
  };
  // Enhanced validation
  const validateForm = () => {
    const newErrors = {};
    
    // Required field validations
    const requiredFields = {
      name: "Nome é obrigatório",
      phone: "Telefone é obrigatório",
      cpf: "CPF é obrigatório",
      rg: "RG é obrigatório",
      birthDate: "Data de nascimento é obrigatória",
      admissionDate: "Data de admissão é obrigatória",
      position: "Cargo é obrigatório",
      department: "Departamento é obrigatório",
      codigoRegional: "Regional é obrigatória",
      codigoMunicipio: "Município é obrigatório",
      codigoLocal: "Localidade é obrigatória"
    };

    Object.entries(requiredFields).forEach(([field, message]) => {
      if (!formData[field]?.trim()) {
        newErrors[field] = message;
      }
    });

    // Format validations
    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    if (formData.cpf && !cpfRegex.test(formData.cpf)) {
      newErrors.cpf = "CPF inválido";
    }

    const phoneRegex = /^\(\d{2}\) \d{5}-\d{4}$/;
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      newErrors.phone = "Formato inválido. Use: (XX) XXXXX-XXXX";
    }

    // Date validations
    const today = new Date();
    const minBirthDate = new Date();
    minBirthDate.setFullYear(today.getFullYear() - 80); // 80 years ago
    const maxBirthDate = new Date();
    maxBirthDate.setFullYear(today.getFullYear() - 18); // 18 years ago

    const birthDate = new Date(formData.birthDate);
    if (birthDate > maxBirthDate || birthDate < minBirthDate) {
      newErrors.birthDate = "Data de nascimento inválida";
    }

    // Admission date validation
    const admissionDate = new Date(formData.admissionDate);
    if (admissionDate > today) {
      newErrors.admissionDate = "Data de admissão não pode ser futura";
    }

    // CNH validity validation
    if (formData.cnhValidity) {
      const cnhValidity = new Date(formData.cnhValidity);
      if (cnhValidity < today) {
        newErrors.cnhValidity = "CNH vencida";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Formatação do telefone
  const formatPhone = (value) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    }
    return value;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [regionalData, municipioData, localData] = await Promise.all([
          fetchRegionals(),
          fetchMunicipios(),
          fetchLocals(),
        ]);
  
        // Colocar "Matriz" no início e ordenar o restante
        const prioritizeMatriz = (data) =>
          data.sort((a, b) => a.name.localeCompare(b.name)).sort((a, b) => {
            if (a.name === "Matriz") return -1; // "Matriz" vai para o início
            if (b.name === "Matriz") return 1;
            return 0;
          });
  
        setRegionals(prioritizeMatriz(regionalData));
        setMunicipalities(prioritizeMatriz(municipioData));
        setLocations(prioritizeMatriz(localData));
      } catch (error) {
        toast.error("Erro ao carregar dados iniciais");
        console.error("Erro ao carregar dados:", error);
      }
    };
  
    fetchData();
  }, []);
  
  

  

  useEffect(() => {
    if (employee) {
      setFormData({
        ...initialFormState,
        ...employee,
        phone: formatPhone(employee.phone || ""),
        cpf: formatCPF(employee.cpf || ""),
        rg: formatRG(employee.rg || ""),
        cnh: formatCNH(employee.cnh || ""),
        birthDate: formatDateForInput(employee.birthDate),
        admissionDate: formatDateForInput(employee.admissionDate),
        cnhValidity: formatDateForInput(employee.cnhValidity),
        placaMoto: employee.placaMoto?.toUpperCase() || "",
        codigoRegional: employee.codigoRegional?._id || "",
        codigoMunicipio: employee.codigoMunicipio?._id || "",
        codigoLocal: employee.codigoLocal?._id || "",
        company: employee.company || company?.name,
        // Address fields
        cep: formatCEP(employee.address?.zipCode || ""),
        street: employee.address?.street || "",
        number: employee.address?.number || "",
        neighborhood: employee.address?.neighborhood || "",
        city: employee.address?.city || "",
        state: employee.address?.state || "",
        complement: employee.address?.complement || "",
        vehicleModel: employee.vehicleModel || "",
        vehicleYear: employee.vehicleYear || ""
      });

      updateMunicipalities(employee.codigoRegional?._id);
      updateLocations(employee.codigoMunicipio?._id);
    } else {
      resetForm();
    }
  }, [employee]);


  const resetForm = () => {
    setFormData(initialFormState);
    setErrors({});
    setFilteredMunicipalities([]);
    setFilteredLocations([]);
  };

  const handleChange = (field, value) => {
    let processedValue = value;

    switch (field) {
      case "cpf":
        processedValue = formatCPF(value);
        break;
      case "rg":
        processedValue = formatRG(value);
        break;
      case "cnh":
        processedValue = formatCNH(value);
        break;
      case "cep":
        processedValue = formatCEP(value);
        if (processedValue.replace(/\D/g, "").length === 8) {
          fetchAddressByCep(processedValue);
        }
        break;
      case "phone":
        processedValue = formatPhone(value);
        break;
      case "name":
        processedValue = value.replace(/[^a-zA-ZÀ-ÿ\s]/g, "");
        break;
      case "placaMoto":
        processedValue = value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 7);
        break;
      case "vehicleYear":
        processedValue = value.replace(/\D/g, "").slice(0, 4);
        break;
      // Handle dates
      case "birthDate":
      case "admissionDate":
      case "cnhValidity":
        processedValue = value; // Keep the YYYY-MM-DD format from input
        break;
      default:
        break;
    }

    setFormData(prev => ({ ...prev, [field]: processedValue }));
    
    // Clear errors when field is modified
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSave = async () => {
    /*if (!validateForm()) {
      toast.error("Por favor, corrija os erros no formulário");
      return;
    }*/

    setIsSubmitting(true);

    try {
      // Create a clean data object with only the necessary fields
      const employeeData = {
        name: formData.name,
        surname: formData.surname,
        phone: formData.phone.replace(/\D/g, ""),
        cpf: formData.cpf,
        rg: formData.rg,
        cnh: formData.cnh,
        cnhValidity: formData.cnhValidity,
        admissionDate: formData.admissionDate,
        birthDate: formData.birthDate,
        address: {
          street: formData.street,
          number: formData.number,
          neighborhood: formData.neighborhood,
          city: formData.city,
          state: formData.state,
          zipCode: formData.cep,
          complement: formData.complement || ''
        },
        codigoRegional: formData.codigoRegional,
        codigoMunicipio: formData.codigoMunicipio,
        company: formData.company,
        codigoLocal: formData.codigoLocal,
        status: formData.status,
        position: formData.position,
        department: formData.department,
        placaMoto: formData.placaMoto?.toUpperCase(),
        codigoEquipe: formData.codigoEquipe,
        vehicleModel: formData.vehicleModel,
        vehicleYear: formData.vehicleYear 
      };

      const response = employee?._id
        ? await updateEmployee(employeeData, employee._id)
        : await createEmployee(employeeData);

      if (response) {
        onSave(response);
        toast.success(
          `Funcionário ${employee?._id ? "atualizado" : "criado"} com sucesso`
        );
        onClose();
      }
    } catch (error) {
      console.error("Erro ao salvar funcionário:", error);
      toast.error(error.response?.data?.message || "Erro ao salvar funcionário");
    } finally {
      setIsSubmitting(false);
    }
  };


  const updateMunicipalities = (regionalId) => {
    if (regionalId) {
      const filtered = municipalities.filter(
        (municipio) =>
          municipio.codigoRegional?._id === regionalId ||
          municipio.codigoRegional === regionalId
      );
      setFilteredMunicipalities(filtered);

      // Só limpa os campos se não estiver editando
      if (!employee) {
        setFormData((prev) => ({
          ...prev,
          codigoMunicipio: "",
          codigoLocal: "",
        }));
      }
    } else {
      setFilteredMunicipalities([]);
      setFormData((prev) => ({
        ...prev,
        codigoMunicipio: "",
        codigoLocal: "",
      }));
    }
  };

  const updateLocations = (municipioId) => {
    if (municipioId) {
      const filtered = locations.filter(
        (local) =>
          local.codigoMunicipio?._id === municipioId ||
          local.codigoMunicipio === municipioId
      );
      setFilteredLocations(filtered);

      // Só limpa o campo se não estiver editando
      if (!employee) {
        setFormData((prev) => ({ ...prev, codigoLocal: "" }));
      }
    } else {
      setFilteredLocations([]);
      setFormData((prev) => ({ ...prev, codigoLocal: "" }));
    }
  };

  useEffect(() => {
    updateMunicipalities(formData.codigoRegional);
  }, [formData.codigoRegional]);

  useEffect(() => {
    updateLocations(formData.codigoMunicipio);
  }, [formData.codigoMunicipio]);

  const positions = [
    "Coordenador",
    "Fiscal de Consumo",
    "Gerente",
    "Analista de RH",
    "Estagiário",
    "Aux. Adm - Jovem Aprendiz",
    "Secretária",
    "Auxiliar Administrativo",
    "Analista de Dados",
    "Assistente Proc. Dados",
    "Assistente Administrativo",
    "Supervisor Administrativo I",
    "Supervisor Administrativo II",
    "Responsável Técnico I",
    "Responsável Técnico II",
    "Supervisor de Regionais",
    "Funcionário de Campo",
    "Leiturista",
    "Suporte Help Desk I",
    "Suporte Help Desk II",
    "Suporte Help Desk III",
  ];

  const departments = ["RH", "Administrativo", "Campo", "TI", "Financeiro"];

  return (
    <Modal
    open={open}
    onClose={!isSubmitting ? onClose : undefined}
    disableEscapeKeyDown={isSubmitting}
    >
      <Box
        sx={{
          width: 700,
          margin: "auto",
          padding: 3,
          backgroundColor: "#fff",
          borderRadius: 2,
          mt: "5%",
          maxHeight: "70vh",
          overflowY: "auto",
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" component="h2" sx={{fontWeight:'bold', borderBottom: '1px solid #000'}}>
            {employee?.name ? "Editar Funcionário" : "Criar Novo Funcionário"}
          </Typography>
          <IconButton onClick={onClose} disabled={isSubmitting}>
            <IoMdCloseCircleOutline size={24} />
          </IconButton>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "row", gap: "1rem" }}>
        <TextField
          label="Nome Completo"
          fullWidth
          required
          type="text"
          margin="normal"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          error={!!errors.name}
          helperText={errors.name}
          disabled={isSubmitting}
        />
    
        <TextField
          label="Telefone"
          fullWidth
          required
          type="text"
          margin="normal"
          value={formData.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
          error={!!errors.phone}
          helperText={errors.phone}
          placeholder="(XX) XXXXX-XXXX"
          disabled={isSubmitting}
        />
        </Box>

        <Box sx={{ display: "flex", flexDirection: "row", gap: "1rem" }}>
        <TextField
          label="Data de Nascimento"
          type="date"
          fullWidth
          required
          margin="normal"
          value={formData.birthDate}
          onChange={(e) => handleChange("birthDate", e.target.value)}
          error={!!errors.birthDate}
          helperText={errors.birthDate}
          disabled={isSubmitting}
          InputLabelProps={{ 
            shrink: true,
            required: true
          }}
          inputProps={{
            max: formatDateForInput(new Date(Date.now() - (18 * 365 * 24 * 60 * 60 * 1000))), // 18 years ago
          }}
        />

    
<TextField
          label="Data de Admissão"
          type="date"
          fullWidth
          margin="normal"
          value={formData.admissionDate}
          onChange={(e) => handleChange("admissionDate", e.target.value)}
          error={!!errors.admissionDate}
          helperText={errors.admissionDate}
          disabled={isSubmitting}
          InputLabelProps={{ 
            shrink: true,
            required: true
          }}
          inputProps={{
            max: formatDateForInput(new Date()) // Today
          }}
        />
        </Box>

       {/* Documentos */}
      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, fontWeight: "bold" }}>
        Documentos
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "row", gap: "1rem" }}>
        <TextField
          label="CPF"
          fullWidth
          required
          margin="normal"
          value={formData.cpf}
          onChange={(e) => handleChange("cpf", e.target.value)}
          error={!!errors.cpf}
          helperText={errors.cpf}
          placeholder="000.000.000-00"
          disabled={isSubmitting}
        />
        <TextField
          label="RG"
          fullWidth
          required
          margin="normal"
          value={formData.rg}
          onChange={(e) => handleChange("rg", e.target.value)}
          error={!!errors.rg}
          helperText={errors.rg}
          disabled={isSubmitting}
        />
      </Box>

      <Box sx={{ display: "flex", flexDirection: "row", gap: "1rem" }}>
        <TextField
          label="CNH"
          fullWidth
          required
          margin="normal"
          value={formData.cnh}
          onChange={(e) => handleChange("cnh", e.target.value)}
          error={!!errors.cnh}
          helperText={errors.cnh}
          disabled={isSubmitting}
        />
        <TextField
          label="Validade CNH"
          type="date"
          fullWidth
          required
          margin="normal"
          value={formData.cnhValidity}
          onChange={(e) => handleChange("cnhValidity", e.target.value)}
          error={!!errors.cnhValidity}
          helperText={errors.cnhValidity}
          InputLabelProps={{ shrink: true }}
          disabled={isSubmitting}
        />
      </Box>

 {/* Endereço */}
 <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, fontWeight: "bold" }}>
        Endereço
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "row", gap: "1rem" }}>
        <TextField
          label="CEP"
          fullWidth
          required
          margin="normal"
          value={formData.cep}
          onChange={(e) => {
            const value = e.target.value;
            handleChange("cep", value);
            if (value.length === 8) {
              fetchAddressByCep(value);
            }
          }}
          error={!!errors.cep}
          helperText={errors.cep}
          placeholder="00000-000"
          disabled={isSubmitting}
        />
        <TextField
          label="Rua"
          fullWidth
          margin="normal"
          value={formData.street}
          onChange={(e) => handleChange("street", e.target.value)}
          disabled={isSubmitting}
        />
        <TextField
          label="Número"
          fullWidth
          required
          margin="normal"
          value={formData.number}
          onChange={(e) => handleChange("number", e.target.value)}
          error={!!errors.number}
          helperText={errors.number}
          disabled={isSubmitting}
        />
        <TextField
          label="Bairro"
          fullWidth
          margin="normal"
          value={formData.neighborhood}
          onChange={(e) => handleChange("neighborhood", e.target.value)}
          disabled={isSubmitting}
        />
      </Box>

      {/* Informações Profissionais */}
      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, fontWeight: "bold" }}>
        Informações Profissionais
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "row", gap: "1rem" }}>
        <FormControl
          fullWidth
          margin="normal"
          error={!!errors.position}
          required
        >
          <InputLabel>Cargo</InputLabel>
          <Select
            value={formData.position}
            onChange={(e) => handleChange("position", e.target.value)}
            disabled={isSubmitting}
          >
            {positions.map((position) => (
              <MenuItem key={position} value={position}>
                {position}
              </MenuItem>
            ))}
          </Select>
          {errors.position && (
            <FormHelperText>{errors.position}</FormHelperText>
          )}
        </FormControl>

        <FormControl
          fullWidth
          margin="normal"
          error={!!errors.department}
          required
        >
          <InputLabel>Departamento</InputLabel>
          <Select
            value={formData.department}
            onChange={(e) => handleChange("department", e.target.value)}
            disabled={isSubmitting}
          >
            {departments.map((department) => (
              <MenuItem key={department} value={department}>
                {department}
              </MenuItem>
            ))}
          </Select>
          {errors.department && (
            <FormHelperText>{errors.department}</FormHelperText>
          )}
        </FormControl>

        <FormControl fullWidth margin="normal" error={!!errors.status}>
          <InputLabel>Status</InputLabel>
          <Select
            value={formData.status}
            onChange={(e) => handleChange("status", e.target.value)}
            disabled={isSubmitting}
          >
            <MenuItem value="Ativo">Ativo</MenuItem>
            <MenuItem value="Inativo">Inativo</MenuItem>
            <MenuItem value="Afastado">Afastado</MenuItem>
          </Select>
          {errors.status && <FormHelperText>{errors.status}</FormHelperText>}
        </FormControl>
      </Box>

       {/* Informações de Campo */}
       <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, fontWeight: "bold" }}>
        Informações de Campo
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "row", gap: "1rem" }}>
       
        <TextField
          label="Equipe"
          type="text"
          fullWidth
          margin="normal"
          value={formData.codigoEquipe}
          onChange={(e) => handleChange("codigoEquipe", e.target.value)}
          disabled={isSubmitting}
        />
         <TextField
          label="Placa Veículo"
          fullWidth
          type="text"
          margin="normal"
          value={formData.placaMoto}
          onChange={(e) => handleChange("placaMoto", e.target.value)}
          error={!!errors.placaMoto}
          helperText={errors.placaMoto}
          placeholder="ABC1D23"
          disabled={isSubmitting}
        />
         <TextField
          label="Modelo Moto"
          fullWidth
          type="text"
          margin="normal"
          value={formData.vehicleModel}
          onChange={(e) => handleChange("vehicleModel", e.target.value)}
          placeholder="ABC1D23"
          disabled={isSubmitting}
        />
           <TextField
          label="Ano/Fabricação"
          fullWidth
          type="text"
          margin="normal"
          value={formData.vehicleYear}
          onChange={(e) => handleChange("vehicleYear", e.target.value)}
          placeholder="1999"
          disabled={isSubmitting}
        />
      </Box>
 {/* Localização */}
 <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, fontWeight: "bold" }}>
        Localização
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "row", gap: "1rem" }}>
        <FormControl
          fullWidth
          margin="normal"
          error={!!errors.codigoRegional}
          required
        >
          <InputLabel>Regional</InputLabel>
          <Select
            value={formData.codigoRegional}
            onChange={(e) => handleChange("codigoRegional", e.target.value)}
            disabled={isSubmitting}
          >
            {regionals.map((regional) => (
              <MenuItem
                key={regional._id}
                value={regional._id}
                style={{
                  backgroundColor:
                    regional.name === "Matriz" ? "#f0f8ff" : "inherit",
                  fontWeight: regional.name === "Matriz" ? "bold" : "normal",
                }}
              >
                {regional.name}
              </MenuItem>
            ))}
          </Select>
          {errors.codigoRegional && (
            <FormHelperText>{errors.codigoRegional}</FormHelperText>
          )}
        </FormControl>

        <FormControl
          fullWidth
          margin="normal"
          error={!!errors.codigoMunicipio}
          required
        >
          <InputLabel>Município</InputLabel>
          <Select
            value={formData.codigoMunicipio}
            onChange={(e) => handleChange("codigoMunicipio", e.target.value)}
            disabled={!formData.codigoRegional || isSubmitting}
          >
            {filteredMunicipalities.map((municipio) => (
              <MenuItem key={municipio._id} value={municipio._id}>
                {municipio.name}
              </MenuItem>
            ))}
          </Select>
          {errors.codigoMunicipio && (
            <FormHelperText>{errors.codigoMunicipio}</FormHelperText>
          )}
        </FormControl>

        <FormControl
          fullWidth
          margin="normal"
          error={!!errors.codigoLocal}
          required
        >
          <InputLabel>Localidade</InputLabel>
          <Select
            value={formData.codigoLocal}
            onChange={(e) => handleChange("codigoLocal", e.target.value)}
            disabled={!formData.codigoMunicipio || isSubmitting}
          >
            {filteredLocations.map((local) => (
              <MenuItem key={local._id} value={local._id}>
                {local.name}
              </MenuItem>
            ))}
          </Select>
          {errors.codigoLocal && (
            <FormHelperText>{errors.codigoLocal}</FormHelperText>
          )}
        </FormControl>
      </Box>

        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          fullWidth
          sx={{ mt: 2 }}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Salvando..." : "Salvar"}
        </Button>
      </Box>
    </Modal>
  );
};

export default EmployeeModal;
