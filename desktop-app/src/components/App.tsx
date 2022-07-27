import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import * as React from "react";

import { generateTheme } from "../utils";
import { useUserSettings } from "./providers/UserSettings";
import { Router } from "./Router";
import { ColorToggle } from "./shared/ColorToggle";

export const App: React.FC = () => {
  const { colorMode } = useUserSettings();
  const theme = generateTheme(colorMode);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box display="flex" flexDirection="column" mx={2} pt={4}>
        <ColorToggle />
        <Router />
      </Box>
    </ThemeProvider>
  );
};
