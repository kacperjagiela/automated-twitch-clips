import * as React from "react";
import ReactDOM from "react-dom/client";

import { App } from "./App";
import { UserSettingsProvider } from "./providers/UserSettings";

const render = () => {
  const root = ReactDOM.createRoot(document.getElementById("root"));

  root.render(
    <UserSettingsProvider>
      <App />
    </UserSettingsProvider>
  );
};

render();
