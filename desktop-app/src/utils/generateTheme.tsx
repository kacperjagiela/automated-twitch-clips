import { createTheme } from "@mui/material";

export const generateTheme = (colorMode: "light" | "dark") =>
  createTheme({
    palette: {
      mode: colorMode,
    },
  });
