import { types } from "./types";

const initialAuthReducerState = {
  isSignedIn: false,
  user: null,
  providerId: null,
  isAnonimously: null,
};

export const authReducer = (state = initialAuthReducerState, action) => {
  switch (action.type) {
    case types.setAuthData:
      return {
        ...action.payload,
      };
    default:
      return state;
  }
};
