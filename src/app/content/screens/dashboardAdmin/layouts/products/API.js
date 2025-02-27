
export const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/product');
      if (!response.ok) {
        throw new Error('Erro ao buscar produtos');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      throw error;
    }
  };

  export const deleteProduct = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/api/product/${id}`, {
        method: 'DELETE',
      });
  
      if (!response.ok) {
        throw new Error('Erro ao deletar produto');
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erro ao deletar produto:', error);
      throw error;
    }
  }
  