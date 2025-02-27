const URL_LOCAL = 'https://sysgrande-nodejs.onrender.com/api/'

export const fetchRegionals = async () => {
    try {
      const response = await fetch(`${URL_LOCAL}regionals`, { 
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Erro ao buscar as regionais');
      }
      const data = await response.json();
      return data; // Retorna os dados dos itens
    } catch (error) {
      console.error('Erro:', error);
      return [];
    }
  };
  
  
