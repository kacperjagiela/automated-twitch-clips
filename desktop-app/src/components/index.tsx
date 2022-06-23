import { CssBaseline, ThemeProvider } from "@mui/material";
import * as React from "react";
import ReactDOM from "react-dom/client";
import { generateTheme } from "../utils";
import { App } from "./App";

const render = () => {
  const root = ReactDOM.createRoot(document.getElementById("root"));
  const theme = generateTheme("light");

  root.render(
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </>
  );
};

render();
