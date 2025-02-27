import React, { createContext, useState, useContext, useEffect } from 'react';

// Contexto para gerenciar a empresa
const CompanyContext = createContext();

export const CompanyProvider = ({ children }) => {
  const [company, setCompany] = useState('Sanegrande'); // Valor inicial padrão

  useEffect(() => {
    const storedCompany = localStorage.getItem('company');
    if (storedCompany) {
        setCompany(JSON.parse(storedCompany));
    } else {
        // Definir a empresa padrão se não houver dados armazenados
        const defaultCompany = { name: "Sanegrande", id: 1 };
        setCompany(defaultCompany);
        localStorage.setItem('company', JSON.stringify(defaultCompany));
    }
}, []);

const setSelectedCompany = (companyData) => {
  if (companyData) {
      localStorage.setItem('company', JSON.stringify(companyData));
      setCompany(companyData);
  }
};


  const clearCompany = () => {
    // Limpar dados da empresa
    localStorage.removeItem('company');
    setCompany('Sanegrande'); // Voltar ao padrão
  };

  return (
    <CompanyContext.Provider value={{ company, setSelectedCompany, clearCompany }}>
      {children}
    </CompanyContext.Provider>
  );
};

// Hook para acessar o contexto da empresa
export const useCompany = () => {
  return useContext(CompanyContext);
};
