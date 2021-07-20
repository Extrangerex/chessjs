import { types } from "./types";
import firebase from "firebase";
import { Board } from "../models/Board";
import { finishLoading, startLoading } from "./actions";
import { GameConst } from "../config/Constants";

export const newGame = (uid) => async (dispatch) => {
  if (uid === undefined) return;
  dispatch(startLoading());

  const itemRef = await firebase.database().ref("lobby").push();

  await itemRef.set({
    board: new Board(),
    curX: -1,
    curY: -1,
    njblancas: 0,
    njnegras: 0,
    tmpjuego: 0,
    contadorleonnegro: 0,
    contadorleonblanco: 0,
    contadorreyblanco: 0,
    contadorreynegro: 0,
    contadortorre1blanco: 0,
    contadortorre1negro: 0,
    contadortorre2blanco: 0,
    contadortorre2negro: 0,
    jaquereynegro: "No",
    jaquereyblanco: "No",
    createdAt: Date.now(),
    side: GameConst.white,
    whiteCasualities: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    blackCasualities: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    player1: uid,
    player2: null,
    status: "waiting",
  });

  dispatch(newGameAction(`lobby/${itemRef.key}`));
  dispatch(finishLoading());
};

export const joinGame = (lobbyItemId, uid) => async (dispatch) => {
  if (uid === undefined) return;
  dispatch(startLoading());

  const lobbyItemRefSnap = await firebase
    .database()
    .ref(`lobby/${lobbyItemId}`)
    .get();

  if (lobbyItemRefSnap.exists()) {
    await firebase
      .database()
      .ref(`lobby/${lobbyItemId}`)
      .update({ player2: uid, status: "playing" });

    dispatch(newGameAction(lobbyItemRefSnap.ref));
  }

  dispatch(finishLoading());
};

export const updateBoard = (lobbyItemId, newBoard) => async (dispatch) => {
  dispatch(startLoading());

  const lobbyItemRefSnap = await firebase
    .database()
    .ref(`lobby/${lobbyItemId}`)
    .get();

  if (lobbyItemRefSnap.exists()) {
    await firebase
      .database()
      .ref(`lobby/${lobbyItemId}`)
      .update({ board: newBoard });
  }
};

export const updateGame = (lobbyItemId, data) => async (dispatch) => {
  dispatch(startLoading());

  const lobbyItemRefSnap = await firebase
    .database()
    .ref(`lobby/${lobbyItemId}`)
    .get();

  if (lobbyItemRefSnap.exists()) {
    await firebase.database().ref(`lobby/${lobbyItemId}`).update(data);
  }
};

export const newGameAction = (lobbyItemRef) => ({
  type: types.addGame,
  lobbyItemRef,
});

export const initGameAction = (gamePath) => ({
  type: types.initGame,
  gamePath,
});
