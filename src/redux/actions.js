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

export const startLoading = () => ({
  type: types.uiStartLoading,
  loading: true,
});

export const finishLoading = () => ({
  type: types.uiFinishLoading,
  loading: false,
});

export const setError = (msgError) => ({
  type: types.uiSetError,
  error: msgError,
});

export const clearError = () => ({
  type: types.uiClearError,
});
