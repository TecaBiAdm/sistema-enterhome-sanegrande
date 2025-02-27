export const createExpense = async (expenseData) => {
    try {
        const response = await fetch('https://sysgrande-nodejs.onrender.com/api/expenses', {
            method: 'POST',
            // Não define Content-Type explicitamente, pois o FormData já define isso
            body: expenseData, // Passa diretamente o FormData
        });

        if (!response.ok) {
            throw new Error('Erro ao criar Despesa');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro:', error);
        return null;
    }
};

  
  export const updateItem = async (id, itemData) => {
    try {
      const response = await fetch(`http://localhost:5000/api/items/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(itemData),
      });
      if (!response.ok) {
        throw new Error('Erro ao atualizar item');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erro:', error);
      return null;
    }
  };
  
  export const fetchCategoryExpenses = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/despesas', { 
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Erro ao buscar as categorias de despesas');
      }
      const data = await response.json();
      return data; // Retorna os dados dos itens
    } catch (error) {
      console.error('Erro:', error);
      return [];
    }
  };
  
  export const updateItemById = async (itemId, updatedData) => {
    try {
      const response = await fetch(`http://localhost:5000/api/items/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData), // Os dados atualizados do item
      });
  
      if (!response.ok) {
        throw new Error('Erro ao atualizar o item');
      }
  
      const data = await response.json();
      return data; // Retorna os dados do item atualizado
    } catch (error) {
      console.error('Erro ao atualizar o item:', error);
      return null; // Retorna null em caso de erro
    }
  };
  
  
  