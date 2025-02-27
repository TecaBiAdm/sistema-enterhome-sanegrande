
const URL = 'https://sysgrande-nodejs.onrender.com/api/'
const URL_LOCAL = 'http://localhost:5000/api/'

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

export const createSupplier = async (supplierData) => {
  try {
    const response = await fetch(
      `${URL}supplier`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(supplierData),
      }
    );

    if (!response.ok) {
      throw new Error("Erro ao criar Fornecedor");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro:", error);
    return null;
  }
};



export const updateSupplier = async (supplierData, id) => {
  try {
    const response = await fetch(
      `${URL}supplier/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json", // Certifique-se que o backend aceita JSON
        },
        body: JSON.stringify(supplierData), // Converta o objeto em JSON
      }
    );

    if (!response.ok) {
      throw new Error("Erro ao editar fornecedor");
    }

    return await response.json();
  } catch (error) {
    console.error("Erro:", error);
    return null;
  }
};



