import { createTheme } from "@mui/material/styles";

export default function getTheme(mode = "light") {
  return createTheme({
    palette: {
      mode,
      primary: {
        main: "#1da1f2",
      },
      secondary: {
        main: "#14171a",
      },
      background: {
        default: mode === "light" ? "#f5f8fa" : "#15202b",
        paper: mode === "light" ? "#fff" : "#192734",
      },
    },
    typography: {
      fontFamily: [
        'Segoe UI',
        'Roboto',
        'Helvetica Neue',
        'Arial',
        'sans-serif',
      ].join(','),
      h1: { fontWeight: 700 },
      h2: { fontWeight: 700 },
      h3: { fontWeight: 600 },
      h4: { fontWeight: 600 },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 600,
          },
        },
      },
    },
  });
}
