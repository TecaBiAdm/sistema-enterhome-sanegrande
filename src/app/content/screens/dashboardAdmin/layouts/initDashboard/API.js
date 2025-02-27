const API_URL = 'http://localhost:3001/api';
import axios from 'axios'; 

export const fetchProducts = async () => {
  try {
    const response = await fetch(`${API_URL}/product`);
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

export const fetchUsers = async () => {
  try {
    const response = await fetch(`${API_URL}/user`);
    if (!response.ok) {
      throw new Error('Erro ao buscar usuários');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro:', error);
    return [];
  }
};

export const fetchOrders = async () => {
  try {
    const response = await fetch(`${API_URL}/order`);
    if (!response.ok) {
      throw new Error('Erro ao buscar pedidos');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro:', error);
    return [];
  }
};


const getAccessToken = async () => {
  const clientId = '50d79ab5-df6b-45f7-a786-615a8a73d960';
  const clientSecret = '740fd9c3-21c4-434a-be36-3e06dbae1025';
  const tenantId = '06738f6b-6721-49b2-908b-ddeed51824ff';

  const URL_LOCAL = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;

  const params = new URLSearchParams();
  params.append('grant_type', 'client_credentials');
  params.append('client_id', clientId);
  params.append('client_secret', clientSecret);
  params.append('scope', 'https://analysis.windows.net/powerbi/api/.default');

  const response = await axios.post(URL_LOCAL, params);
  console.log(response)
  return response.data.access_token;
};

//await getAccessToken()

