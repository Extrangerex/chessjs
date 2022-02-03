import { types } from "./types";
import firebase from "firebase";
import { Board } from "../models/Board";
import { finishLoading, startLoading } from "./actions";
import { ReactSwal } from "../utils/SwalUtils";

export const newGame = (uid, email) => async (dispatch) => {
  if (uid === undefined) return;
  dispatch(startLoading());

  const itemRef = await firebase.database().ref("lobby").push();

  let partidas;
  let next_id_partida;

  await firebase.database().ref("lobby")
    .get()
    .then((snapshot) => {
      partidas = snapshot.val();
    })
    .catch((error) => {
      console.error(error);
    });

  if (partidas === null) {
    next_id_partida = 1;
  } else {
    next_id_partida = Object.keys(partidas).length + 1;
  }


  const clave = localStorage.getItem("clave_privada");
  const moves = localStorage.getItem("moves");
  const time = localStorage.getItem("time");


  const ahorita = new Date();
  const timetoplayplayers = ahorita.getTime() + 45 * 60 * 1000;
  const timetoplay = ahorita.getTime() + 90 * 60 * 1000;

  if (email === null || email === undefined) {
    email = "Anonimo";
  }

  await itemRef.set({
    id_partida: next_id_partida,
    creador: email,
    fecha_creacion:ahorita,
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
    jaquedesde: "-1,-1",
    createdAt: timetoplay,
    timeplayer1: timetoplayplayers,
    timeplayer2: timetoplayplayers,
    tiempo_restante_jugador1: "45:00",
    tiempo_restante_jugador2: "45:00",
    side: uid,
    whiteCasualities: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    blackCasualities: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    whiteCasualitiesText: "",
    blackCasualitiesText: "",
    player1: uid,
    player2: null,
    status: "waiting",
    comeralpaso: "-1,-1",
    comeralpasoconejo: "-1,-1",
    comeralpasoardilla: "-1,-1",
    comeralpasoardillatres: "-1,-1",
    leoncoronadoblancocomible: false,
    posicionleonblanco: "-1,-1",
    leoncoronadonegrocomible: false,
    posicionleonnegro: "-1,-1",
    posicionreynegro: "4,0",
    posicionreyblanco: "4,9",
    bloque: 1,
    numero_turno: 1,
    isTriggeredChangeTeam: false,
    ultimo_movimiento: "",
    clave_privada: clave,
    partida_con_movimientos: moves,
    partida_con_tiempo: time,
    pidio_pausa: "",
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
    const game = lobbyItemRefSnap?.toJSON();

    if (game?.player1 != null && game?.player2 != null && game?.status !== "pause") {
      if (game?.player1 !== uid && game?.player2 !== uid) {
        ReactSwal.fire({
          title: "Opps..",
          text: "Esta sala ya esta llena",
          icon: "warning",
          preConfirm: () => {
            window.location = "/";
          },
        });
        return;
      }
    }

    if (uid === lobbyItemRefSnap?.toJSON().player1) {
      dispatch(newGameAction(`lobby/${lobbyItemId}`));
    } else {
      //si estamos en pausa el player 2 no puede reanudar
      if (game?.status !== "pause") {
        await firebase
          .database()
          .ref(`lobby/${lobbyItemId}`)
          .update({ player2: uid, status: "playing" });
      }

    }

    dispatch(newGameAction(`lobby/${lobbyItemId}`));
  }

  dispatch(finishLoading());
};

export const reviewGame = (lobbyItemId, uid) => async (dispatch) => {
  if (uid === undefined) return;
  dispatch(startLoading());

  const lobbyItemRefSnap = await firebase
    .database()
    .ref(`lobby/${lobbyItemId}`)
    .get();

  if (lobbyItemRefSnap.exists()) {

    if (uid === lobbyItemRefSnap?.toJSON().player1) {
      dispatch(newGameAction(`lobby/${lobbyItemId}`));
    } else {

      await firebase
        .database()
        .ref(`lobby/${lobbyItemId}`)
        .update({ player2: uid });

    }
    dispatch(newGameAction(`lobby/${lobbyItemId}`));
  }

  dispatch(finishLoading());
};

export const sendChatMsg = (lobbyItemId, uid, msg) => async (dispatch) => {
  if (uid === undefined) return;
  dispatch(startLoading());

  const lobbyItemRefSnap = await firebase
    .database()
    .ref(`lobby/${lobbyItemId}`)
    .get();

  if (lobbyItemRefSnap.exists()) {
    await firebase
      .database()
      .ref(`lobby/${lobbyItemId}/chat`)
      .push(uid)
      .set(msg);
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
  dispatch(finishLoading());
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

export const sendChatMsgAction = () => ({
  type: types.sendChatMsgGame,
});

export const newGameAction = (lobbyItemRef) => ({
  type: types.addGame,
  lobbyItemRef,
});

export const initGameAction = (gamePath) => ({
  type: types.initGame,
  gamePath,
});
