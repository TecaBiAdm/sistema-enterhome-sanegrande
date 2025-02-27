const API_URL = 'http://localhost:3001/api';

export const fetchPermissions = async () => {
  try {
    const response = await fetch(`${API_URL}/permission`);
    if (!response.ok) {
      throw new Error('Erro ao buscar permissões');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao buscar permissões:', error);
    throw error;
  }
};

export const createPermission = async (name) => {
  try {
    const response = await fetch(`${API_URL}/permission`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name })
    });
    if (!response.ok) {
      throw new Error('Erro ao criar permissão');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao criar permissão:', error);
    throw error;
  }
};

export const updatePermission = async (id, name) => {
  try {
    const response = await fetch(`${API_URL}/permission/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name })
    });
    if (!response.ok) {
      throw new Error('Erro ao atualizar permissão');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao atualizar permissão:', error);
    throw error;
  }
};

export const deletePermission = async (id) => {
  try {
    const response = await fetch(`${API_URL}/permission/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Erro ao excluir permissão');
    }
    return response.json();
  } catch (error) {
    console.error('Erro ao excluir permissão:', error);
    throw error;
  }
};
