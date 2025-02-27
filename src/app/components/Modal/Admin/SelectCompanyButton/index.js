import React from 'react';
import { Button } from '@mui/material';
import { useCompany } from '../../../../context/CompanyContext'; // Acesso ao contexto de empresa

const SelectCompanyButton = ({ companyData }) => {
  const { company, setSelectedCompany } = useCompany();

  // Função para lidar com a seleção da empresa
  const handleCompanySelect = () => {
    setSelectedCompany(companyData); // Atualiza a empresa selecionada no contexto
  };

  // Verifica se a empresa atual é a selecionada
  const isSelected = company.name === companyData.name;

  console.log(company)
  console.log(companyData.name)
  console.log(isSelected)

  return (
    <Button
      variant="outlined"
      onClick={handleCompanySelect}
      sx={{
        background: 'none',
        border: 'none',
        borderBottom: isSelected ? '2px solid #007bff' : '2px solid transparent',
        borderRadius: 0,
        padding: '0.5rem 1rem',
        color: isSelected ? '#007bff' : 'white', // Muda a cor do texto quando selecionado
        transition: 'border-color 0.3s, color 0.3s',
        '&:hover': {
          background: 'none',
          border: 'none',
          borderBottom: '2px solid #007bff',
        },
        fontWeight: 'normal'
      }}
    >
      {companyData.name}
    </Button>
  );
};

export default SelectCompanyButton;
