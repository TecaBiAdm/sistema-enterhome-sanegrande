export const formatCNPJ = (cnpj) => {
    // Se não houver CNPJ, retorna vazio
    if (!cnpj) return '';
  
    // Remove todos os caracteres não numéricos
    const numericCNPJ = cnpj.replace(/[^\d]/g, '');
  
    // Verifica se tem o tamanho correto
    if (numericCNPJ.length !== 14) {
      return numericCNPJ; // Retorna sem formatação se não tiver 14 dígitos
    }
  
    // Aplica a máscara
    return numericCNPJ.replace(
      /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
      '$1.$2.$3/$4-$5'
    );
  };