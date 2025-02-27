export const formatPhone = (phone) => {
    // Remove todos os caracteres não numéricos
    const numericPhone = phone?.replace(/\D/g, '');
  
    // Se não houver telefone, retorna vazio
    if (!numericPhone) return '';
  
    // Verifica se é celular (11 dígitos) ou fixo (10 dígitos)
    if (numericPhone.length === 11) {
      // Formato celular: (XX) XXXXX-XXXX
      return numericPhone.replace(
        /^(\d{2})(\d{5})(\d{4})$/,
        '($1) $2-$3'
      );
    } else if (numericPhone.length === 10) {
      // Formato fixo: (XX) XXXX-XXXX
      return numericPhone.replace(
        /^(\d{2})(\d{4})(\d{4})$/,
        '($1) $2-$3'
      );
    }
  
    // Se não se encaixar em nenhum formato, retorna o número sem formatação
    return numericPhone;
  };