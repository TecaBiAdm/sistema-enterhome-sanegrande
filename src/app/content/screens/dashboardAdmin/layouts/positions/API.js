const API_URL = 'http://localhost:3001/api';

export const fetchRoles = async () => {
  try {
    const response = await fetch(`${API_URL}/role`);
    if (!response.ok) {
      throw new Error('Erro ao buscar cargos');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao buscar cargos:', error);
    throw error;
  }
};

export const deleteRole = async (id) => {
    try {
      const response = await fetch(`${API_URL}/role/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Erro ao excluir cargo');
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao excluir cargo:', error);
      throw error;
    }
  };
  
