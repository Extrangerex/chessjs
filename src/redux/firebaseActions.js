import { finishLoading, setError, startLoading } from "./actions";
import firebase from "firebase";

export const signInWithEmailPassword =
  (email, password) => async (dispatch) => {
    dispatch(startLoading());

    const result = await firebase
      .auth()
      .signInWithEmailAndPassword(email, password);

    if (!result) {
      dispatch(setError("Nombre de usuario y/o contraseña invalida"));
    }

    dispatch(finishLoading());
  };

export const createUserEmailPassword =
  ({ email, password, displayName }) =>
  async (dispatch) => {
    dispatch(startLoading());

    const result = await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password);

    if (!result) {
      dispatch(setError("Nombre de usuario y/o contraseña invalida"));
      return;
    }

    await result.user.updateProfile({ displayName });

    dispatch(finishLoading());
  };
