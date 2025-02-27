import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  Chip,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { format, parseISO, isValid } from "date-fns"; // Para formatar datas

// Função para verificar se uma string é uma data ISO válida
const isISODate = (str) => {
  if (typeof str !== 'string') return false;
  try {
    const date = parseISO(str);
    return isValid(date);
  } catch (e) {
    return false;
  }
};

// Função para formatar valores de forma legível
const formatValue = (value) => {
  // Verificar se é uma data ISO e formatá-la
  if (typeof value === 'string' && isISODate(value)) {
    return format(parseISO(value), "dd/MM/yyyy");
  }

  if (Array.isArray(value)) {
    return value.map((item, index) => (
      <Box key={index} sx={{ ml: 2 }}>
        <Typography variant="body2" component="div">
          {item.name} - Quantidade: {item.quantity}, Preço Unitário: R$ {item.unitPrice}, Total: R$ {item.totalPrice}
          {item.date && isISODate(item.date) && `, Data: ${format(parseISO(item.date), "dd/MM/yyyy")}`}
        </Typography>
      </Box>
    ));
  } else if (typeof value === "string" && value.startsWith("[")) {
    // Se for um array em formato de string, converte para array
    try {
      const parsedArray = JSON.parse(value);
      return parsedArray.map((item, index) => (
        <Typography key={index} variant="body2" component="div">
          {typeof item === 'string' && isISODate(item) 
            ? format(parseISO(item), "dd/MM/yyyy") 
            : item}
        </Typography>
      ));
    } catch (error) {
      return value;
    }
  } else if (typeof value === "object" && value !== null) {
    // Se for um objeto, verificar campos que possam ser datas
    const formattedObj = {};
    for (const key in value) {
      if (typeof value[key] === 'string' && isISODate(value[key])) {
        formattedObj[key] = format(parseISO(value[key]), "dd/MM/yyyy");
      } else {
        formattedObj[key] = value[key];
      }
    }
    return JSON.stringify(formattedObj, null, 2);
  } else {
    return value?.toString() || "N/A";
  }
};

const HistoryItem = ({ entry }) => {
  // Filtra apenas as alterações onde oldValue e newValue são diferentes
  const filteredChanges = entry.changes.filter(
    (change) => JSON.stringify(change.oldValue) !== JSON.stringify(change.newValue)
  );

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="subtitle2">
          {entry.action === "criação" ? "Criação" : "Atualização"} por{" "}
          {entry.user} em {format(parseISO(entry.timestamp), "dd/MM/yyyy HH:mm:ss")}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        {filteredChanges.length > 0 ? (
          filteredChanges.map((change, idx) => (
            <Box key={idx} sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                {change.field}:
              </Typography>
              <Box sx={{ display: "flex", gap: 1, alignItems: "flex-start", ml: 2 }}>
                <Chip label="Antigo" size="small" color="default" />
                <Typography variant="body2" component="div">
                  {formatValue(change.oldValue)}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", gap: 1, alignItems: "flex-start", ml: 2 }}>
                <Chip label="Novo" size="small" color="primary" />
                <Typography variant="body2" component="div">
                  {formatValue(change.newValue)}
                </Typography>
              </Box>
            </Box>
          ))
        ) : (
          <Typography variant="body2">Nenhuma alteração registrada.</Typography>
        )}
      </AccordionDetails>
    </Accordion>
  );
};

const HistorySection = ({ history }) => {
  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Histórico de Alterações
      </Typography>
      {history.map((entry, index) => (
        <HistoryItem key={index} entry={entry} />
      ))}
    </Box>
  );
};

export default HistorySection;