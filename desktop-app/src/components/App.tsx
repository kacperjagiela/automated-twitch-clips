import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import * as React from "react";

import { generateTheme } from "../utils";
import { useUserSettings } from "./providers/UserSettings";
import { Router } from "./Router";

export const App: React.FC = () => {
  const { darkMode } = useUserSettings();
  const theme = generateTheme(darkMode);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box display="flex" flexDirection="column" mx={2} pt={4}>
        <Router />
      </Box>
    </ThemeProvider>
  );
};
