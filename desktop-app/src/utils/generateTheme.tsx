import { createTheme } from "@mui/material";

export const generateTheme = (mode: "light" | "dark") =>
  createTheme({
    palette: {
      mode,
    },
  });
