import { GameConst } from "../config/Constants";
import { Board } from "../models/Board";
import { EventEmitter } from "fbemitter";
import firebase from "firebase";

/**
 * imgs
 */
import alfil from "../assets/svg/alfil.svg";
import alfilbco from "../assets/svg/alfilbco.svg";
import ardilla from "../assets/svg/ardilla.svg";
import ardillabco from "../assets/svg/ardillabco.svg";
import caballo from "../assets/svg/caballo.svg";
import caballobco from "../assets/svg/caballobco.svg";
import conejo from "../assets/svg/conejo.svg";
import conejobco from "../assets/svg/conejobco.svg";
import elefante from "../assets/svg/elefante.svg";
import elefantebco from "../assets/svg/elefantebco.svg";
import leon from "../assets/svg/leon.svg";
import leonbco from "../assets/svg/leonbco.svg";
import pantera from "../assets/svg/pantera.svg";
import panterabco from "../assets/svg/panterabco.svg";
import peon from "../assets/svg/peon.svg";
import peonbco from "../assets/svg/peonbco.svg";
import perro from "../assets/svg/perro.svg";
import perrobco from "../assets/svg/perrobco.svg";
import reina from "../assets/svg/reina.svg";
import reinabco from "../assets/svg/reinabco.svg";
import rey from "../assets/svg/rey.svg";
import reybco from "../assets/svg/reybco.svg";
import torre from "../assets/svg/torre.svg";
import torrebco from "../assets/svg/torrebco.svg";
import fakeking from "../assets/svg/rey.svg";
import fakekingbco from "../assets/svg/reybco.svg";
import vacio from "../assets/svg/vacio.svg";
import Swal from "sweetalert2";

export const event = new EventEmitter();

const BOARD_WIDTH = GameConst.boardWidth;
const BOARD_HEIGHT = GameConst.boardHeight;

const HIGHLIGHT_COLOR = GameConst.colors.highLightTileColor;
const WHITE = GameConst.white;
const BLACK = GameConst.black;

const EMPTY = GameConst.empty;
const PAWN = GameConst.pawn;
const KNIGHT = GameConst.knight;
const BISHOP = GameConst.bishop;
const ROOK = GameConst.rook;
const QUEEN = GameConst.queen;
const KING = GameConst.king;
const FAKEKING = GameConst.fakeking;
const ARDILLA = GameConst.squirrel;
const CONEJO = GameConst.bunny;
const PERRO = GameConst.dog;
const PANTERA = GameConst.panter;
const ELEFANTE = GameConst.elephant;
const LEON = GameConst.lyon;

//const INVALID = GameConst.invalid;
const VALID = GameConst.valid;
const VALID_CAPTURE = GameConst.validCapture;

const piecesCharacters = {
  0: "♙",
  1: "♘",
  2: "♗",
  3: "♖",
  4: "♕",
  5: "♔",
  6: "Ar",
  7: "Co",
  8: "Pe",
  9: "Pa",
  10: "El",
  11: "Le",
  12: "FK",
};

let whiteCasualitiesText;
let blackCasualitiesText;

let board;
let currentTeam;
let currentTeamJUSTCHECK;
let currentTeamCHECKBLOCKMATE;
let currentTeamKINGRESOLVEMATE;
let currentTeamCHECKMOVE;

let flag = 1;

let curX;
let curY;

let whiteCasualities;
let blackCasualities;

let contadorreyblanco;
let contadorreynegro;
let contadortorre1blanco;
let contadortorre1negro;
let contadortorre2blanco;
let contadortorre2negro;

let casillasenpeligro = [];
let bloquearjaquemate = [];
let posiblemovimiento = [];
let resolverjaquemate = [];


let jaquereyblanco;
let jaquereynegro;


let posicionreynegro;
let posicionreyblanco;

let jugadas_negras;
let jugadas_blancas;


let comeralpaso;
let comeralpasoardilla;
let comeralpasoardillatres;
let comeralpasoconejo;

let leoncoronadoblancocomible;
let leoncoronadonegrocomible;
let posicionleonblanco;
let posicionleonnegro;
let numero_turno;
let bloque;

let ultimapiezacapturadanegra;
let ultimapiezacapturadablanca;

let ultimotipodemovimiento; //captura o movimiento

let ultimomovimiento;
let nomenclatura;
let aviso_doble_turno = false;
let aviso_inicio = true;
let aviso_jaque = false;
let clave_privada;

let validar = true;

let lobbyItemKey;

let serverGameData = {};

let ejeX = ["a", "b", "c", "d", "e", "f", "g", "h", "i"];
let ejeY = ["10", "9", "8", "7", "6", "5", "4", "3", "2", "1"];

whiteCasualities = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
blackCasualities = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

export function onLoad(_lobbyItemKey) {

  lobbyItemKey = _lobbyItemKey;

  startGame(lobbyItemKey);
}

function getGameDbRef() {
  return firebase.database().ref(lobbyItemKey);
}

async function setIsTriggeredChangeTeam(value) {
  await getGameDbRef()
    .update({
      isTriggeredChangeTeam: value,
    })
    .catch(console.error);
}


setInterval(() => {
  let val = getMinutesromLastPieceJoueCreatedAt();

  const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(
    (value) => `${value * 5}:0`
  );

  if (array.includes(val)) {
    //changeCurrentTeam(true, true); //cambio de turno despues de 5 min.
  }
}, 1000);

/**
 * Function called each second from Game Component
 */
export async function setTimerFromCreatedAt() {

  if (serverGameData?.status === "playing") {

    /*
    if (parseInt((getMillisecondsFromCreatedAt() / (1000 * 60)) % 60) === 0) {
      if (serverGameData?.status !== "tied") {
        await getGameDbRef()
          .update({
            status: "tied",
          })
          .catch(console.error);
      }
    }
    */
    if (getMillisecondsFromPlayer1() < 0 && serverGameData?.partida_con_tiempo === "true") {
      if (serverGameData?.status !== "timeover black wins") {
        await getGameDbRef()
          .update({
            status: "timeover black wins",
          })
          .catch(console.error);
        Swal.fire({
          title: "Opps..",
          text: "SE TERMINÓ EL TIEMPO HAN GANADO LAS NEGRAS",
        });
      }
    }

    if (getMillisecondsFromPlayer2() < 0 && serverGameData?.partida_con_tiempo === "true") {
      if (serverGameData?.status !== "timeover white wins") {
        await getGameDbRef()
          .update({
            status: "timeover white wins",
          })
          .catch(console.error);
        Swal.fire({
          title: "Opps..",
          text: "SE TERMINÓ EL TIEMPO HAN GANADO LAS BLANCAS",
        });
      }
    }




    if (serverGameData?.partida_con_tiempo === "true") {
      //timer general
      document.getElementById("time_createdat").innerHTML = getMinutesFromCreatedAt();

      if (serverGameData?.side === serverGameData?.player1) {
        document.getElementById("time_toplay_player1").innerHTML = getMinutesromPlayer1();
      } else {
        document.getElementById("time_toplay_player1").innerHTML = serverGameData?.tiempo_restante_jugador1
      }

      if (serverGameData?.side === serverGameData?.player2) {
        document.getElementById("time_toplay_player2").innerHTML = getMinutesromPlayer2();
      } else {
        document.getElementById("time_toplay_player2").innerHTML = serverGameData?.tiempo_restante_jugador2
      }
    } else {
      document.getElementById("time_createdat").innerHTML = "00:00";
      document.getElementById("time_toplay_player1").innerHTML = "00:00";
      document.getElementById("time_toplay_player2").innerHTML = "00:00";
    }
  }
}

//timer general
export function getMinutesFromCreatedAt() {
  const date1 = new Date(serverGameData?.createdAt);
  const date2 = Date.now();
  const diffTime = Math.abs(date2 - date1);
  /*let seconds = (diffTime / 1000) % 60;*/
  let minutes = (diffTime / (1000 * 60)) % 60;

  if (minutes < 10) {
    minutes = "0" + parseInt(minutes);
  } else {
    minutes = parseInt(minutes);
  }
  let hours = (diffTime / (1000 * 60 * 60)) % 60;
  //return `${parseInt(hours)}:${parseInt(minutes)}:${parseInt(seconds)}`;
  return `${parseInt(hours)}:${minutes}`;
}
//timer general
/*
function getMillisecondsFromCreatedAt() {
  const date1 = new Date(serverGameData?.createdAt);
  const date2 = Date.now();
  return Math.abs(date2 - date1);
}
*/

function getMillisecondsFromLastPieceJoueCreatedAt() {
  const date1 = new Date(
    serverGameData?.lastPiecejoue?.createdAt ?? serverGameData?.createdAt
  );
  const date2 = Date.now();
  return parseInt(date2 - date1);
}

function getMinutesromLastPieceJoueCreatedAt() {
  let seconds = (getMillisecondsFromLastPieceJoueCreatedAt() / 1000) % 60;
  let minutes =
    (getMillisecondsFromLastPieceJoueCreatedAt() / (1000 * 60)) % 60;
  return `${parseInt(minutes)}:${parseInt(seconds)}`;
}

function getMillisecondsFromPlayer1() {
  const date1 = new Date(serverGameData?.timeplayer1);
  const date2 = Date.now();
  return parseInt(date1 - date2);
}
function getMinutesromPlayer1() {
  let seconds = (getMillisecondsFromPlayer1() / 1000) % 60;
  let minutes =
    (getMillisecondsFromPlayer1() / (1000 * 60)) % 60;
  return `${parseInt(minutes)}:${parseInt(seconds)}`;
}

function getMillisecondsFromPlayer2() {
  const date1 = new Date(serverGameData?.timeplayer2);
  const date2 = Date.now();
  return parseInt(date1 - date2);
}

function getMinutesromPlayer2() {
  let seconds = (getMillisecondsFromPlayer2() / 1000) % 60;
  let minutes =
    (getMillisecondsFromPlayer2() / (1000 * 60)) % 60;
  return `${parseInt(minutes)}:${parseInt(seconds)}`;
}


async function startGame() {
  const lobbyDbRef = getGameDbRef(lobbyItemKey);
  lobbyDbRef.on("value", async (snapshot) => {
    if (!snapshot.exists()) {
      return;
    }

    serverGameData = snapshot.val();


    if (serverGameData?.player2 == null) {


      Swal.fire({
        title: "Opps..",
        text: "Debes esperar que se una un jugador para empezar a jugar",
      });


    } else {

      if (serverGameData?.status === "pause") {
        //si esta en pausa sacamos al jugador 2 solo puede reanuadar el 1
        if (serverGameData?.player2 === firebase?.auth()?.currentUser?.uid) {
          Swal.fire({
            title: "Opps..",
            text: "El juego está en pausa",
          })
            .then(function () {
              window.location.assign("/lobby");
            });
        } else {

          //si pidio pausa el player 2 que tambien saque al player1
          if (serverGameData?.pidio_pausa === serverGameData?.player2) {
            Swal.fire({
              title: "Opps..",
              text: "El juego está en pausa",
            })
              .then(function () {
                flag = 2;
                window.location.assign("/lobby");
                getGameDbRef()
                  .update({
                    pidio_pausa: "",
                  })
                  .catch(console.error)
              });
          } else {

            if (flag === 1) {
              Swal.fire({
                title: "Opps..",
                text: "El juego estaba en pausa, acabas de reanudarlo",
              })
                .then(function () {
                  getGameDbRef()
                    .update({
                      status: "playing",
                    })
                    .catch(console.error);

                });
            }
          }
        }
      }


      if (serverGameData?.side === firebase?.auth()?.currentUser?.uid && serverGameData?.numero_turno === 1 && aviso_inicio === true) {
        Swal.fire({
          title: "Alerta",
          text: "Comenzemos, ya llego tu oponente",
        });
        aviso_inicio = "false";

        const timetoplay = new Date();
        timetoplay.setTime(timetoplay.getTime() + 90 * 60 * 1000);

        const timeavailableplayer1 = new Date();
        timeavailableplayer1.setTime(timeavailableplayer1.getTime() + 45 * 60 * 1000);

        await getGameDbRef()
          .update({
            board,
            lastPiecejoue: {
              createdAt: Date.now(),
            },
            createdAt: timetoplay,
            timeplayer1: timeavailableplayer1
          })
          .catch(console.error);
      }
    }

    if (serverGameData?.isTriggeredChangeTeam) {
      setIsTriggeredChangeTeam(false);
    }

    currentTeam =
      serverGameData?.side === serverGameData?.player1 ? WHITE : BLACK;

    board = new Board(snapshot?.toJSON()?.board);
    //leemos de firebase
    leer_comer_al_paso();
    leer_comer_al_paso_conejo();
    leer_comer_al_paso_ardilla();
    leer_comer_al_paso_ardilla_tres();

    leer_contadorreyblanco();
    leer_contadorreynegro();
    leer_contadortorre1blanco();
    leer_contadortorre1negro();
    leer_contadortorre2blanco();
    leer_contadortorre2negro();

    leer_jaquereyblanco();
    leer_jaquereynegro();



    leer_leoncoronadoblancocomible();
    leer_leoncoronadonegrocomible();
    leer_posicionleonblanco();
    leer_posicionleonnegro();

    leer_posicionreynegro();
    leer_posicionreyblanco();

    leer_act_numero_turno();
    leer_act_bloque();
    leer_ultimo_movimiento();
    leer_whiteCasualitiesText();
    leer_blackCasualitiesText();


    try {
      Object.keys(serverGameData?.jugadasPorBloque)?.forEach((_element) => {
        let element = parseInt(_element);
        switch (element) {
          case 0:
            document.getElementById("jugada1").style.backgroundColor = "blue";
            break;
          case 1:
            document.getElementById("jugada2").style.backgroundColor = "blue";
            break;
          case 2:
            document.getElementById("jugada3").style.backgroundColor = "blue";
            break;
          case 3:
            document.getElementById("jugada4").style.backgroundColor = "blue";
            break;
          case 4:
            document.getElementById("jugada5").style.backgroundColor = "blue";
            break;
          case 5:
            document.getElementById("jugada6").style.backgroundColor = "blue";
            break;
          case 6:
            document.getElementById("jugada7").style.backgroundColor = "blue";
            break;
          case 7:
            document.getElementById("jugada8").style.backgroundColor = "blue";
            break;
          case 8:
            document.getElementById("jugada9").style.backgroundColor = "blue";
            break;
          default:
        }
      });
    } catch (error) { }

    if (numero_turno === 19) {
      marca_bloque(2);
      document.getElementById("bloque1").style.backgroundColor = "red";
      reset_jugadas();
    }
    if (numero_turno === 37) {
      marca_bloque(3);
      document.getElementById("bloque2").style.backgroundColor = "red";
      reset_jugadas();
    }
    if (numero_turno === 55) {
      marca_bloque(4);
      document.getElementById("bloque3").style.backgroundColor = "red";
      reset_jugadas();
    }
    if (numero_turno === 73) {
      marca_bloque(5);
      document.getElementById("bloque4").style.backgroundColor = "red";
      reset_jugadas();
    }
    if (numero_turno === 91) {
      marca_bloque(6);
      document.getElementById("bloque5").style.backgroundColor = "red";
      reset_jugadas();
    }
    if (numero_turno === 109) {
      marca_bloque(7);
      document.getElementById("bloque6").style.backgroundColor = "red";
      reset_jugadas();
    }
    if (numero_turno === 127) {
      marca_bloque(8);
      document.getElementById("bloque7").style.backgroundColor = "red";
      reset_jugadas();
    }
    if (numero_turno === 145) {
      marca_bloque(9);
      document.getElementById("bloque8").style.backgroundColor = "red";
      reset_jugadas();
    }
    if (numero_turno === 163) {
      marca_bloque(10);
      document.getElementById("bloque9").style.backgroundColor = "red";
      reset_jugadas();
    }
    if (numero_turno === 180) {
      marca_bloque(10);
      document.getElementById("bloque10").style.backgroundColor = "red";
      reset_jugadas();
    }



    repaintBoard();

    if (firebase?.auth()?.currentUser?.uid === serverGameData?.player1) {
      if (serverGameData?.status === "tied_black_prop") {
        Swal.fire({
          title: "Opps....",
          text: "Las negras proponen tablas",
          showCancelButton: true,
          confirmButtonColor: '#DD6B55',
          confirmButtonText: 'Aceptar',
          cancelButtonText: "Rechazar",
        }).then(function (result) {
          if (result.isConfirmed) {
            getGameDbRef()
              .update({
                status: "tied",
                board,
              })
              .catch(console.error);

          } else {
            getGameDbRef()
              .update({
                status: "playing",
                board,
              })
              .catch(console.error);
          }
        });
      }
      if (serverGameData?.status === "black_revenge_prop") {
        Swal.fire({
          title: "Opps....",
          text: "Las negras proponen revancha",
          showCancelButton: true,
          confirmButtonColor: '#DD6B55',
          confirmButtonText: 'Aceptar',
          cancelButtonText: "Rechazar",
        }).then(function (result) {
          if (result.isConfirmed) {
            //creamos nueva partida y vamos para alla
            getGameDbRef()
              .update({
                status: "black_revenge_accepted",
              })
              .catch(console.error);
            window.location.assign("/lobby");
          } else {
            getGameDbRef()
              .update({
                status: "whites denied",
              })
              .catch(console.error);
          }
        });
      }
      if (serverGameData?.status === "white_revenge_accepted") {
        window.location.assign("/lobby");
      }
    }

    if (firebase?.auth()?.currentUser?.uid === serverGameData?.player2) {
      if (serverGameData?.status === "tied_white_prop") {
        Swal.fire({
          title: "Opps....",
          text: "Las blancas proponen tablas",
          showCancelButton: true,
          confirmButtonColor: '#DD6B55',
          confirmButtonText: 'Aceptar',
          cancelButtonText: "Rechazar",
        }).then(function (result) {
          if (result.isConfirmed) {
            getGameDbRef()
              .update({
                status: "tied",
                board,
              })
              .catch(console.error);

          } else {
            getGameDbRef()
              .update({
                status: "playing",
                board,
              })
              .catch(console.error);
          }
        });
      }
      if (serverGameData?.status === "white_revenge_prop") {
        Swal.fire({
          title: "Opps....",
          text: "Las blancas proponen revancha",
          showCancelButton: true,
          confirmButtonColor: '#DD6B55',
          confirmButtonText: 'Aceptar',
          cancelButtonText: "Rechazar",
        }).then(function (result) {
          if (result.isConfirmed) {
            //creamos nueva partida y vamos para alla
            getGameDbRef()
              .update({
                status: "white_revenge_accepted",
              })
              .catch(console.error);
            window.location.assign("/lobby");

          } else {
            getGameDbRef()
              .update({
                status: "blacks denied",
              })
              .catch(console.error);
          }
        });
      }
      if (serverGameData?.status === "black_revenge_accepted") {
        window.location.assign("/lobby");
      }
    }

    if (serverGameData?.side !== firebase?.auth()?.currentUser?.uid) {
      document.getElementById("turno").innerHTML = "Turno de tu oponente";

      if (
        serverGameData?.numero_turno % 18 === 1 && serverGameData?.numero_turno !== 1 && aviso_doble_turno === false
      ) {
        aviso_doble_turno = true;
        Swal.fire({
          title: "Alerta..",
          text: "Doble turno de tu oponente",
        });
      }

    } else {
      if (serverGameData?.side === serverGameData?.player1) {
        if (jaquereyblanco === "Si") {
          if (serverGameData?.status === "black wins") {
            Swal.fire({
              title: "Opps....",
              text: "JAQUE MATE HAN GANADO LAS NEGRAS",
            });
          } else {
            Swal.fire({
              title: "Alerta..",
              text: "JAQUE",
            });
          }
        }
      }

      if (serverGameData?.side === serverGameData?.player2) {
        if (jaquereynegro === "Si") {
          if (serverGameData?.status === "white wins") {
            Swal.fire({
              title: "Opps....",
              text: "JAQUE MATE HAN GANADO LAS BLANCAS",
            });
          } else {
            Swal.fire({
              title: "Alerta..",
              text: "JAQUE",
            });
          }
        }
      }
      if (serverGameData?.status === "white lion wins") {
        Swal.fire({
          title: "Opps....",
          text: "SE CORONÓ EL LEÓN, HAN GANADO LAS BLANCAS",
        });
      }
      if (serverGameData?.status === "black lion wins") {
        Swal.fire({
          title: "Opps....",
          text: "SE CORONÓ EL LEÓN, HAN GANADO LAS NEGRAS",
        });
      }

      if (serverGameData?.status === "black give up") {
        Swal.fire({
          title: "Opps....",
          text: "SE RINDIERON LAS NEGRAS, HAN GANADO LAS BLANCAS",
        });
      }

      if (serverGameData?.status === "white give up") {
        Swal.fire({
          title: "Opps....",
          text: "SE RINDIERON LAS BLANCAS, HAN GANADO LAS NEGRAS",
        });
      }

      if (serverGameData?.status === "tied") {
        Swal.fire({
          title: "Opps....",
          text: "El juego se ha empatado",
        });
      }

      document.getElementById("turno").innerHTML = "Tu turno";

      clave_privada = localStorage.getItem("clave_privada");
      if (clave_privada !== '' && clave_privada !== null) {
        document.getElementById("clave").innerHTML = "Clave: " + clave_privada;
        document.getElementById("clave_movil").innerHTML = "Clave: " + clave_privada;
      }

      document.getElementById("id_partida").innerHTML = "ID: " + serverGameData?.id_partida;
      document.getElementById("id_partida_movil").innerHTML = "ID: " + serverGameData?.id_partida;
    }

    if (ultimomovimiento !== null && ultimomovimiento !== undefined) {
      const combo_ultimomovimiento = ultimomovimiento.split("/");
      if (combo_ultimomovimiento[1] !== null && combo_ultimomovimiento[1] !== undefined && combo_ultimomovimiento[2] !== null && combo_ultimomovimiento[2] !== undefined) {
        const combo_oldxy = combo_ultimomovimiento[1].split(",");
        const combo_newxy = combo_ultimomovimiento[2].split(",");

        if (serverGameData?.side === firebase?.auth()?.currentUser?.uid) {
          marcar_ultimo_movimiento(
            parseInt(combo_newxy[0]),
            parseInt(combo_newxy[1]),
            parseInt(combo_oldxy[0]),
            parseInt(combo_oldxy[1])
          );
        }
      }
    }



    if (currentTeam === BLACK) {
      //pc
      var jugador1a = document.getElementById("jugador2");
      jugador1a.style.border = "1px solid white";
      jugador1a.style.borderRadius = "50%";
      jugador1a.style.padding = "5px";
      //movil
      var jugador1a_movil = document.getElementById("jugador2_movil");
      jugador1a_movil.style.border = "1px solid white";
      jugador1a_movil.style.borderRadius = "50%";
      jugador1a_movil.style.padding = "5px";

      //pc
      var jugador2a = document.getElementById("jugador1");
      jugador2a.style.border = "0";
      jugador2a.style.borderRadius = "0";
      jugador2a.style.padding = "0";
      //movil
      var jugador2a_movil = document.getElementById("jugador1_movil");
      jugador2a_movil.style.border = "0";
      jugador2a_movil.style.borderRadius = "0";
      jugador2a_movil.style.padding = "0";

    } else {
      //pc
      var jugador1b = document.getElementById("jugador1");
      jugador1b.style.border = "1px solid white";
      jugador1b.style.borderRadius = "50%";
      jugador1b.style.padding = "5px";

      //movil
      var jugador1b_movil = document.getElementById("jugador1_movil");
      jugador1b_movil.style.border = "1px solid white";
      jugador1b_movil.style.borderRadius = "50%";
      jugador1b_movil.style.padding = "5px";

      //pc
      var jugador2b = document.getElementById("jugador2");
      jugador2b.style.border = "0";
      jugador2b.style.borderRadius = "0";
      jugador2b.style.padding = "0";

      //movil
      var jugador2b_movil = document.getElementById("jugador2_movil");
      jugador2b_movil.style.border = "0";
      jugador2b_movil.style.borderRadius = "0";
      jugador2b_movil.style.padding = "0";
    }
    if (whiteCasualitiesText !== undefined) {
      document.getElementById("blancas_comidas").innerHTML = whiteCasualitiesText;
      document.getElementById("blancas_comidas_movil").innerHTML = whiteCasualitiesText;
    }
    if (blackCasualitiesText !== undefined) {
      document.getElementById("negras_comidas").innerHTML = blackCasualitiesText;
      document.getElementById("negras_comidas_movil").innerHTML = blackCasualitiesText;
    }

  });

  curX = -1;
  curY = -1;

  //contadorleonnegro = 0;
  //contadorleonblanco = 0;

  contadorreyblanco = 0;
  contadorreynegro = 0;
  contadortorre1blanco = 0;
  contadortorre1negro = 0;
  contadortorre2blanco = 0;
  contadortorre2negro = 0;

}

export async function onClick(Y, X) {


  if (serverGameData?.status === "pause") {
    Swal.fire({
      title: "Opps..",
      text: "El juego está en pausa, debes esperar que se una un jugador para empezar a jugar",
    });
    return;
  }

  if (serverGameData?.player2 == null) {
    Swal.fire({
      title: "Opps..",
      text: "Debes esperar que se una un jugador para empezar a jugar",
    });
    return;
  }

  if (serverGameData?.status === "tied") {
    Swal.fire({
      title: "Opps..",
      text: "El juego se ha empatado",
    });
    return;
  }

  if (serverGameData?.status === "timeover white wins") {
    Swal.fire({
      title: "Opps..",
      text: "SE TERMINÓ EL TIEMPO HAN GANADO LAS BLANCAS",
    });
    return;
  }

  if (serverGameData?.status === "timeover black wins") {
    Swal.fire({
      title: "Opps..",
      text: "SE TERMINÓ EL TIEMPO HAN GANADO LAS NEGRAS",
    });
    return;
  }

  if (serverGameData?.status === "white wins") {
    Swal.fire({
      title: "Opps..",
      text: "JAQUE MATE HAN GANADO LAS BLANCAS",
    });
    return;
  }
  if (serverGameData?.status === "black wins") {
    Swal.fire({
      title: "Opps..",
      text: "JAQUE MATE HAN GANADO LAS NEGRAS",
    });
    return;
  }

  if (serverGameData?.status === "white lion wins") {
    Swal.fire({
      title: "Opps..",
      text: "SE CORONÓ EL LEÓN, HAN GANADO LAS BLANCAS",
    });
    return;
  }
  if (serverGameData?.status === "black lion wins") {
    Swal.fire({
      title: "Opps..",
      text: "SE CORONÓ EL LEÓN, HAN GANADO LAS NEGRAS",
    });
    return;
  }

  if (serverGameData?.status === "black give up") {
    Swal.fire({
      title: "Opps....",
      text: "SE RINDIERON LAS NEGRAS, HAN GANADO LAS BLANCAS",
    });
    return;
  }

  if (serverGameData?.status === "white give up") {
    Swal.fire({
      title: "Opps....",
      text: "SE RINDIERON LAS BLANCAS, HAN GANADO LAS NEGRAS",
    });
    return;
  }

  if (serverGameData?.numero_turno >= 180 && serverGameData?.partida_con_movimientos === "true") {
    await getGameDbRef()
      .update({
        status: "tied",
      })
      .catch(console.error);
  }

  if (serverGameData?.side !== firebase?.auth()?.currentUser?.uid) {
    Swal.fire({
      title: "Opps..",
      text: "Todavía no es tu turno",
    });
    return;
  }

  if (serverGameData?.numero_turno % 18 === 1) {
    if (
      serverGameData?.lastPiecejoue?.X === X &&
      serverGameData?.lastPiecejoue?.Y === Y
    ) {
      //vemos si hay alternativas de movimiento ademas del rey
      if (checkPossiblePlaysCHECKMOVE(0, currentTeam) === true) {
        Swal.fire({
          title: "Opps..",
          text: "No puedes mover la misma pieza",
        });
        return;
      }
    }
  }

  //ganoleon();

  if (checkValidMovement(X, Y) === true) {
    ultimotipodemovimiento = "Movimiento";

    if (checkValidCapture(X, Y) === true) {
      if (board.tiles[Y][X].pieceType === KING) {
        startGame();
      }

      if (currentTeam === WHITE) {
        blackCasualities[board.tiles[Y][X].pieceType]++;
        ultimapiezacapturadanegra =
          board.tiles[Y][X].pieceType + "/" + X + "," + Y;
        ultimotipodemovimiento = "Captura";
        updateBlackCasualities();
      } else {
        whiteCasualities[board.tiles[Y][X].pieceType]++;
        ultimapiezacapturadablanca =
          board.tiles[Y][X].pieceType + "/" + X + "," + Y;
        ultimotipodemovimiento = "Captura";
        updateWhiteCasualities();
      }
    }

    if (curY !== -1 && curX !== -1) {
      let tile = board.tiles[curY][curX];
      moveSelectedPiece(X, Y, tile.pieceType, curX, curY);

      //vemos si despues de que movio gano el leon coronado
      if (currentTeam === BLACK) {
        var CLEANposicionleonblanco = posicionleonblanco.replace('"', "");
        var Wcombopos = CLEANposicionleonblanco.split(",");
        var WposY = Wcombopos[0];
        var WposX = Wcombopos[1];
        //console.log("status:"+leoncoronadoblancocomible);
        //console.log("x:"+WposX);
        //console.log("y:"+WposY);
        /*if(WposX !== -1 && WposY !== -1){
                          console.log(board.tiles[WposY][WposX].pieceType);
                        }*/
        if (
          leoncoronadoblancocomible === true &&
          board.tiles[WposY][WposX].pieceType === FAKEKING
        ) {
          getGameDbRef()
            .update({
              status: "white lion wins",
              board,
            })
            .catch(console.error);
        }
      } else {
        var CLEANposicionleonnegro = posicionleonnegro.replace('"', "");
        var Bcombopos = CLEANposicionleonnegro.split(",");
        var BposY = Bcombopos[0];
        var BposX = Bcombopos[1];
        if (
          leoncoronadonegrocomible === true &&
          board.tiles[BposY][BposX].pieceType === FAKEKING
        ) {
          getGameDbRef()
            .update({
              status: "black lion wins",
              board,
            })
            .catch(console.error);
        }
      }

      //vemos si despues de que movio se ahogo algun rey (0 = NO marcar casilla)
      const combo_posicionreyblanco = posicionreyblanco.split(",");
      const checkWX = combo_posicionreyblanco[0];
      const checkWY = combo_posicionreyblanco[1];

      const combo_posicionreynegro = posicionreynegro.split(",");
      const checkBX = combo_posicionreynegro[0];
      const checkBY = combo_posicionreynegro[1];


      if (checkPossiblePlaysCHECKMOVE(0, WHITE) === false && moverelreyblanco(parseInt(checkWX), parseInt(checkWY)) === false) {
        //console.log("rey BLANCO ahogado");  
        await getGameDbRef()
          .update({
            status: "tied",
            board,
          })
          .catch(console.error);

        Swal.fire({
          title: "Opps..",
          text: "El juego se ha empatado",
        });
      } else {
        //console.log("rey BLANCO NO ahogado");  
      }

      if (checkPossiblePlaysCHECKMOVE(0, BLACK) === false && moverelreynegro(parseInt(checkBX), parseInt(checkBY)) === false) {
        //console.log("rey NEGRO ahogado");  
        await getGameDbRef()
          .update({
            status: "tied",
            board,
          })
          .catch(console.error);

        Swal.fire({
          title: "Opps..",
          text: "El juego se ha empatado",
        });
      } else {
        //console.log("reyNEGRO NO ahogado");  
      }



      //vemos si al moverse hace jaque o se crea un jaque
      //ponemos en cero los jaques
      jaquereyblanco = "No";
      jaquereynegro = "No";

      casillasenpeligro = [];
      var cambio_de_turno = "Si";

      //revisamos que nadie le haga jaque al rey blanco
      //si hay jaque regresamos la jugada el false de la funcion de abajo es para que no cheque checkmate
      if (checkTileUnderAttack(checkWX, checkWY, BLACK, false) === true &&
        currentTeam === WHITE) {

        //alert('Movimiento inválido');
        //regresamos todo a como estaba antes del movimiento
        const combo_ultimomovimiento = ultimomovimiento.split("/");
        const combo_oldxy = combo_ultimomovimiento[1].split(",");
        const combo_newxy = combo_ultimomovimiento[2].split(",");

        board.tiles[combo_oldxy[1]][combo_oldxy[0]].pieceType = parseInt(
          combo_ultimomovimiento[0]
        );
        board.tiles[combo_oldxy[1]][combo_oldxy[0]].team = 0;
        board.tiles[combo_newxy[1]][combo_newxy[0]].pieceType = EMPTY;
        board.tiles[combo_newxy[1]][combo_newxy[0]].team = EMPTY;

        //si capturo ficha la devolvemos
        if (
          ultimotipodemovimiento === "Captura" &&
          ultimapiezacapturadanegra !== undefined
        ) {
          const combo_ultimapiezacapturadanegra =
            ultimapiezacapturadanegra.split("/");
          const combo_xy = combo_ultimapiezacapturadanegra[1].split(",");
          board.tiles[combo_xy[1]][combo_xy[0]].pieceType = parseInt(
            combo_ultimapiezacapturadanegra[0]
          );
          board.tiles[combo_xy[1]][combo_xy[0]].team = 1;
          //blackCasualities[combo_ultimapiezacapturadanegra[0]]--;
          //updateBlackCasualities();
        }

        cambio_de_turno = "No";
      }

      //revisamos que nadie le haga jaque al rey negro
      //si hay jaque regresamos la jugada el false de la funcion de abajo es para que no cheque checkmate
      if (
        checkTileUnderAttack(checkBX, checkBY, WHITE, false) === true &&
        currentTeam === BLACK) {
        //alert('Movimiento inválido');
        //regresamos todo a como estaba antes del movimiento
        const combo_ultimomovimiento = ultimomovimiento.split("/");
        const combo_oldxy = combo_ultimomovimiento[1].split(",");
        const combo_newxy = combo_ultimomovimiento[2].split(",");

        board.tiles[combo_oldxy[1]][combo_oldxy[0]].pieceType = parseInt(
          combo_ultimomovimiento[0]
        );
        board.tiles[combo_oldxy[1]][combo_oldxy[0]].team = 1;
        board.tiles[combo_newxy[1]][combo_newxy[0]].pieceType = EMPTY;
        board.tiles[combo_newxy[1]][combo_newxy[0]].team = EMPTY;

        //si capturo ficha la devolvemos
        if (
          ultimotipodemovimiento === "Captura" &&
          ultimapiezacapturadablanca !== undefined
        ) {
          const combo_ultimapiezacapturadablanca =
            ultimapiezacapturadablanca.split("/");
          const combo_xy = combo_ultimapiezacapturadablanca[1].split(",");
          board.tiles[combo_xy[1]][combo_xy[0]].pieceType = parseInt(
            combo_ultimapiezacapturadablanca[0]
          );
          board.tiles[combo_xy[1]][combo_xy[0]].team = 0;
          //whiteCasualities[combo_ultimapiezacapturadablanca[0]]--;
          //updateWhiteCasualities();
        }

        cambio_de_turno = "No";
      }
      //solo si no hay jaque cambiamos el turno
      if (cambio_de_turno === "Si") {

        if (serverGameData?.partida_con_tiempo === "true") {
          if (currentTeam === WHITE) {
            var tiempo_disponible_white = getMinutesromPlayer1();
            var tiempo_disponible_black = serverGameData?.tiempo_restante_jugador2
          } else {
            var tiempo_disponible_white = serverGameData?.tiempo_restante_jugador1
            var tiempo_disponible_black = getMinutesromPlayer2();
          }
        } else {
          var tiempo_disponible_white = "45:00";
          var tiempo_disponible_black = "45:00";
        }
        const combo_restante_player1 = serverGameData?.tiempo_restante_jugador1.split(":");
        const minutos_restantes_player1 = parseInt(combo_restante_player1[0]);
        const segundos_restantes_player1 = parseInt(combo_restante_player1[1]);
        const timeavailableplayer1 = new Date();
        timeavailableplayer1.setTime(timeavailableplayer1.getTime() + (minutos_restantes_player1 * 60 * 1000) + (segundos_restantes_player1 * 1000));

        const combo_restante_player2 = serverGameData?.tiempo_restante_jugador2.split(":");
        const minutos_restantes_player2 = parseInt(combo_restante_player2[0]);
        const segundos_restantes_player2 = parseInt(combo_restante_player2[1]);
        const timeavailableplayer2 = new Date();
        timeavailableplayer2.setTime(timeavailableplayer2.getTime() + (minutos_restantes_player2 * 60 * 1000) + (segundos_restantes_player2 * 1000));

        //console.log(serverGameData?.jaquereyblanco);
        //console.log(jaquereyblanco);

        //aca tenemos un tema necesitamos guardar jaquedesde solo si hizo jaque sino no
        //si es el segundo tiro del doble turno y no hizo jaque no guardamos jaquedesde pq talvez hizo jaque en el primer tiro y se nos borraria la posicion de la pieza que esta haciendo jaque
        if ((serverGameData?.numero_turno % 18 === 1 &&
          serverGameData?.player2 === serverGameData?.side &&
          serverGameData?.jaquereyblanco === "Si" &&
          jaquereyblanco === "No") ||
          (serverGameData?.numero_turno % 18 === 1 &&
            serverGameData?.player1 === serverGameData?.side &&
            serverGameData?.jaquereynegro === "Si" &&
            jaquereynegro === "No") ||
          (serverGameData?.numero_turno % 18 === 1 &&
            serverGameData?.player2 === serverGameData?.side &&
            serverGameData?.jaquereyblanco === "Si" &&
            jaquereyblanco === "Si") ||
          (serverGameData?.numero_turno % 18 === 1 &&
            serverGameData?.player1 === serverGameData?.side &&
            serverGameData?.jaquereynegro === "Si" &&
            jaquereynegro === "Si")
        ) {
          await getGameDbRef()
            .update({
              comeralpaso: comeralpaso,
              comeralpasoconejo: comeralpasoconejo,
              comeralpasoardilla: comeralpasoardilla,
              comeralpasoardillatres: comeralpasoardillatres,
              contadorreyblanco: contadorreyblanco,
              contadorreynegro: contadorreynegro,
              contadortorre1blanco: contadortorre1blanco,
              contadortorre1negro: contadortorre1negro,
              contadortorre2blanco: contadortorre2blanco,
              contadortorre2negro: contadortorre2negro,
              posicionreynegro: posicionreynegro,
              posicionreyblanco: posicionreyblanco,
              jaquereyblanco: jaquereyblanco,
              jaquereynegro: jaquereynegro,
              ultimo_movimiento: ultimomovimiento,
              whiteCasualitiesText: whiteCasualitiesText,
              blackCasualitiesText: blackCasualitiesText,
              board,
              lastPiecejoue: { X, Y, createdAt: Date.now() },
              timeplayer1: timeavailableplayer1,
              timeplayer2: timeavailableplayer2,
              tiempo_restante_jugador1: tiempo_disponible_white,
              tiempo_restante_jugador2: tiempo_disponible_black,
            })
            .catch(console.error);

        } else {

          await getGameDbRef()
            .update({
              comeralpaso: comeralpaso,
              comeralpasoconejo: comeralpasoconejo,
              comeralpasoardilla: comeralpasoardilla,
              comeralpasoardillatres: comeralpasoardillatres,
              contadorreyblanco: contadorreyblanco,
              contadorreynegro: contadorreynegro,
              contadortorre1blanco: contadortorre1blanco,
              contadortorre1negro: contadortorre1negro,
              contadortorre2blanco: contadortorre2blanco,
              contadortorre2negro: contadortorre2negro,
              posicionreynegro: posicionreynegro,
              posicionreyblanco: posicionreyblanco,
              jaquereyblanco: jaquereyblanco,
              jaquereynegro: jaquereynegro,
              jaquedesde: X + "," + Y,
              ultimo_movimiento: ultimomovimiento,
              whiteCasualitiesText: whiteCasualitiesText,
              blackCasualitiesText: blackCasualitiesText,
              board,
              lastPiecejoue: { X, Y, createdAt: Date.now() },
              timeplayer1: timeavailableplayer1,
              timeplayer2: timeavailableplayer2,
              tiempo_restante_jugador1: tiempo_disponible_white,
              tiempo_restante_jugador2: tiempo_disponible_black,
            })
            .catch(console.error);
        }

        if (serverGameData?.side === firebase?.auth()?.currentUser?.uid) {
          await changeCurrentTeam();
        }
      }
      /*await repaintBoard();*/
    }
  } else {
    //si da click en celda vacia reset curx cury
    if (board.tiles[Y][X].pieceType === EMPTY) {
      curX = -1;
      curY = -1;
    } else {
      curX = X;
      curY = Y;
    }
  }

  repaintBoard();
}

function checkPossiblePlaysCHECKMOVE(marcar_casilla, equipo) {
  validar = false; //no marcar casillas con validcapture o validmove

  //recorremos todo el tablero y llenamos el arreglo de casillas con posiblemovimiento
  for (let xx = 0; xx <= 8; xx++) {
    for (let yy = 0; yy <= 9; yy++) {

      if (board.tiles[yy][xx].team === equipo) {
        currentTeamCHECKMOVE = equipo;
        let tile = board.tiles[yy][xx];

        if (tile.pieceType === PAWN) checkPossiblePlaysPawn(xx, yy, marcar_casilla);
        else if (tile.pieceType === KNIGHT) checkPossiblePlaysKnight(xx, yy, marcar_casilla);
        else if (tile.pieceType === BISHOP) checkPossiblePlaysBishop(xx, yy, marcar_casilla);
        else if (tile.pieceType === ROOK) checkPossiblePlaysRook(xx, yy, marcar_casilla);
        else if (tile.pieceType === QUEEN) checkPossiblePlaysQueen(xx, yy, marcar_casilla);
        //else if (tile.pieceType === KING) checkPossiblePlaysKing(xx, yy, marcar_casilla);
        else if (tile.pieceType === ARDILLA) checkPossiblePlaysArdilla(xx, yy, marcar_casilla);
        else if (tile.pieceType === CONEJO) checkPossiblePlaysConejo(xx, yy, marcar_casilla);
        else if (tile.pieceType === PERRO) checkPossiblePlaysPerro(xx, yy, marcar_casilla);
        else if (tile.pieceType === PANTERA) checkPossiblePlaysPantera(xx, yy, marcar_casilla);
        else if (tile.pieceType === ELEFANTE) checkPossiblePlaysElefante(xx, yy, marcar_casilla);
        else if (tile.pieceType === LEON) checkPossiblePlaysLeon(xx, yy, marcar_casilla);
      }
    }
  }
  if (posiblemovimiento.includes("Si")) {
    //vaciamos el arreglo
    posiblemovimiento = [];
    return true;
  } else {
    posiblemovimiento = [];
    return false;
  }
}

function checkPossiblePlays(marcar_casilla) {
  validar = true;//si marcar casillas con validcapture o validmove

  if (curX < 0 || curY < 0) return;

  let tile = board.tiles[curY][curX];
  if (tile.team === EMPTY || tile.team !== currentTeam) return;

  var coordenada = "celda_y" + curY + "x" + curX;
  var celda = document.getElementById(coordenada);
  celda.style.setProperty('background-color', HIGHLIGHT_COLOR, 'important');

  currentTeamCHECKMOVE = currentTeam;

  board.resetValidMoves();

  if (tile.pieceType === PAWN) checkPossiblePlaysPawn(curX, curY, marcar_casilla);
  else if (tile.pieceType === KNIGHT) checkPossiblePlaysKnight(curX, curY, marcar_casilla);
  else if (tile.pieceType === BISHOP) checkPossiblePlaysBishop(curX, curY, marcar_casilla);
  else if (tile.pieceType === ROOK) checkPossiblePlaysRook(curX, curY, marcar_casilla);
  else if (tile.pieceType === QUEEN) checkPossiblePlaysQueen(curX, curY, marcar_casilla);
  else if (tile.pieceType === KING) checkPossiblePlaysKing(curX, curY, marcar_casilla);
  else if (tile.pieceType === ARDILLA) checkPossiblePlaysArdilla(curX, curY, marcar_casilla);
  else if (tile.pieceType === CONEJO) checkPossiblePlaysConejo(curX, curY, marcar_casilla);
  else if (tile.pieceType === PERRO) checkPossiblePlaysPerro(curX, curY, marcar_casilla);
  else if (tile.pieceType === PANTERA) checkPossiblePlaysPantera(curX, curY, marcar_casilla);
  else if (tile.pieceType === ELEFANTE) checkPossiblePlaysElefante(curX, curY, marcar_casilla);
  else if (tile.pieceType === LEON) checkPossiblePlaysLeon(curX, curY, marcar_casilla);

  //va a guardar los posibles movimientos pero aqui no los vamos a usar
  //por eso los borramos
  posiblemovimiento = [];
}

function checkPossiblePlaysPawn(curX, curY, marcar_casilla) {
  let direction;

  if (currentTeamCHECKMOVE === WHITE) direction = -1;
  else direction = 1;

  if (curY + direction < 0 || curY + direction > BOARD_HEIGHT - 1) return;

  // Advance one tile
  checkPossibleMove(curX, curY + direction, marcar_casilla);

  // First double move
  if (
    (curY === 2 && board.tiles[curY][curX].team === BLACK) ||
    (curY === 7 && board.tiles[curY][curX].team === WHITE)
  ) {
    if (board.tiles[curY + direction][curX].pieceType === EMPTY) {
      checkPossibleMove(curX, curY + 2 * direction, marcar_casilla);
    }
  }

  // Check diagonal left capture
  if (curX - 1 >= 0) {
    if (board.tiles[curY + direction][curX - 1].pieceType !== ELEFANTE) {
      if (board.tiles[curY + direction][curX - 1].pieceType !== LEON) {
        checkPossibleCapture(curX - 1, curY + direction, marcar_casilla);
      }
    }
    //vemos si puede comer al paso
    if (currentTeamCHECKMOVE === 0 && curY === 4) {
      if (curX - 1 + "," + (curY - 1) === comeralpaso) {
        checkPossibleMove(curX - 1, curY - 1, marcar_casilla);
      }
    }
    if (currentTeamCHECKMOVE === 1 && curY === 5) {
      if (curX - 1 + "," + (curY + 1) === comeralpaso) {
        checkPossibleMove(curX - 1, curY + 1, marcar_casilla);
      }
    }
  }

  // Check diagonal right capture
  if (curX + 1 <= BOARD_WIDTH - 1) {
    if (board.tiles[curY + direction][curX + 1].pieceType !== ELEFANTE) {
      if (board.tiles[curY + direction][curX + 1].pieceType !== LEON) {
        checkPossibleCapture(curX + 1, curY + direction, marcar_casilla);
      }
    }
    //vemos si puede comer al paso
    if (currentTeamCHECKMOVE === 0 && curY === 4) {
      if (curX + 1 + "," + (curY - 1) === comeralpaso) {
        checkPossibleMove(curX + 1, curY - 1, marcar_casilla);
      }
    }
    if (currentTeamCHECKMOVE === 1 && curY === 5) {
      if (curX + 1 + "," + (curY + 1) === comeralpaso) {
        checkPossibleMove(curX + 1, curY + 1, marcar_casilla);
      }
    }
  }
}

function checkPossiblePlaysConejo(curX, curY, marcar_casilla) {
  let direction;

  if (currentTeamCHECKMOVE === WHITE) direction = -1;
  else direction = 1;

  if (curY + direction < 0 || curY + direction > BOARD_HEIGHT - 1) return;

  // Advance one tile
  checkPossibleMove(curX, curY + direction, marcar_casilla);

  // Advance two tile
  //si es un PAWN si se puede saltar Y COMER SI NO SOLO AVANZA
  if (board.tiles[curY + 1 * direction][curX].pieceType === EMPTY) {
    //vemos que no se salga del tablero
    if (curY + 2 * direction < BOARD_HEIGHT && curY + 2 * direction >= 0) {
      checkPossibleMove(curX, curY + 2 * direction, marcar_casilla);
    }
  } else {
    if (
      board.tiles[curY + 1 * direction][curX].pieceType === PAWN &&
      board.tiles[curY + 1 * direction][curX].team !== currentTeamCHECKMOVE
    ) {
      checkPossibleMove(curX, curY + 2 * direction, marcar_casilla);
    }
  }

  // Check diagonal right capture
  if (curX + 1 <= BOARD_WIDTH - 1)
    checkPossibleMove(curX + 1, curY + direction, marcar_casilla);
  // Check diagonal left capture
  if (curX - 1 >= 0) checkPossibleMove(curX - 1, curY + direction, marcar_casilla);

  // Check diagonal left capture
  if (curX - 1 >= 0) {
    if (board.tiles[curY + direction][curX - 1].pieceType !== ELEFANTE) {
      checkPossibleCapture(curX - 1, curY + direction, marcar_casilla);
    }
  }

  // Check diagonal right capture
  if (curX + 1 <= BOARD_WIDTH - 1) {
    if (board.tiles[curY + direction][curX + 1].pieceType !== ELEFANTE) {
      checkPossibleCapture(curX + 1, curY + direction, marcar_casilla);
    }
  }
}

function checkPossiblePlaysArdilla(curX, curY, marcar_casilla) {
  let direction;

  if (currentTeamCHECKMOVE === WHITE) direction = -1;
  else direction = 1;

  if (curY + direction < 0 || curY + direction > BOARD_HEIGHT - 1) return;

  // Advance one tile
  checkPossibleMove(curX, curY + direction, marcar_casilla);

  // Advance two tile
  //si es un PAWN O CONEJO si se puede saltar y comer sino no hacer nada
  if (
    curY + 1 * direction >= 0 &&
    curY + 1 * direction <= BOARD_HEIGHT - 1 &&
    curY + 2 * direction >= 0 &&
    curY + 2 * direction <= BOARD_HEIGHT - 1
  ) {

    if (
      board.tiles[curY + 1 * direction][curX].pieceType === 0 ||
      board.tiles[curY + 1 * direction][curX].pieceType === CONEJO ||
      board.tiles[curY + 1 * direction][curX].pieceType === EMPTY
    ) {
      checkPossibleMove(curX, curY + 2 * direction, marcar_casilla);
    }

  }

  // Advance three tile
  //si es un PAWN O CONEJO si se puede saltar y comer sino no hacer nada
  if (
    curY + 1 * direction >= 0 &&
    curY + 1 * direction <= BOARD_HEIGHT - 1 &&
    curY + 2 * direction >= 0 &&
    curY + 2 * direction <= BOARD_HEIGHT - 1 &&
    curY + 3 * direction >= 0 &&
    curY + 3 * direction <= BOARD_HEIGHT - 1
  ) {

    if (
      (board.tiles[curY + 1 * direction][curX].pieceType === EMPTY &&
        board.tiles[curY + 2 * direction][curX].pieceType === EMPTY) ||
      (board.tiles[curY + 1 * direction][curX].pieceType === PAWN &&
        board.tiles[curY + 2 * direction][curX].pieceType === PAWN) ||
      (board.tiles[curY + 1 * direction][curX].pieceType === CONEJO &&
        board.tiles[curY + 2 * direction][curX].pieceType === CONEJO) ||
      (board.tiles[curY + 1 * direction][curX].pieceType === PAWN &&
        board.tiles[curY + 2 * direction][curX].pieceType === CONEJO) ||
      (board.tiles[curY + 1 * direction][curX].pieceType === CONEJO &&
        board.tiles[curY + 2 * direction][curX].pieceType === PAWN) ||
      (board.tiles[curY + 1 * direction][curX].pieceType === PAWN &&
        board.tiles[curY + 2 * direction][curX].pieceType === EMPTY) ||
      (board.tiles[curY + 1 * direction][curX].pieceType === EMPTY &&
        board.tiles[curY + 2 * direction][curX].pieceType === PAWN) ||
      (board.tiles[curY + 1 * direction][curX].pieceType === CONEJO &&
        board.tiles[curY + 2 * direction][curX].pieceType === EMPTY) ||
      (board.tiles[curY + 1 * direction][curX].pieceType === EMPTY &&
        board.tiles[curY + 2 * direction][curX].pieceType === CONEJO)
    ) {
      checkPossibleMove(curX, curY + 3 * direction, marcar_casilla);
    }

  }

  // Advance Horizontal tile
  if (curX > 0) {
    checkPossibleMove(curX - 1, curY, marcar_casilla);
  }
  if (curX < 8) {
    checkPossibleMove(curX + 1, curY, marcar_casilla);
  }

  // Check diagonal right move
  if (curX + 1 <= BOARD_WIDTH - 1)
    checkPossibleMove(curX + 1, curY + direction, marcar_casilla);
  // Check diagonal left move
  if (curX - 1 >= 0) checkPossibleMove(curX - 1, curY + direction, marcar_casilla);

  // Check diagonal left capture
  if (curX - 1 >= 0) {
    if (board.tiles[curY + direction][curX - 1].pieceType !== ELEFANTE) {
      checkPossibleCapture(curX - 1, curY + direction, marcar_casilla);
    }
  }

  // Check diagonal right capture
  if (curX + 1 <= BOARD_WIDTH - 1) {
    if (board.tiles[curY + direction][curX + 1].pieceType !== ELEFANTE) {
      checkPossibleCapture(curX + 1, curY + direction, marcar_casilla);
    }
  }
}

function checkPossiblePlaysPerro(curX, curY, marcar_casilla) {
  let direction;

  if (currentTeamCHECKMOVE === WHITE) direction = -1;
  else direction = 1;

  if (curY + direction < 0 || curY + direction > BOARD_HEIGHT - 1) return;

  // Advance one tile
  checkPossibleMove(curX, curY + direction, marcar_casilla);
  checkPossibleCapture(curX, curY + direction, marcar_casilla);


  if (
    curY + 2 * direction > 0 &&
    curY + 2 * direction > 0 &&
    curY + 2 * direction <= BOARD_HEIGHT - 1 &&
    board.tiles[curY + 1 * direction][curX].pieceType === EMPTY
  ) {
    // Advance two tile
    checkPossibleMove(curX, curY + 2 * direction, marcar_casilla);
    checkPossibleCapture(curX, curY + 2 * direction, marcar_casilla);
  }

  // Advance Horizontal tile
  if (curX > 0) {
    checkPossibleMove(curX - 1, curY, marcar_casilla);
  }
  if (curX > 1 && board.tiles[curY][curX - 1].pieceType === EMPTY) {
    checkPossibleMove(curX - 2, curY, marcar_casilla);
  }
  if (curX < 8) {
    checkPossibleMove(curX + 1, curY, marcar_casilla);
  }
  if (curX < 7 && board.tiles[curY][curX + 1].pieceType === EMPTY) {
    checkPossibleMove(curX + 2, curY, marcar_casilla);
  }

  // Check diagonal right movimiento
  if (curX + 1 <= BOARD_WIDTH - 1) {
    checkPossibleMove(curX + 1, curY + direction, marcar_casilla);
  }
  if (
    curX + 2 <= BOARD_WIDTH - 1 &&
    board.tiles[curY + direction][curX + 1].pieceType === EMPTY
  ) {
    checkPossibleMove(curX + 2, curY + 2 * direction, marcar_casilla);
  }

  // Check diagonal left movimiento
  if (curX - 1 >= 0) {
    checkPossibleMove(curX - 1, curY + direction, marcar_casilla);
  }
  if (
    curX - 2 >= 0 &&
    board.tiles[curY + direction][curX - 1].pieceType === EMPTY
  ) {
    checkPossibleMove(curX - 2, curY + 2 * direction, marcar_casilla);
  }

  // Check diagonal left capture
  if (curX - 1 >= 0) {
    checkPossibleCapture(curX - 1, curY + direction, marcar_casilla);
  }
  if (
    curX - 2 >= 0 &&
    curY + 2 * direction > 0 &&
    curY + 2 * direction <= BOARD_HEIGHT - 1 &&
    board.tiles[curY + 1 * direction][curX - 1].pieceType === EMPTY
  ) {
    checkPossibleCapture(curX - 2, curY + 2 * direction, marcar_casilla);
  }

  // Check diagonal right capture
  if (curX + 1 <= BOARD_WIDTH - 1) {
    checkPossibleCapture(curX + 1, curY + direction, marcar_casilla);
  }
  if (
    curX + 2 <= BOARD_WIDTH - 1 &&
    curY + 2 * direction > 0 &&
    curY + 2 * direction <= BOARD_HEIGHT - 1 &&
    board.tiles[curY + 1 * direction][curX + 1].pieceType === EMPTY
  ) {
    checkPossibleCapture(curX + 2, curY + 2 * direction, marcar_casilla);
  }

  //movimiento hacia atras 1 casilla
  // Lower move
  if (curY - 1 * direction >= 0 && curY - 1 * direction <= BOARD_HEIGHT - 1) {
    checkPossibleMove(curX, curY - 1 * direction, marcar_casilla);
  }
  //movimiento hacia atras 2 casillas
  if (curY - 2 * direction >= 0 && curY - 2 * direction <= BOARD_HEIGHT - 1) {
    if (board.tiles[curY - 1 * direction][curX].team === EMPTY) {
      checkPossibleMove(curX, curY - 2 * direction, marcar_casilla);
    }
  }
}

function checkPossiblePlaysKnight(curX, curY, marcar_casilla) {
  // Far left moves
  if (curX - 2 >= 0) {
    // Upper move
    if (curY - 1 >= 0) checkPossiblePlay(curX - 2, curY - 1, marcar_casilla);

    // Lower move
    if (curY + 1 <= BOARD_HEIGHT - 1) checkPossiblePlay(curX - 2, curY + 1, marcar_casilla);
  }

  // Near left moves
  if (curX - 1 >= 0) {
    // Upper move
    if (curY - 2 >= 0) checkPossiblePlay(curX - 1, curY - 2, marcar_casilla);

    // Lower move
    if (curY + 2 <= BOARD_HEIGHT - 1) checkPossiblePlay(curX - 1, curY + 2, marcar_casilla);
  }

  // Near right moves
  if (curX + 1 <= BOARD_WIDTH - 1) {
    // Upper move
    if (curY - 2 >= 0) checkPossiblePlay(curX + 1, curY - 2, marcar_casilla);

    // Lower move
    if (curY + 2 <= BOARD_HEIGHT - 1) checkPossiblePlay(curX + 1, curY + 2, marcar_casilla);
  }

  // Far right moves
  if (curX + 2 <= BOARD_WIDTH - 1) {
    // Upper move
    if (curY - 1 >= 0) checkPossiblePlay(curX + 2, curY - 1, marcar_casilla);

    // Lower move
    if (curY + 1 <= BOARD_HEIGHT - 1) checkPossiblePlay(curX + 2, curY + 1, marcar_casilla);
  }
}

function checkPossiblePlaysPantera(curX, curY, marcar_casilla) {
  // Far left moves
  if (curX - 3 >= 0) {
    // Upper move
    if (curY - 1 >= 0) checkPossiblePlay(curX - 3, curY - 1, marcar_casilla);

    // Lower move
    if (curY + 1 <= BOARD_HEIGHT - 1) checkPossiblePlay(curX - 3, curY + 1, marcar_casilla);
  }

  // Far left moves
  if (curX - 2 >= 0) {
    // Upper move
    if (curY - 1 >= 0) checkPossiblePlay(curX - 2, curY - 1, marcar_casilla);

    // Lower move
    if (curY + 1 <= BOARD_HEIGHT - 1) checkPossiblePlay(curX - 2, curY + 1, marcar_casilla);
  }

  // Near left moves
  if (curX - 1 >= 0) {
    // Upper move
    if (curY - 2 >= 0) checkPossiblePlay(curX - 1, curY - 2, marcar_casilla);
    if (curY - 3 >= 0) checkPossiblePlay(curX - 1, curY - 3, marcar_casilla);

    // Lower move
    if (curY + 2 <= BOARD_HEIGHT - 1) checkPossiblePlay(curX - 1, curY + 2, marcar_casilla);
    if (curY + 3 <= BOARD_HEIGHT - 1) checkPossiblePlay(curX - 1, curY + 3, marcar_casilla);
  }

  // Near right moves
  if (curX + 1 <= BOARD_WIDTH - 1) {
    // Upper move
    if (curY - 2 >= 0) checkPossiblePlay(curX + 1, curY - 2, marcar_casilla);
    if (curY - 3 >= 0) checkPossiblePlay(curX + 1, curY - 3, marcar_casilla);

    // Lower move
    if (curY + 2 <= BOARD_HEIGHT - 1) checkPossiblePlay(curX + 1, curY + 2, marcar_casilla);
    if (curY + 3 <= BOARD_HEIGHT - 1) checkPossiblePlay(curX + 1, curY + 3, marcar_casilla);
  }

  // Far right moves
  if (curX + 2 <= BOARD_WIDTH - 1) {
    // Upper move
    if (curY - 1 >= 0) checkPossiblePlay(curX + 2, curY - 1, marcar_casilla);

    // Lower move
    if (curY + 1 <= BOARD_HEIGHT - 1) checkPossiblePlay(curX + 2, curY + 1, marcar_casilla);
  }

  if (curX + 3 <= BOARD_WIDTH - 1) {
    // Upper move
    if (curY - 1 >= 0) checkPossiblePlay(curX + 3, curY - 1, marcar_casilla);

    // Lower move
    if (curY + 1 <= BOARD_HEIGHT - 1) checkPossiblePlay(curX + 3, curY + 1, marcar_casilla);
  }
}

function checkPossiblePlaysRook(curX, curY, marcar_casilla) {
  // Upper move
  for (let i = 1; curY - i >= 0; i++) {
    if (checkPossiblePlay(curX, curY - i, marcar_casilla)) break;
  }

  // Right move
  for (let i = 1; curX + i <= BOARD_WIDTH - 1; i++) {
    if (checkPossiblePlay(curX + i, curY, marcar_casilla)) break;
  }

  // Lower move
  for (let i = 1; curY + i <= BOARD_HEIGHT - 1; i++) {
    if (checkPossiblePlay(curX, curY + i, marcar_casilla)) break;
  }

  // Left move
  for (let i = 1; curX - i >= 0; i++) {
    if (checkPossiblePlay(curX - i, curY, marcar_casilla)) break;
  }
}

function checkPossiblePlaysBishop(curX, curY, marcar_casilla) {
  // Upper-right move
  for (let i = 1; curX + i <= BOARD_WIDTH - 1 && curY - i >= 0; i++) {
    if (checkPossiblePlay(curX + i, curY - i, marcar_casilla)) break;
  }

  // Lower-right move
  for (
    let i = 1;
    curX + i <= BOARD_WIDTH - 1 && curY + i <= BOARD_HEIGHT - 1;
    i++
  ) {
    if (checkPossiblePlay(curX + i, curY + i, marcar_casilla)) break;
  }

  // Lower-left move
  for (let i = 1; curX - i >= 0 && curY + i <= BOARD_HEIGHT - 1; i++) {
    if (checkPossiblePlay(curX - i, curY + i, marcar_casilla)) break;
  }

  // Upper-left move
  for (let i = 1; curX - i >= 0 && curY - i >= 0; i++) {
    if (checkPossiblePlay(curX - i, curY - i, marcar_casilla)) break;
  }
}

function checkPossiblePlaysElefante(curX, curY, marcar_casilla) {
  // Diagonal abajo a la derecha
  for (let i = 1; curX + i <= BOARD_WIDTH - 1 && curY - i >= 0 && i <= 2; i++) {
    if (curX + i <= BOARD_WIDTH - 1 && curY - i >= 0) {
      if (board.tiles[curY - 1][curX + 1].team !== currentTeamCHECKMOVE) {
        checkPossiblePlay(curX + i, curY - i, marcar_casilla);
      }
    }
  }

  // Diagonal arriba derecha
  for (
    let i = 1;
    curX + i <= BOARD_WIDTH - 1 && curY + i <= BOARD_HEIGHT - 1 && i <= 2;
    i++
  ) {
    if (curX + i <= BOARD_WIDTH - 1 && curY + i <= BOARD_HEIGHT - 1) {
      if (board.tiles[curY + 1][curX + 1].team !== currentTeamCHECKMOVE) {
        checkPossiblePlay(curX + i, curY + i, marcar_casilla);
      }
    }
  }

  // derecha
  for (let i = 1; curX + i <= BOARD_WIDTH - 1 && i <= 2; i++) {
    if (curX + i <= BOARD_WIDTH - 1) {
      if (board.tiles[curY][curX + 1].team !== currentTeamCHECKMOVE) {
        checkPossiblePlay(curX + i, curY, marcar_casilla);
      }
    }
  }

  // diagonal arriba izquierda
  for (
    let i = 1;
    curX - i >= 0 && curY + i <= BOARD_HEIGHT - 1 && i <= 2;
    i++
  ) {
    if (curX - i >= 0 && curY + i <= BOARD_HEIGHT - 1) {
      if (board.tiles[curY + 1][curX - 1].team !== currentTeamCHECKMOVE) {
        checkPossiblePlay(curX - i, curY + i, marcar_casilla);
      }
    }
  }

  // diagonal abajo izquierda
  for (let i = 1; curX - i >= 0 && curY - i >= 0 && i <= 2; i++) {
    if (curX - i >= 0 && curY - i >= 0) {
      if (board.tiles[curY - 1][curX - 1].team !== currentTeamCHECKMOVE) {
        checkPossiblePlay(curX - i, curY - i, marcar_casilla);
      }
    }
  }

  // izquierda
  for (let i = 1; curX - i >= 0 && i <= 2; i++) {
    if (curX - i >= 0) {
      if (board.tiles[curY][curX - 1].team !== currentTeamCHECKMOVE) {
        checkPossiblePlay(curX - i, curY, marcar_casilla);
      }
    }
  }

  // abajo
  for (let i = 1; curY - i >= 0 && i <= 2; i++) {
    if (curY - i >= 0) {
      if (board.tiles[curY - 1][curX].team !== currentTeamCHECKMOVE) {
        checkPossiblePlay(curX, curY - i, marcar_casilla);
      }
    }
  }

  // Arriba
  for (let i = 1; curY + i <= BOARD_HEIGHT - 1 && i <= 2; i++) {
    if (curY + i <= BOARD_HEIGHT - 1) {
      if (board.tiles[curY + 1][curX].team !== currentTeamCHECKMOVE) {
        checkPossiblePlay(curX, curY + i, marcar_casilla);
      }
    }
  }
}

function checkPossiblePlaysLeon(curX, curY, marcar_casilla) {
  // Upper-right move
  for (let i = 1; curX + i <= BOARD_WIDTH - 1 && curY - i >= 0 && i <= 2; i++) {
    if (checkPossiblePlay(curX + i, curY - i, marcar_casilla)) break;
  }

  // Lower-right move
  for (
    let i = 1;
    curX + i <= BOARD_WIDTH - 1 && curY + i <= BOARD_HEIGHT - 1 && i <= 2;
    i++
  ) {
    if (checkPossiblePlay(curX + i, curY + i, marcar_casilla)) break;
  }

  // Lower-left move
  for (
    let i = 1;
    curX - i >= 0 && curY + i <= BOARD_HEIGHT - 1 && i <= 2;
    i++
  ) {
    if (checkPossiblePlay(curX - i, curY + i, marcar_casilla)) break;
  }

  // Upper-left move
  for (let i = 1; curX - i >= 0 && curY - i >= 0 && i <= 2; i++) {
    if (checkPossiblePlay(curX - i, curY - i, marcar_casilla)) break;
  }

  // Upper move
  for (let i = 1; curY - i >= 0 && i <= 3; i++) {
    if (checkPossiblePlay(curX, curY - i, marcar_casilla)) break;
  }

  // Right move
  for (let i = 1; curX + i <= BOARD_WIDTH - 1 && i <= 3; i++) {
    if (checkPossiblePlay(curX + i, curY, marcar_casilla)) break;
  }

  // Lower move
  for (let i = 1; curY + i <= BOARD_HEIGHT - 1 && i <= 3; i++) {
    if (checkPossiblePlay(curX, curY + i, marcar_casilla)) break;
  }

  // Left move
  for (let i = 1; curX - i >= 0 && i <= 3; i++) {
    if (checkPossiblePlay(curX - i, curY, marcar_casilla)) break;
  }
}

function checkPossiblePlaysQueen(curX, curY, marcar_casilla) {
  checkPossiblePlaysBishop(curX, curY, marcar_casilla);
  checkPossiblePlaysRook(curX, curY, marcar_casilla);
}

function checkPossiblePlaysKing(curX, curY, marcar_casilla) {
  for (let i = -1; i <= 1; i++) {
    if (curY + i < 0 || curY + i > BOARD_HEIGHT - 1) continue;

    for (let j = -1; j <= 1; j++) {
      if (curX + j < 0 || curX + j > BOARD_WIDTH - 1) continue;
      if (i === 0 && j === 0) continue;

      checkPossiblePlay(curX + j, curY + i, marcar_casilla);
    }
  }

  //posible enroque de las blancas
  if (currentTeamCHECKMOVE === 0) {
    if (contadorreyblanco === 0 && jaquereyblanco === "No") {
      //torre2
      if (contadortorre2blanco === 0) {
        //verificamos casillas libres de ataque
        if (
          checkTileUnderAttack(curX + 1, curY, getOppositeTeam(currentTeamCHECKMOVE), true) === false &&
          checkTileUnderAttack(curX + 2, curY, getOppositeTeam(currentTeamCHECKMOVE), true) === false &&
          checkTileUnderAttack(curX + 3, curY, getOppositeTeam(currentTeamCHECKMOVE), true) === false
        ) {
          if (board.tiles[curY][(curX + 1)].team === EMPTY &&
            board.tiles[curY][(curX + 2)].team === EMPTY &&
            board.tiles[curY][(curX + 3)].team === EMPTY) {
            //marcamos las casillas para que se pueda enrocar
            checkPossiblePlay(curX + 2, curY, marcar_casilla);
            checkPossiblePlay(curX + 3, curY, marcar_casilla);
          }
        }
      }
      //torre1
      if (contadortorre1blanco === 0) {
        //verificamos casillas libres de ataque
        if (
          checkTileUnderAttack(curX - 1, curY, getOppositeTeam(currentTeamCHECKMOVE), true) === false &&
          checkTileUnderAttack(curX - 2, curY, getOppositeTeam(currentTeamCHECKMOVE), true) === false &&
          checkTileUnderAttack(curX - 3, curY, getOppositeTeam(currentTeamCHECKMOVE), true) === false
        ) {
          if (board.tiles[curY][(curX - 1)].team === EMPTY &&
            board.tiles[curY][(curX - 2)].team === EMPTY &&
            board.tiles[curY][(curX - 3)].team === EMPTY) {
            //marcamos las casillas para que se pueda enrocar
            checkPossiblePlay(curX - 2, curY, marcar_casilla);
            checkPossiblePlay(curX - 3, curY, marcar_casilla);
          }
        }
      }
    }
  }
  //posible enroque de las negras
  if (currentTeamCHECKMOVE === 1) {
    if (contadorreynegro === 0 && jaquereynegro === "No") {
      //torre2
      if (contadortorre2negro === 0) {
        //verificamos casillas libres de ataque
        if (
          checkTileUnderAttack(curX + 1, curY, getOppositeTeam(currentTeamCHECKMOVE), true) === false &&
          checkTileUnderAttack(curX + 2, curY, getOppositeTeam(currentTeamCHECKMOVE), true) === false &&
          checkTileUnderAttack(curX + 3, curY, getOppositeTeam(currentTeamCHECKMOVE), true) === false
        ) {
          if (board.tiles[curY][(curX + 1)].team === EMPTY &&
            board.tiles[curY][(curX + 2)].team === EMPTY &&
            board.tiles[curY][(curX + 3)].team === EMPTY) {
            //marcamos las casillas para que se pueda enrocar
            checkPossiblePlay(curX + 2, curY, marcar_casilla);
            checkPossiblePlay(curX + 3, curY, marcar_casilla);
          }
        }
      }
      //torre1
      if (contadortorre1negro === 0) {
        //verificamos casillas libres de ataque
        if (
          checkTileUnderAttack(curX - 1, curY, getOppositeTeam(currentTeamCHECKMOVE), true) === false &&
          checkTileUnderAttack(curX - 2, curY, getOppositeTeam(currentTeamCHECKMOVE), true) === false &&
          checkTileUnderAttack(curX - 3, curY, getOppositeTeam(currentTeamCHECKMOVE), true) === false
        ) {
          if (board.tiles[curY][(curX - 1)].team === EMPTY &&
            board.tiles[curY][(curX - 2)].team === EMPTY &&
            board.tiles[curY][(curX - 3)].team === EMPTY) {
            //marcamos las casillas para que se pueda enrocar
            checkPossiblePlay(curX - 2, curY, marcar_casilla);
            checkPossiblePlay(curX - 3, curY, marcar_casilla);
          }
        }
      }
    }
  }
}

function checkPossiblePlay(x, y, marcar_casilla) {
  if (checkPossibleCapture(x, y, marcar_casilla)) {
    return true;
  }

  return !checkPossibleMove(x, y, marcar_casilla);
}

function checkPossibleMove(x, y, marcar_casilla) {
  if (board.tiles[y][x].team !== EMPTY) return false;

  if (validar === true) {
    board.validMoves[y][x] = VALID;
  }

  posiblemovimiento.push("Si");
  if (marcar_casilla === 1) {
    drawCircle(x, y, HIGHLIGHT_COLOR);
  }
  return true;
}

function checkPossibleCapture(x, y, marcar_casilla) {
  if (board.tiles[y][x].team !== getOppositeTeam(currentTeamCHECKMOVE)) return false;

  if (validar === true) {
    board.validMoves[y][x] = VALID_CAPTURE;
  }
  posiblemovimiento.push("Si");
  if (marcar_casilla === 1) {
    drawCorners(x, y, HIGHLIGHT_COLOR);
  }
  return true;
}

function checkValidMovement(x, y) {
  if (
    board.validMoves[y][x] === VALID ||
    board.validMoves[y][x] === VALID_CAPTURE
  )
    return true;
  else return false;
}

function checkValidCapture(x, y) {
  if (board.validMoves[y][x] === VALID_CAPTURE) return true;
  else return false;
}

function moveSelectedPiece(x, y, piece, oldX, oldY) {
  if (piece !== PAWN && piece !== CONEJO && piece !== ARDILLA) {
    comeralpaso = "";
  }
  if (piece !== CONEJO && piece !== ARDILLA) {
    comeralpasoconejo = "";
  }
  if (piece !== ARDILLA) {
    comeralpasoardilla = "";
    comeralpasoardillatres = "";
  }

  //revisamos si es el equipo de las blancas
  if (currentTeam === 0) {
    if (piece === PAWN) {
      //revisamos si acaba de comer al paso
      if (x + "," + y === comeralpaso) {
        //actualizamos score y tablero
        blackCasualities[board.tiles[y + 1][x].pieceType]++;
        ultimapiezacapturadanegra =
          board.tiles[y + 1][x].pieceType + "/" + x + "," + (y + 1);
        ultimotipodemovimiento = "Captura";
        updateBlackCasualities();
        //capturamos la ficha
        board.tiles[y + 1][x].pieceType = EMPTY;
        board.tiles[y + 1][x].team = EMPTY;
      } else {
        //revisamos si se lo pueden comer al paso
        if (oldY - 2 === y) {
          comeralpaso = x + "," + (oldY - 1);
        } else {
          if (oldY - 1 === y) {
            comeralpaso = "";
          }
        }
      }
    }
    if (piece === CONEJO) {
      //revisamos si acaba de comer al paso para capturar ficha
      if (x + "," + y === comeralpasoconejo || x + "," + y === comeralpaso) {
        //actualizamos score y tablero
        blackCasualities[board.tiles[y + 1][x].pieceType]++;
        ultimapiezacapturadanegra =
          board.tiles[y + 1][x].pieceType + "/" + x + "," + (y + 1);
        ultimotipodemovimiento = "Captura";
        updateBlackCasualities();
        //capturamos la ficha
        board.tiles[y + 1][x].pieceType = EMPTY;
        board.tiles[y + 1][x].team = EMPTY;
      } else {
        //no capturo entonces comer al paso peon a ceros
        comeralpaso = "";
        //revisamos si se lo pueden comer al paso
        if (oldY - 2 === y) {
          comeralpasoconejo = x + "," + (oldY - 1);
        } else {
          if (oldY - 1 === y) {
            comeralpasoconejo = "";
          }
        }
      }
    }
    if (piece === ARDILLA) {
      const combo_comeralpasoardilla = comeralpasoardilla.split(",");
      //const caaX = combo_comeralpasoardilla[0];
      const caaY = combo_comeralpasoardilla[1];

      const combo_comeralpasoardillatres = comeralpasoardillatres.split(",");
      //const caa3X = combo_comeralpasoardillatres[0];
      const caa3Y = combo_comeralpasoardillatres[1];

      const combo_comeralpasoconejo = comeralpasoconejo.split(",");
      //const cacX = combo_comeralpasoconejo[0];
      const cacY = combo_comeralpasoconejo[1];

      const combo_comeralpaso = comeralpaso.split(",");
      //const capX = combo_comeralpaso[0];
      const capY = combo_comeralpaso[1];

      //revisamos si acaba de comer al paso para capturar ficha solo si estan en el mismo eje y
      if (
        (x + "," + y === comeralpasoardillatres &&
          oldY === parseInt(caa3Y) + 1) ||
        (x + "," + y === comeralpasoardilla && oldY === parseInt(caaY) + 1) ||
        (x + "," + y === comeralpasoconejo && oldY === parseInt(cacY) + 1) ||
        (x + "," + y === comeralpaso && oldY === parseInt(capY) + 1)
      ) {
        //capturamos la ficha
        //si esta vacia ir a la siguiente pq salto 3 cuadros
        if (board.tiles[y + 1][x].pieceType !== EMPTY) {
          //actualizamos score y tablero
          blackCasualities[board.tiles[y + 1][x].pieceType]++;
          ultimapiezacapturadanegra =
            board.tiles[y + 1][x].pieceType + "/" + x + "," + (y + 1);
          ultimotipodemovimiento = "Captura";
          updateBlackCasualities();
          board.tiles[y + 1][x].pieceType = EMPTY;
          board.tiles[y + 1][x].team = EMPTY;
        } else {
          //actualizamos score y tablero
          blackCasualities[board.tiles[y + 2][x].pieceType]++;
          ultimapiezacapturadanegra =
            board.tiles[y + 2][x].pieceType + "/" + x + "," + (y + 2);
          ultimotipodemovimiento = "Captura";
          updateBlackCasualities();
          board.tiles[y + 2][x].pieceType = EMPTY;
          board.tiles[y + 2][x].team = EMPTY;
        }
      } else {
        //no capturo entonces comer al paso peon a ceros y conejo igual
        comeralpaso = "";
        comeralpasoconejo = "";

        //revisamos si se lo pueden comer al paso
        if (oldY - 3 === y) {
          comeralpasoardillatres = x + "," + (oldY - 2);
          comeralpasoardilla = x + "," + (oldY - 1);
        } else {
          if (oldY - 2 === y) {
            comeralpasoardilla = x + "," + (oldY - 1);
            comeralpasoardillatres = "";
          } else {
            if (oldY - 1 === y) {
              comeralpasoardilla = "";
              comeralpasoardillatres = "";
            }
          }
        }
      }
    }
    if (piece === KING) {
      //vemos si es enroque con la torre2
      if (
        (oldX === 4 &&
          oldY === 9 &&
          contadorreyblanco === 0 &&
          contadortorre2blanco === 0 &&
          x === 7 &&
          y === 9) ||
        (oldX === 4 &&
          oldY === 9 &&
          contadorreyblanco === 0 &&
          contadortorre2blanco === 0 &&
          x === 6 &&
          y === 9)
      ) {
        //vaciamos la posicion de la torre
        board.tiles[9][8].pieceType = EMPTY;
        board.tiles[9][8].team = EMPTY;

        //nueva posicion de la torre
        board.tiles[9][5].pieceType = ROOK;
        board.tiles[9][5].team = 0;
      }
      //vemos si es enroque con la torre1
      if (
        (oldX === 4 &&
          oldY === 9 &&
          contadorreyblanco === 0 &&
          contadortorre1blanco === 0 &&
          x === 1 &&
          y === 9) ||
        (oldX === 4 &&
          oldY === 9 &&
          contadorreyblanco === 0 &&
          contadortorre1blanco === 0 &&
          x === 2 &&
          y === 9)
      ) {
        //vaciamos la posicion de la torre
        board.tiles[9][0].pieceType = EMPTY;
        board.tiles[9][0].team = EMPTY;

        //nueva posicion de la torre
        board.tiles[9][3].pieceType = ROOK;
        board.tiles[9][3].team = 0;
      }

      //incrementamos el numero de movimientos del rey
      contadorreyblanco = contadorreyblanco + 1;
      //console.log("Se movió Rey Blanco");
      posicionreyblanco = x + "," + y;
    }

    //incrementamos el numero de movimientos de la torre
    if (piece === ROOK) {
      if (oldX === 0 && oldY === 9) {
        contadortorre1blanco = contadortorre1blanco + 1;
        //console.log("Se movió Torre 1 Blanca");
      }
      if (oldX === 8 && oldY === 9) {
        contadortorre2blanco = contadortorre2blanco + 1;
        //console.log("Se movió Torre 2 Blanca");
      }
    }

    //revisamos si movio ardilla y 2 lugares hacia el frente
    if (piece === ARDILLA && oldY - 2 === y) {
      var lugar_saltado = oldY - 1;
      //console.log(board.tiles[lugar_saltado][oldX].pieceType+'/'+board.tiles[lugar_saltado][oldX].team);

      //vemos si habia pieza en el lugar saltado y de que equipo es
      if (board.tiles[lugar_saltado][oldX].pieceType !== -1) {
        if (board.tiles[lugar_saltado][oldX].team === 0) {
          //console.log("Ardilla blanca salto 2 lugares y salto ficha amiga");
        }
        if (board.tiles[lugar_saltado][oldX].team === 1) {
          //console.log("Ardilla blanca salto 2 lugares y salto ficha enemiga");
          //actualizamos score y tablero
          blackCasualities[board.tiles[lugar_saltado][oldX].pieceType]++;
          ultimapiezacapturadanegra =
            board.tiles[lugar_saltado][oldX].pieceType +
            "/" +
            oldX +
            "," +
            lugar_saltado;
          ultimotipodemovimiento = "Captura";
          updateBlackCasualities();
          //capturamos la ficha
          board.tiles[lugar_saltado][oldX].pieceType = EMPTY;
          board.tiles[lugar_saltado][oldX].team = EMPTY;
        }
      } else {
        //console.log("Ardilla blanca salto 2 lugares y no habia piezas intermedias");
      }
    }
    //revisamos si movio ardilla y 3 lugares hacia el frente
    if (piece === ARDILLA && oldY - 3 === y) {
      var lugar_saltado1 = oldY - 1;
      var lugar_saltado2 = oldY - 2;

      //vemos si habia pieza en el lugar saltado 1 y de que equipo es
      if (
        board.tiles[lugar_saltado1][oldX].pieceType !== -1 ||
        board.tiles[lugar_saltado2][oldX].pieceType !== -1
      ) {
        if (
          board.tiles[lugar_saltado1][oldX].team === 0 &&
          board.tiles[lugar_saltado2][oldX].team === 0
        ) {
          //console.log("Ardilla blanca salto 3 lugares y salto 2 fichas amigas");
        }

        if (
          board.tiles[lugar_saltado1][oldX].team === 1 &&
          board.tiles[lugar_saltado2][oldX].team === 1
        ) {
          //console.log("Ardilla blanca salto 3 lugares y salto 2 fichas enemigas");

          //actualizamos score y tablero
          blackCasualities[board.tiles[lugar_saltado1][oldX].pieceType]++;
          ultimapiezacapturadanegra =
            board.tiles[lugar_saltado1][oldX].pieceType +
            "/" +
            oldX +
            "," +
            lugar_saltado1;
          ultimotipodemovimiento = "Captura";
          updateBlackCasualities();
          //capturamos la ficha
          board.tiles[lugar_saltado1][oldX].pieceType = EMPTY;
          board.tiles[lugar_saltado1][oldX].team = EMPTY;

          //actualizamos score y tablero
          blackCasualities[board.tiles[lugar_saltado2][oldX].pieceType]++;
          ultimapiezacapturadanegra =
            board.tiles[lugar_saltado2][oldX].pieceType +
            "/" +
            oldX +
            "," +
            lugar_saltado2;
          ultimotipodemovimiento = "Captura";
          updateBlackCasualities();
          //capturamos la ficha
          board.tiles[lugar_saltado2][oldX].pieceType = EMPTY;
          board.tiles[lugar_saltado2][oldX].team = EMPTY;
        }

        if (
          board.tiles[lugar_saltado1][oldX].team === 0 &&
          board.tiles[lugar_saltado2][oldX].team === 1
        ) {
          //console.log("Ardilla blanca salto 3 lugares y salto 1 fichas enemiga");

          //actualizamos score y tablero
          blackCasualities[board.tiles[lugar_saltado2][oldX].pieceType]++;
          ultimapiezacapturadanegra =
            board.tiles[lugar_saltado2][oldX].pieceType +
            "/" +
            oldX +
            "," +
            lugar_saltado2;
          ultimotipodemovimiento = "Captura";
          updateBlackCasualities();
          //capturamos la ficha
          board.tiles[lugar_saltado2][oldX].pieceType = EMPTY;
          board.tiles[lugar_saltado2][oldX].team = EMPTY;
        }
        if (
          board.tiles[lugar_saltado1][oldX].team === 1 &&
          board.tiles[lugar_saltado2][oldX].team === 0
        ) {
          //console.log("Ardilla blanca salto 3 lugares y salto 1 fichas enemiga");

          //actualizamos score y tablero
          blackCasualities[board.tiles[lugar_saltado1][oldX].pieceType]++;
          ultimapiezacapturadanegra =
            board.tiles[lugar_saltado1][oldX].pieceType +
            "/" +
            oldX +
            "," +
            lugar_saltado1;
          ultimotipodemovimiento = "Captura";
          updateBlackCasualities();
          //capturamos la ficha
          board.tiles[lugar_saltado1][oldX].pieceType = EMPTY;
          board.tiles[lugar_saltado1][oldX].team = EMPTY;
        }

        if (
          board.tiles[lugar_saltado1][oldX].team === -1 &&
          board.tiles[lugar_saltado2][oldX].team === 1
        ) {
          //console.log("Ardilla blanca salto 3 lugares y salto 1 fichas enemiga y una vacia");

          //actualizamos score y tablero
          blackCasualities[board.tiles[lugar_saltado2][oldX].pieceType]++;
          ultimapiezacapturadanegra =
            board.tiles[lugar_saltado2][oldX].pieceType +
            "/" +
            oldX +
            "," +
            lugar_saltado2;
          ultimotipodemovimiento = "Captura";
          updateBlackCasualities();
          //capturamos la ficha
          board.tiles[lugar_saltado2][oldX].pieceType = EMPTY;
          board.tiles[lugar_saltado2][oldX].team = EMPTY;
        }
        if (
          board.tiles[lugar_saltado1][oldX].team === 1 &&
          board.tiles[lugar_saltado2][oldX].team === -1
        ) {
          //console.log("Ardilla blanca salto 3 lugares y salto 1 fichas enemiga");

          //actualizamos score y tablero
          blackCasualities[board.tiles[lugar_saltado1][oldX].pieceType]++;
          ultimapiezacapturadanegra =
            board.tiles[lugar_saltado1][oldX].pieceType +
            "/" +
            oldX +
            "," +
            lugar_saltado1;
          ultimotipodemovimiento = "Captura";
          updateBlackCasualities();
          //capturamos la ficha
          board.tiles[lugar_saltado1][oldX].pieceType = EMPTY;
          board.tiles[lugar_saltado1][oldX].team = EMPTY;
        }

        if (
          board.tiles[lugar_saltado1][oldX].team === -1 &&
          board.tiles[lugar_saltado2][oldX].team === 0
        ) {
          //console.log("Ardilla blanca salto 3 lugares y salto 1 ficha amiga y una vacia");
        }
        if (
          board.tiles[lugar_saltado1][oldX].team === 0 &&
          board.tiles[lugar_saltado2][oldX].team === -1
        ) {
          //console.log("Ardilla blanca salto 3 lugares y salto 1 ficha amiga y una vacia");
        }
      } else {
        //console.log("Ardilla blanca salto 3 lugares y no habia piezas intermedias");
      }
    }

    if (piece === CONEJO && oldY - 2 === y) {
      lugar_saltado = oldY - 1;
      //console.log(board.tiles[lugar_saltado][oldX].pieceType+'/'+board.tiles[lugar_saltado][oldX].team);

      //vemos si habia pieza en el lugar saltado y de que equipo es
      if (board.tiles[lugar_saltado][oldX].pieceType !== -1) {
        if (board.tiles[lugar_saltado][oldX].team === 0) {
          //console.log("Conejo blanco salto 2 lugares y salto ficha amiga");
        }
        if (board.tiles[lugar_saltado][oldX].team === 1) {
          //console.log("Conejo blanco salto 2 lugares y salto ficha enemiga");
          //comemos pieza solo si es peon
          if (board.tiles[lugar_saltado][oldX].pieceType === 0) {
            //actualizamos score y tablero
            blackCasualities[board.tiles[lugar_saltado][oldX].pieceType]++;
            ultimapiezacapturadanegra =
              board.tiles[lugar_saltado][oldX].pieceType +
              "/" +
              oldX +
              "," +
              lugar_saltado;
            ultimotipodemovimiento = "Captura";
            updateBlackCasualities();
            //capturamos la ficha
            board.tiles[lugar_saltado][oldX].pieceType = EMPTY;
            board.tiles[lugar_saltado][oldX].team = EMPTY;
          }
        }
      } else {
        //console.log("Conejo blanco salto 2 lugares y no habia piezas intermedias");
      }
    }

    if (piece === ELEFANTE) {
      // Upper-right move
      if (oldX + 2 === x && oldY - 2 === y) {
        //actualizamos score y tablero
        blackCasualities[board.tiles[oldY - 1][oldX + 1].pieceType]++;
        ultimapiezacapturadanegra =
          board.tiles[oldY - 1][oldX + 1].pieceType +
          "/" +
          (oldX + 1) +
          "," +
          (oldY - 1);
        ultimotipodemovimiento = "Captura";
        updateBlackCasualities();
        //capturamos la ficha
        board.tiles[oldY - 1][oldX + 1].pieceType = EMPTY;
        board.tiles[oldY - 1][oldX + 1].team = EMPTY;
      }

      // Lower-right move
      if (oldX + 2 === x && oldY + 2 === y) {
        //actualizamos score y tablero
        blackCasualities[board.tiles[oldY + 1][oldX + 1].pieceType]++;
        ultimapiezacapturadanegra =
          board.tiles[oldY + 1][oldX + 1].pieceType +
          "/" +
          (oldX + 1) +
          "," +
          (oldY + 1);
        ultimotipodemovimiento = "Captura";
        updateBlackCasualities();
        //capturamos la ficha
        board.tiles[oldY + 1][oldX + 1].pieceType = EMPTY;
        board.tiles[oldY + 1][oldX + 1].team = EMPTY;
      }
      // Lower-left move
      if (oldX - 2 === x && oldY + 2 === y) {
        //actualizamos score y tablero
        blackCasualities[board.tiles[oldY + 1][oldX - 1].pieceType]++;
        ultimapiezacapturadanegra =
          board.tiles[oldY + 1][oldX - 1].pieceType +
          "/" +
          (oldX - 1) +
          "," +
          (oldY + 1);
        ultimotipodemovimiento = "Captura";
        updateBlackCasualities();
        //capturamos la ficha
        board.tiles[oldY + 1][oldX - 1].pieceType = EMPTY;
        board.tiles[oldY + 1][oldX - 1].team = EMPTY;
      }
      // Upper-left move
      if (oldX - 2 === x && oldY - 2 === y) {
        //actualizamos score y tablero
        blackCasualities[board.tiles[oldY - 1][oldX - 1].pieceType]++;
        ultimapiezacapturadanegra =
          board.tiles[oldY - 1][oldX - 1].pieceType +
          "/" +
          (oldX - 1) +
          "," +
          (oldY - 1);
        ultimotipodemovimiento = "Captura";
        updateBlackCasualities();
        //capturamos la ficha
        board.tiles[oldY - 1][oldX - 1].pieceType = EMPTY;
        board.tiles[oldY - 1][oldX - 1].team = EMPTY;
      }
      // Upper move
      if (oldX === x && oldY - 2 === y) {
        //actualizamos score y tablero
        blackCasualities[board.tiles[oldY - 1][oldX].pieceType]++;
        ultimapiezacapturadanegra =
          board.tiles[oldY - 1][oldX].pieceType + "/" + oldX + "," + (oldY - 1);
        ultimotipodemovimiento = "Captura";
        updateBlackCasualities();
        //capturamos la ficha
        board.tiles[oldY - 1][oldX].pieceType = EMPTY;
        board.tiles[oldY - 1][oldX].team = EMPTY;
      }
      // Right move
      if (oldX + 2 === x && oldY === y) {
        //actualizamos score y tablero
        blackCasualities[board.tiles[oldY][oldX + 1].pieceType]++;
        ultimapiezacapturadanegra =
          board.tiles[oldY][oldX + 1].pieceType + "/" + (oldX + 1) + "," + oldY;
        ultimotipodemovimiento = "Captura";
        updateBlackCasualities();
        //capturamos la ficha
        board.tiles[oldY][oldX + 1].pieceType = EMPTY;
        board.tiles[oldY][oldX + 1].team = EMPTY;
      }
      // Lower move
      if (oldX === x && oldY + 2 === y) {
        //actualizamos score y tablero
        blackCasualities[board.tiles[oldY + 1][oldX].pieceType]++;
        ultimapiezacapturadanegra =
          board.tiles[oldY + 1][oldX].pieceType + "/" + oldX + "," + (oldY + 1);
        ultimotipodemovimiento = "Captura";
        updateBlackCasualities();
        //capturamos la ficha
        board.tiles[oldY + 1][oldX].pieceType = EMPTY;
        board.tiles[oldY + 1][oldX].team = EMPTY;
      }
      // Left move
      if (oldX - 2 === x && oldY === y) {
        //actualizamos score y tablero
        blackCasualities[board.tiles[oldY][oldX - 1].pieceType]++;
        ultimapiezacapturadanegra =
          board.tiles[oldY][oldX - 1].pieceType + "/" + (oldX - 1) + "," + oldY;
        ultimotipodemovimiento = "Captura";
        updateBlackCasualities();
        //capturamos la ficha
        board.tiles[oldY][oldX - 1].pieceType = EMPTY;
        board.tiles[oldY][oldX - 1].team = EMPTY;
      }
    }
  }

  //revisamos si es el equipo de las negras
  if (currentTeam === 1) {
    if (piece === PAWN) {
      //revisamos si acaba de comer al paso
      if (x + "," + y === comeralpaso) {
        //actualizamos score y tablero
        whiteCasualities[board.tiles[y - 1][x].pieceType]++;
        ultimapiezacapturadablanca =
          board.tiles[y - 1][x].pieceType + "/" + x + "," + (y - 1);
        ultimotipodemovimiento = "Captura";
        updateWhiteCasualities();
        //capturamos la ficha
        board.tiles[y - 1][x].pieceType = EMPTY;
        board.tiles[y - 1][x].team = EMPTY;
      } else {
        //revisamos si se lo pueden comer al paso
        if (oldY + 2 === y) {
          comeralpaso = x + "," + (oldY + 1);
        } else {
          if (oldY + 1 === y) {
            comeralpaso = "";
          }
        }
      }
    }
    if (piece === CONEJO) {
      //revisamos si acaba de comer al paso
      if (x + "," + y === comeralpasoconejo || x + "," + y === comeralpaso) {
        //actualizamos score y tablero
        whiteCasualities[board.tiles[y - 1][x].pieceType]++;
        ultimapiezacapturadablanca =
          board.tiles[y - 1][x].pieceType + "/" + x + "," + (y - 1);
        ultimotipodemovimiento = "Captura";
        updateWhiteCasualities();
        //capturamos la ficha
        board.tiles[y - 1][x].pieceType = EMPTY;
        board.tiles[y - 1][x].team = EMPTY;
      } else {
        //no comio al paso entonces comer al paso peon a cero
        comeralpaso = "";
        //revisamos si se lo pueden comer al paso
        if (oldY + 2 === y) {
          comeralpasoconejo = x + "," + (oldY + 1);
        } else {
          if (oldY + 1 === y) {
            comeralpasoconejo = "";
          }
        }
      }
    }
    if (piece === ARDILLA) {
      const combo_comeralpasoardilla = comeralpasoardilla.split(",");
      //const caaX = combo_comeralpasoardilla[0];
      const caaY = combo_comeralpasoardilla[1];

      const combo_comeralpasoardillatres = comeralpasoardillatres.split(",");
      //const caa3X = combo_comeralpasoardillatres[0];
      const caa3Y = combo_comeralpasoardillatres[1];

      const combo_comeralpasoconejo = comeralpasoconejo.split(",");
      //const cacX = combo_comeralpasoconejo[0];
      const cacY = combo_comeralpasoconejo[1];

      const combo_comeralpaso = comeralpaso.split(",");
      //const capX = combo_comeralpaso[0];
      const capY = combo_comeralpaso[1];

      //revisamos si acaba de comer al paso para capturar ficha solo si estan en el mismo eje y
      if (
        (x + "," + y === comeralpasoardillatres &&
          oldY === parseInt(caa3Y) - 1) ||
        (x + "," + y === comeralpasoardilla && oldY === parseInt(caaY) - 1) ||
        (x + "," + y === comeralpasoconejo && oldY === parseInt(cacY) - 1) ||
        (x + "," + y === comeralpaso && oldY === parseInt(capY) - 1)
      ) {
        //capturamos la ficha
        //si esta vacia ir a la siguiente pq salto 3 cuadros
        if (board.tiles[y - 1][x].pieceType !== EMPTY) {
          //actualizamos score y tablero
          whiteCasualities[board.tiles[y - 1][x].pieceType]++;
          ultimapiezacapturadablanca =
            board.tiles[y - 1][x].pieceType + "/" + x + "," + (y - 1);
          ultimotipodemovimiento = "Captura";
          updateWhiteCasualities();
          board.tiles[y - 1][x].pieceType = EMPTY;
          board.tiles[y - 1][x].team = EMPTY;
        } else {
          //actualizamos score y tablero
          whiteCasualities[board.tiles[y - 2][x].pieceType]++;
          ultimapiezacapturadablanca =
            board.tiles[y - 2][x].pieceType + "/" + x + "," + (y - 2);
          ultimotipodemovimiento = "Captura";
          updateWhiteCasualities();
          board.tiles[y - 2][x].pieceType = EMPTY;
          board.tiles[y - 2][x].team = EMPTY;
        }
      } else {
        //no capturo entonces comer al paso peon a ceros y conejo igual
        comeralpaso = "";
        comeralpasoconejo = "";

        //revisamos si se lo pueden comer al paso
        if (oldY + 3 === y) {
          comeralpasoardillatres = x + "," + (oldY + 2);
          comeralpasoardilla = x + "," + (oldY + 1);
        } else {
          if (oldY + 2 === y) {
            comeralpasoardilla = x + "," + (oldY + 1);
            comeralpasoardillatres = "";
          } else {
            if (oldY + 1 === y) {
              comeralpasoardilla = "";
              comeralpasoardillatres = "";
            }
          }
        }
      }
    }

    if (piece === KING) {
      //vemos si es enroque con la torre2
      if (
        (oldX === 4 &&
          oldY === 0 &&
          contadorreynegro === 0 &&
          contadortorre2negro === 0 &&
          x === 7 &&
          y === 0) ||
        (oldX === 4 &&
          oldY === 0 &&
          contadorreynegro === 0 &&
          contadortorre2negro === 0 &&
          x === 6 &&
          y === 0)
      ) {
        //vaciamos la posicion de la torre
        board.tiles[0][8].pieceType = EMPTY;
        board.tiles[0][8].team = EMPTY;

        //nueva posicion de la torre
        board.tiles[0][5].pieceType = ROOK;
        board.tiles[0][5].team = 1;
      }
      //vemos si es enroque con la torre1
      if (
        (oldX === 4 &&
          oldY === 0 &&
          contadorreynegro === 0 &&
          contadortorre1negro === 0 &&
          x === 1 &&
          y === 0) ||
        (oldX === 4 &&
          oldY === 0 &&
          contadorreynegro === 0 &&
          contadortorre1negro === 0 &&
          x === 2 &&
          y === 0)
      ) {
        //vaciamos la posicion de la torre
        board.tiles[0][0].pieceType = EMPTY;
        board.tiles[0][0].team = EMPTY;

        //nueva posicion de la torre
        board.tiles[0][3].pieceType = ROOK;
        board.tiles[0][3].team = 1;
      }

      //incrementamos el numero de movimientos del rey
      contadorreynegro = contadorreynegro + 1;
      //console.log("Se movió Rey Negro");
      posicionreynegro = x + "," + y;
    }
    //incrementamos el numero de movimientos de la torre
    if (piece === ROOK) {
      if (oldX === 0 && oldY === 0) {
        contadortorre1negro = contadortorre1negro + 1;
        //console.log("Se movió Torre 1 Negra");
      }
      if (oldX === 8 && oldY === 0) {
        contadortorre2negro = contadortorre2negro + 1;
        //console.log("Se movió Torre 2 Negra");
      }
    }

    //revisamos si movio ardilla y 2 lugares hacia el frente
    if (piece === ARDILLA && oldY + 2 === y) {
      lugar_saltado = oldY + 1;

      //vemos si habia pieza en el lugar saltado y de que equipo es
      if (board.tiles[lugar_saltado][oldX].pieceType !== -1) {
        if (board.tiles[lugar_saltado][oldX].team === 1) {
          //console.log("Ardilla negra salto 2 lugares y salto ficha amiga");
        }
        if (board.tiles[lugar_saltado][oldX].team === 0) {
          //console.log("Ardilla negra salto 2 lugares y salto ficha enemiga");
          //actualizamos score y tablero
          whiteCasualities[board.tiles[lugar_saltado][oldX].pieceType]++;
          ultimapiezacapturadablanca =
            board.tiles[lugar_saltado][oldX].pieceType +
            "/" +
            oldX +
            "," +
            lugar_saltado;
          ultimotipodemovimiento = "Captura";
          updateWhiteCasualities();
          //capturamos la ficha
          board.tiles[lugar_saltado][oldX].pieceType = EMPTY;
          board.tiles[lugar_saltado][oldX].team = EMPTY;
        }
      } else {
        //console.log("Ardilla negra salto 2 lugares y no habia piezas intermedias");
      }
    }
    //revisamos si movio ardilla y 3 lugares hacia el frente
    if (piece === ARDILLA && oldY + 3 === y) {
      lugar_saltado1 = oldY + 1;
      lugar_saltado2 = oldY + 2;

      //vemos si habia pieza en el lugar saltado 1 y de que equipo es
      if (
        board.tiles[lugar_saltado1][oldX].pieceType !== -1 ||
        board.tiles[lugar_saltado2][oldX].pieceType !== -1
      ) {
        if (
          board.tiles[lugar_saltado1][oldX].team === 1 &&
          board.tiles[lugar_saltado2][oldX].team === 1
        ) {
          //console.log("Ardilla negra salto 3 lugares y salto 2 fichas amigas");
        }

        if (
          board.tiles[lugar_saltado1][oldX].team === 0 &&
          board.tiles[lugar_saltado2][oldX].team === 0
        ) {
          //console.log("Ardilla negra salto 3 lugares y salto 2 fichas enemigas");

          //actualizamos score y tablero
          whiteCasualities[board.tiles[lugar_saltado1][oldX].pieceType]++;
          ultimapiezacapturadablanca =
            board.tiles[lugar_saltado1][oldX].pieceType +
            "/" +
            oldX +
            "," +
            lugar_saltado1;
          ultimotipodemovimiento = "Captura";
          updateWhiteCasualities();
          //capturamos la ficha
          board.tiles[lugar_saltado1][oldX].pieceType = EMPTY;
          board.tiles[lugar_saltado1][oldX].team = EMPTY;

          //actualizamos score y tablero
          whiteCasualities[board.tiles[lugar_saltado2][oldX].pieceType]++;
          ultimapiezacapturadablanca =
            board.tiles[lugar_saltado2][oldX].pieceType +
            "/" +
            oldX +
            "," +
            lugar_saltado2;
          ultimotipodemovimiento = "Captura";
          updateWhiteCasualities();
          //capturamos la ficha
          board.tiles[lugar_saltado2][oldX].pieceType = EMPTY;
          board.tiles[lugar_saltado2][oldX].team = EMPTY;
        }

        if (
          board.tiles[lugar_saltado1][oldX].team === 1 &&
          board.tiles[lugar_saltado2][oldX].team === 0
        ) {
          //console.log("Ardilla negra salto 3 lugares y salto 1 fichas enemiga");

          //actualizamos score y tablero
          whiteCasualities[board.tiles[lugar_saltado2][oldX].pieceType]++;
          ultimapiezacapturadablanca =
            board.tiles[lugar_saltado2][oldX].pieceType +
            "/" +
            oldX +
            "," +
            lugar_saltado2;
          ultimotipodemovimiento = "Captura";
          updateWhiteCasualities();
          //capturamos la ficha
          board.tiles[lugar_saltado2][oldX].pieceType = EMPTY;
          board.tiles[lugar_saltado2][oldX].team = EMPTY;
        }
        if (
          board.tiles[lugar_saltado1][oldX].team === 0 &&
          board.tiles[lugar_saltado2][oldX].team === 1
        ) {
          //console.log("Ardilla negra salto 3 lugares y salto 1 fichas enemiga");

          //actualizamos score y tablero
          whiteCasualities[board.tiles[lugar_saltado1][oldX].pieceType]++;
          ultimapiezacapturadablanca =
            board.tiles[lugar_saltado1][oldX].pieceType +
            "/" +
            oldX +
            "," +
            lugar_saltado1;
          ultimotipodemovimiento = "Captura";
          updateWhiteCasualities();
          //capturamos la ficha
          board.tiles[lugar_saltado1][oldX].pieceType = EMPTY;
          board.tiles[lugar_saltado1][oldX].team = EMPTY;
        }

        if (
          board.tiles[lugar_saltado1][oldX].team === -1 &&
          board.tiles[lugar_saltado2][oldX].team === 0
        ) {
          //console.log("Ardilla negra salto 3 lugares y salto 1 fichas enemiga y una vacia");

          //actualizamos score y tablero
          whiteCasualities[board.tiles[lugar_saltado2][oldX].pieceType]++;
          ultimapiezacapturadablanca =
            board.tiles[lugar_saltado2][oldX].pieceType +
            "/" +
            oldX +
            "," +
            lugar_saltado2;
          ultimotipodemovimiento = "Captura";
          updateWhiteCasualities();
          //capturamos la ficha
          board.tiles[lugar_saltado2][oldX].pieceType = EMPTY;
          board.tiles[lugar_saltado2][oldX].team = EMPTY;
        }
        if (
          board.tiles[lugar_saltado1][oldX].team === 0 &&
          board.tiles[lugar_saltado2][oldX].team === -1
        ) {
          //console.log("Ardilla negra salto 3 lugares y salto 1 fichas enemiga");

          //actualizamos score y tablero
          whiteCasualities[board.tiles[lugar_saltado1][oldX].pieceType]++;
          ultimapiezacapturadablanca =
            board.tiles[lugar_saltado1][oldX].pieceType +
            "/" +
            oldX +
            "," +
            lugar_saltado1;
          ultimotipodemovimiento = "Captura";
          updateWhiteCasualities();
          //capturamos la ficha
          board.tiles[lugar_saltado1][oldX].pieceType = EMPTY;
          board.tiles[lugar_saltado1][oldX].team = EMPTY;
        }

        if (
          board.tiles[lugar_saltado1][oldX].team === -1 &&
          board.tiles[lugar_saltado2][oldX].team === 1
        ) {
          //console.log("Ardilla negra salto 3 lugares y salto 1 ficha amiga y una vacia");
        }
        if (
          board.tiles[lugar_saltado1][oldX].team === 1 &&
          board.tiles[lugar_saltado2][oldX].team === -1
        ) {
          //console.log("Ardilla negra salto 3 lugares y salto 1 ficha amiga y una vacia");
        }
      } else {
        //console.log("Ardilla negra salto 3 lugares y no habia piezas intermedias");
      }
    }

    if (piece === CONEJO && oldY + 2 === y) {
      lugar_saltado = oldY + 1;

      //vemos si habia pieza en el lugar saltado y de que equipo es
      if (board.tiles[lugar_saltado][oldX].pieceType !== -1) {
        if (board.tiles[lugar_saltado][oldX].team === 1) {
          //console.log("Conejo negro salto 2 lugares y salto ficha amiga");
        }
        if (board.tiles[lugar_saltado][oldX].team === 0) {
          //console.log("Conejo negro salto 2 lugares y salto ficha enemiga");
          //comemos pieza solo si es peon
          if (board.tiles[lugar_saltado][oldX].pieceType === 0) {
            //actualizamos score y tablero
            whiteCasualities[board.tiles[lugar_saltado][oldX].pieceType]++;
            ultimapiezacapturadablanca =
              board.tiles[lugar_saltado][oldX].pieceType +
              "/" +
              oldX +
              "," +
              lugar_saltado;
            ultimotipodemovimiento = "Captura";
            updateWhiteCasualities();
            //capturamos la ficha
            board.tiles[lugar_saltado][oldX].pieceType = EMPTY;
            board.tiles[lugar_saltado][oldX].team = EMPTY;
          }
        }
      } else {
        //console.log("Conejo negro salto 2 lugares y no habia piezas intermedias");
      }
    }

    if (piece === ELEFANTE) {
      // Upper-right move
      if (oldX + 2 === x && oldY - 2 === y) {
        //actualizamos score y tablero
        whiteCasualities[board.tiles[oldY - 1][oldX + 1].pieceType]++;
        ultimapiezacapturadablanca =
          board.tiles[oldY - 1][oldX + 1].pieceType +
          "/" +
          (oldX + 1) +
          "," +
          (oldY - 1);
        ultimotipodemovimiento = "Captura";
        updateWhiteCasualities();
        //capturamos la ficha
        board.tiles[oldY - 1][oldX + 1].pieceType = EMPTY;
        board.tiles[oldY - 1][oldX + 1].team = EMPTY;
      }

      // Lower-right move
      if (oldX + 2 === x && oldY + 2 === y) {
        //actualizamos score y tablero
        whiteCasualities[board.tiles[oldY + 1][oldX + 1].pieceType]++;
        ultimapiezacapturadablanca =
          board.tiles[oldY + 1][oldX + 1].pieceType +
          "/" +
          (oldX + 1) +
          "," +
          (oldY + 1);
        ultimotipodemovimiento = "Captura";
        updateWhiteCasualities();
        //capturamos la ficha
        board.tiles[oldY + 1][oldX + 1].pieceType = EMPTY;
        board.tiles[oldY + 1][oldX + 1].team = EMPTY;
      }
      // Lower-left move
      if (oldX - 2 === x && oldY + 2 === y) {
        //actualizamos score y tablero
        whiteCasualities[board.tiles[oldY + 1][oldX - 1].pieceType]++;
        ultimapiezacapturadablanca =
          board.tiles[oldY + 1][oldX - 1].pieceType +
          "/" +
          (oldX - 1) +
          "," +
          (oldY + 1);
        ultimotipodemovimiento = "Captura";
        updateWhiteCasualities();
        //capturamos la ficha
        board.tiles[oldY + 1][oldX - 1].pieceType = EMPTY;
        board.tiles[oldY + 1][oldX - 1].team = EMPTY;
      }
      // Upper-left move
      if (oldX - 2 === x && oldY - 2 === y) {
        //actualizamos score y tablero
        whiteCasualities[board.tiles[oldY - 1][oldX - 1].pieceType]++;
        ultimapiezacapturadablanca =
          board.tiles[oldY - 1][oldX - 1].pieceType +
          "/" +
          (oldX - 1) +
          "," +
          (oldY - 1);
        ultimotipodemovimiento = "Captura";
        updateWhiteCasualities();
        //capturamos la ficha
        board.tiles[oldY - 1][oldX - 1].pieceType = EMPTY;
        board.tiles[oldY - 1][oldX - 1].team = EMPTY;
      }
      // Upper move
      if (oldX === x && oldY - 2 === y) {
        //actualizamos score y tablero
        whiteCasualities[board.tiles[oldY - 1][oldX].pieceType]++;
        ultimapiezacapturadablanca =
          board.tiles[oldY - 1][oldX].pieceType + "/" + oldX + "," + (oldY - 1);
        ultimotipodemovimiento = "Captura";
        updateWhiteCasualities();
        //capturamos la ficha
        board.tiles[oldY - 1][oldX].pieceType = EMPTY;
        board.tiles[oldY - 1][oldX].team = EMPTY;
      }
      // Right move
      if (oldX + 2 === x && oldY === y) {
        //actualizamos score y tablero
        whiteCasualities[board.tiles[oldY][oldX + 1].pieceType]++;
        ultimapiezacapturadablanca =
          board.tiles[oldY][oldX + 1].pieceType + "/" + (oldX + 1) + "," + oldY;
        ultimotipodemovimiento = "Captura";
        updateWhiteCasualities();
        //capturamos la ficha
        board.tiles[oldY][oldX + 1].pieceType = EMPTY;
        board.tiles[oldY][oldX + 1].team = EMPTY;
      }
      // Lower move
      if (oldX === x && oldY + 2 === y) {
        //actualizamos score y tablero
        whiteCasualities[board.tiles[oldY + 1][oldX].pieceType]++;
        ultimapiezacapturadablanca =
          board.tiles[oldY + 1][oldX].pieceType + "/" + oldX + "," + (oldY + 1);
        ultimotipodemovimiento = "Captura";
        updateWhiteCasualities();
        //capturamos la ficha
        board.tiles[oldY + 1][oldX].pieceType = EMPTY;
        board.tiles[oldY + 1][oldX].team = EMPTY;
      }
      // Left move
      if (oldX - 2 === x && oldY === y) {
        //actualizamos score y tablero
        whiteCasualities[board.tiles[oldY][oldX - 1].pieceType]++;
        ultimapiezacapturadablanca =
          board.tiles[oldY][oldX - 1].pieceType + "/" + (oldX - 1) + "," + oldY;
        ultimotipodemovimiento = "Captura";
        updateWhiteCasualities();
        //capturamos la ficha
        board.tiles[oldY][oldX - 1].pieceType = EMPTY;
        board.tiles[oldY][oldX - 1].team = EMPTY;
      }
    }
  }

  //movemos la pieza
  board.tiles[y][x].pieceType = board.tiles[curY][curX].pieceType;
  board.tiles[y][x].team = board.tiles[curY][curX].team;

  board.tiles[curY][curX].pieceType = EMPTY;
  board.tiles[curY][curX].team = EMPTY;

  curX = -1;
  curY = -1;
  board.resetValidMoves();

  //revisamos si al mover hace jaque
  if (currentTeam === 0 && jaquereyblanco === "Si") {
    const combo_posicionreyblanco = posicionreyblanco.split(",");
    const checkX = combo_posicionreyblanco[0];
    const checkY = combo_posicionreyblanco[1];

    if (checkTileUnderAttack(checkX, checkY, BLACK, true) === true && piece !== KING) {
      //alert('Movimiento inválido');
      //regresamos todo a como estaba antes del movimiento solo si la pieza movida no es el rey
      board.tiles[oldY][oldX].pieceType = board.tiles[y][x].pieceType;
      board.tiles[oldY][oldX].team = board.tiles[y][x].team;
      board.tiles[y][x].pieceType = EMPTY;
      board.tiles[y][x].team = EMPTY;

      //si capturo ficha la devolvemos
      if (ultimotipodemovimiento === "Captura") {
        const combo_ultimapiezacapturadanegra =
          ultimapiezacapturadanegra.split("/");
        const combo_xy = combo_ultimapiezacapturadanegra[1].split(",");
        board.tiles[combo_xy[1]][combo_xy[0]].pieceType =
          combo_ultimapiezacapturadanegra[0];
        board.tiles[combo_xy[1]][combo_xy[0]].team = 1;
        blackCasualities[combo_ultimapiezacapturadanegra[0]]--;
        updateBlackCasualities();
      }
    }
  }

  if (currentTeam === 1 && jaquereynegro === "Si") {
    const combo_posicionreynegro = posicionreynegro.split(",");
    const checkX = combo_posicionreynegro[0];
    const checkY = combo_posicionreynegro[1];

    if (checkTileUnderAttack(checkX, checkY, WHITE, true) === true && piece !== KING) {
      //alert('Movimiento inválido');
      //regresamos todo a como estaba antes del movimiento solo si la pieza movida no es el rey
      board.tiles[oldY][oldX].pieceType = board.tiles[y][x].pieceType;
      board.tiles[oldY][oldX].team = board.tiles[y][x].team;
      board.tiles[y][x].pieceType = EMPTY;
      board.tiles[y][x].team = EMPTY;

      //si capturo ficha la devolvemos
      if (ultimotipodemovimiento === "Captura") {
        const combo_ultimapiezacapturadablanca =
          ultimapiezacapturadablanca.split("/");
        const combo_xy = combo_ultimapiezacapturadablanca[1].split(",");
        board.tiles[combo_xy[1]][combo_xy[0]].pieceType =
          combo_ultimapiezacapturadablanca[0];
        board.tiles[combo_xy[1]][combo_xy[0]].team = 0;
        whiteCasualities[combo_ultimapiezacapturadablanca[0]]--;
        updateWhiteCasualities();
      }
    }
  }

  //guardamos el ultimo movimiento
  if (ultimotipodemovimiento === "Captura") {
    if (currentTeam === 1) {
      const combo_ultimapiezacapturadablanca = ultimapiezacapturadablanca.split("/");

      ultimomovimiento =
        piece + "/" + oldX + "," + oldY + "/" + x + "," + y + "/" + currentTeam + "/" + combo_ultimapiezacapturadablanca[0];

    } else {
      const combo_ultimapiezacapturadanegra = ultimapiezacapturadanegra.split("/");

      ultimomovimiento =
        piece + "/" + oldX + "," + oldY + "/" + x + "," + y + "/" + currentTeam + "/" + combo_ultimapiezacapturadanegra[0];
    }
  } else {
    ultimomovimiento =
      piece + "/" + oldX + "," + oldY + "/" + x + "," + y + "/" + currentTeam + "/-1";
  }

  nomenclatura =
    piecesCharacters[piece] +
    " " +
    ejeX[oldX] +
    "-" +
    ejeY[oldY] +
    "," +
    ejeX[x] +
    "-" +
    ejeY[y];
}

export async function changeCurrentTeam(skip = false, resetPlayTime = false) {
  if (serverGameData == null) return;
  if (serverGameData?.player2 == null) return;
  if (serverGameData?.player1 == null) return;

  var newTurno = numero_turno + 1;
  var equipo_opuesto = getOppositeTeam(currentTeam);

  if (numero_turno % 2 !== 1 && numero_turno !== 0) {
    marca_jugada(numero_turno % 9);
  }

  if (
    serverGameData?.numero_turno % 18 === 0 &&
    serverGameData?.numero_turno !== 0
  ) {
    Swal.fire({
      title: "Alerta..",
      text: "Te toca doble turno",
    });
    aviso_doble_turno = false;
    await getGameDbRef()
      .update({
        board,
        numero_turno: newTurno,
      })
      .catch(console.error);
    await getGameDbRef()
      .child("jugadas")
      .push({
        uid: firebase.auth().currentUser?.uid,
        movimiento: nomenclatura,
        codigo: ultimomovimiento,
        createdAt: Date.now(),
        player: equipo_opuesto,
      })
      .catch(console.error);
    return;
  }

  if (currentTeam === WHITE) {
    await getGameDbRef()
      .update(
        {
          board,
          side: serverGameData?.player2,
          numero_turno: newTurno,
        },
        (error) => {
          if (error) {
            // The write failed...
            Swal.fire({
              title: "Alerta..",
              text: "No se guardo el último movimiento",
            });
          } else {
            // Data saved successfully!
          }
        }
      )
      .catch(console.error);
  } else {
    await getGameDbRef()
      .update(
        {
          board,
          side: serverGameData?.player1,
          numero_turno: newTurno,
        },
        (error) => {
          if (error) {
            // The write failed...
            Swal.fire({
              title: "Alerta..",
              text: "No se guardo el último movimiento",
            });
          } else {
            // Data saved successfully!
          }
        }
      )
      .catch(console.error);
  }
  if (!skip) {
    await getGameDbRef()
      .child("jugadas")
      .push({
        uid: firebase.auth().currentUser?.uid,
        movimiento: nomenclatura,
        codigo: ultimomovimiento,
        createdAt: Date.now(),
        player: currentTeam,
      })
      .catch(console.error);
  }

  if (resetPlayTime) {
    await getGameDbRef()
      .update({
        board,
        lastPiecejoue: {
          createdAt: Date.now(),
        },
      })
      .catch(console.error);
  }

  //guardamos jugadas por jugador 
  if (currentTeam === WHITE) {
    //leemos las jugadas anteriores
    await getGameDbRef()
      .child("jugadas_negras")
      .get()
      .then((snapshot) => {
        jugadas_negras = snapshot.val();
      })
      .catch((error) => {
        console.error(error);
      });

    //buscamos la jugada nueva en la bd
    if (jugadas_negras !== '' && jugadas_negras !== undefined && jugadas_negras !== null) {

      let valores_negras = Array.from(Object.entries(jugadas_negras));
      let existe = 'No';
      for (let i = 0; i < valores_negras.length; i++) {
        if (valores_negras[i][1]['movimiento'] === nomenclatura) {
          existe = 'Si';
          if (valores_negras[i][1]['veces'] === 1) {
            //console.log(nomenclatura + " existe 1 vez en las jugadas negras");

            let key_jugada = valores_negras[i][0];

            await getGameDbRef()
              .child('jugadas_negras')
              .child(key_jugada)
              .update({
                veces: 2,
              })
              .catch(console.error);
          }
          if (valores_negras[i][1]['veces'] === 2) {
            //console.log(nomenclatura + " existe 2 veces en las jugadas negras");
            //declaramos empate por ser la 3a vez que el jugador repite la misma jugada
            let key_jugada = valores_negras[i][0];
            await getGameDbRef()
              .child('jugadas_negras')
              .child(key_jugada)
              .update({
                veces: 3,
              })
              .catch(console.error);

            await getGameDbRef()
              .update({
                status: "tied",
              })
              .catch(console.error);

            Swal.fire({
              title: "Opps..",
              text: "El juego se ha empatado",
            });

          }
          break;
        }
      }
      if (existe === 'No') {
        getGameDbRef()
          .child("jugadas_negras")
          .push({
            movimiento: nomenclatura,
            veces: 1,
          })
          .catch(console.error);
        //console.log(nomenclatura + " no existe en las jugadas negras");
      }
    } else {
      await getGameDbRef()
        .child("jugadas_negras")
        .push({
          movimiento: nomenclatura,
          veces: 1,
        })
        .catch(console.error);
    }

  } else {

    //leemos las jugadas anteriores
    await getGameDbRef()
      .child("jugadas_blancas")
      .get()
      .then((snapshot) => {
        jugadas_blancas = snapshot.val();
      })
      .catch((error) => {
        console.error(error);
      });

    //buscamos la jugada nueva en la bd
    if (jugadas_blancas !== '' && jugadas_blancas !== undefined && jugadas_blancas !== null) {

      let valores_blancas = Array.from(Object.entries(jugadas_blancas));
      let existe = 'No';
      for (let i = 0; i < valores_blancas.length; i++) {
        if (valores_blancas[i][1]['movimiento'] === nomenclatura) {
          existe = 'Si';
          if (valores_blancas[i][1]['veces'] === 1) {
            //console.log(nomenclatura + " existe 1 vez en las jugadas blancas");
            let key_jugada = valores_blancas[i][0];

            await getGameDbRef()
              .child('jugadas_blancas')
              .child(key_jugada)
              .update({
                veces: 2,
              })
              .catch(console.error);
          }
          if (valores_blancas[i][1]['veces'] === 2) {
            //console.log(nomenclatura + " existe 2 veces en las jugadas blancas");
            //declaramos empate por ser la 3a vez que el jugador repite la misma jugada
            let key_jugada = valores_blancas[i][0];
            await getGameDbRef()
              .child('jugadas_blancas')
              .child(key_jugada)
              .update({
                veces: 3,
              })
              .catch(console.error);

            await getGameDbRef()
              .update({
                status: "tied",
              })
              .catch(console.error);

            Swal.fire({
              title: "Opps..",
              text: "El juego se ha empatado",
            });

          }
          break;
        }
      }
      if (existe === 'No') {
        getGameDbRef()
          .child("jugadas_blancas")
          .push({
            movimiento: nomenclatura,
            veces: 1,
          })
          .catch(console.error);
        //console.log(nomenclatura + " no existe en las jugadas blancas");
      }
    } else {
      await getGameDbRef()
        .child("jugadas_blancas")
        .push({
          movimiento: nomenclatura,
          veces: 1,
        })
        .catch(console.error);
    }
  }
}

async function repaintBoard() {
  drawBoard();
  checkPossiblePlays(1); //1 = marcar casilla
  drawPieces();
}

function drawBoard() {
  for (let i = 0; i < BOARD_HEIGHT; i++) {
    for (let j = 0; j < BOARD_WIDTH; j++) {

      var coordenada_celda = "celda_y" + i + "x" + j;
      var celda = document.getElementById(coordenada_celda);
      celda.style.backgroundColor = '';
    }
  }
}


function drawCircle(x, y, fillStyle) {
  var coordenada = "celda_y" + y + "x" + x;
  var celda = document.getElementById(coordenada);
  //celda.style.backgroundColor = "#90C485";
  celda.style.setProperty('background-color', '#90C485', 'important');
}

function drawCorners(x, y, fillStyle) {
  var coordenada = "celda_y" + y + "x" + x;
  var celda = document.getElementById(coordenada);
  //celda.style.backgroundColor = 'red';
  celda.style.setProperty('background-color', 'red', 'important');

}

function drawPieces() {
  //coronacion
  for (let j = 0; j < BOARD_WIDTH; j++) {
    let pieza = board.tiles[9][j].pieceType;
    if (pieza === PAWN) {
      board.tiles[9][j].pieceType = BISHOP;
    }
  }

  for (let j = 0; j < BOARD_WIDTH; j++) {
    let pieza = board.tiles[0][j].pieceType;
    if (pieza === PAWN) {
      board.tiles[0][j].pieceType = BISHOP;
    }
  }

  for (let j = 0; j < BOARD_WIDTH; j++) {
    let pieza = board.tiles[0][j].pieceType;
    if (pieza === CONEJO) {
      board.tiles[0][j].pieceType = ROOK;
    }
  }

  for (let j = 0; j < BOARD_WIDTH; j++) {
    let pieza = board.tiles[9][j].pieceType;
    if (pieza === CONEJO) {
      board.tiles[9][j].pieceType = ROOK;
    }
  }

  for (let j = 0; j < BOARD_WIDTH; j++) {
    let pieza = board.tiles[0][j].pieceType;
    if (pieza === ARDILLA) {
      board.tiles[0][j].pieceType = QUEEN;
    }
  }

  for (let j = 0; j < BOARD_WIDTH; j++) {
    let pieza = board.tiles[9][j].pieceType;
    if (pieza === ARDILLA) {
      board.tiles[9][j].pieceType = QUEEN;
    }
  }


  for (let j = 0; j < BOARD_WIDTH; j++) {
    let pieza = board.tiles[0][j].pieceType;
    let equipo = board.tiles[0][j].team;

    if (pieza === LEON && equipo === WHITE) {
      board.tiles[0][j].pieceType = FAKEKING;
      if (currentTeam === WHITE) {
        marcaleonblanco(true);
        marcarposicionleonblanco("0," + j);
      } else {
        marcaleonnegro(true);
        marcarposicionleonnegro("0," + j);
      }
    }
  }

  for (let j = 0; j < BOARD_WIDTH; j++) {
    let pieza = board.tiles[9][j].pieceType;
    let equipo = board.tiles[9][j].team;

    if (pieza === LEON && equipo === BLACK) {
      board.tiles[9][j].pieceType = FAKEKING;
      if (currentTeam === WHITE) {
        marcaleonnegro(true);
        marcarposicionleonnegro("9," + j);
      } else {
        marcaleonblanco(true);
        marcarposicionleonblanco("9," + j);
      }
    }
  }
  //fin coronacion

  //revisamos que nadie le haga jaque al rey blanco
  if (posicionreyblanco !== undefined) {
    const combo_posicionreyblanco = posicionreyblanco.split(",");
    const checkWX = combo_posicionreyblanco[0];
    const checkWY = combo_posicionreyblanco[1];
    checkTileUnderAttack(checkWX, checkWY, BLACK, true)
  }

  //revisamos que nadie le haga jaque al rey negro
  if (posicionreynegro !== undefined) {
    const combo_posicionreynegro = posicionreynegro.split(",");
    const checkBX = combo_posicionreynegro[0];
    const checkBY = combo_posicionreynegro[1];
    checkTileUnderAttack(checkBX, checkBY, WHITE, true)
  }

  //pintamos las piezas
  for (let i = 0; i < BOARD_HEIGHT; i++) {
    for (let j = 0; j < BOARD_WIDTH; j++) {

      let pieceType = board.tiles[i][j].pieceType;
      let equipo = board.tiles[i][j].team;
      let coordenada = "y" + i + "x" + j;
      let elemento = document.getElementById(coordenada);

      if (board.tiles[i][j].team === EMPTY) {
        elemento.src = vacio;
        continue;
      }

      if (pieceType === 6) {
        if (equipo === WHITE) {
          elemento.src = ardillabco;
        } else {
          elemento.src = ardilla;
        }
      } else if (pieceType === 0) {
        if (equipo === WHITE) {
          elemento.src = peonbco;
        } else {
          elemento.src = peon;
        }
      }
      else if (pieceType === 1) {
        if (equipo === WHITE) {
          elemento.src = caballobco;
        } else {
          elemento.src = caballo;
        }
      }
      else if (pieceType === 2) {
        if (equipo === WHITE) {
          elemento.src = alfilbco;
        } else {
          elemento.src = alfil;
        }

      }
      else if (pieceType === 3) {
        if (equipo === WHITE) {
          elemento.src = torrebco;
        } else {
          elemento.src = torre;
        }
      }
      else if (pieceType === 4) {
        if (equipo === WHITE) {
          elemento.src = reinabco;
        } else {
          elemento.src = reina;
        }
      }
      else if (pieceType === 5) {
        if (equipo === WHITE) {
          elemento.src = reybco;
        } else {
          elemento.src = rey;
        }

      } else if (pieceType === 7) {
        if (equipo === WHITE) {
          elemento.src = conejobco;
        } else {
          elemento.src = conejo;
        }

      } else if (pieceType === 8) {
        if (equipo === WHITE) {
          elemento.src = perrobco;
        } else {
          elemento.src = perro;
        }

      } else if (pieceType === 9) {
        if (equipo === WHITE) {
          elemento.src = panterabco;
        } else {
          elemento.src = pantera;
        }

      } else if (pieceType === 10) {
        if (equipo === WHITE) {
          elemento.src = elefantebco;
        } else {
          elemento.src = elefante;
        }
      } else if (pieceType === 11) {
        if (equipo === WHITE) {
          elemento.src = leonbco;
        } else {
          elemento.src = leon;
        }

      } else if (pieceType === 12) {
        if (equipo === WHITE) {
          elemento.src = fakekingbco;
        } else {
          elemento.src = fakeking;
        }
      }
    }
  }
}

function updateWhiteCasualities() {
  updateCasualities(whiteCasualities, WHITE);
}

function updateBlackCasualities() {
  updateCasualities(blackCasualities, BLACK);
}

function updateCasualities(casualities, equipo) {
  let none = true;

  for (let i = LEON; i >= PAWN; i--) {
    if (casualities[i] === 0) continue;

    if (none) {
      if (equipo === WHITE) {
        whiteCasualitiesText = casualities[i] + "" + piecesCharacters[i];
      } else {
        blackCasualitiesText = casualities[i] + "" + piecesCharacters[i];
      }
      none = false;
    } else {
      if (equipo === WHITE) {
        whiteCasualitiesText += " " + casualities[i] + "" + piecesCharacters[i];
      } else {
        blackCasualitiesText += " " + casualities[i] + "" + piecesCharacters[i];
      }
    }
  }
  /*
  if (none) {
    if (equipo === WHITE) {
      whiteCasualitiesText = "Ninguna";
    } else {
      blackCasualitiesText = "Ninguna";
    }
  }
  */
}
function getOppositeTeam(team) {
  if (team === WHITE) return BLACK;
  else if (team === BLACK) return WHITE;
  else return EMPTY;
}
function checkTileUnderAttackNO_KING(x, y, equipo, checarjaquemate) {
  //recorremos todo el tablero y llenamos el arreglo de casillas en peligro
  for (let xx = 0; xx <= 8; xx++) {
    for (let yy = 0; yy <= 9; yy++) {
      //vemos que la pieza sea enemiga
      if (board.tiles[yy][xx].team === equipo) {
        currentTeamJUSTCHECK = equipo;
        let tile = board.tiles[yy][xx];
        if (tile.pieceType === PAWN)
          checkPossiblePlaysPawnJUSTCHECK(xx, yy);
        else if (tile.pieceType === KNIGHT)
          checkPossiblePlaysKnightJUSTCHECK(xx, yy);
        else if (tile.pieceType === BISHOP)
          checkPossiblePlaysBishopJUSTCHECK(xx, yy);
        else if (tile.pieceType === ROOK)
          checkPossiblePlaysRookJUSTCHECK(xx, yy);
        else if (tile.pieceType === QUEEN)
          checkPossiblePlaysQueenJUSTCHECK(xx, yy);
        //else if (tile.pieceType === KING) checkPossiblePlaysKingJUSTCHECK(xx, yy);
        else if (tile.pieceType === ARDILLA)
          checkPossiblePlaysArdillaJUSTCHECK(xx, yy);
        else if (tile.pieceType === CONEJO)
          checkPossiblePlaysConejoJUSTCHECK(xx, yy);
        else if (tile.pieceType === PERRO)
          checkPossiblePlaysPerroJUSTCHECK(xx, yy);
        else if (tile.pieceType === PANTERA)
          checkPossiblePlaysPanteraJUSTCHECK(xx, yy);
        else if (tile.pieceType === ELEFANTE)
          checkPossiblePlaysElefanteJUSTCHECK(xx, yy);
        else if (tile.pieceType === LEON)
          checkPossiblePlaysLeonJUSTCHECK(xx, yy);

        //console.log('X:'+xx+'Y:'+yy+'Pieza:'+board.tiles[yy][xx].pieceType);
      }
    }
  }
  if (casillasenpeligro.includes(x + "/" + y)) {
    //vaciamos el arreglo
    casillasenpeligro = [];
    if (board.tiles[y][x].pieceType === KING && checarjaquemate === true) {

      if (board.tiles[y][x].team === WHITE) {
        jaquereyblanco = "Si";
        posicionreyblanco = x + "," + y;

        //checamos jaque o jaquemate
        const combo_brute_jaque_desde = serverGameData?.jaquedesde;
        const combo_jaque_desde = combo_brute_jaque_desde.split(",");
        const lastWX = parseInt(combo_jaque_desde[0]);
        const lastWY = parseInt(combo_jaque_desde[1]);

        //sino se puede mover el rey
        //la pieza que hace jaque nadie se la puede comer
        //y no hay pieza que pueda tapar el jaque es MATE
        //si el rey puede comer y quedar sin jaque
        if ((moverelreyblanco(parseInt(x), parseInt(y)) === false &&
          checkTileUnderAttackNO_KING(lastWX, lastWY, WHITE, true) === false &&
          checkblockmate(x, y, WHITE) === false &&
          checkKINGRESOLVEMATE(parseInt(x), parseInt(y), WHITE) === false)
        ) {

          getGameDbRef()
            .update({
              status: "black wins",
              board,
            })
            .catch(console.error);
          Swal.fire({
            title: "Opps....",
            text: "JAQUE MATE HAN GANADO LAS NEGRAS",
          });

        } else {
          if (aviso_jaque === false) {
            aviso_jaque = true;

            getGameDbRef()
              .update({
                jaquereyblanco: jaquereyblanco,
              })
              .catch(console.error);


            Swal.fire({
              title: "Opps....",
              text: "JAQUE",
            });
          }
        }
      } else {
        jaquereynegro = "Si";
        posicionreynegro = x + "," + y;

        const combo_brute_jaque_desde = serverGameData?.jaquedesde;
        const combo_jaque_desde = combo_brute_jaque_desde.split(",");
        const lastBX = parseInt(combo_jaque_desde[0]);
        const lastBY = parseInt(combo_jaque_desde[1]);

        //sino se puede mover el rey
        //la pieza que hace jaque nadie se la puede comer
        //y no hay pieza que pueda tapar el jaque es MATE
        //si el rey puede comer y quedar sin jaque
        if ((moverelreynegro(parseInt(x), parseInt(y)) === false &&
          checkTileUnderAttackNO_KING(lastBX, lastBY, BLACK, true) === false &&
          checkblockmate(x, y, BLACK) === false &&
          checkKINGRESOLVEMATE(parseInt(x), parseInt(y), BLACK) === false)
        ) {

          getGameDbRef()
            .update({
              status: "white wins",
              board,
            })
            .catch(console.error);
          Swal.fire({
            title: "Opps....",
            text: "JAQUE MATE HAN GANADO LAS BLANCAS",
          });

        } else {
          if (aviso_jaque === false) {
            aviso_jaque = true;

            getGameDbRef()
              .update({
                jaquereynegro: jaquereynegro,
              })
              .catch(console.error);

            Swal.fire({
              title: "Opps....",
              text: "JAQUE",
            });
          }
        }
      }
    }
    return true;
  } else {
    //vaciamos el arreglo
    casillasenpeligro = [];
    return false;
  }
}

function checkTileUnderAttack(x, y, equipo, checarjaquemate) {
  //recorremos todo el tablero y llenamos el arreglo de casillas en peligro
  for (let xx = 0; xx <= 8; xx++) {
    for (let yy = 0; yy <= 9; yy++) {
      //vemos que la pieza sea enemiga
      if (board.tiles[yy][xx].team === equipo) {
        currentTeamJUSTCHECK = equipo;
        let tile = board.tiles[yy][xx];
        if (tile.pieceType === PAWN)
          checkPossiblePlaysPawnJUSTCHECK(xx, yy);
        else if (tile.pieceType === KNIGHT)
          checkPossiblePlaysKnightJUSTCHECK(xx, yy);
        else if (tile.pieceType === BISHOP)
          checkPossiblePlaysBishopJUSTCHECK(xx, yy);
        else if (tile.pieceType === ROOK)
          checkPossiblePlaysRookJUSTCHECK(xx, yy);
        else if (tile.pieceType === QUEEN)
          checkPossiblePlaysQueenJUSTCHECK(xx, yy);
        else if (tile.pieceType === KING)
          checkPossiblePlaysKingJUSTCHECK(xx, yy);
        else if (tile.pieceType === ARDILLA)
          checkPossiblePlaysArdillaJUSTCHECK(xx, yy);
        else if (tile.pieceType === CONEJO)
          checkPossiblePlaysConejoJUSTCHECK(xx, yy);
        else if (tile.pieceType === PERRO)
          checkPossiblePlaysPerroJUSTCHECK(xx, yy);
        else if (tile.pieceType === PANTERA)
          checkPossiblePlaysPanteraJUSTCHECK(xx, yy);
        else if (tile.pieceType === ELEFANTE)
          checkPossiblePlaysElefanteJUSTCHECK(xx, yy);
        else if (tile.pieceType === LEON)
          checkPossiblePlaysLeonJUSTCHECK(xx, yy);

        //console.log('X:'+xx+'Y:'+yy+'Pieza:'+board.tiles[yy][xx].pieceType);
      }
    }
  }
  if (casillasenpeligro.includes(x + "/" + y)) {
    //vaciamos el arreglo
    casillasenpeligro = [];

    if (board.tiles[y][x].pieceType === KING && checarjaquemate === true) {

      if (board.tiles[y][x].team === WHITE) {
        jaquereyblanco = "Si";
        posicionreyblanco = x + "," + y;

        //checamos jaque o jaquemate
        const combo_brute_jaque_desde = serverGameData?.jaquedesde;
        const combo_jaque_desde = combo_brute_jaque_desde.split(",");
        const lastWX = parseInt(combo_jaque_desde[0]);
        const lastWY = parseInt(combo_jaque_desde[1]);

        //sino se puede mover el rey
        //la pieza que hace jaque nadie se la puede comer
        //y no hay pieza que pueda tapar el jaque es MATE
        //si el rey puede comer y quedar sin jaque
        if ((moverelreyblanco(parseInt(x), parseInt(y)) === false &&
          checkTileUnderAttackNO_KING(lastWX, lastWY, WHITE, true) === false &&
          checkblockmate(x, y, WHITE) === false &&
          checkKINGRESOLVEMATE(parseInt(x), parseInt(y), WHITE) === false)
        ) {

          getGameDbRef()
            .update({
              status: "black wins",
              board,
            })
            .catch(console.error);
          Swal.fire({
            title: "Opps....",
            text: "JAQUE MATE HAN GANADO LAS NEGRAS",
          });

        } else {
          if (aviso_jaque === false) {
            aviso_jaque = true;

            getGameDbRef()
              .update({
                jaquereyblanco: jaquereyblanco,
              })
              .catch(console.error);

            Swal.fire({
              title: "Opps....",
              text: "JAQUE",
            });
          }
        }
      } else {
        jaquereynegro = "Si";
        posicionreynegro = x + "," + y;


        const combo_brute_jaque_desde = serverGameData?.jaquedesde;
        const combo_jaque_desde = combo_brute_jaque_desde.split(",");
        const lastBX = parseInt(combo_jaque_desde[0]);
        const lastBY = parseInt(combo_jaque_desde[1]);

        //sino se puede mover el rey
        //la pieza que hace jaque nadie se la puede comer
        //y no hay pieza que pueda tapar el jaque es MATE
        //si el rey puede comer y quedar sin jaque
        if ((moverelreynegro(parseInt(x), parseInt(y)) === false &&
          checkTileUnderAttackNO_KING(lastBX, lastBY, BLACK, true) === false &&
          checkblockmate(x, y, BLACK) === false &&
          checkKINGRESOLVEMATE(parseInt(x), parseInt(y), BLACK) === false)
        ) {

          getGameDbRef()
            .update({
              status: "white wins",
              board,
            })
            .catch(console.error);
          Swal.fire({
            title: "Opps....",
            text: "JAQUE MATE HAN GANADO LAS BLANCAS",
          });

        } else {
          if (aviso_jaque === false) {
            aviso_jaque = true;

            getGameDbRef()
              .update({
                jaquereynegro: jaquereynegro,
              })
              .catch(console.error);

            Swal.fire({
              title: "Opps....",
              text: "JAQUE",
            });
          }
        }
      }
    }
    return true;
  } else {
    //vaciamos el arreglo
    casillasenpeligro = [];
    return false;
  }
}

function checkPossiblePlaysPawnJUSTCHECK(curX, curY) {
  let direction;

  if (currentTeamJUSTCHECK === WHITE) direction = -1;
  else direction = 1;

  if (curY + direction < 0 || curY + direction > BOARD_HEIGHT - 1) return;

  // Advance one tile
  checkPossibleMoveJUSTCHECK(curX, curY + direction);

  // Check diagonal left capture
  if (curX - 1 >= 0) {
    if (board.tiles[curY + direction][curX - 1].pieceType !== ELEFANTE) {
      if (board.tiles[curY + direction][curX - 1].pieceType !== LEON) {
        checkPossibleCaptureJUSTCHECK(curX - 1, curY + direction);
      }
    }
  }

  // Check diagonal right capture
  if (curX + 1 <= BOARD_WIDTH - 1) {
    if (board.tiles[curY + direction][curX + 1].pieceType !== ELEFANTE) {
      if (board.tiles[curY + direction][curX + 1].pieceType !== LEON) {
        checkPossibleCaptureJUSTCHECK(curX + 1, curY + direction);
      }
    }
  }
}

function checkPossiblePlaysConejoJUSTCHECK(curX, curY) {
  let direction;

  if (currentTeamJUSTCHECK === WHITE) direction = -1;
  else direction = 1;

  if (curY + direction < 0 || curY + direction > BOARD_HEIGHT - 1) return;

  // Advance one tile
  checkPossibleMoveJUSTCHECK(curX, curY + direction);

  // Advance two tile
  //si es un PAWN si se puede saltar Y COMER SI NO SOLO AVANZA
  if (board.tiles[curY + 1 * direction][curX].pieceType === EMPTY) {
    //vemos que no se salga del tablero
    if (curY + 2 * direction < BOARD_HEIGHT && curY + 2 * direction >= 0) {
      checkPossibleMoveJUSTCHECK(curX, curY + 2 * direction);
    }
  } else {
    if (
      board.tiles[curY + 1 * direction][curX].pieceType === PAWN &&
      board.tiles[curY + 1 * direction][curX].team !== currentTeamJUSTCHECK
    ) {
      checkPossibleMoveJUSTCHECK(curX, curY + 2 * direction);
    }
  }

  // Check diagonal right capture
  if (curX + 1 <= BOARD_WIDTH - 1)
    checkPossibleMoveJUSTCHECK(curX + 1, curY + direction);
  // Check diagonal left capture
  if (curX - 1 >= 0) checkPossibleMoveJUSTCHECK(curX - 1, curY + direction);

  // Check diagonal left capture
  if (curX - 1 >= 0) {
    if (board.tiles[curY + direction][curX - 1].pieceType !== ELEFANTE) {
      checkPossibleCaptureJUSTCHECK(curX - 1, curY + direction);
    }
  }

  // Check diagonal right capture
  if (curX + 1 <= BOARD_WIDTH - 1) {
    if (board.tiles[curY + direction][curX + 1].pieceType !== ELEFANTE) {
      checkPossibleCaptureJUSTCHECK(curX + 1, curY + direction);
    }
  }
}

function checkPossiblePlaysArdillaJUSTCHECK(curX, curY) {
  let direction;

  if (currentTeamJUSTCHECK === WHITE) direction = -1;
  else direction = 1;

  if (curY + direction < 0 || curY + direction > BOARD_HEIGHT - 1) return;

  // Advance one tile
  checkPossibleMoveJUSTCHECK(curX, curY + direction);

  // Advance two tile
  //si es un PAWN O CONEJO si se puede saltar y comer sino no hacer nada
  if (
    curY + 1 * direction >= 0 &&
    curY + 1 * direction <= BOARD_HEIGHT - 1 &&
    curY + 2 * direction >= 0 &&
    curY + 2 * direction <= BOARD_HEIGHT - 1
  ) {
    if (board.tiles[curY + 1 * direction][curX].team !== currentTeamJUSTCHECK) {
      if (
        board.tiles[curY + 1 * direction][curX].pieceType === 0 ||
        board.tiles[curY + 1 * direction][curX].pieceType === CONEJO ||
        board.tiles[curY + 1 * direction][curX].pieceType === EMPTY
      ) {
        checkPossibleMoveJUSTCHECK(curX, curY + 2 * direction);
      }
    }
  }

  // Advance three tile
  //si es un PAWN O CONEJO si se puede saltar y comer sino no hacer nada
  if (
    curY + 1 * direction >= 0 &&
    curY + 1 * direction <= BOARD_HEIGHT - 1 &&
    curY + 2 * direction >= 0 &&
    curY + 2 * direction <= BOARD_HEIGHT - 1 &&
    curY + 3 * direction >= 0 &&
    curY + 3 * direction <= BOARD_HEIGHT - 1
  ) {
    if (
      board.tiles[curY + 1 * direction][curX].team !== currentTeamJUSTCHECK &&
      board.tiles[curY + 2 * direction][curX].team !== currentTeamJUSTCHECK
    ) {
      if (
        (board.tiles[curY + 1 * direction][curX].pieceType === EMPTY &&
          board.tiles[curY + 2 * direction][curX].pieceType === EMPTY) ||
        (board.tiles[curY + 1 * direction][curX].pieceType === PAWN &&
          board.tiles[curY + 2 * direction][curX].pieceType === PAWN) ||
        (board.tiles[curY + 1 * direction][curX].pieceType === CONEJO &&
          board.tiles[curY + 2 * direction][curX].pieceType === CONEJO) ||
        (board.tiles[curY + 1 * direction][curX].pieceType === PAWN &&
          board.tiles[curY + 2 * direction][curX].pieceType === CONEJO) ||
        (board.tiles[curY + 1 * direction][curX].pieceType === CONEJO &&
          board.tiles[curY + 2 * direction][curX].pieceType === PAWN) ||
        (board.tiles[curY + 1 * direction][curX].pieceType === PAWN &&
          board.tiles[curY + 2 * direction][curX].pieceType === EMPTY) ||
        (board.tiles[curY + 1 * direction][curX].pieceType === EMPTY &&
          board.tiles[curY + 2 * direction][curX].pieceType === PAWN) ||
        (board.tiles[curY + 1 * direction][curX].pieceType === CONEJO &&
          board.tiles[curY + 2 * direction][curX].pieceType === EMPTY) ||
        (board.tiles[curY + 1 * direction][curX].pieceType === EMPTY &&
          board.tiles[curY + 2 * direction][curX].pieceType === CONEJO)
      ) {
        checkPossibleMoveJUSTCHECK(curX, curY + 3 * direction);
      }
    }
  }
  // Advance Horizontal tile
  if (curX > 0) {
    checkPossibleMoveJUSTCHECK(curX - 1, curY);
  }
  if (curX < 8) {
    checkPossibleMoveJUSTCHECK(curX + 1, curY);
  }

  // Check diagonal right move
  if (curX + 1 <= BOARD_WIDTH - 1)
    checkPossibleMoveJUSTCHECK(curX + 1, curY + direction);
  // Check diagonal left move
  if (curX - 1 >= 0) checkPossibleMoveJUSTCHECK(curX - 1, curY + direction);

  // Check diagonal left capture
  if (curX - 1 >= 0) {
    if (board.tiles[curY + direction][curX - 1].pieceType !== ELEFANTE) {
      checkPossibleCaptureJUSTCHECK(curX - 1, curY + direction);
    }
  }

  // Check diagonal right capture
  if (curX + 1 <= BOARD_WIDTH - 1) {
    if (board.tiles[curY + direction][curX + 1].pieceType !== ELEFANTE) {
      checkPossibleCaptureJUSTCHECK(curX + 1, curY + direction);
    }
  }
}

function checkPossiblePlaysPerroJUSTCHECK(curX, curY) {
  let direction;

  if (currentTeamJUSTCHECK === WHITE) direction = -1;
  else direction = 1;

  if (curY + direction < 0 || curY + direction > BOARD_HEIGHT - 1) return;

  // Advance one tile
  checkPossibleMoveJUSTCHECK(curX, curY + direction);
  checkPossibleCaptureJUSTCHECK(curX, curY + direction);


  if (
    curY + 2 * direction > 0 &&
    curY + 2 * direction > 0 &&
    curY + 2 * direction <= BOARD_HEIGHT - 1 &&
    board.tiles[curY + 1 * direction][curX].pieceType === EMPTY
  ) {
    // Advance two tile
    checkPossibleMoveJUSTCHECK(curX, curY + 2 * direction);
    checkPossibleCaptureJUSTCHECK(curX, curY + 2 * direction);
  }

  // Advance Horizontal tile
  if (curX > 0) {
    checkPossibleMoveJUSTCHECK(curX - 1, curY);
  }
  if (curX > 1 && board.tiles[curY][curX - 1].pieceType === EMPTY) {
    checkPossibleMoveJUSTCHECK(curX - 2, curY);
  }
  if (curX < 8) {
    checkPossibleMoveJUSTCHECK(curX + 1, curY);
  }
  if (curX < 7 && board.tiles[curY][curX + 1].pieceType === EMPTY) {
    checkPossibleMoveJUSTCHECK(curX + 2, curY);
  }

  // Check diagonal right movimiento
  if (curX + 1 <= BOARD_WIDTH - 1) {
    checkPossibleMoveJUSTCHECK(curX + 1, curY + direction);
  }
  if (
    curX + 2 <= BOARD_WIDTH - 1 &&
    board.tiles[curY + direction][curX + 1].pieceType === EMPTY
  ) {
    checkPossibleMoveJUSTCHECK(curX + 2, curY + 2 * direction);
  }

  // Check diagonal left movimiento
  if (curX - 1 >= 0) {
    checkPossibleMoveJUSTCHECK(curX - 1, curY + direction);
  }
  if (
    curX - 2 >= 0 &&
    board.tiles[curY + direction][curX - 1].pieceType === EMPTY
  ) {
    checkPossibleMoveJUSTCHECK(curX - 2, curY + 2 * direction);
  }

  // Check diagonal left capture
  if (curX - 1 >= 0) {
    checkPossibleCaptureJUSTCHECK(curX - 1, curY + direction);
  }
  if (
    curX - 2 >= 0 &&
    curY + 2 * direction > 0 &&
    curY + 2 * direction <= BOARD_HEIGHT - 1 &&
    board.tiles[curY + 1 * direction][curX - 1].pieceType === EMPTY
  ) {
    checkPossibleCaptureJUSTCHECK(curX - 2, curY + 2 * direction);
  }

  // Check diagonal right capture
  if (curX + 1 <= BOARD_WIDTH - 1) {
    checkPossibleCaptureJUSTCHECK(curX + 1, curY + direction);
  }
  if (
    curX + 2 <= BOARD_WIDTH - 1 &&
    curY + 2 * direction > 0 &&
    curY + 2 * direction <= BOARD_HEIGHT - 1 &&
    board.tiles[curY + 1 * direction][curX + 1].pieceType === EMPTY
  ) {
    checkPossibleCaptureJUSTCHECK(curX + 2, curY + 2 * direction);
  }
  //movimiento hacia atras 1 casilla
  // Lower move
  if (curY - 1 * direction >= 0 && curY - 1 * direction <= BOARD_HEIGHT - 1) {
    checkPossibleMoveJUSTCHECK(curX, curY - 1 * direction);
  }
  //movimiento hacia atras 2 casillas
  if (curY - 2 * direction >= 0 && curY - 2 * direction <= BOARD_HEIGHT - 1) {
    if (board.tiles[curY - 1 * direction][curX].team === EMPTY) {
      checkPossibleMoveJUSTCHECK(curX, curY - 2 * direction);
    }
  }
}

function checkPossiblePlaysKnightJUSTCHECK(curX, curY) {
  // Far left moves
  if (curX - 2 >= 0) {
    // Upper move
    if (curY - 1 >= 0) checkPossiblePlayJUSTCHECK(curX - 2, curY - 1);

    // Lower move
    if (curY + 1 <= BOARD_HEIGHT - 1)
      checkPossiblePlayJUSTCHECK(curX - 2, curY + 1);
  }

  // Near left moves
  if (curX - 1 >= 0) {
    // Upper move
    if (curY - 2 >= 0) checkPossiblePlayJUSTCHECK(curX - 1, curY - 2);

    // Lower move
    if (curY + 2 <= BOARD_HEIGHT - 1)
      checkPossiblePlayJUSTCHECK(curX - 1, curY + 2);
  }

  // Near right moves
  if (curX + 1 <= BOARD_WIDTH - 1) {
    // Upper move
    if (curY - 2 >= 0) checkPossiblePlayJUSTCHECK(curX + 1, curY - 2);

    // Lower move
    if (curY + 2 <= BOARD_HEIGHT - 1)
      checkPossiblePlayJUSTCHECK(curX + 1, curY + 2);
  }

  // Far right moves
  if (curX + 2 <= BOARD_WIDTH - 1) {
    // Upper move
    if (curY - 1 >= 0) checkPossiblePlayJUSTCHECK(curX + 2, curY - 1);

    // Lower move
    if (curY + 1 <= BOARD_HEIGHT - 1)
      checkPossiblePlayJUSTCHECK(curX + 2, curY + 1);
  }
}

function checkPossiblePlaysPanteraJUSTCHECK(curX, curY) {
  // Far left moves
  if (curX - 3 >= 0) {
    // Upper move
    if (curY - 1 >= 0) checkPossiblePlayJUSTCHECK(curX - 3, curY - 1);

    // Lower move
    if (curY + 1 <= BOARD_HEIGHT - 1)
      checkPossiblePlayJUSTCHECK(curX - 3, curY + 1);
  }

  // Far left moves
  if (curX - 2 >= 0) {
    // Upper move
    if (curY - 1 >= 0) checkPossiblePlayJUSTCHECK(curX - 2, curY - 1);

    // Lower move
    if (curY + 1 <= BOARD_HEIGHT - 1)
      checkPossiblePlayJUSTCHECK(curX - 2, curY + 1);
  }

  // Near left moves
  if (curX - 1 >= 0) {
    // Upper move
    if (curY - 2 >= 0) checkPossiblePlayJUSTCHECK(curX - 1, curY - 2);
    if (curY - 3 >= 0) checkPossiblePlayJUSTCHECK(curX - 1, curY - 3);

    // Lower move
    if (curY + 2 <= BOARD_HEIGHT - 1)
      checkPossiblePlayJUSTCHECK(curX - 1, curY + 2);
    if (curY + 3 <= BOARD_HEIGHT - 1)
      checkPossiblePlayJUSTCHECK(curX - 1, curY + 3);
  }

  // Near right moves
  if (curX + 1 <= BOARD_WIDTH - 1) {
    // Upper move
    if (curY - 2 >= 0) checkPossiblePlayJUSTCHECK(curX + 1, curY - 2);
    if (curY - 3 >= 0) checkPossiblePlayJUSTCHECK(curX + 1, curY - 3);

    // Lower move
    if (curY + 2 <= BOARD_HEIGHT - 1)
      checkPossiblePlayJUSTCHECK(curX + 1, curY + 2);
    if (curY + 3 <= BOARD_HEIGHT - 1)
      checkPossiblePlayJUSTCHECK(curX + 1, curY + 3);
  }

  // Far right moves
  if (curX + 2 <= BOARD_WIDTH - 1) {
    // Upper move
    if (curY - 1 >= 0) checkPossiblePlayJUSTCHECK(curX + 2, curY - 1);

    // Lower move
    if (curY + 1 <= BOARD_HEIGHT - 1)
      checkPossiblePlayJUSTCHECK(curX + 2, curY + 1);
  }

  if (curX + 3 <= BOARD_WIDTH - 1) {
    // Upper move
    if (curY - 1 >= 0) checkPossiblePlayJUSTCHECK(curX + 3, curY - 1);

    // Lower move
    if (curY + 1 <= BOARD_HEIGHT - 1)
      checkPossiblePlayJUSTCHECK(curX + 3, curY + 1);
  }
}

function checkPossiblePlaysRookJUSTCHECK(curX, curY) {
  // Upper move
  for (let i = 1; curY - i >= 0; i++) {
    if (checkPossiblePlayJUSTCHECK(curX, curY - i)) break;
  }

  // Right move
  for (let i = 1; curX + i <= BOARD_WIDTH - 1; i++) {
    if (checkPossiblePlayJUSTCHECK(curX + i, curY)) break;
  }

  // Lower move
  for (let i = 1; curY + i <= BOARD_HEIGHT - 1; i++) {
    if (checkPossiblePlayJUSTCHECK(curX, curY + i)) break;
  }

  // Left move
  for (let i = 1; curX - i >= 0; i++) {
    if (checkPossiblePlayJUSTCHECK(curX - i, curY)) break;
  }
}

function checkPossiblePlaysBishopJUSTCHECK(curX, curY) {
  // Upper-right move
  for (let i = 1; curX + i <= BOARD_WIDTH - 1 && curY - i >= 0; i++) {
    if (checkPossiblePlayJUSTCHECK(curX + i, curY - i)) break;
  }

  // Lower-right move
  for (
    let i = 1;
    curX + i <= BOARD_WIDTH - 1 && curY + i <= BOARD_HEIGHT - 1;
    i++
  ) {
    if (checkPossiblePlayJUSTCHECK(curX + i, curY + i)) break;
  }

  // Lower-left move
  for (let i = 1; curX - i >= 0 && curY + i <= BOARD_HEIGHT - 1; i++) {
    if (checkPossiblePlayJUSTCHECK(curX - i, curY + i)) break;
  }

  // Upper-left move
  for (let i = 1; curX - i >= 0 && curY - i >= 0; i++) {
    if (checkPossiblePlayJUSTCHECK(curX - i, curY - i)) break;
  }
}

function checkPossiblePlaysElefanteJUSTCHECK(curX, curY) {
  // Diagonal abajo a la derecha
  for (let i = 1; curX + i <= BOARD_WIDTH - 1 && curY - i >= 0 && i <= 2; i++) {
    if (curX + i <= BOARD_WIDTH - 1 && curY - i >= 0) {
      if (board.tiles[curY - 1][curX + 1].team !== currentTeamJUSTCHECK) {
        checkPossiblePlayJUSTCHECK(curX + i, curY - i);
      }
    }
  }

  // Diagonal arriba derecha
  for (
    let i = 1;
    curX + i <= BOARD_WIDTH - 1 && curY + i <= BOARD_HEIGHT - 1 && i <= 2;
    i++
  ) {
    if (curX + i <= BOARD_WIDTH - 1 && curY + i <= BOARD_HEIGHT - 1) {
      if (board.tiles[curY + 1][curX + 1].team !== currentTeamJUSTCHECK) {
        checkPossiblePlayJUSTCHECK(curX + i, curY + i);
      }
    }
  }

  // derecha
  for (let i = 1; curX + i <= BOARD_WIDTH - 1 && i <= 2; i++) {
    if (curX + i <= BOARD_WIDTH - 1) {
      if (board.tiles[curY][curX + 1].team !== currentTeamJUSTCHECK) {
        checkPossiblePlayJUSTCHECK(curX + i, curY);
      }
    }
  }

  // diagonal arriba izquierda
  for (
    let i = 1;
    curX - i >= 0 && curY + i <= BOARD_HEIGHT - 1 && i <= 2;
    i++
  ) {
    if (curX - i >= 0 && curY + i <= BOARD_HEIGHT - 1) {
      if (board.tiles[curY + 1][curX - 1].team !== currentTeamJUSTCHECK) {
        checkPossiblePlayJUSTCHECK(curX - i, curY + i);
      }
    }
  }

  // diagonal abajo izquierda
  for (let i = 1; curX - i >= 0 && curY - i >= 0 && i <= 2; i++) {
    if (curX - i >= 0 && curY - i >= 0) {
      if (board.tiles[curY - 1][curX - 1].team !== currentTeamJUSTCHECK) {
        checkPossiblePlayJUSTCHECK(curX - i, curY - i);
      }
    }
  }

  // izquierda
  for (let i = 1; curX - i >= 0 && i <= 2; i++) {
    if (curX - i >= 0) {
      if (board.tiles[curY][curX - 1].team !== currentTeamJUSTCHECK) {
        checkPossiblePlayJUSTCHECK(curX - i, curY);
      }
    }
  }

  // abajo
  for (let i = 1; curY - i >= 0 && i <= 2; i++) {
    if (curY - i >= 0) {
      if (board.tiles[curY - 1][curX].team !== currentTeamJUSTCHECK) {
        checkPossiblePlayJUSTCHECK(curX, curY - i);
      }
    }
  }

  // Arriba
  for (let i = 1; curY + i <= BOARD_HEIGHT - 1 && i <= 2; i++) {
    if (curY + i <= BOARD_HEIGHT - 1) {
      if (board.tiles[curY + 1][curX].team !== currentTeamJUSTCHECK) {
        checkPossiblePlayJUSTCHECK(curX, curY + i);
      }
    }
  }
}

function checkPossiblePlaysLeonJUSTCHECK(curX, curY) {
  // Upper-right move
  for (let i = 1; curX + i <= BOARD_WIDTH - 1 && curY - i >= 0 && i <= 2; i++) {
    if (checkPossiblePlayJUSTCHECK(curX + i, curY - i)) break;
  }

  // Lower-right move
  for (
    let i = 1;
    curX + i <= BOARD_WIDTH - 1 && curY + i <= BOARD_HEIGHT - 1 && i <= 2;
    i++
  ) {
    if (checkPossiblePlayJUSTCHECK(curX + i, curY + i)) break;
  }

  // Lower-left move
  for (
    let i = 1;
    curX - i >= 0 && curY + i <= BOARD_HEIGHT - 1 && i <= 2;
    i++
  ) {
    if (checkPossiblePlayJUSTCHECK(curX - i, curY + i)) break;
  }

  // Upper-left move
  for (let i = 1; curX - i >= 0 && curY - i >= 0 && i <= 2; i++) {
    if (checkPossiblePlayJUSTCHECK(curX - i, curY - i)) break;
  }

  // Upper move
  for (let i = 1; curY - i >= 0 && i <= 3; i++) {
    if (checkPossiblePlayJUSTCHECK(curX, curY - i)) break;
  }

  // Right move
  for (let i = 1; curX + i <= BOARD_WIDTH - 1 && i <= 3; i++) {
    if (checkPossiblePlayJUSTCHECK(curX + i, curY)) break;
  }

  // Lower move
  for (let i = 1; curY + i <= BOARD_HEIGHT - 1 && i <= 3; i++) {
    if (checkPossiblePlayJUSTCHECK(curX, curY + i)) break;
  }

  // Left move
  for (let i = 1; curX - i >= 0 && i <= 3; i++) {
    if (checkPossiblePlayJUSTCHECK(curX - i, curY)) break;
  }
}

function checkPossiblePlaysQueenJUSTCHECK(curX, curY) {
  checkPossiblePlaysBishopJUSTCHECK(curX, curY);
  checkPossiblePlaysRookJUSTCHECK(curX, curY);
}

function checkPossiblePlaysKingJUSTCHECK(curX, curY) {
  for (let i = -1; i <= 1; i++) {
    if (curY + i < 0 || curY + i > BOARD_HEIGHT - 1) continue;

    for (let j = -1; j <= 1; j++) {
      if (curX + j < 0 || curX + j > BOARD_WIDTH - 1) continue;
      if (i === 0 && j === 0) continue;

      checkPossiblePlayJUSTCHECK(curX + j, curY + i);
    }
  }
}

function checkPossiblePlayJUSTCHECK(x, y) {
  if (checkPossibleCaptureJUSTCHECK(x, y)) {
    return true;
  }
  return !checkPossibleMoveJUSTCHECK(x, y);
}

function checkPossibleMoveJUSTCHECK(x, y) {
  if (board.tiles[y][x].team !== EMPTY) return false;
  casillasenpeligro.push(x + "/" + y);
  return true;
}

function checkPossibleCaptureJUSTCHECK(x, y) {
  if (board.tiles[y][x].team !== getOppositeTeam(currentTeamJUSTCHECK))
    return false;
  casillasenpeligro.push(x + "/" + y);
  return true;
}

function moverelreynegro(x, y) {
  //vemos si se puede movar a lugares vacios o con piezas enemigas dentro del rango de movimiento del rey

  //movemos al rey ala izq
  if (x - 1 <= BOARD_WIDTH - 1 && x - 1 >= 0) {
    if (
      board.tiles[y][x - 1].pieceType === EMPTY &&
      checkTileUnderAttack(x - 1, y, WHITE, true) === false
    ) {
      //console.log("true");
      return true;
    }
  }
  //movemos al rey ala der
  if (x + 1 <= BOARD_WIDTH - 1 && x + 1 >= 0) {
    if (
      board.tiles[y][x + 1].pieceType === EMPTY &&
      checkTileUnderAttack(x + 1, y, WHITE, true) === false
    ) {
      //console.log("true");
      return true;
    }
  }

  //movemos al rey arriba
  if (y - 1 <= BOARD_HEIGHT - 1 && y - 1 >= 0) {
    if (
      board.tiles[y - 1][x].pieceType === EMPTY &&
      checkTileUnderAttack(x, y - 1, WHITE, true) === false
    ) {
      //console.log("true");
      return true;
    }
  }

  //movemos al rey abajo
  if (y + 1 <= BOARD_HEIGHT - 1 && y + 1 >= 0) {
    if (
      board.tiles[y + 1][x].pieceType === EMPTY &&
      checkTileUnderAttack(x, y + 1, WHITE, true) === false
    ) {
      //console.log("true");
      return true;
    }
  }

  //movemos al rey diag izq arriba
  if (
    x - 1 <= BOARD_WIDTH - 1 &&
    x - 1 >= 0 &&
    y - 1 <= BOARD_HEIGHT - 1 &&
    y - 1 >= 0
  ) {
    if (
      board.tiles[y - 1][x - 1].pieceType === EMPTY &&
      checkTileUnderAttack(x - 1, y - 1, WHITE, true) === false
    ) {
      //console.log("true");
      return true;
    }
  }
  //movemos al rey ala der arriba
  if (
    x + 1 <= BOARD_WIDTH - 1 &&
    x + 1 >= 0 &&
    y - 1 <= BOARD_HEIGHT - 1 &&
    y - 1 >= 0
  ) {
    if (
      board.tiles[y - 1][x + 1].pieceType === EMPTY &&
      checkTileUnderAttack(x + 1, y - 1, WHITE, true) === false
    ) {
      //console.log("true");
      return true;
    }
  }
  //movemos al rey diag izq abajo
  if (
    x - 1 <= BOARD_WIDTH - 1 &&
    x - 1 >= 0 &&
    y + 1 <= BOARD_HEIGHT - 1 &&
    y + 1 >= 0
  ) {
    if (
      board.tiles[y + 1][x - 1].pieceType === EMPTY &&
      checkTileUnderAttack(x - 1, y + 1, WHITE, true) === false
    ) {
      //console.log("true");
      return true;
    }
  }

  //movemos al rey diag der abajo
  if (
    x + 1 <= BOARD_WIDTH - 1 &&
    x + 1 >= 0 &&
    y + 1 <= BOARD_HEIGHT - 1 &&
    y + 1 >= 0
  ) {
    if (
      board.tiles[y + 1][x + 1].pieceType === EMPTY &&
      checkTileUnderAttack(x + 1, y + 1, WHITE, true) === false
    ) {
      //console.log("true");
      return true;
    }
  }

  //console.log("false");

  return false;
}

function moverelreyblanco(x, y) {
  //vemos si se puede movar a lugares vacios o con piezas enemigas dentro del rango de movimiento del rey

  //movemos al rey ala izq
  if (x - 1 <= BOARD_WIDTH - 1 && x - 1 >= 0) {
    if (
      board.tiles[y][x - 1].pieceType === EMPTY &&
      checkTileUnderAttack(x - 1, y, BLACK, true) === false
    ) {
      //console.log("true");
      return true;
    }
  }
  //movemos al rey ala der
  if (x + 1 <= BOARD_WIDTH - 1 && x + 1 >= 0) {
    if (
      board.tiles[y][x + 1].pieceType === EMPTY &&
      checkTileUnderAttack(x + 1, y, BLACK, true) === false
    ) {
      //console.log("true");
      return true;
    }
  }

  //movemos al rey arriba
  if (y - 1 <= BOARD_HEIGHT - 1 && y - 1 >= 0) {
    if (
      board.tiles[y - 1][x].pieceType === EMPTY &&
      checkTileUnderAttack(x, y - 1, BLACK, true) === false
    ) {
      //console.log("true");
      return true;
    }
  }

  //movemos al rey abajo
  if (y + 1 <= BOARD_HEIGHT - 1 && y + 1 >= 0) {
    if (
      board.tiles[y + 1][x].pieceType === EMPTY &&
      checkTileUnderAttack(x, y + 1, BLACK, true) === false
    ) {
      //console.log("true");
      return true;
    }
  }

  //movemos al rey diag izq arriba
  if (
    x - 1 <= BOARD_WIDTH - 1 &&
    x - 1 >= 0 &&
    y - 1 <= BOARD_HEIGHT - 1 &&
    y - 1 >= 0
  ) {
    if (
      board.tiles[y - 1][x - 1].pieceType === EMPTY &&
      checkTileUnderAttack(x - 1, y - 1, BLACK, true) === false
    ) {
      //console.log("true");
      return true;
    }
  }
  //movemos al rey ala der arriba
  if (
    x + 1 <= BOARD_WIDTH - 1 &&
    x + 1 >= 0 &&
    y - 1 <= BOARD_HEIGHT - 1 &&
    y - 1 >= 0
  ) {
    if (
      board.tiles[y - 1][x + 1].pieceType === EMPTY &&
      checkTileUnderAttack(x + 1, y - 1, BLACK, true) === false
    ) {
      //console.log("true");
      return true;
    }
  }
  //movemos al rey diag izq abajo
  if (
    x - 1 <= BOARD_WIDTH - 1 &&
    x - 1 >= 0 &&
    y + 1 <= BOARD_HEIGHT - 1 &&
    y + 1 >= 0
  ) {
    if (
      board.tiles[y + 1][x - 1].pieceType === EMPTY &&
      checkTileUnderAttack(x - 1, y + 1, BLACK, true) === false
    ) {
      //console.log("true");
      return true;
    }
  }

  //movemos al rey diag der abajo
  if (
    x + 1 <= BOARD_WIDTH - 1 &&
    x + 1 >= 0 &&
    y + 1 <= BOARD_HEIGHT - 1 &&
    y + 1 >= 0
  ) {
    if (
      board.tiles[y + 1][x + 1].pieceType === EMPTY &&
      checkTileUnderAttack(x + 1, y + 1, BLACK, true) === false
    ) {
      //console.log("true");
      return true;
    }
  }

  return false;
}

async function leer_comer_al_paso() {
  await getGameDbRef()
    .child("comeralpaso")
    .get()
    .then((snapshot) => {
      comeralpaso = snapshot.val();
    })
    .catch((error) => {
      console.error(error);
    });
}
async function leer_comer_al_paso_conejo() {
  await getGameDbRef()
    .child("comeralpasoconejo")
    .get()
    .then((snapshot) => {
      comeralpasoconejo = snapshot.val();
    })
    .catch((error) => {
      console.error(error);
    });
}
async function leer_comer_al_paso_ardilla() {
  await getGameDbRef()
    .child("comeralpasoardilla")
    .get()
    .then((snapshot) => {
      comeralpasoardilla = snapshot.val();
    })
    .catch((error) => {
      console.error(error);
    });
}
async function leer_comer_al_paso_ardilla_tres() {
  await getGameDbRef()
    .child("comeralpasoardillatres")
    .get()
    .then((snapshot) => {
      comeralpasoardillatres = snapshot.val();
    })
    .catch((error) => {
      console.error(error);
    });
}

async function marcaleonblanco(val) {
  await getGameDbRef()
    .update({
      leoncoronadoblancocomible: val,
    })
    .catch(console.error);
}

async function marcaleonnegro(val) {
  await getGameDbRef()
    .update({
      leoncoronadonegrocomible: val,
    })
    .catch(console.error);
}
async function leer_leoncoronadoblancocomible() {
  await getGameDbRef()
    .child("leoncoronadoblancocomible")
    .get()
    .then((snapshot) => {
      leoncoronadoblancocomible = snapshot.val();
    })
    .catch((error) => {
      console.error(error);
    });
}
async function leer_leoncoronadonegrocomible() {
  await getGameDbRef()
    .child("leoncoronadonegrocomible")
    .get()
    .then((snapshot) => {
      leoncoronadonegrocomible = snapshot.val();
    })
    .catch((error) => {
      console.error(error);
    });
}

async function leer_posicionleonblanco() {
  await getGameDbRef()
    .child("posicionleonblanco")
    .get()
    .then((snapshot) => {
      posicionleonblanco = snapshot.val();
    })
    .catch((error) => {
      console.error(error);
    });
}

async function leer_posicionleonnegro() {
  await getGameDbRef()
    .child("posicionleonnegro")
    .get()
    .then((snapshot) => {
      posicionleonnegro = snapshot.val();
    })
    .catch((error) => {
      console.error(error);
    });
}

async function marcarposicionleonnegro(val) {
  await getGameDbRef()
    .update({
      posicionleonnegro: val,
    })
    .catch(console.error);
}
async function marcarposicionleonblanco(val) {
  await getGameDbRef()
    .update({
      posicionleonblanco: val,
    })
    .catch(console.error);
}

async function leer_act_numero_turno() {
  await getGameDbRef()
    .child("numero_turno")
    .get()
    .then((snapshot) => {
      numero_turno = snapshot.val();
      //1 turno son 2 jugadas
      var numero_turno_actual = parseInt(numero_turno / 2);
      if (numero_turno_actual === 0) {
        numero_turno_actual = 1;
      }
      document.getElementById("numero_turno").innerHTML = numero_turno_actual;
    })
    .catch((error) => {
      console.error(error);
    });
}

async function leer_act_bloque() {
  await getGameDbRef()
    .child("bloque")
    .get()
    .then((snapshot) => {
      bloque = snapshot.val();
      document.getElementById("bloque").innerHTML = bloque;
    })
    .catch((error) => {
      console.error(error);
    });
}
async function marca_bloque(val) {
  await getGameDbRef()
    .update({
      bloque: val,
    })
    .catch(console.error);
}

async function marca_jugada(val) {
  try {
    await getGameDbRef()
      .update({
        jugadasPorBloque: [...serverGameData?.jugadasPorBloque, val],
      })
      .catch(console.error);
  } catch (error) {
    await getGameDbRef()
      .update({
        jugadasPorBloque: [val],
      })
      .catch(console.error);
  }
}

async function reset_jugadas(val) {
  try {
    Object.keys(serverGameData?.jugadasPorBloque)?.forEach((_element) => {
      let element = parseInt(_element);
      switch (element) {
        case 0:
          document.getElementById("jugada1").style.backgroundColor = "white";
          break;
        case 1:
          document.getElementById("jugada2").style.backgroundColor = "white";
          break;
        case 2:
          document.getElementById("jugada3").style.backgroundColor = "white";
          break;
        case 3:
          document.getElementById("jugada4").style.backgroundColor = "white";
          break;
        case 4:
          document.getElementById("jugada5").style.backgroundColor = "white";
          break;
        case 5:
          document.getElementById("jugada6").style.backgroundColor = "white";
          break;
        case 6:
          document.getElementById("jugada7").style.backgroundColor = "white";
          break;
        case 7:
          document.getElementById("jugada8").style.backgroundColor = "white";
          break;
        case 8:
          document.getElementById("jugada9").style.backgroundColor = "white";
          break;
        default:
      }
    });
  } catch (error) { }

  await getGameDbRef()
    .update({
      jugadasPorBloque: [],
    })
    .catch(console.error);
}

async function leer_jaquereyblanco() {
  await getGameDbRef()
    .child("jaquereyblanco")
    .get()
    .then((snapshot) => {
      jaquereyblanco = snapshot.val();
    })
    .catch((error) => {
      console.error(error);
    });
}

async function leer_jaquereynegro() {
  await getGameDbRef()
    .child("jaquereynegro")
    .get()
    .then((snapshot) => {
      jaquereynegro = snapshot.val();
    })
    .catch((error) => {
      console.error(error);
    });
}

async function leer_ultimo_movimiento() {
  await getGameDbRef()
    .child("ultimo_movimiento")
    .get()
    .then((snapshot) => {
      ultimomovimiento = snapshot.val();
    })
    .catch((error) => {
      console.error(error);
    });
}
async function leer_whiteCasualitiesText() {
  await getGameDbRef()
    .child("whiteCasualitiesText")
    .get()
    .then((snapshot) => {
      whiteCasualitiesText = snapshot.val();
    })
    .catch((error) => {
      console.error(error);
    });
}
async function leer_blackCasualitiesText() {
  await getGameDbRef()
    .child("blackCasualitiesText")
    .get()
    .then((snapshot) => {
      blackCasualitiesText = snapshot.val();
    })
    .catch((error) => {
      console.error(error);
    });
}

async function leer_contadortorre1blanco() {
  await getGameDbRef()
    .child("contadortorre1blanco")
    .get()
    .then((snapshot) => {
      contadortorre1blanco = snapshot.val();
    })
    .catch((error) => {
      console.error(error);
    });
}
async function leer_contadortorre2blanco() {
  await getGameDbRef()
    .child("contadortorre2blanco")
    .get()
    .then((snapshot) => {
      contadortorre2blanco = snapshot.val();
    })
    .catch((error) => {
      console.error(error);
    });
}
async function leer_contadortorre1negro() {
  await getGameDbRef()
    .child("contadortorre1negro")
    .get()
    .then((snapshot) => {
      contadortorre1negro = snapshot.val();
    })
    .catch((error) => {
      console.error(error);
    });
}
async function leer_contadortorre2negro() {
  await getGameDbRef()
    .child("contadortorre2negro")
    .get()
    .then((snapshot) => {
      contadortorre2negro = snapshot.val();
    })
    .catch((error) => {
      console.error(error);
    });
}

async function leer_contadorreyblanco() {
  await getGameDbRef()
    .child("contadorreyblanco")
    .get()
    .then((snapshot) => {
      contadorreyblanco = snapshot.val();
    })
    .catch((error) => {
      console.error(error);
    });
}
async function leer_contadorreynegro() {
  await getGameDbRef()
    .child("contadorreynegro")
    .get()
    .then((snapshot) => {
      contadorreynegro = snapshot.val();
    })
    .catch((error) => {
      console.error(error);
    });
}
async function leer_posicionreynegro() {
  await getGameDbRef()
    .child("posicionreynegro")
    .get()
    .then((snapshot) => {
      posicionreynegro = snapshot.val();
    })
    .catch((error) => {
      console.error(error);
    });
}
async function leer_posicionreyblanco() {
  await getGameDbRef()
    .child("posicionreyblanco")
    .get()
    .then((snapshot) => {
      posicionreyblanco = snapshot.val();
    })
    .catch((error) => {
      console.error(error);
    });
}

function marcar_ultimo_movimiento(movnewX, movnewY, movoldX, movoldY) {
  var coordenadanew = "celda_y" + movnewY + "x" + movnewX;
  var celdanew = document.getElementById(coordenadanew);
  //celdanew.style.backgroundColor = HIGHLIGHT_COLOR;
  celdanew.style.setProperty('background-color', HIGHLIGHT_COLOR, 'important');

  var coordenadaold = "celda_y" + movoldY + "x" + movoldX;
  var celdaold = document.getElementById(coordenadaold);
  //celdaold.style.backgroundColor = HIGHLIGHT_COLOR;
  celdaold.style.setProperty('background-color', HIGHLIGHT_COLOR, 'important');


  /*drawTile(movnewX, movnewY, HIGHLIGHT_COLOR);*/
  /*drawTile(movoldX, movoldY, HIGHLIGHT_COLOR);*/
  //console.log("x:" + movoldX);
  /*
  if (movoldX === 0) {
    var letterold = 10 - movoldY;
    drawLetter(movoldX, movoldY, "black", letterold, .25);
  }
  if (movnewX === 0) {
    var letternew = 10 - movnewY;
    drawLetter(movnewX, movnewY, "black", letternew, .25);
  }
 
  if (movoldY === 9) {
    drawLetter(movoldX, movoldY, "black", ejeX[movoldX], .80);
  }
  if (movnewY === 9) {
    drawLetter(movnewX, movnewY, "black", ejeX[movnewX], .80);
  }
  */
}

function checkblockmate(xmirey, ymirey, miequipo) {
  //recorremos todo el tablero y llenamos el arreglo de bloquearjaquemate
  for (let xx = 0; xx <= 8; xx++) {
    for (let yy = 0; yy <= 9; yy++) {
      //vemos que la pieza sea mia
      if (board.tiles[yy][xx].team === miequipo) {
        currentTeamCHECKBLOCKMATE = miequipo;

        //casilla
        let tile = board.tiles[yy][xx];

        if (tile.pieceType === PAWN)
          checkPossiblePlaysPawnCHECKBLOCKMATE(xmirey, ymirey, xx, yy);
        else if (tile.pieceType === KNIGHT)
          checkPossiblePlaysKnightCHECKBLOCKMATE(xmirey, ymirey, xx, yy);
        else if (tile.pieceType === BISHOP)
          checkPossiblePlaysBishopCHECKBLOCKMATE(xmirey, ymirey, xx, yy);
        else if (tile.pieceType === ROOK)
          checkPossiblePlaysRookCHECKBLOCKMATE(xmirey, ymirey, xx, yy);
        else if (tile.pieceType === QUEEN)
          checkPossiblePlaysQueenCHECKBLOCKMATE(xmirey, ymirey, xx, yy);
        else if (tile.pieceType === ARDILLA)
          checkPossiblePlaysArdillaCHECKBLOCKMATE(xmirey, ymirey, xx, yy);
        else if (tile.pieceType === CONEJO)
          checkPossiblePlaysConejoCHECKBLOCKMATE(xmirey, ymirey, xx, yy);
        else if (tile.pieceType === PERRO)
          checkPossiblePlaysPerroCHECKBLOCKMATE(xmirey, ymirey, xx, yy);
        else if (tile.pieceType === PANTERA)
          checkPossiblePlaysPanteraCHECKBLOCKMATE(xmirey, ymirey, xx, yy);
        else if (tile.pieceType === ELEFANTE)
          checkPossiblePlaysElefanteCHECKBLOCKMATE(xmirey, ymirey, xx, yy);
        else if (tile.pieceType === LEON)
          checkPossiblePlaysLeonCHECKBLOCKMATE(xmirey, ymirey, xx, yy);
      }
    }
  }
  if (bloquearjaquemate.includes("si")) {
    //vaciamos el arreglo
    bloquearjaquemate = [];
    return true;
  } else {
    bloquearjaquemate = [];
    return false;
  }
}
function checkPossiblePlaysPawnCHECKBLOCKMATE(xrey, yrey, curX, curY) {
  let direction;
  if (currentTeamCHECKBLOCKMATE === WHITE) direction = -1;
  else direction = 1;
  if (curY + direction < 0 || curY + direction > BOARD_HEIGHT - 1) return;

  // Advance one tile
  checkPossibleMoveCHECKBLOCKMATE(xrey, yrey, curX, curY, curX, curY + direction, PAWN); //xrey,yrey,xold,yold,xnew,ynew,pieza
}

function checkPossiblePlaysKnightCHECKBLOCKMATE(xrey, yrey, curX, curY) {
  // Far left moves
  if (curX - 2 >= 0) {
    // Upper move
    if (curY - 1 >= 0) checkPossiblePlayCHECKBLOCKMATE(xrey, yrey, curX, curY, curX - 2, curY - 1, KNIGHT);

    // Lower move
    if (curY + 1 <= BOARD_HEIGHT - 1)
      checkPossiblePlayCHECKBLOCKMATE(xrey, yrey, curX, curY, curX - 2, curY + 1, KNIGHT);
  }

  // Near left moves
  if (curX - 1 >= 0) {
    // Upper move
    if (curY - 2 >= 0) checkPossiblePlayCHECKBLOCKMATE(xrey, yrey, curX, curY, curX - 1, curY - 2, KNIGHT);

    // Lower move
    if (curY + 2 <= BOARD_HEIGHT - 1)
      checkPossiblePlayCHECKBLOCKMATE(xrey, yrey, curX, curY, curX - 1, curY + 2, KNIGHT);
  }

  // Near right moves
  if (curX + 1 <= BOARD_WIDTH - 1) {
    // Upper move
    if (curY - 2 >= 0) checkPossiblePlayCHECKBLOCKMATE(xrey, yrey, curX, curY, curX + 1, curY - 2, KNIGHT);

    // Lower move
    if (curY + 2 <= BOARD_HEIGHT - 1)
      checkPossiblePlayCHECKBLOCKMATE(xrey, yrey, curX, curY, curX + 1, curY + 2, KNIGHT);
  }

  // Far right moves
  if (curX + 2 <= BOARD_WIDTH - 1) {
    // Upper move
    if (curY - 1 >= 0) checkPossiblePlayCHECKBLOCKMATE(xrey, yrey, curX, curY, curX + 2, curY - 1, KNIGHT);

    // Lower move
    if (curY + 1 <= BOARD_HEIGHT - 1)
      checkPossiblePlayCHECKBLOCKMATE(xrey, yrey, curX, curY, curX + 2, curY + 1, KNIGHT);
  }
}

function checkPossiblePlaysBishopCHECKBLOCKMATE(xrey, yrey, curX, curY) {
  // Upper-right move
  for (let i = 1; curX + i <= BOARD_WIDTH - 1 && curY - i >= 0; i++) {
    if (checkPossiblePlayCHECKBLOCKMATE(xrey, yrey, curX, curY, curX + i, curY - i, BISHOP)) break;
  }

  // Lower-right move
  for (
    let i = 1;
    curX + i <= BOARD_WIDTH - 1 && curY + i <= BOARD_HEIGHT - 1;
    i++
  ) {
    if (checkPossiblePlayCHECKBLOCKMATE(xrey, yrey, curX, curY, curX + i, curY + i, BISHOP)) break;
  }

  // Lower-left move
  for (let i = 1; curX - i >= 0 && curY + i <= BOARD_HEIGHT - 1; i++) {
    if (checkPossiblePlayCHECKBLOCKMATE(xrey, yrey, curX, curY, curX - i, curY + i, BISHOP)) break;
  }

  // Upper-left move
  for (let i = 1; curX - i >= 0 && curY - i >= 0; i++) {
    if (checkPossiblePlayCHECKBLOCKMATE(xrey, yrey, curX, curY, curX - i, curY - i, BISHOP)) break;
  }
}

function checkPossiblePlaysRookCHECKBLOCKMATE(xrey, yrey, curX, curY) {
  // Upper move
  for (let i = 1; curY - i >= 0; i++) {
    if (checkPossiblePlayCHECKBLOCKMATE(xrey, yrey, curX, curY, curX, curY - i, ROOK)) break;
  }

  // Right move
  for (let i = 1; curX + i <= BOARD_WIDTH - 1; i++) {
    if (checkPossiblePlayCHECKBLOCKMATE(xrey, yrey, curX, curY, curX + i, curY, ROOK)) break;
  }

  // Lower move
  for (let i = 1; curY + i <= BOARD_HEIGHT - 1; i++) {
    if (checkPossiblePlayCHECKBLOCKMATE(xrey, yrey, curX, curY, curX, curY + i, ROOK)) break;
  }

  // Left move
  for (let i = 1; curX - i >= 0; i++) {
    if (checkPossiblePlayCHECKBLOCKMATE(xrey, yrey, curX, curY, curX - i, curY, ROOK)) break;
  }
}

function checkPossiblePlaysQueenCHECKBLOCKMATE(xrey, yrey, curX, curY) {
  // Upper-right move
  for (let i = 1; curX + i <= BOARD_WIDTH - 1 && curY - i >= 0; i++) {
    if (checkPossiblePlayCHECKBLOCKMATE(xrey, yrey, curX, curY, curX + i, curY - i, QUEEN)) break;
  }

  // Lower-right move
  for (
    let i = 1;
    curX + i <= BOARD_WIDTH - 1 && curY + i <= BOARD_HEIGHT - 1;
    i++
  ) {
    if (checkPossiblePlayCHECKBLOCKMATE(xrey, yrey, curX, curY, curX + i, curY + i, QUEEN)) break;
  }

  // Lower-left move
  for (let i = 1; curX - i >= 0 && curY + i <= BOARD_HEIGHT - 1; i++) {
    if (checkPossiblePlayCHECKBLOCKMATE(xrey, yrey, curX, curY, curX - i, curY + i, QUEEN)) break;
  }

  // Upper-left move
  for (let i = 1; curX - i >= 0 && curY - i >= 0; i++) {
    if (checkPossiblePlayCHECKBLOCKMATE(xrey, yrey, curX, curY, curX - i, curY - i, QUEEN)) break;
  }

  // Upper move
  for (let i = 1; curY - i >= 0; i++) {
    if (checkPossiblePlayCHECKBLOCKMATE(xrey, yrey, curX, curY, curX, curY - i, QUEEN)) break;
  }

  // Right move
  for (let i = 1; curX + i <= BOARD_WIDTH - 1; i++) {
    if (checkPossiblePlayCHECKBLOCKMATE(xrey, yrey, curX, curY, curX + i, curY, QUEEN)) break;
  }

  // Lower move
  for (let i = 1; curY + i <= BOARD_HEIGHT - 1; i++) {
    if (checkPossiblePlayCHECKBLOCKMATE(xrey, yrey, curX, curY, curX, curY + i, QUEEN)) break;
  }

  // Left move
  for (let i = 1; curX - i >= 0; i++) {
    if (checkPossiblePlayCHECKBLOCKMATE(xrey, yrey, curX, curY, curX - i, curY, QUEEN)) break;

  }
}

function checkPossiblePlaysArdillaCHECKBLOCKMATE(xrey, yrey, curX, curY) {
  let direction;
  if (currentTeamCHECKBLOCKMATE === WHITE) direction = -1;
  else direction = 1;
  if (curY + direction < 0 || curY + direction > BOARD_HEIGHT - 1) return;

  // Advance one tile
  checkPossibleMoveCHECKBLOCKMATE(xrey, yrey, curX, curY, curX, curY + direction, ARDILLA);

  // Advance two tile
  //si es un PAWN O CONEJO si se puede saltar y comer sino no hacer nada
  if (
    curY + 1 * direction >= 0 &&
    curY + 1 * direction <= BOARD_HEIGHT - 1 &&
    curY + 2 * direction >= 0 &&
    curY + 2 * direction <= BOARD_HEIGHT - 1
  ) {
    if (board.tiles[curY + 1 * direction][curX].team !== currentTeamCHECKBLOCKMATE) {
      if (
        board.tiles[curY + 1 * direction][curX].pieceType === 0 ||
        board.tiles[curY + 1 * direction][curX].pieceType === CONEJO ||
        board.tiles[curY + 1 * direction][curX].pieceType === EMPTY
      ) {
        checkPossibleMoveCHECKBLOCKMATE(xrey, yrey, curX, curY, curX, curY + 2 * direction, ARDILLA);
      }
    }
  }

  // Advance three tile
  //si es un PAWN O CONEJO si se puede saltar y comer sino no hacer nada
  if (
    curY + 1 * direction >= 0 &&
    curY + 1 * direction <= BOARD_HEIGHT - 1 &&
    curY + 2 * direction >= 0 &&
    curY + 2 * direction <= BOARD_HEIGHT - 1 &&
    curY + 3 * direction >= 0 &&
    curY + 3 * direction <= BOARD_HEIGHT - 1
  ) {
    if (
      board.tiles[curY + 1 * direction][curX].team !== currentTeamCHECKBLOCKMATE &&
      board.tiles[curY + 2 * direction][curX].team !== currentTeamCHECKBLOCKMATE
    ) {
      if (
        (board.tiles[curY + 1 * direction][curX].pieceType === EMPTY &&
          board.tiles[curY + 2 * direction][curX].pieceType === EMPTY) ||
        (board.tiles[curY + 1 * direction][curX].pieceType === PAWN &&
          board.tiles[curY + 2 * direction][curX].pieceType === PAWN) ||
        (board.tiles[curY + 1 * direction][curX].pieceType === CONEJO &&
          board.tiles[curY + 2 * direction][curX].pieceType === CONEJO) ||
        (board.tiles[curY + 1 * direction][curX].pieceType === PAWN &&
          board.tiles[curY + 2 * direction][curX].pieceType === CONEJO) ||
        (board.tiles[curY + 1 * direction][curX].pieceType === CONEJO &&
          board.tiles[curY + 2 * direction][curX].pieceType === PAWN) ||
        (board.tiles[curY + 1 * direction][curX].pieceType === PAWN &&
          board.tiles[curY + 2 * direction][curX].pieceType === EMPTY) ||
        (board.tiles[curY + 1 * direction][curX].pieceType === EMPTY &&
          board.tiles[curY + 2 * direction][curX].pieceType === PAWN) ||
        (board.tiles[curY + 1 * direction][curX].pieceType === CONEJO &&
          board.tiles[curY + 2 * direction][curX].pieceType === EMPTY) ||
        (board.tiles[curY + 1 * direction][curX].pieceType === EMPTY &&
          board.tiles[curY + 2 * direction][curX].pieceType === CONEJO)
      ) {
        checkPossibleMoveCHECKBLOCKMATE(xrey, yrey, curX, curY, curX, curY + 3 * direction, ARDILLA);
      }
    }
  }
  // Advance Horizontal tile
  if (curX > 0) {
    checkPossibleMoveCHECKBLOCKMATE(xrey, yrey, curX, curY, curX - 1, curY, ARDILLA);
  }
  if (curX < 8) {
    checkPossibleMoveCHECKBLOCKMATE(xrey, yrey, curX, curY, curX + 1, curY, ARDILLA);
  }

  // Check diagonal right move
  if (curX + 1 <= BOARD_WIDTH - 1)
    checkPossibleMoveCHECKBLOCKMATE(xrey, yrey, curX, curY, curX + 1, curY + direction, ARDILLA);
  // Check diagonal left move
  if (curX - 1 >= 0)
    checkPossibleMoveCHECKBLOCKMATE(xrey, yrey, curX, curY, curX - 1, curY + direction, ARDILLA);
}

function checkPossiblePlaysConejoCHECKBLOCKMATE(xrey, yrey, curX, curY) {
  let direction;
  if (currentTeamCHECKBLOCKMATE === WHITE) direction = -1;
  else direction = 1;
  if (curY + direction < 0 || curY + direction > BOARD_HEIGHT - 1) return;

  // Advance one tile
  checkPossibleMoveCHECKBLOCKMATE(xrey, yrey, curX, curY, curX, curY + direction, CONEJO);

  // Advance two tile
  //si es un PAWN si se puede saltar Y COMER SI NO SOLO AVANZA
  if (board.tiles[curY + 1 * direction][curX].pieceType === EMPTY) {
    //vemos que no se salga del tablero
    if (curY + 2 * direction < BOARD_HEIGHT && curY + 2 * direction >= 0) {
      checkPossibleMoveCHECKBLOCKMATE(xrey, yrey, curX, curY, curX, curY + 2 * direction, CONEJO);
    }
  } else {
    if (
      board.tiles[curY + 1 * direction][curX].pieceType === PAWN &&
      board.tiles[curY + 1 * direction][curX].team !== currentTeamCHECKBLOCKMATE
    ) {
      checkPossibleMoveCHECKBLOCKMATE(xrey, yrey, curX, curY, curX, curY + 2 * direction, CONEJO);
    }
  }

  // Check diagonal right move
  if (curX + 1 <= BOARD_WIDTH - 1)
    checkPossibleMoveCHECKBLOCKMATE(xrey, yrey, curX, curY, curX + 1, curY + direction, CONEJO);
  // Check diagonal left move
  if (curX - 1 >= 0)
    checkPossibleMoveCHECKBLOCKMATE(xrey, yrey, curX, curY, curX - 1, curY + direction, CONEJO);


}

function checkPossiblePlaysPerroCHECKBLOCKMATE(xrey, yrey, curX, curY) {
  let direction;
  if (currentTeamCHECKBLOCKMATE === WHITE) direction = -1;
  else direction = 1;
  if (curY + direction < 0 || curY + direction > BOARD_HEIGHT - 1) return;

  // Advance one tile
  checkPossibleMoveCHECKBLOCKMATE(xrey, yrey, curX, curY, curX, curY + direction, PERRO);

  if (
    curY + 2 * direction > 0 &&
    curY + 2 * direction > 0 &&
    curY + 2 * direction <= BOARD_HEIGHT - 1 &&
    board.tiles[curY + 1 * direction][curX].pieceType === EMPTY
  ) {
    // Advance two tile
    checkPossibleMoveCHECKBLOCKMATE(xrey, yrey, curX, curY, curX, curY + 2 * direction, PERRO);

  }

  // Advance Horizontal tile
  if (curX > 0) {
    checkPossibleMoveCHECKBLOCKMATE(xrey, yrey, curX, curY, curX - 1, curY, PERRO);
  }
  if (curX > 1 && board.tiles[curY][curX - 1].pieceType === EMPTY) {
    checkPossibleMoveCHECKBLOCKMATE(xrey, yrey, curX, curY, curX - 2, curY, PERRO);
  }
  if (curX < 8) {
    checkPossibleMoveCHECKBLOCKMATE(xrey, yrey, curX, curY, curX + 1, curY, PERRO);
  }
  if (curX < 7 && board.tiles[curY][curX + 1].pieceType === EMPTY) {
    checkPossibleMoveCHECKBLOCKMATE(xrey, yrey, curX, curY, curX + 2, curY, PERRO);
  }

  // Check diagonal right movimiento
  if (curX + 1 <= BOARD_WIDTH - 1) {
    checkPossibleMoveCHECKBLOCKMATE(xrey, yrey, curX, curY, curX + 1, curY + direction, PERRO);
  }
  if (
    curX + 2 <= BOARD_WIDTH - 1 &&
    board.tiles[curY + direction][curX + 1].pieceType === EMPTY
  ) {
    checkPossibleMoveCHECKBLOCKMATE(xrey, yrey, curX, curY, curX + 2, curY + 2 * direction, PERRO);
  }

  // Check diagonal left movimiento
  if (curX - 1 >= 0) {
    checkPossibleMoveCHECKBLOCKMATE(xrey, yrey, curX, curY, curX - 1, curY + direction, PERRO);
  }
  if (
    curX - 2 >= 0 &&
    board.tiles[curY + direction][curX - 1].pieceType === EMPTY
  ) {
    checkPossibleMoveCHECKBLOCKMATE(xrey, yrey, curX, curY, curX - 2, curY + 2 * direction, PERRO);
  }

  //movimiento hacia atras 1 casilla
  // Lower move
  if (curY - 1 * direction >= 0 && curY - 1 * direction <= BOARD_HEIGHT - 1) {
    checkPossibleMoveCHECKBLOCKMATE(xrey, yrey, curX, curY, curX, curY - 1 * direction, PERRO);
  }
  //movimiento hacia atras 2 casillas
  if (curY - 2 * direction >= 0 && curY - 2 * direction <= BOARD_HEIGHT - 1) {
    if (board.tiles[curY - 1 * direction][curX].team === EMPTY) {
      checkPossibleMoveCHECKBLOCKMATE(xrey, yrey, curX, curY, curX, curY - 2 * direction, PERRO);
    }
  }
}

function checkPossiblePlaysPanteraCHECKBLOCKMATE(xrey, yrey, curX, curY) {
  // Far left moves
  if (curX - 3 >= 0) {
    // Upper move
    if (curY - 1 >= 0)
      checkPossiblePlayCHECKBLOCKMATE(xrey, yrey, curX, curY, curX - 3, curY - 1, PANTERA);
    // Lower move
    if (curY + 1 <= BOARD_HEIGHT - 1)
      checkPossiblePlayCHECKBLOCKMATE(xrey, yrey, curX, curY, curX - 3, curY + 1, PANTERA);
  }

  // Far left moves
  if (curX - 2 >= 0) {
    // Upper move
    if (curY - 1 >= 0)
      checkPossiblePlayCHECKBLOCKMATE(xrey, yrey, curX, curY, curX - 2, curY - 1, PANTERA);
    // Lower move
    if (curY + 1 <= BOARD_HEIGHT - 1)
      checkPossiblePlayCHECKBLOCKMATE(xrey, yrey, curX, curY, curX - 2, curY + 1, PANTERA);
  }

  // Near left moves
  if (curX - 1 >= 0) {
    // Upper move
    if (curY - 2 >= 0)
      checkPossiblePlayCHECKBLOCKMATE(xrey, yrey, curX, curY, curX - 1, curY - 2, PANTERA);
    if (curY - 3 >= 0)
      checkPossiblePlayCHECKBLOCKMATE(xrey, yrey, curX, curY, curX - 1, curY - 3, PANTERA);
    // Lower move
    if (curY + 2 <= BOARD_HEIGHT - 1)
      checkPossiblePlayCHECKBLOCKMATE(xrey, yrey, curX, curY, curX - 1, curY + 2, PANTERA);
    if (curY + 3 <= BOARD_HEIGHT - 1)
      checkPossiblePlayCHECKBLOCKMATE(xrey, yrey, curX, curY, curX - 1, curY + 3, PANTERA);
  }

  // Near right moves
  if (curX + 1 <= BOARD_WIDTH - 1) {
    // Upper move
    if (curY - 2 >= 0)
      checkPossiblePlayCHECKBLOCKMATE(xrey, yrey, curX, curY, curX + 1, curY - 2, PANTERA);
    if (curY - 3 >= 0)
      checkPossiblePlayCHECKBLOCKMATE(xrey, yrey, curX, curY, curX + 1, curY - 3, PANTERA);
    // Lower move
    if (curY + 2 <= BOARD_HEIGHT - 1)
      checkPossiblePlayCHECKBLOCKMATE(xrey, yrey, curX, curY, curX + 1, curY + 2, PANTERA);
    if (curY + 3 <= BOARD_HEIGHT - 1)
      checkPossiblePlayCHECKBLOCKMATE(xrey, yrey, curX, curY, curX + 1, curY + 3, PANTERA);
  }

  // Far right moves
  if (curX + 2 <= BOARD_WIDTH - 1) {
    // Upper move
    if (curY - 1 >= 0)
      checkPossiblePlayCHECKBLOCKMATE(xrey, yrey, curX, curY, curX + 2, curY - 1, PANTERA);
    // Lower move
    if (curY + 1 <= BOARD_HEIGHT - 1)
      checkPossiblePlayCHECKBLOCKMATE(xrey, yrey, curX, curY, curX + 2, curY + 1, PANTERA);
  }

  if (curX + 3 <= BOARD_WIDTH - 1) {
    // Upper move
    if (curY - 1 >= 0)
      checkPossiblePlayCHECKBLOCKMATE(xrey, yrey, curX, curY, curX + 3, curY - 1, PANTERA);
    // Lower move
    if (curY + 1 <= BOARD_HEIGHT - 1)
      checkPossiblePlayCHECKBLOCKMATE(xrey, yrey, curX, curY, curX + 3, curY + 1, PANTERA);
  }
}

function checkPossiblePlaysElefanteCHECKBLOCKMATE(xrey, yrey, curX, curY) {
  // Diagonal abajo a la derecha
  for (let i = 1; curX + i <= BOARD_WIDTH - 1 && curY - i >= 0 && i <= 2; i++) {
    if (curX + i <= BOARD_WIDTH - 1 && curY - i >= 0) {
      if (board.tiles[curY - 1][curX + 1].team !== currentTeamCHECKBLOCKMATE) {
        checkPossiblePlayCHECKBLOCKMATE(xrey, yrey, curX, curY, curX + i, curY - i, ELEFANTE);
      }
    }
  }

  // Diagonal arriba derecha
  for (
    let i = 1;
    curX + i <= BOARD_WIDTH - 1 && curY + i <= BOARD_HEIGHT - 1 && i <= 2;
    i++
  ) {
    if (curX + i <= BOARD_WIDTH - 1 && curY + i <= BOARD_HEIGHT - 1) {
      if (board.tiles[curY + 1][curX + 1].team !== currentTeamCHECKBLOCKMATE) {
        checkPossiblePlayCHECKBLOCKMATE(xrey, yrey, curX, curY, curX + i, curY + i, ELEFANTE);
      }
    }
  }

  // derecha
  for (let i = 1; curX + i <= BOARD_WIDTH - 1 && i <= 2; i++) {
    if (curX + i <= BOARD_WIDTH - 1) {
      if (board.tiles[curY][curX + 1].team !== currentTeamCHECKBLOCKMATE) {
        checkPossiblePlayCHECKBLOCKMATE(xrey, yrey, curX, curY, curX + i, curY, ELEFANTE);
      }
    }
  }

  // diagonal arriba izquierda
  for (
    let i = 1;
    curX - i >= 0 && curY + i <= BOARD_HEIGHT - 1 && i <= 2;
    i++
  ) {
    if (curX - i >= 0 && curY + i <= BOARD_HEIGHT - 1) {
      if (board.tiles[curY + 1][curX - 1].team !== currentTeamCHECKBLOCKMATE) {
        checkPossiblePlayCHECKBLOCKMATE(xrey, yrey, curX, curY, curX - i, curY + i, ELEFANTE);
      }
    }
  }

  // diagonal abajo izquierda
  for (let i = 1; curX - i >= 0 && curY - i >= 0 && i <= 2; i++) {
    if (curX - i >= 0 && curY - i >= 0) {
      if (board.tiles[curY - 1][curX - 1].team !== currentTeamCHECKBLOCKMATE) {
        checkPossiblePlayCHECKBLOCKMATE(xrey, yrey, curX, curY, curX - i, curY - i, ELEFANTE);
      }
    }
  }

  // izquierda
  for (let i = 1; curX - i >= 0 && i <= 2; i++) {
    if (curX - i >= 0) {
      if (board.tiles[curY][curX - 1].team !== currentTeamCHECKBLOCKMATE) {
        checkPossiblePlayCHECKBLOCKMATE(xrey, yrey, curX, curY, curX - i, curY, ELEFANTE);
      }
    }
  }

  // abajo
  for (let i = 1; curY - i >= 0 && i <= 2; i++) {
    if (curY - i >= 0) {
      if (board.tiles[curY - 1][curX].team !== currentTeamCHECKBLOCKMATE) {
        checkPossiblePlayCHECKBLOCKMATE(xrey, yrey, curX, curY, curX, curY - i, ELEFANTE);
      }
    }
  }

  // Arriba
  for (let i = 1; curY + i <= BOARD_HEIGHT - 1 && i <= 2; i++) {
    if (curY + i <= BOARD_HEIGHT - 1) {
      if (board.tiles[curY + 1][curX].team !== currentTeamCHECKBLOCKMATE) {
        checkPossiblePlayCHECKBLOCKMATE(xrey, yrey, curX, curY, curX, curY + i, ELEFANTE);
      }
    }
  }
}

function checkPossiblePlaysLeonCHECKBLOCKMATE(xrey, yrey, curX, curY) {
  // Upper-right move
  for (let i = 1; curX + i <= BOARD_WIDTH - 1 && curY - i >= 0 && i <= 2; i++) {
    if (checkPossiblePlayCHECKBLOCKMATE(xrey, yrey, curX, curY, curX + i, curY - i, LEON)) break;
  }

  // Lower-right move
  for (let i = 1; curX + i <= BOARD_WIDTH - 1 && curY + i <= BOARD_HEIGHT - 1 && i <= 2; i++) {
    if (checkPossiblePlayCHECKBLOCKMATE(xrey, yrey, curX, curY, curX + i, curY + i, LEON)) break;
  }

  // Lower-left move
  for (let i = 1; curX - i >= 0 && curY + i <= BOARD_HEIGHT - 1 && i <= 2; i++) {
    if (checkPossiblePlayCHECKBLOCKMATE(xrey, yrey, curX, curY, curX - i, curY + i, LEON)) break;
  }

  // Upper-left move
  for (let i = 1; curX - i >= 0 && curY - i >= 0 && i <= 2; i++) {
    if (checkPossiblePlayCHECKBLOCKMATE(xrey, yrey, curX, curY, curX - i, curY - i, LEON)) break;
  }

  // Upper move
  for (let i = 1; curY - i >= 0 && i <= 3; i++) {
    if (checkPossiblePlayCHECKBLOCKMATE(xrey, yrey, curX, curY, curX, curY - i, LEON)) break;
  }

  // Right move
  for (let i = 1; curX + i <= BOARD_WIDTH - 1 && i <= 3; i++) {
    if (checkPossiblePlayCHECKBLOCKMATE(xrey, yrey, curX, curY, curX + i, curY, LEON)) break;
  }

  // Lower move
  for (let i = 1; curY + i <= BOARD_HEIGHT - 1 && i <= 3; i++) {
    if (checkPossiblePlayCHECKBLOCKMATE(xrey, yrey, curX, curY, curX, curY + i, LEON)) break;
  }

  // Left move
  for (let i = 1; curX - i >= 0 && i <= 3; i++) {
    if (checkPossiblePlayCHECKBLOCKMATE(xrey, yrey, curX, curY, curX - i, curY, LEON)) break;
  }
}

function checkPossibleMoveCHECKBLOCKMATE(xrey, yrey, xold, yold, xnew, ynew, pieza) {
  //si la casilla esta ocupada no podemos hace nada  
  if (board.tiles[ynew][xnew].team !== EMPTY) return false;
  //liberamos la casilla vieja
  board.tiles[yold][xold].team = EMPTY;
  board.tiles[yold][xold].pieceType = EMPTY;
  //hacemos el movimiento nuevo  
  board.tiles[ynew][xnew].team = currentTeamCHECKBLOCKMATE;
  board.tiles[ynew][xnew].pieceType = pieza;
  //checamos si todavia hay jaque
  if (checkTileUnderAttack(xrey, yrey, getOppositeTeam(currentTeamCHECKBLOCKMATE), false) === true) {
    //regresamos el tablero como estaba
    board.tiles[ynew][xnew].team = EMPTY;
    board.tiles[ynew][xnew].pieceType = EMPTY;
    board.tiles[yold][xold].team = currentTeamCHECKBLOCKMATE;
    board.tiles[yold][xold].pieceType = pieza;

    bloquearjaquemate.push("no");
    return false; //no hay salvacion
  } else {
    //regresamos el tablero como estaba
    board.tiles[ynew][xnew].team = EMPTY;
    board.tiles[ynew][xnew].pieceType = EMPTY;
    board.tiles[yold][xold].team = currentTeamCHECKBLOCKMATE;
    board.tiles[yold][xold].pieceType = pieza;

    bloquearjaquemate.push("si");
    return true; //si hay salvacion
  }
}

function checkPossiblePlayCHECKBLOCKMATE(xrey, yrey, curX, curY, x, y, pieza) {
  return !checkPossibleMoveCHECKBLOCKMATE(xrey, yrey, curX, curY, x, y, pieza);
}











function checkKINGRESOLVEMATE(xmirey, ymirey, miequipo) {
  currentTeamKINGRESOLVEMATE = miequipo;

  checkPossiblePlaysKINGRESOLVEMATE(xmirey, ymirey);

  if (resolverjaquemate.includes("si")) {
    //vaciamos el arreglo
    resolverjaquemate = [];
    return true;
  } else {
    resolverjaquemate = [];
    return false;
  }
}

function checkPossiblePlaysKINGRESOLVEMATE(curX, curY) {
  for (let i = -1; i <= 1; i++) {
    if (curY + i < 0 || curY + i > BOARD_HEIGHT - 1) continue;

    for (let j = -1; j <= 1; j++) {
      if (curX + j < 0 || curX + j > BOARD_WIDTH - 1) continue;
      if (i === 0 && j === 0) continue;

      checkPossibleKINGRESOLVEMATE(curX, curY, curX + j, curY + i);
    }
  }
}



function checkPossibleKINGRESOLVEMATE(xold, yold, xnew, ynew) {
  //si la casilla esta ocupada por una pieza nuestra no podemos hace nada  
  if (board.tiles[ynew][xnew].team === currentTeamKINGRESOLVEMATE) return false;

  //liberamos la casilla vieja
  board.tiles[yold][xold].team = EMPTY;
  board.tiles[yold][xold].pieceType = EMPTY;
  //guardamos el equipo y pieza de la casilla nueva
  var equipo_old = board.tiles[ynew][xnew].team;
  var pieza_old = board.tiles[ynew][xnew].pieceType;

  //hacemos el movimiento nuevo  
  board.tiles[ynew][xnew].team = currentTeamKINGRESOLVEMATE;
  board.tiles[ynew][xnew].pieceType = KING;
  //checamos si todavia hay jaque
  if (checkTileUnderAttack(xnew, ynew, getOppositeTeam(currentTeamKINGRESOLVEMATE), false) === true) {
    //regresamos el tablero como estaba
    board.tiles[ynew][xnew].team = equipo_old;
    board.tiles[ynew][xnew].pieceType = pieza_old;
    board.tiles[yold][xold].team = currentTeamKINGRESOLVEMATE;
    board.tiles[yold][xold].pieceType = KING;

    resolverjaquemate.push("no");
    return false; //no hay salvacion
  } else {
    //regresamos el tablero como estaba
    board.tiles[ynew][xnew].team = equipo_old;
    board.tiles[ynew][xnew].pieceType = pieza_old;
    board.tiles[yold][xold].team = currentTeamKINGRESOLVEMATE;
    board.tiles[yold][xold].pieceType = KING;

    resolverjaquemate.push("si");
    return true; //si hay salvacion
  }
}















export async function rendirse_blancas() {
  //console.log("Rendirse blancas");
  getGameDbRef()
    .update({
      status: "white give up",
      board,
    })
    .catch(console.error);
  Swal.fire({
    title: "Opps....",
    text: "HAN GANADO LAS NEGRAS",
  });
}
export async function rendirse_negras() {
  //console.log("Rendirse negras");
  getGameDbRef()
    .update({
      status: "black give up",
      board,
    })
    .catch(console.error);
  Swal.fire({
    title: "Opps....",
    text: "HAN GANADO LAS BLANCAS",
  });
}

export async function tablas_blancas() {
  getGameDbRef()
    .update({
      status: "tied_white_prop",
      board,
    })
    .catch(console.error);
  Swal.fire({
    title: "Opps....",
    text: "Has propuesto tablas",
  });
}

export async function tablas_negras() {
  getGameDbRef()
    .update({
      status: "tied_black_prop",
      board,
    })
    .catch(console.error);
  Swal.fire({
    title: "Opps....",
    text: "Has propuesto tablas",
  });
}

export async function revancha_blancas() {
  getGameDbRef()
    .update({
      status: "white_revenge_prop",
      board,
    })
    .catch(console.error);
  Swal.fire({
    title: "Opps....",
    text: "Has propuesto revancha",
  });
}

export async function revancha_negras() {
  getGameDbRef()
    .update({
      status: "black_revenge_prop",
      board,
    })
    .catch(console.error);
  Swal.fire({
    title: "Opps....",
    text: "Has propuesto revancha",
  });
}

export async function pausar() {

  getGameDbRef()
    .update({
      status: "pause",
      pidio_pausa: firebase?.auth()?.currentUser?.uid,
    })
    .catch(console.error);
  Swal.fire({
    title: "Opps....",
    text: "Pausa",
  })
    .then(function () {
      window.location.assign("/lobby");
    });
}