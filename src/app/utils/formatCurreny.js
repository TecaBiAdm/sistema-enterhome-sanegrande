// Formatar valor em R$
export const formatCurrency = (value) => {
    if (!value) return ""; // Caso vazio
    return `R$ ${parseFloat(value).toFixed(2).replace(".", ",")}`; // Formata em Real
};

// Remover formatação para edição
export const parseCurrency = (value) => {
    return value.toString().replace("R$ ", "").replace(".", "").replace(",", "."); // Remove símbolos
};
