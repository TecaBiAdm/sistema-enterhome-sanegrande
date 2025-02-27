export const fetchedExpenses = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/expenses', { 
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Erro ao buscar os despesas');
    }
    const data = await response.json();
    return data; // Retorna os dados dos despesas
  } catch (error) {
    console.error('Erro:', error);
    return [];
  }
};

export const fetchedExpensesByCompany = async (companyName) => {
  try {
    const response = await fetch(`http://localhost:5000/api/expenses?company=${companyName}`, { 
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Erro ao buscar as despesas');
    }

    const data = await response.json();
    return data; // Retorna os dados das despesas
  } catch (error) {
    console.error('Erro:', error);
    return [];
  }
};




export const deleteExpenseById = async (expenseId) => {
  try {
    const response = await fetch(`http://localhost:5000/api/expenses/${expenseId}`, { 
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Erro ao deletar despesa.');
    }
    const data = await response.json();
    return data; // Retorna os dados dos itens
  } catch (error) {
    console.error('Erro:', error);
    return [];
  }
};


