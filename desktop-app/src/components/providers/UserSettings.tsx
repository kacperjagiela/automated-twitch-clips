import * as React from "react";

import { Nullable } from "../../types/nullable";
import {
  Action,
  ActionType,
  State,
  userSettingsReducer,
} from "./reducers/userSettingsReducer";

interface Value {
  state: State;
  dispatch: React.Dispatch<Action>;
}

const UserSettingsContext = React.createContext<Nullable<Value>>(null);

interface Props {
  children: React.ReactNode;
}

export const UserSettingsProvider: React.FC<Props> = ({ children }) => {
  const [state, dispatch] = React.useReducer(userSettingsReducer, {
    colorMode: "light",
  });

  return (
    <UserSettingsContext.Provider value={{ state, dispatch }}>
      {children}
    </UserSettingsContext.Provider>
  );
};

interface UseUserSettings {
  colorMode: "light" | "dark";
  toggleColorMode: (colorMode: "light" | "dark") => void;
}

export const useUserSettings = (): UseUserSettings => {
  const ctx = React.useContext(UserSettingsContext);

  if (!ctx) {
    throw new Error("Beyond UserSettingsProvider!");
  }

  const { state, dispatch } = ctx;

  const toggleColorMode = (colorMode: "light" | "dark") => {
    dispatch({ type: ActionType.ToggleColorMode, payload: { colorMode } });
  };

  return {
    colorMode: state.colorMode,
    toggleColorMode,
  };
};
