
const URL = 'https://sysgrande-nodejs.onrender.com/api/'
const URL_LOCAL = 'http://localhost:5000/api/'

export const fetchedSuppliersByCompany = async (companyName) => {
  try {
    const response = await fetch(
      `${URL}supplier?company=${companyName}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      throw new Error("Erro ao buscar os fornecedores");
    }
    const data = await response.json();
    return data; // Retorna os dados dos fornecedores
  } catch (error) {
    console.error("Erro:", error);
    return [];
  }
};

export const createCollector = async (collectorData) => {
  try {
    const response = await fetch(
      `${URL}collectors`,
      {
        method: "POST",
        body: collectorData,
      }
    );

    if (!response.ok) {
      throw new Error("Erro ao criar coletor");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro:", error);
    return null;
  }
};


export const fetchedEmployeesByCompany = async (companyName) => {
    try {
      const response = await fetch(
        `${URL}employees?company=${companyName}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Erro ao buscar os funcionários");
      }
      const data = await response.json();
      return data; // Retorna os dados dos despesas
    } catch (error) {
      console.error("Erro:", error);
      return [];
    }
  };
  
export const updateCollector = async (collectorData, id) => {
  try {
    const response = await fetch(
      `${URL}collector/${id}`,
      {
        method: "PATCH",
        body: collectorData, // Passando o FormData diretamente como body
      }
    );

    if (!response.ok) {
      throw new Error("Erro ao editar coletor");
    }

    return await response.json();
  } catch (error) {
    console.error("Erro:", error);
    return null;
  }
};

export const fetchRegionals = async () => {
  try {
    const response = await fetch(
      `${URL}regionals`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      throw new Error("Erro ao buscar as regionais");
    }
    const data = await response.json();
    return data; 
  } catch (error) {
    console.error("Erro:", error);
    return [];
  }
};

export const fetchMunicipios = async () => {
  try {
    const response = await fetch(
      `${URL}municipios`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      throw new Error("Erro ao buscar os municipios");
    }
    const data = await response.json();
    return data; 
  } catch (error) {
    console.error("Erro:", error);
    return [];
  }
};

export const fetchLocals = async () => {
  try {
    const response = await fetch(
      `${URL}local`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      throw new Error("Erro ao buscar as localidades");
    }
    const data = await response.json();
    return data; 
  } catch (error) {
    console.error("Erro:", error);
    return [];
  }
};


