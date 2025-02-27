import { json } from "react-router-dom";

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
  
  export const createExpense = async (expenseData) => {
    try {
      const response = await fetch(
        `${URL_LOCAL}expenses/vacation`,
        {
          method: "POST",
          body: expenseData,
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
  
  export const updateExpense = async (expenseData, id) => {
    console.log(id)
    try {
      const response = await fetch(
        `${URL_LOCAL}expenses/vacation/${id}`,
        {
          method: "PATCH",
          body:  expenseData, // Passando o FormData diretamente como body
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
  
  