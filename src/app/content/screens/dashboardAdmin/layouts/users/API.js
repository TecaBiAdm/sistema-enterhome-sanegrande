const API_URL = 'http://localhost:3001/api';

export const fetchUsers = async () => {
  try {
    const response = await fetch(`${API_URL}/user`);
    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const deleteUser = async (id) => {
    try {
      const response = await fetch(`${API_URL}/user/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao deletar usuário');
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
      throw error;
    }
  };
