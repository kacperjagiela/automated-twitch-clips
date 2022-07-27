export type State = {
  colorMode: "light" | "dark";
};

export enum ActionType {
  ToggleColorMode = "ToggleColorMode",
}

export type Action = {
  type: ActionType.ToggleColorMode;
  payload: {
    colorMode: "light" | "dark";
  };
};

export const userSettingsReducer = (state: State, action: Action) => {
  switch (action.type) {
    case ActionType.ToggleColorMode:
      return { ...state, colorMode: action.payload.colorMode };
    default:
      return state;
  }
};
