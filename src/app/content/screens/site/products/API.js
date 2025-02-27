export const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/product');
      if (!response.ok) {
        throw new Error('Erro ao buscar produtos');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erro:', error);
      return [];
    }
  };
  