export type State = {
  darkMode: boolean;
};

export enum ActionType {
  ToggleColorMode = "ToggleColorMode",
}

export type Action = {
  type: ActionType.ToggleColorMode;
};

export const userSettingsReducer = (state: State, action: Action) => {
  switch (action.type) {
    case ActionType.ToggleColorMode:
      return { ...state, darkMode: !state.darkMode };
    default:
      return state;
  }
};
