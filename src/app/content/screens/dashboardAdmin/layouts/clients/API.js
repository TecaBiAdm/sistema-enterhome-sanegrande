const API_URL = 'http://localhost:3001/api';

export const fetchUsers = async () => {
  try {
    const response = await fetch(`${API_URL}/client`);
    if (!response.ok) {
      throw new Error('Erro ao buscar clientes');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro:', error);
    return [];
  }
};

export const updateClient = async (id, clientData) => {
  try {
    const response = await fetch(`${API_URL}/client/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(clientData)
    });
    if (!response.ok) {
      throw new Error('Erro ao atualizar cliente');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro:', error);
    return null;
  }
};

export const deleteClient = async (id) => {
  try {
    const response = await fetch(`${API_URL}/client/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) {
      throw new Error('Erro ao deletar cliente');
    }
    return true;
  } catch (error) {
    console.error('Erro:', error);
    return false;
  }
};
