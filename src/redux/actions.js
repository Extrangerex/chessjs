import { types } from "./types";

export const setAuthData = ({ isSignedIn, user, providerId }) => {
  return {
    type: types.setAuthData,
    payload: {
      isSignedIn,
      user,
      providerId,
      isAnonymously: providerId === "anonymous",
    },
  };
};
