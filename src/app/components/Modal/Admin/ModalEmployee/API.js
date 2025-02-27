
const URL = 'https://sysgrande-nodejs.onrender.com/api/'
const URL_LOCAL = 'http://localhost:5000/api/'

export const fetchedEmployeesByCompany = async (companyName) => {
  try {
    const response = await fetch(
      `${URL_LOCAL}employees?company=${companyName}`,
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

export const fetchRegionals = async () => {
  try {
    const response = await fetch(
      `${URL_LOCAL}regionals`,
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
      `${URL_LOCAL}municipios`,
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
      `${URL_LOCAL}local`,
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


export const createEmployee = async (employeeData) => {
  const response = await fetch(`${URL_LOCAL}employees`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // Certifique-se que o backend aceita JSON
    },
    body: JSON.stringify(employeeData), // Converta o objeto em JSON
  });

  if (!response.ok) {
    throw new Error(`Erro ${response.status}: ${await response.text()}`);
  }

  return response.json();
};

export const updateEmployee = async (employeeData, id) => {
  try {
    const response = await fetch(
      `${URL_LOCAL}employees/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json", // Certifique-se que o backend aceita JSON
        },
        body: JSON.stringify(employeeData), // Converta o objeto em JSON
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



