const URL = 'https://sysgrande-nodejs.onrender.com/api/'
const URL_LOCAL = 'http://localhost:5000/api/'

export const fetchedCollectors = async () => {
  try {
    const response = await fetch(`${URL}collectors`, { 
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Erro ao buscar os coletores.');
    }
    const data = await response.json();
    return data; // Retorna os dados das compras
  } catch (error) {
    console.error('Erro:', error);
    return [];
  }
};

export const fetchedCollectorsByCompany = async (companyName) => {
  console.log(companyName)
  try {
    const response = await fetch(`${URL}collectors?company=${companyName}`, { 
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log(response)

    if (!response.ok) {
      throw new Error('Erro ao buscar os coletores.');
    }

    const data = await response.json();
    return data; // Retorna os dados das despesas
  } catch (error) {
    console.error('Erro:', error);
    return [];
  }
};




export const deleteCollectorById = async (purchaseId) => {
  try {
    const response = await fetch(`${URL}collectors/${purchaseId}`, { 
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Erro ao deletar compra.');
    }
    const data = await response.json();
    return data; // Retorna os dados da compra
  } catch (error) {
    console.error('Erro:', error);
    return [];
  }
};


