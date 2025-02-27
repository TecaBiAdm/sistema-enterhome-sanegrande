export const fetchPlanById = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/plan/${id}`);
      if (!response.ok) {
        throw new Error('Erro ao buscar plano');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erro:', error);
      return null;
    }
  };