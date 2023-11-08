import { ThemeProvider, createTheme } from "@mui/material/styles";

declare module '@mui/material/styles' {
  interface BreakpointOverrides {
    xs: true;
    sm: true;
    md: true;
    lg: true;
    xl: true;
    // mobile: true;
    // tablet: true;
    // laptop: true;
    // desktop: true;
  }
}

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
      // mobile: 0,
      // tablet: 640,
      // laptop: 1024,
      // desktop: 1200,
    }
  },
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

  return (
    // @ts-ignore
    <ThemeProvider theme={theme}>
      {children}
    </ThemeProvider>
  )
}

export { MuiProvider }