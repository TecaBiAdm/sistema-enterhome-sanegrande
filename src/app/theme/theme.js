import React from "react";
import { ThemeProvider, createTheme } from "@mui/material";
import { Kanit } from "next/font/google"; // Usando a fonte Montserrat
import { palette } from "./palette";

// Configuração da fonte Montserrat
const montserrat = Kanit({
  weight: ["300", "400", "700"],
  subsets: ["latin"],
});

const theme = createTheme({
  palette: {
    primary: palette.primary,
    secondary: palette.secondary,
    background: palette.background,
    success: palette.success,
    error: palette.error,
    warning: palette.warning,
    text: palette.text,
  },
  typography: {
    fontFamily: montserrat.style.fontFamily,
    h1: { fontWeight: 700 },
    h2: { fontWeight: 600 },
    body1: { fontWeight: 400 },
    body2: { fontWeight: 300 },
  },
  shape: {
    borderRadius: 8, // Bordas arredondadas para elementos
  },
  spacing: 8, // Espaçamento padrão entre os elementos
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // Remove o texto em maiúsculas
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        h1: {
          color: palette.primary.main,
        },
        h2: {
          color: palette.primary.main,
        },
        h3: {
          color: palette.primary.main,
        },
        h4: {
          color: palette.primary.main,
        },
        p: {
          color: palette.grey[600],
        },
        body1: {
          color: palette.grey[600],
        },
      },
    },
  },
});

export default function Theme({ children }) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
