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
    darkMode: false,
  });

  return (
    <UserSettingsContext.Provider value={{ state, dispatch }}>
      {children}
    </UserSettingsContext.Provider>
  );
};

interface UseUserSettings {
  darkMode: boolean;
  toggleColorMode: () => void;
}

export const useUserSettings = (): UseUserSettings => {
  const ctx = React.useContext(UserSettingsContext);

  if (!ctx) {
    throw new Error("Beyond UserSettingsProvider!");
  }

  const { state, dispatch } = ctx;

  const toggleColorMode = () => {
    dispatch({ type: ActionType.ToggleColorMode });
  };

  return {
    darkMode: state.darkMode,
    toggleColorMode,
  };
};
