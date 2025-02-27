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


export const updateRole = async (id, name) => {
  try {
    const response = await fetch(`${API_URL}/role/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name })
    });
    if (!response.ok) {
      throw new Error('Erro ao atualizar cargo');
    }
    return await response.json();
  } catch (error) {
    console.error('Erro ao atualizar cargo:', error);
    throw error;
  }
};

export const updateRolePermission = async (roleId, permissionId) => {
  try {
    const response = await fetch(`${API_URL}/role-permission/${roleId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ roleId, permissionId })
    });
    if (!response.ok) {
      throw new Error('Erro ao atualizar cargo');
    }
    return await response.json();
  } catch (error) {
    console.error('Erro ao atualizar cargo:', error);
    throw error;
  }
};


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

export const createRole = async (name) => {
  try {
    const response = await fetch(`${API_URL}/role`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name })
    });
    if (!response.ok) {
      throw new Error('Erro ao criar cargo');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao criar cargo:', error);
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

export const associateRolePermission = async (roleId, permissionId) => {
  try {
    const response = await fetch(`${API_URL}/role-permission`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ roleId, permissionId })
    });
    if (!response.ok) {
      throw new Error('Erro ao associar cargo e permissão');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao associar cargo e permissão:', error);
    throw error;
  }
};
