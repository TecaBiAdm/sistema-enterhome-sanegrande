const URL = 'https://sysgrande-nodejs.onrender.com/api/'
const URL_LOCAL = 'http://localhost:5000/api/'

export const fetchedSuppliers = async (companyName) => {
  try {
    const response = await fetch(`${URL}supplier?company=${companyName}`, { 
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Erro ao buscar os fornecedores.');
    }
    const data = await response.json();
    return data; // Retorna os dados das compras
  } catch (error) {
    console.error('Erro:', error);
    return [];
  }
};

export const fetchedPurchasesByCompany = async (companyName) => {
  console.log(companyName)
  try {
    const response = await fetch(`${URL}purchase?company=${companyName}`, { 
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log(response)

    if (!response.ok) {
      throw new Error('Erro ao buscar as compras');
    }

    const data = await response.json();
    return data; // Retorna os dados das despesas
  } catch (error) {
    console.error('Erro:', error);
    return [];
  }
};

export const deleteSupplierById = async (supplierId) => {
  try {
    const response = await fetch(`${URL}supplier/${supplierId}`, { 
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Erro ao deletar fornecedor.');
    }
    const data = await response.json();
    return data; // Retorna os dados do fornecedor
  } catch (error) {
    console.error('Erro:', error);
    return [];
  }
};


