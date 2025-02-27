const URL = 'https://sysgrande-nodejs.onrender.com/api/'
const URL_LOCAL = 'http://localhost:5000/api/'
export const fetchedPurchases = async () => {
  try {
    const response = await fetch(`${URL_LOCAL}purchases`, { 
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Erro ao buscar os compras');
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
    const response = await fetch(`${URL_LOCAL}purchase?company=${companyName}`, { 
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




export const deletePurchaseById = async (purchaseId) => {
  try {
    const response = await fetch(`${URL_LOCAL}purchase/${purchaseId}`, { 
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


