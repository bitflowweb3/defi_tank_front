import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#fff", light: "#f55b00", dark: "#060200e3" },
    secondary: { main: "#55322c", light: "#ccad45", dark: "#1e0500" },
    error: { main: "#da2607" },
    warning: { main: "#e9cf1c" },
    text: { primary: "#ffffff", secondary: "#e9e8e8" },
    background: { paper: "#060200e3" }
  },
  typography: {
    allVariants: {
      color: "#ffffff",
      fontFamily: `"Roboto","Helvetica","Arial",sans-serif`
    },
  },
})

const MuiProvider = ({ children }: any) => {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}

export { MuiProvider }