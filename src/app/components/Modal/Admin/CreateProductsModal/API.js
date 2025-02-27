export const createProduct = async (product) => {
    try {
      const response = await fetch(`http://localhost:3001/api/product`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      });
  
      if (!response.ok) {
        throw new Error('Erro ao criar produto');
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      throw error;
    }
  };
  

  export const updateProduct = async (id, product) => {
    try {
      const response = await fetch(`http://localhost:3001/api/product/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      });
  
      if (!response.ok) {
        throw new Error('Erro ao atualizar produto');
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      throw error;
    }
  };