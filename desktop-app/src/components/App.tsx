import { Box } from "@mui/material";
import * as React from "react";

import { Router } from "./Router";

export const App: React.FC = () => (
  <Box display="flex" flexDirection="column" mx={2} pt={4}>
    <Router />
  </Box>
);
