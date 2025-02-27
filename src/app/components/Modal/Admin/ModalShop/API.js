
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

export const createPurchase = async (purchaseData) => {
  try {
    const response = await fetch(
      `${URL}purchase`,
      {
        method: "POST",
        body: purchaseData,
      }
    );

    if (!response.ok) {
      throw new Error("Erro ao criar Despesa");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro:", error);
    return null;
  }
};

export const updatePurchase = async (purchaseData, id) => {
  try {
    const response = await fetch(
      `${URL}purchase/${id}`,
      {
        method: "PUT",
        body: purchaseData, // Passando o FormData diretamente como body
      }
    );

    if (!response.ok) {
      throw new Error("Erro ao editar Despesa");
    }

    return await response.json();
  } catch (error) {
    console.error("Erro:", error);
    return null;
  }
};

