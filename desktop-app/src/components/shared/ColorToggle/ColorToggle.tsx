import { Box, FormControlLabel, FormGroup, Switch } from "@mui/material";
import * as React from "react";

import { useUserSettings } from "../../providers/UserSettings";

enum OpositeMode {
  "light" = "dark",
  "dark" = "light",
}

export const ColorToggle: React.FC = () => {
  const { colorMode, toggleColorMode } = useUserSettings();
  const [currentMode, setCurrentMode] = React.useState<"light" | "dark">(
    colorMode
  );

  const handleChange = (currentMode: "light" | "dark") => {
    const newColorMode = OpositeMode[currentMode];

    setCurrentMode(newColorMode);
    toggleColorMode(newColorMode);
  };

  return (
    <Box position="absolute" top={4} right={4}>
      <FormGroup aria-labelledby="dark mode toggle">
        <FormControlLabel
          label="Dark mode"
          control={
            <Switch
              color="default"
              checked={currentMode === "dark"}
              onChange={() => handleChange(currentMode)}
            />
          }
        />
      </FormGroup>
    </Box>
  );
};
