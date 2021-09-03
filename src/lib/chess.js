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
//import { ReactSwal } from "../utils/SwalUtils";
import Swal from "sweetalert2";

export const event = new EventEmitter();

const BOARD_WIDTH = GameConst.boardWidth;
const BOARD_HEIGHT = GameConst.boardHeight;

const TILE_SIZE = GameConst.tileSize;
const WHITE_TILE_COLOR = GameConst.colors.whiteTileColor;
const BLACK_TILE_COLOR = GameConst.colors.blackTileColor;
const MIDDEL_TILE_COLOR = GameConst.colors.middleTileColor;
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

let chessCanvas;
let chessCtx;
let currentTeamText;
let whiteCasualitiesText;
let blackCasualitiesText;
let totalVictoriesText;

let board;
let currentTeam;
let currentTeamJUSTCHECK;

let curX;
let curY;

let whiteCasualities;
let blackCasualities;

let whiteVictories;
let blackVictories;

let njblancas;
let njnegras;

let tmpjuego;
let contadorleonnegro;
let contadorleonblanco;

let contadorreyblanco;
let contadorreynegro;

let contadortorre1blanco;
let contadortorre1negro;

let contadortorre2blanco;
let contadortorre2negro;

let casillasenpeligro = [];

let jaquereyblanco;
let jaquereynegro;
let posicionreynegro = "4,0";
let posicionreyblanco = "4,9";

let comeralpaso;
let comeralpasoardilla;
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

let tablero = [];

let lobbyItemKey;

let serverGameData = {};

export function onLoad(_lobbyItemKey) {
  chessCanvas = document.getElementById("chessCanvas");
  chessCtx = chessCanvas.getContext("2d");
  chessCanvas.addEventListener("click", onClick);

  tmpjuego = 0;
  whiteVictories = 0;
  blackVictories = 0;

  lobbyItemKey = _lobbyItemKey;

  startGame(lobbyItemKey);
}

function getGameDbRef() {
  return firebase.database().ref(lobbyItemKey);
}

let isTriggeredChangeTeam = false;

/**
 * Function called each second from Game Component
 */
export async function setTimerFromCreatedAt() {
  /**
   * We change of current player's side every 10 minuts
   */
//   let minutesdFromLastPieceJoue = Math.abs(
//     parseInt((getMillisecondsFromLastPieceJoueCreatedAt() / (1000 * 60)) % 60)
//   );
//   if (minutesdFromLastPieceJoue % 2 == 0 && minutesdFromLastPieceJoue != 0) {
//     if (!isTriggeredChangeTeam) {
//       changeCurrentTeam(true);
//       isTriggeredChangeTeam = true;
//     }
//   } else {
//     isTriggeredChangeTeam = false;
//   }

  if (parseInt((getMillisecondsFromCreatedAt() / (1000 * 60)) % 60) >= 90) {
    if (serverGameData?.status != "tied") {
      await getGameDbRef()
        .update({
          status: "tied",
        })
        .catch(console.error);
    }
  }

  document.getElementById("time_createdat").innerHTML =
    getMinutesFromCreatedAt();
  document.getElementById("time_play").innerHTML =
    getMinutesromLastPieceJoueCreatedAt();
}

export function getMinutesFromCreatedAt() {
  const date1 = new Date(serverGameData?.createdAt);
  const date2 = Date.now();
  const diffTime = Math.abs(date2 - date1);
  let seconds = (diffTime / 1000) % 60;
  let minutes = (diffTime / (1000 * 60)) % 60;
  return `${parseInt(minutes)}:${parseInt(seconds)}`;
}

function getMillisecondsFromCreatedAt() {
  const date1 = new Date(serverGameData?.createdAt);
  const date2 = Date.now();
  return Math.abs(date2 - date1);
}

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
    }

    currentTeam =
      serverGameData?.side === serverGameData?.player1 ? WHITE : BLACK;

    board = new Board(snapshot?.toJSON()?.board);
    //leemos de firebase
    leer_comer_al_paso();
    leer_comer_al_paso_conejo();
    leer_comer_al_paso_ardilla();

    leer_leoncoronadoblancocomible();
    leer_leoncoronadonegrocomible();
    leer_posicionleonblanco();
    leer_posicionleonnegro();
    leer_act_numero_turno();
    leer_act_bloque();

    try {
      Object.keys(serverGameData?.jugadasPorBloque)?.forEach((_element) => {
        let element = parseInt(_element);
        switch (element) {
          case 0:
            document.getElementById("jugada1").style.backgroundColor = "red";
            break;
          case 1:
            document.getElementById("jugada2").style.backgroundColor = "red";
            break;
          case 2:
            document.getElementById("jugada3").style.backgroundColor = "red";
            break;
          case 3:
            document.getElementById("jugada4").style.backgroundColor = "red";
            break;
          case 4:
            document.getElementById("jugada5").style.backgroundColor = "red";
            break;
          case 5:
            document.getElementById("jugada6").style.backgroundColor = "red";
            break;
          case 6:
            document.getElementById("jugada7").style.backgroundColor = "red";
            break;
          case 7:
            document.getElementById("jugada8").style.backgroundColor = "red";
            break;
          case 8:
            document.getElementById("jugada9").style.backgroundColor = "red";
            break;
          default:
            console.log(element);
        }
      });
    } catch (error) {}

    if (numero_turno === 18) {
      marca_bloque(2);
      document.getElementById("bloque1").style.backgroundColor = "red";
      reset_jugadas();
    }
    if (numero_turno === 36) {
      marca_bloque(3);
      document.getElementById("bloque2").style.backgroundColor = "red";
      reset_jugadas();
    }
    if (numero_turno === 54) {
      marca_bloque(4);
      document.getElementById("bloque3").style.backgroundColor = "red";
      reset_jugadas();
    }
    if (numero_turno === 72) {
      marca_bloque(5);
      document.getElementById("bloque4").style.backgroundColor = "red";
      reset_jugadas();
    }
    if (numero_turno === 90) {
      marca_bloque(6);
      document.getElementById("bloque5").style.backgroundColor = "red";
      reset_jugadas();
    }
    if (numero_turno === 108) {
      marca_bloque(7);
      document.getElementById("bloque6").style.backgroundColor = "red";
      reset_jugadas();
    }
    if (numero_turno === 126) {
      marca_bloque(8);
      document.getElementById("bloque7").style.backgroundColor = "red";
      reset_jugadas();
    }
    if (numero_turno === 144) {
      marca_bloque(9);
      document.getElementById("bloque8").style.backgroundColor = "red";
      reset_jugadas();
    }
    if (numero_turno === 162) {
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

    if (serverGameData?.side !== firebase?.auth()?.currentUser?.uid) {
      document.getElementById("turno").innerHTML = "Turno de tu oponente";
    } else {
      document.getElementById("turno").innerHTML = "Tu turno";
    }
    if (currentTeam === BLACK) {
      var jugador1a = document.getElementById("jugador2");
      jugador1a.style.border = "1px solid white";
      jugador1a.style.borderRadius = "50%";
      jugador1a.style.padding = "5px";

      var jugador2a = document.getElementById("jugador1");
      jugador2a.style.border = "0";
      jugador2a.style.borderRadius = "0";
      jugador2a.style.padding = "0";
    } else {
      var jugador1b = document.getElementById("jugador1");
      jugador1b.style.border = "1px solid white";
      jugador1b.style.borderRadius = "50%";
      jugador1b.style.padding = "5px";

      var jugador2b = document.getElementById("jugador2");
      jugador2b.style.border = "0";
      jugador2b.style.borderRadius = "0";
      jugador2b.style.padding = "0";
    }

    // updateWhiteCasualities();
    // updateBlackCasualities();
    // updateTotalVictories();
  });

  curX = -1;
  curY = -1;
  njblancas = 0;
  njnegras = 0;
  tmpjuego = 0;
  contadorleonnegro = 0;
  contadorleonblanco = 0;

  contadorreyblanco = 0;
  contadorreynegro = 0;
  contadortorre1blanco = 0;
  contadortorre1negro = 0;
  contadortorre2blanco = 0;
  contadortorre2negro = 0;

  whiteCasualities = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  blackCasualities = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
}

async function onClick(event) {
  if (serverGameData?.player2 == null) {
    Swal.fire({
      title: "Opps..",
      text: "Debes esperar que se una un jugador para empezar a jugar",
    });
    return;
  }

  if (serverGameData?.status == "tied") {
    Swal.fire({
      title: "Opps..",
      text: "El juego se ha empatado",
    });
    return;
  }

  if (serverGameData?.numero_turno >= 90) {
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

  let chessCanvasX = chessCanvas.getBoundingClientRect().left;
  let chessCanvasY = chessCanvas.getBoundingClientRect().top;

  let x = Math.floor((event.clientX - chessCanvasX) / TILE_SIZE);
  let y = Math.floor((event.clientY - chessCanvasY) / TILE_SIZE);

  if (serverGameData?.numero_turno % 9 == 1) {
    if (
      serverGameData?.lastPiecejoue?.x == x &&
      serverGameData?.lastPiecejoue?.y == y
    ) {
      Swal.fire({
        title: "Opps..",
        text: "No puedes mover la misma pieza",
      });
      return;
    }
  }

  ganoleon();

  if (checkValidMovement(x, y) === true) {
    ultimotipodemovimiento = "Movimiento";

    if (checkValidCapture(x, y) === true) {
      if (board.tiles[y][x].pieceType === KING) {
        if (currentTeam === WHITE) whiteVictories++;
        else blackVictories++;
        startGame();
      }

      if (currentTeam === WHITE) {
        blackCasualities[board.tiles[y][x].pieceType]++;
        ultimapiezacapturadanegra =
          board.tiles[y][x].pieceType + "/" + x + "," + y;
        ultimotipodemovimiento = "Captura";
        updateBlackCasualities();
      } else {
        whiteCasualities[board.tiles[y][x].pieceType]++;
        ultimapiezacapturadablanca =
          board.tiles[y][x].pieceType + "/" + x + "," + y;
        ultimotipodemovimiento = "Captura";
        updateWhiteCasualities();
      }
    }

    if (curY !== -1 && curX !== -1) {
      let tile = board.tiles[curY][curX];
      moveSelectedPiece(x, y, tile.pieceType, curX, curY);

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
          Swal.fire({
            title: "Ganaron las Blancas",
            icon: "warning",
            type: "success",
            allowOutsideClick: false,
            allowEscapeKey: false,
          }).then(function () {
            window.location = "/lobby";
          });
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
          Swal.fire({
            title: "Ganaron las Negras",
            icon: "warning",
            type: "success",
            allowOutsideClick: false,
            allowEscapeKey: false,
          }).then(function () {
            window.location = "/lobby";
          });
        }
      }

      //vemos si al moverse hace jaque o se crea un jaque
      //ponemos en cero los jaques
      jaquereyblanco = "No";
      jaquereynegro = "No";
      casillasenpeligro = [];
      var cambio_de_turno = "Si";

      //revisamos que nadie le haga jaque al rey blanco
      const combo_posicionreyblanco = posicionreyblanco.split(",");
      const checkWX = combo_posicionreyblanco[0];
      const checkWY = combo_posicionreyblanco[1];
      //si hay jaque regresamos la jugada
      if (
        checkKingWhiteMovepossible(checkWX, checkWY) === true &&
        currentTeam === WHITE
      ) {
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
      const combo_posicionreynegro = posicionreynegro.split(",");
      const checkBX = combo_posicionreynegro[0];
      const checkBY = combo_posicionreynegro[1];

      if (
        checkKingBlackMovepossible(checkBX, checkBY) === true &&
        currentTeam === BLACK
      ) {
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
        await getGameDbRef()
          .update({
            board,
            lastPiecejoue: { x, y, createdAt: Date.now() },
          })
          .catch(console.error);

        if (serverGameData?.side === firebase?.auth()?.currentUser?.uid) {
          await changeCurrentTeam();
        }
      }
      /*await repaintBoard();*/
    }
  } else {
    //si da click en celda vacia reset curx cury
    if (board.tiles[y][x].pieceType === EMPTY) {
      curX = -1;
      curY = -1;
    } else {
      curX = x;
      curY = y;
    }
  }

  repaintBoard();
}

function checkPossiblePlays() {
  if (curX < 0 || curY < 0) return;

  let tile = board.tiles[curY][curX];
  if (tile.team === EMPTY || tile.team !== currentTeam) return;

  drawTile(curX, curY, HIGHLIGHT_COLOR);

  board.resetValidMoves();

  if (tile.pieceType === PAWN) checkPossiblePlaysPawn(curX, curY);
  else if (tile.pieceType === KNIGHT) checkPossiblePlaysKnight(curX, curY);
  else if (tile.pieceType === BISHOP) checkPossiblePlaysBishop(curX, curY);
  else if (tile.pieceType === ROOK) checkPossiblePlaysRook(curX, curY);
  else if (tile.pieceType === QUEEN) checkPossiblePlaysQueen(curX, curY);
  else if (tile.pieceType === KING) checkPossiblePlaysKing(curX, curY);
  else if (tile.pieceType === ARDILLA) checkPossiblePlaysArdilla(curX, curY);
  else if (tile.pieceType === CONEJO) checkPossiblePlaysConejo(curX, curY);
  else if (tile.pieceType === PERRO) checkPossiblePlaysPerro(curX, curY);
  else if (tile.pieceType === PANTERA) checkPossiblePlaysPantera(curX, curY);
  else if (tile.pieceType === ELEFANTE) checkPossiblePlaysElefante(curX, curY);
  else if (tile.pieceType === LEON) checkPossiblePlaysLeon(curX, curY);
}

function checkPossiblePlaysPawn(curX, curY) {
  let direction;

  if (currentTeam === WHITE) direction = -1;
  else direction = 1;

  if (curY + direction < 0 || curY + direction > BOARD_HEIGHT - 1) return;

  // Advance one tile
  checkPossibleMove(curX, curY + direction);

  // First double move
  if (
    (curY === 2 && board.tiles[curY][curX].team === BLACK) ||
    (curY === 7 && board.tiles[curY][curX].team === WHITE)
  ) {
    if (board.tiles[curY + direction][curX].pieceType === EMPTY) {
      checkPossibleMove(curX, curY + 2 * direction);
    }
  }

  // Check diagonal left capture
  if (curX - 1 >= 0) {
    if (board.tiles[curY + direction][curX - 1].pieceType !== ELEFANTE) {
      if (board.tiles[curY + direction][curX - 1].pieceType !== LEON) {
        checkPossibleCapture(curX - 1, curY + direction);
      }
    }
    //vemos si puede comer al paso
    if (currentTeam === 0 && curY === 4) {
      if (curX - 1 + "," + (curY - 1) === comeralpaso) {
        checkPossibleMove(curX - 1, curY - 1);
      }
    }
    if (currentTeam === 1 && curY === 5) {
      if (curX - 1 + "," + (curY + 1) === comeralpaso) {
        checkPossibleMove(curX - 1, curY + 1);
      }
    }
  }

  // Check diagonal right capture
  if (curX + 1 <= BOARD_WIDTH - 1) {
    if (board.tiles[curY + direction][curX + 1].pieceType !== ELEFANTE) {
      if (board.tiles[curY + direction][curX + 1].pieceType !== LEON) {
        checkPossibleCapture(curX + 1, curY + direction);
      }
    }
    //vemos si puede comer al paso
    if (currentTeam === 0 && curY === 4) {
      if (curX + 1 + "," + (curY - 1) === comeralpaso) {
        checkPossibleMove(curX + 1, curY - 1);
      }
    }
    if (currentTeam === 1 && curY === 5) {
      if (curX + 1 + "," + (curY + 1) === comeralpaso) {
        checkPossibleMove(curX + 1, curY + 1);
      }
    }
  }
}

function checkPossiblePlaysConejo(curX, curY) {
  let direction;

  if (currentTeam === WHITE) direction = -1;
  else direction = 1;

  if (curY + direction < 0 || curY + direction > BOARD_HEIGHT - 1) return;

  // Advance one tile
  checkPossibleMove(curX, curY + direction);

  // Advance two tile
  //si es un PAWN si se puede saltar Y COMER SI NO SOLO AVANZA
  if (board.tiles[curY + 1 * direction][curX].pieceType === EMPTY) {
    //vemos que no se salga del tablero
    if (curY + 2 * direction < BOARD_HEIGHT && curY + 2 * direction >= 0) {
      checkPossibleMove(curX, curY + 2 * direction);
    }
  } else {
    if (
      board.tiles[curY + 1 * direction][curX].pieceType === PAWN &&
      board.tiles[curY + 1 * direction][curX].team !== currentTeam
    ) {
      checkPossibleMove(curX, curY + 2 * direction);
    }
  }

  // Check diagonal right capture
  if (curX + 1 <= BOARD_WIDTH - 1)
    checkPossibleMove(curX + 1, curY + direction);
  // Check diagonal left capture
  if (curX - 1 >= 0) checkPossibleMove(curX - 1, curY + direction);

  // Check diagonal left capture
  if (curX - 1 >= 0) {
    if (board.tiles[curY + direction][curX - 1].pieceType !== ELEFANTE) {
      checkPossibleCapture(curX - 1, curY + direction);
    }
  }

  // Check diagonal right capture
  if (curX + 1 <= BOARD_WIDTH - 1) {
    if (board.tiles[curY + direction][curX + 1].pieceType !== ELEFANTE) {
      checkPossibleCapture(curX + 1, curY + direction);
    }
  }
}

function checkPossiblePlaysArdilla(curX, curY) {
  let direction;

  if (currentTeam === WHITE) direction = -1;
  else direction = 1;

  if (curY + direction < 0 || curY + direction > BOARD_HEIGHT - 1) return;

  // Advance one tile
  checkPossibleMove(curX, curY + direction);

  // Advance two tile
  //si es un PAWN O CONEJO si se puede saltar y comer sino no hacer nada
  if (
    curY + 1 * direction >= 0 &&
    curY + 1 * direction <= BOARD_HEIGHT - 1 &&
    curY + 2 * direction >= 0 &&
    curY + 2 * direction <= BOARD_HEIGHT - 1
  ) {
    if (board.tiles[curY + 1 * direction][curX].team !== currentTeam) {
      if (
        board.tiles[curY + 1 * direction][curX].pieceType === 0 ||
        board.tiles[curY + 1 * direction][curX].pieceType === CONEJO ||
        board.tiles[curY + 1 * direction][curX].pieceType === EMPTY
      ) {
        checkPossibleMove(curX, curY + 2 * direction);
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
      board.tiles[curY + 1 * direction][curX].team !== currentTeam &&
      board.tiles[curY + 2 * direction][curX].team !== currentTeam
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
        checkPossibleMove(curX, curY + 3 * direction);
      }
    }
  }

  // Advance Horizontal tile
  if (curX > 0) {
    checkPossibleMove(curX - 1, curY);
  }
  if (curX < 8) {
    checkPossibleMove(curX + 1, curY);
  }

  // Check diagonal right move
  if (curX + 1 <= BOARD_WIDTH - 1)
    checkPossibleMove(curX + 1, curY + direction);
  // Check diagonal left move
  if (curX - 1 >= 0) checkPossibleMove(curX - 1, curY + direction);

  // Check diagonal left capture
  if (curX - 1 >= 0) {
    if (board.tiles[curY + direction][curX - 1].pieceType !== ELEFANTE) {
      checkPossibleCapture(curX - 1, curY + direction);
    }
  }

  // Check diagonal right capture
  if (curX + 1 <= BOARD_WIDTH - 1) {
    if (board.tiles[curY + direction][curX + 1].pieceType !== ELEFANTE) {
      checkPossibleCapture(curX + 1, curY + direction);
    }
  }
}

function checkPossiblePlaysPerro(curX, curY) {
  let direction;

  if (currentTeam === WHITE) direction = -1;
  else direction = 1;

  if (curY + direction < 0 || curY + direction > BOARD_HEIGHT - 1) return;

  // Advance one tile
  checkPossibleMove(curX, curY + direction);
  if (board.tiles[curY + direction][curX].pieceType !== ELEFANTE) {
    checkPossibleCapture(curX, curY + direction);
  }

  if (
    curY + 2 * direction > 0 &&
    curY + 2 * direction > 0 &&
    curY + 2 * direction <= BOARD_HEIGHT - 1 &&
    board.tiles[curY + 1 * direction][curX].pieceType === EMPTY
  ) {
    // Advance two tile
    checkPossibleMove(curX, curY + 2 * direction);
    if (board.tiles[curY + 2 * direction][curX].pieceType !== ELEFANTE) {
      checkPossibleCapture(curX, curY + 2 * direction);
    }
  }

  // Advance Horizontal tile
  if (curX > 0) {
    checkPossibleMove(curX - 1, curY);
  }
  if (curX > 1 && board.tiles[curY][curX - 1].pieceType === EMPTY) {
    checkPossibleMove(curX - 2, curY);
  }
  if (curX < 8) {
    checkPossibleMove(curX + 1, curY);
  }
  if (curX < 7 && board.tiles[curY][curX + 1].pieceType === EMPTY) {
    checkPossibleMove(curX + 2, curY);
  }

  // Check diagonal right movimiento
  if (curX + 1 <= BOARD_WIDTH - 1) {
    checkPossibleMove(curX + 1, curY + direction);
  }
  if (
    curX + 2 <= BOARD_WIDTH - 1 &&
    board.tiles[curY + direction][curX + 1].pieceType === EMPTY
  ) {
    checkPossibleMove(curX + 2, curY + 2 * direction);
  }

  // Check diagonal left movimiento
  if (curX - 1 >= 0) {
    checkPossibleMove(curX - 1, curY + direction);
  }
  if (
    curX - 2 >= 0 &&
    board.tiles[curY + direction][curX - 1].pieceType === EMPTY
  ) {
    checkPossibleMove(curX - 2, curY + 2 * direction);
  }

  // Check diagonal left capture
  if (
    curX - 1 >= 0 &&
    board.tiles[curY + direction][curX - 1].pieceType !== ELEFANTE
  ) {
    checkPossibleCapture(curX - 1, curY + direction);
  }
  if (
    curX - 2 >= 0 &&
    curY + 2 * direction > 0 &&
    curY + 2 * direction <= BOARD_HEIGHT - 1 &&
    board.tiles[curY + 2 * direction][curX - 2].pieceType !== ELEFANTE &&
    board.tiles[curY + 1 * direction][curX - 1].pieceType === EMPTY
  ) {
    checkPossibleCapture(curX - 2, curY + 2 * direction);
  }

  // Check diagonal right capture
  if (
    curX + 1 <= BOARD_WIDTH - 1 &&
    board.tiles[curY + direction][curX + 1].pieceType !== ELEFANTE
  ) {
    checkPossibleCapture(curX + 1, curY + direction);
  }
  if (
    curX + 2 <= BOARD_WIDTH - 1 &&
    curY + 2 * direction > 0 &&
    curY + 2 * direction <= BOARD_HEIGHT - 1 &&
    board.tiles[curY + 2 * direction][curX + 2].pieceType !== ELEFANTE &&
    board.tiles[curY + 1 * direction][curX + 1].pieceType === EMPTY
  ) {
    checkPossibleCapture(curX + 2, curY + 2 * direction);
  }
}

function checkPossiblePlaysKnight(curX, curY) {
  // Far left moves
  if (curX - 2 >= 0) {
    // Upper move
    if (curY - 1 >= 0) checkPossiblePlay(curX - 2, curY - 1);

    // Lower move
    if (curY + 1 <= BOARD_HEIGHT - 1) checkPossiblePlay(curX - 2, curY + 1);
  }

  // Near left moves
  if (curX - 1 >= 0) {
    // Upper move
    if (curY - 2 >= 0) checkPossiblePlay(curX - 1, curY - 2);

    // Lower move
    if (curY + 2 <= BOARD_HEIGHT - 1) checkPossiblePlay(curX - 1, curY + 2);
  }

  // Near right moves
  if (curX + 1 <= BOARD_WIDTH - 1) {
    // Upper move
    if (curY - 2 >= 0) checkPossiblePlay(curX + 1, curY - 2);

    // Lower move
    if (curY + 2 <= BOARD_HEIGHT - 1) checkPossiblePlay(curX + 1, curY + 2);
  }

  // Far right moves
  if (curX + 2 <= BOARD_WIDTH - 1) {
    // Upper move
    if (curY - 1 >= 0) checkPossiblePlay(curX + 2, curY - 1);

    // Lower move
    if (curY + 1 <= BOARD_HEIGHT - 1) checkPossiblePlay(curX + 2, curY + 1);
  }
}

function checkPossiblePlaysPantera(curX, curY) {
  // Far left moves
  if (curX - 3 >= 0) {
    // Upper move
    if (curY - 1 >= 0) checkPossiblePlay(curX - 3, curY - 1);

    // Lower move
    if (curY + 1 <= BOARD_HEIGHT - 1) checkPossiblePlay(curX - 3, curY + 1);
  }

  // Far left moves
  if (curX - 2 >= 0) {
    // Upper move
    if (curY - 1 >= 0) checkPossiblePlay(curX - 2, curY - 1);

    // Lower move
    if (curY + 1 <= BOARD_HEIGHT - 1) checkPossiblePlay(curX - 2, curY + 1);
  }

  // Near left moves
  if (curX - 1 >= 0) {
    // Upper move
    if (curY - 2 >= 0) checkPossiblePlay(curX - 1, curY - 2);
    if (curY - 3 >= 0) checkPossiblePlay(curX - 1, curY - 3);

    // Lower move
    if (curY + 2 <= BOARD_HEIGHT - 1) checkPossiblePlay(curX - 1, curY + 2);
    if (curY + 3 <= BOARD_HEIGHT - 1) checkPossiblePlay(curX - 1, curY + 3);
  }

  // Near right moves
  if (curX + 1 <= BOARD_WIDTH - 1) {
    // Upper move
    if (curY - 2 >= 0) checkPossiblePlay(curX + 1, curY - 2);
    if (curY - 3 >= 0) checkPossiblePlay(curX + 1, curY - 3);

    // Lower move
    if (curY + 2 <= BOARD_HEIGHT - 1) checkPossiblePlay(curX + 1, curY + 2);
    if (curY + 3 <= BOARD_HEIGHT - 1) checkPossiblePlay(curX + 1, curY + 3);
  }

  // Far right moves
  if (curX + 2 <= BOARD_WIDTH - 1) {
    // Upper move
    if (curY - 1 >= 0) checkPossiblePlay(curX + 2, curY - 1);

    // Lower move
    if (curY + 1 <= BOARD_HEIGHT - 1) checkPossiblePlay(curX + 2, curY + 1);
  }

  if (curX + 3 <= BOARD_WIDTH - 1) {
    // Upper move
    if (curY - 1 >= 0) checkPossiblePlay(curX + 3, curY - 1);

    // Lower move
    if (curY + 1 <= BOARD_HEIGHT - 1) checkPossiblePlay(curX + 3, curY + 1);
  }
}

function checkPossiblePlaysRook(curX, curY) {
  // Upper move
  for (let i = 1; curY - i >= 0; i++) {
    if (checkPossiblePlay(curX, curY - i)) break;
  }

  // Right move
  for (let i = 1; curX + i <= BOARD_WIDTH - 1; i++) {
    if (checkPossiblePlay(curX + i, curY)) break;
  }

  // Lower move
  for (let i = 1; curY + i <= BOARD_HEIGHT - 1; i++) {
    if (checkPossiblePlay(curX, curY + i)) break;
  }

  // Left move
  for (let i = 1; curX - i >= 0; i++) {
    if (checkPossiblePlay(curX - i, curY)) break;
  }
}

function checkPossiblePlaysBishop(curX, curY) {
  // Upper-right move
  for (let i = 1; curX + i <= BOARD_WIDTH - 1 && curY - i >= 0; i++) {
    if (checkPossiblePlay(curX + i, curY - i)) break;
  }

  // Lower-right move
  for (
    let i = 1;
    curX + i <= BOARD_WIDTH - 1 && curY + i <= BOARD_HEIGHT - 1;
    i++
  ) {
    if (checkPossiblePlay(curX + i, curY + i)) break;
  }

  // Lower-left move
  for (let i = 1; curX - i >= 0 && curY + i <= BOARD_HEIGHT - 1; i++) {
    if (checkPossiblePlay(curX - i, curY + i)) break;
  }

  // Upper-left move
  for (let i = 1; curX - i >= 0 && curY - i >= 0; i++) {
    if (checkPossiblePlay(curX - i, curY - i)) break;
  }
}

function checkPossiblePlaysElefante(curX, curY) {
  // Diagonal abajo a la derecha
  for (let i = 1; curX + i <= BOARD_WIDTH - 1 && curY - i >= 0 && i <= 2; i++) {
    if (curX + i <= BOARD_WIDTH - 1 && curY - i >= 0) {
      if (board.tiles[curY - 1][curX + 1].team !== currentTeam) {
        checkPossiblePlay(curX + i, curY - i);
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
      if (board.tiles[curY + 1][curX + 1].team !== currentTeam) {
        checkPossiblePlay(curX + i, curY + i);
      }
    }
  }

  // derecha
  for (let i = 1; curX + i <= BOARD_WIDTH - 1 && i <= 2; i++) {
    if (curX + i <= BOARD_WIDTH - 1) {
      if (board.tiles[curY][curX + 1].team !== currentTeam) {
        checkPossiblePlay(curX + i, curY);
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
      if (board.tiles[curY + 1][curX - 1].team !== currentTeam) {
        checkPossiblePlay(curX - i, curY + i);
      }
    }
  }

  // diagonal abajo izquierda
  for (let i = 1; curX - i >= 0 && curY - i >= 0 && i <= 2; i++) {
    if (curX - i >= 0 && curY - i >= 0) {
      if (board.tiles[curY - 1][curX - 1].team !== currentTeam) {
        checkPossiblePlay(curX - i, curY - i);
      }
    }
  }

  // izquierda
  for (let i = 1; curX - i >= 0 && i <= 2; i++) {
    if (curX - i >= 0) {
      if (board.tiles[curY][curX - 1].team !== currentTeam) {
        checkPossiblePlay(curX - i, curY);
      }
    }
  }

  // abajo
  for (let i = 1; curY - i >= 0 && i <= 2; i++) {
    if (curY - i >= 0) {
      if (board.tiles[curY - 1][curX].team !== currentTeam) {
        checkPossiblePlay(curX, curY - i);
      }
    }
  }

  // Arriba
  for (let i = 1; curY + i <= BOARD_HEIGHT - 1 && i <= 2; i++) {
    if (curY + i <= BOARD_HEIGHT - 1) {
      if (board.tiles[curY + 1][curX].team !== currentTeam) {
        checkPossiblePlay(curX, curY + i);
      }
    }
  }
}

function checkPossiblePlaysLeon(curX, curY) {
  // Upper-right move
  for (let i = 1; curX + i <= BOARD_WIDTH - 1 && curY - i >= 0 && i <= 2; i++) {
    if (checkPossiblePlay(curX + i, curY - i)) break;
  }

  // Lower-right move
  for (
    let i = 1;
    curX + i <= BOARD_WIDTH - 1 && curY + i <= BOARD_HEIGHT - 1 && i <= 2;
    i++
  ) {
    if (checkPossiblePlay(curX + i, curY + i)) break;
  }

  // Lower-left move
  for (
    let i = 1;
    curX - i >= 0 && curY + i <= BOARD_HEIGHT - 1 && i <= 2;
    i++
  ) {
    if (checkPossiblePlay(curX - i, curY + i)) break;
  }

  // Upper-left move
  for (let i = 1; curX - i >= 0 && curY - i >= 0 && i <= 2; i++) {
    if (checkPossiblePlay(curX - i, curY - i)) break;
  }

  // Upper move
  for (let i = 1; curY - i >= 0 && i <= 3; i++) {
    if (checkPossiblePlay(curX, curY - i)) break;
  }

  // Right move
  for (let i = 1; curX + i <= BOARD_WIDTH - 1 && i <= 3; i++) {
    if (checkPossiblePlay(curX + i, curY)) break;
  }

  // Lower move
  for (let i = 1; curY + i <= BOARD_HEIGHT - 1 && i <= 3; i++) {
    if (checkPossiblePlay(curX, curY + i)) break;
  }

  // Left move
  for (let i = 1; curX - i >= 0 && i <= 3; i++) {
    if (checkPossiblePlay(curX - i, curY)) break;
  }
}

function checkPossiblePlaysQueen(curX, curY) {
  checkPossiblePlaysBishop(curX, curY);
  checkPossiblePlaysRook(curX, curY);
}

function checkPossiblePlaysKing(curX, curY) {
  for (let i = -1; i <= 1; i++) {
    if (curY + i < 0 || curY + i > BOARD_HEIGHT - 1) continue;

    for (let j = -1; j <= 1; j++) {
      if (curX + j < 0 || curX + j > BOARD_WIDTH - 1) continue;
      if (i === 0 && j === 0) continue;

      checkPossiblePlay(curX + j, curY + i);
    }
  }

  //posible enroque de las blancas
  if (currentTeam === 0) {
    if (contadorreyblanco === 0 && jaquereyblanco === "No") {
      //torre2
      if (contadortorre2blanco === 0) {
        //verificamos casillas libres de ataque
        if (
          checkTileUnderAttack(curX + 1, curY) === false &&
          checkTileUnderAttack(curX + 2, curY) === false &&
          checkTileUnderAttack(curX + 3, curY) === false
        ) {
          //marcamos las casillas para que se pueda enrocar
          checkPossiblePlay(curX + 2, curY);
          checkPossiblePlay(curX + 3, curY);
        }
      }
      //torre1
      if (contadortorre1blanco === 0) {
        //verificamos casillas libres de ataque
        if (
          checkTileUnderAttack(curX - 1, curY) === false &&
          checkTileUnderAttack(curX - 2, curY) === false &&
          checkTileUnderAttack(curX - 3, curY) === false
        ) {
          //marcamos las casillas para que se pueda enrocar
          checkPossiblePlay(curX - 2, curY);
          checkPossiblePlay(curX - 3, curY);
        }
      }
    }
  }
  //posible enroque de las negras
  if (currentTeam === 1) {
    if (contadorreynegro === 0 && jaquereynegro === "No") {
      //torre2
      if (contadortorre2negro === 0) {
        //verificamos casillas libres de ataque
        if (
          checkTileUnderAttack(curX + 1, curY) === false &&
          checkTileUnderAttack(curX + 2, curY) === false &&
          checkTileUnderAttack(curX + 3, curY) === false
        ) {
          //marcamos las casillas para que se pueda enrocar
          checkPossiblePlay(curX + 2, curY);
          checkPossiblePlay(curX + 3, curY);
        }
      }
      //torre1
      if (contadortorre1negro === 0) {
        //verificamos casillas libres de ataque
        if (
          checkTileUnderAttack(curX - 1, curY) === false &&
          checkTileUnderAttack(curX - 2, curY) === false &&
          checkTileUnderAttack(curX - 3, curY) === false
        ) {
          //marcamos las casillas para que se pueda enrocar
          checkPossiblePlay(curX - 2, curY);
          checkPossiblePlay(curX - 3, curY);
        }
      }
    }
  }
}

function checkPossiblePlay(x, y) {
  if (checkPossibleCapture(x, y)) {
    return true;
  }

  return !checkPossibleMove(x, y);
}

function checkPossibleMove(x, y) {
  if (board.tiles[y][x].team !== EMPTY) return false;

  board.validMoves[y][x] = VALID;

  drawCircle(x, y, HIGHLIGHT_COLOR);
  return true;
}

function checkPossibleCapture(x, y) {
  if (board.tiles[y][x].team !== getOppositeTeam(currentTeam)) return false;

  board.validMoves[y][x] = VALID_CAPTURE;

  drawCorners(x, y, HIGHLIGHT_COLOR);
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
  //revisamos si es el equipo de las blancas
  if (currentTeam === 0) {
    if (piece === PAWN) {
      //revisamos si acaba de comer al paso
      if (x + "," + y === comeralpaso) {
        //actualizamos score y tablero

        //blackCasualities[board.tiles[y + 1][x].pieceType]++;
        //ultimapiezacapturadanegra =
        //board.tiles[y + 1][x].pieceType + "/" + x + "," + (y + 1);
        //ultimotipodemovimiento = "Captura";
        //updateBlackCasualities();
        //capturamos la ficha
        board.tiles[y + 1][x].pieceType = EMPTY;
        board.tiles[y + 1][x].team = EMPTY;
      } else {
        //revisamos si se lo pueden comer al paso
        if (oldY - 2 === y) {
          comeralpaso = x + "," + (oldY - 1);
          //guardamos en firebase
          guardar_comer_al_paso(comeralpaso);
        } else {
          comeralpaso = "";
          //guardamos en firebase
          guardar_comer_al_paso(comeralpaso);
        }
      }
    }
    if (piece === CONEJO) {
      //revisamos si acaba de comer al paso para capturar ficha
      if (x + "," + y === comeralpasoconejo || x + "," + y === comeralpaso) {
        //capturamos la ficha
        board.tiles[y + 1][x].pieceType = EMPTY;
        board.tiles[y + 1][x].team = EMPTY;
      } else {
        //revisamos si se lo pueden comer al paso
        if (oldY - 2 === y) {
          comeralpasoconejo = x + "," + (oldY - 1);
          //guardamos en firebase
          guardar_comer_al_paso_conejo(comeralpasoconejo);
        } else {
          comeralpasoconejo = "";
          //guardamos en firebase
          guardar_comer_al_paso_conejo(comeralpasoconejo);
        }
      }
    }
    if (piece === ARDILLA) {
      //revisamos si acaba de comer al paso para capturar ficha
      if (
        x + "," + y === comeralpasoardilla ||
        x + "," + y === comeralpasoconejo ||
        x + "," + y === comeralpaso
      ) {
        //capturamos la ficha
        board.tiles[y + 1][x].pieceType = EMPTY;
        board.tiles[y + 1][x].team = EMPTY;
      } else {
        //revisamos si se lo pueden comer al paso
        if (oldY - 2 === y) {
          comeralpasoardilla = x + "," + (oldY - 1);
          //guardamos en firebase
          guardar_comer_al_paso_ardilla(comeralpasoardilla);
        } else {
          comeralpasoardilla = "";
          //guardamos en firebase
          guardar_comer_al_paso_ardilla(comeralpasoardilla);
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
      console.log("Se movió Rey Blanco");
      posicionreyblanco = x + "," + y;
    }

    //incrementamos el numero de movimientos de la torre
    if (piece === ROOK) {
      if (oldX === 0 && oldY === 9) {
        contadortorre1blanco = contadortorre1blanco + 1;
        console.log("Se movió Torre 1 Blanca");
      }
      if (oldX === 8 && oldY === 9) {
        contadortorre2blanco = contadortorre2blanco + 1;
        console.log("Se movió Torre 2 Blanca");
      }
    }

    //revisamos si movio ardilla y 2 lugares hacia el frente
    if (piece === ARDILLA && oldY - 2 === y) {
      var lugar_saltado = oldY - 1;
      //console.log(board.tiles[lugar_saltado][oldX].pieceType+'/'+board.tiles[lugar_saltado][oldX].team);

      //vemos si habia pieza en el lugar saltado y de que equipo es
      if (board.tiles[lugar_saltado][oldX].pieceType !== -1) {
        if (board.tiles[lugar_saltado][oldX].team === 0) {
          console.log("Ardilla blanca salto 2 lugares y salto ficha amiga");
        }
        if (board.tiles[lugar_saltado][oldX].team === 1) {
          console.log("Ardilla blanca salto 2 lugares y salto ficha enemiga");
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
        console.log(
          "Ardilla blanca salto 2 lugares y no habia piezas intermedias"
        );
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
          console.log("Ardilla blanca salto 3 lugares y salto 2 fichas amigas");
        }

        if (
          board.tiles[lugar_saltado1][oldX].team === 1 &&
          board.tiles[lugar_saltado2][oldX].team === 1
        ) {
          console.log(
            "Ardilla blanca salto 3 lugares y salto 2 fichas enemigas"
          );

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
          console.log(
            "Ardilla blanca salto 3 lugares y salto 1 fichas enemiga"
          );

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
          console.log(
            "Ardilla blanca salto 3 lugares y salto 1 fichas enemiga"
          );

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
          console.log(
            "Ardilla blanca salto 3 lugares y salto 1 fichas enemiga y una vacia"
          );

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
          console.log(
            "Ardilla blanca salto 3 lugares y salto 1 fichas enemiga"
          );

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
          console.log(
            "Ardilla blanca salto 3 lugares y salto 1 ficha amiga y una vacia"
          );
        }
        if (
          board.tiles[lugar_saltado1][oldX].team === 0 &&
          board.tiles[lugar_saltado2][oldX].team === -1
        ) {
          console.log(
            "Ardilla blanca salto 3 lugares y salto 1 ficha amiga y una vacia"
          );
        }
      } else {
        console.log(
          "Ardilla blanca salto 3 lugares y no habia piezas intermedias"
        );
      }
    }

    if (piece === CONEJO && oldY - 2 === y) {
      lugar_saltado = oldY - 1;
      //console.log(board.tiles[lugar_saltado][oldX].pieceType+'/'+board.tiles[lugar_saltado][oldX].team);

      //vemos si habia pieza en el lugar saltado y de que equipo es
      if (board.tiles[lugar_saltado][oldX].pieceType !== -1) {
        if (board.tiles[lugar_saltado][oldX].team === 0) {
          console.log("Conejo blanco salto 2 lugares y salto ficha amiga");
        }
        if (board.tiles[lugar_saltado][oldX].team === 1) {
          console.log("Conejo blanco salto 2 lugares y salto ficha enemiga");
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
        console.log(
          "Conejo blanco salto 2 lugares y no habia piezas intermedias"
        );
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
        //whiteCasualities[board.tiles[y - 1][x].pieceType]++;
        //ultimapiezacapturadablanca =
        //board.tiles[y - 1][x].pieceType + "/" + x + "," + (y - 1);
        //ultimotipodemovimiento = "Captura";
        //updateWhiteCasualities();
        //capturamos la ficha
        board.tiles[y - 1][x].pieceType = EMPTY;
        board.tiles[y - 1][x].team = EMPTY;
      } else {
        //revisamos si se lo pueden comer al paso
        if (oldY + 2 === y) {
          comeralpaso = x + "," + (oldY + 1);
          //guardamos en firebase
          guardar_comer_al_paso(comeralpaso);
        } else {
          comeralpaso = "";
          //guardamos en firebase
          guardar_comer_al_paso(comeralpaso);
        }
      }
    }
    if (piece === CONEJO) {
      //revisamos si acaba de comer al paso
      if (x + "," + y === comeralpasoconejo || x + "," + y === comeralpaso) {
        //capturamos la ficha
        board.tiles[y - 1][x].pieceType = EMPTY;
        board.tiles[y - 1][x].team = EMPTY;
      } else {
        //revisamos si se lo pueden comer al paso
        if (oldY + 2 === y) {
          comeralpasoconejo = x + "," + (oldY + 1);
          //guardamos en firebase
          guardar_comer_al_paso_conejo(comeralpasoconejo);
        } else {
          comeralpasoconejo = "";
          //guardamos en firebase
          guardar_comer_al_paso_conejo(comeralpasoconejo);
        }
      }
    }
    if (piece === ARDILLA) {
      //revisamos si acaba de comer al paso
      if (
        x + "," + y === comeralpasoardilla ||
        x + "," + y === comeralpasoconejo ||
        x + "," + y === comeralpaso
      ) {
        //capturamos la ficha
        board.tiles[y - 1][x].pieceType = EMPTY;
        board.tiles[y - 1][x].team = EMPTY;
      } else {
        //revisamos si se lo pueden comer al paso
        if (oldY + 2 === y) {
          comeralpasoardilla = x + "," + (oldY + 1);
          //guardamos en firebase
          guardar_comer_al_paso_ardilla(comeralpasoardilla);
        } else {
          comeralpasoardilla = "";
          //guardamos en firebase
          guardar_comer_al_paso_ardilla(comeralpasoardilla);
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
      console.log("Se movió Rey Negro");
      posicionreynegro = x + "," + y;
    }
    //incrementamos el numero de movimientos de la torre
    if (piece === ROOK) {
      if (oldX === 0 && oldY === 0) {
        contadortorre1negro = contadortorre1negro + 1;
        console.log("Se movió Torre 1 Negra");
      }
      if (oldX === 8 && oldY === 0) {
        contadortorre2negro = contadortorre2negro + 1;
        console.log("Se movió Torre 2 Negra");
      }
    }

    //revisamos si movio ardilla y 2 lugares hacia el frente
    if (piece === ARDILLA && oldY + 2 === y) {
      lugar_saltado = oldY + 1;

      //vemos si habia pieza en el lugar saltado y de que equipo es
      if (board.tiles[lugar_saltado][oldX].pieceType !== -1) {
        if (board.tiles[lugar_saltado][oldX].team === 1) {
          console.log("Ardilla negra salto 2 lugares y salto ficha amiga");
        }
        if (board.tiles[lugar_saltado][oldX].team === 0) {
          console.log("Ardilla negra salto 2 lugares y salto ficha enemiga");
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
        console.log(
          "Ardilla negra salto 2 lugares y no habia piezas intermedias"
        );
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
          console.log("Ardilla negra salto 3 lugares y salto 2 fichas amigas");
        }

        if (
          board.tiles[lugar_saltado1][oldX].team === 0 &&
          board.tiles[lugar_saltado2][oldX].team === 0
        ) {
          console.log(
            "Ardilla negra salto 3 lugares y salto 2 fichas enemigas"
          );

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
            lugar_saltado2; //chessjs-2dcfc.web.app/game
          https: ultimotipodemovimiento = "Captura";
          updateWhiteCasualities();
          //capturamos la ficha
          board.tiles[lugar_saltado2][oldX].pieceType = EMPTY;
          board.tiles[lugar_saltado2][oldX].team = EMPTY;
        }

        if (
          board.tiles[lugar_saltado1][oldX].team === 1 &&
          board.tiles[lugar_saltado2][oldX].team === 0
        ) {
          console.log("Ardilla negra salto 3 lugares y salto 1 fichas enemiga");

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
          console.log("Ardilla negra salto 3 lugares y salto 1 fichas enemiga");

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
          console.log(
            "Ardilla negra salto 3 lugares y salto 1 fichas enemiga y una vacia"
          );

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
          console.log("Ardilla negra salto 3 lugares y salto 1 fichas enemiga");

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
          console.log(
            "Ardilla negra salto 3 lugares y salto 1 ficha amiga y una vacia"
          );
        }
        if (
          board.tiles[lugar_saltado1][oldX].team === 1 &&
          board.tiles[lugar_saltado2][oldX].team === -1
        ) {
          console.log(
            "Ardilla negra salto 3 lugares y salto 1 ficha amiga y una vacia"
          );
        }
      } else {
        console.log(
          "Ardilla negra salto 3 lugares y no habia piezas intermedias"
        );
      }
    }

    if (piece === CONEJO && oldY + 2 === y) {
      lugar_saltado = oldY + 1;

      //vemos si habia pieza en el lugar saltado y de que equipo es
      if (board.tiles[lugar_saltado][oldX].pieceType !== -1) {
        if (board.tiles[lugar_saltado][oldX].team === 1) {
          console.log("Conejo negro salto 2 lugares y salto ficha amiga");
        }
        if (board.tiles[lugar_saltado][oldX].team === 0) {
          console.log("Conejo negro salto 2 lugares y salto ficha enemiga");
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
        console.log(
          "Conejo negro salto 2 lugares y no habia piezas intermedias"
        );
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

    if (checkKingWhiteMovepossible(checkX, checkY) === true) {
      //alert('Movimiento inválido');
      //regresamos todo a como estaba antes del movimiento
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

    if (checkKingBlackMovepossible(checkX, checkY) === true) {
      //alert('Movimiento inválido');
      //regresamos todo a como estaba antes del movimiento
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
  ultimomovimiento = piece + "/" + oldX + "," + oldY + "/" + x + "," + y;
  nomenclatura =
    piecesCharacters[piece] + "/" + oldX + "," + oldY + "/" + x + "," + y;
}
function ganoleon() {
  for (let j = 0; j < BOARD_WIDTH; j++) {
    let pieza = board.tiles[9][j].pieceType;
    if (pieza === LEON) {
      let leonequipo = board.tiles[9][j].team;
      if (leonequipo === BLACK) {
        contadorleonnegro = contadorleonnegro + 1;
      }
      if (contadorleonnegro === 3) {
        if (currentTeam === BLACK) blackVictories++;
        startGame();
      }
    }
  }

  for (let j = 0; j < BOARD_WIDTH; j++) {
    let pieza = board.tiles[0][j].pieceType;
    if (pieza === LEON) {
      let leonequipo = board.tiles[9][j].team;
      if (leonequipo === WHITE) {
        contadorleonblanco = contadorleonblanco + 1;
      }
      if (contadorleonblanco === 3) {
        if (currentTeam === WHITE) whiteVictories++;
        startGame();
      }
    }
  }
}

export async function changeCurrentTeam(skip = false) {
  if (serverGameData == null) return;
  if (serverGameData?.player2 == null) return;
  if (serverGameData?.player1 == null) return;

  var newTurno = numero_turno + 1;

  if (
    serverGameData?.numero_turno % 2 == 0 &&
    serverGameData?.numero_turno != 0
  ) {
    marca_jugada(serverGameData?.numero_turno % 9);
  }

  if (
    serverGameData?.numero_turno % 9 == 0 &&
    serverGameData?.numero_turno != 0
  ) {
    await getGameDbRef()
      .update({
        board,
        numero_turno: newTurno,
        lastPiecejoue: {
          createdAt: Date.now(),
        },
      })
      .catch(console.error);
    return;
  }

  if (currentTeam === WHITE) {
    await getGameDbRef()
      .update({
        board,
        whiteCasualities: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
        side: serverGameData?.player2,
        numero_turno: newTurno,
      })
      .catch(console.error);
  } else {
    await getGameDbRef()
      .update({
        board,
        blackCasualities: [2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0],
        side: serverGameData?.player1,
        numero_turno: newTurno,
      })
      .catch(console.error);
  }
  if (!skip) {
    await getGameDbRef()
      .child("jugadas")
      .push({
        uid: firebase.auth().currentUser?.uid,
        movimiento: nomenclatura,
        createdAt: Date.now(),
      })
      .catch(console.error);
  }
}

async function repaintBoard() {
  /**
   * dispatch update board
   */

  /*await getGameDbRef().update({ board }).catch(console.error);*/

  drawBoard();
  checkPossiblePlays();
  drawPieces();
}

function drawBoard() {
  chessCtx.fillStyle = WHITE_TILE_COLOR;
  chessCtx.fillRect(0, 0, BOARD_WIDTH * TILE_SIZE, BOARD_HEIGHT * TILE_SIZE);

  for (let i = 0; i < BOARD_HEIGHT; i++) {
    if (i > 2 && i < 7) {
      for (let j = 0; j < BOARD_WIDTH; j++) {
        if ((i + j) % 2 === 1) {
          drawTile(j, i, MIDDEL_TILE_COLOR);
        }
      }
    } else {
      for (let j = 0; j < BOARD_WIDTH; j++) {
        if ((i + j) % 2 === 1) {
          drawTile(j, i, BLACK_TILE_COLOR);
        }
      }
    }
  }
}

function drawTile(x, y, fillStyle) {
  chessCtx.fillStyle = fillStyle;
  chessCtx.fillRect(TILE_SIZE * x, TILE_SIZE * y, TILE_SIZE, TILE_SIZE);
}

function drawCircle(x, y, fillStyle) {
  chessCtx.fillStyle = fillStyle;
  chessCtx.beginPath();
  chessCtx.arc(
    TILE_SIZE * (x + 0.5),
    TILE_SIZE * (y + 0.5),
    TILE_SIZE / 5,
    0,
    2 * Math.PI
  );
  chessCtx.fill();
}

function drawCorners(x, y, fillStyle) {
  chessCtx.fillStyle = fillStyle;

  chessCtx.beginPath();
  chessCtx.moveTo(TILE_SIZE * x, TILE_SIZE * y);
  chessCtx.lineTo(TILE_SIZE * x + 15, TILE_SIZE * y);
  chessCtx.lineTo(TILE_SIZE * x, TILE_SIZE * y + 15);
  chessCtx.fill();

  chessCtx.beginPath();
  chessCtx.moveTo(TILE_SIZE * (x + 1), TILE_SIZE * y);
  chessCtx.lineTo(TILE_SIZE * (x + 1) - 15, TILE_SIZE * y);
  chessCtx.lineTo(TILE_SIZE * (x + 1), TILE_SIZE * y + 15);
  chessCtx.fill();

  chessCtx.beginPath();
  chessCtx.moveTo(TILE_SIZE * x, TILE_SIZE * (y + 1));
  chessCtx.lineTo(TILE_SIZE * x + 15, TILE_SIZE * (y + 1));
  chessCtx.lineTo(TILE_SIZE * x, TILE_SIZE * (y + 1) - 15);
  chessCtx.fill();

  chessCtx.beginPath();
  chessCtx.moveTo(TILE_SIZE * (x + 1), TILE_SIZE * (y + 1));
  chessCtx.lineTo(TILE_SIZE * (x + 1) - 15, TILE_SIZE * (y + 1));
  chessCtx.lineTo(TILE_SIZE * (x + 1), TILE_SIZE * (y + 1) - 15);
  chessCtx.fill();
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
    if (pieza === PERRO) {
      board.tiles[0][j].pieceType = ROOK;
    }
  }

  for (let j = 0; j < BOARD_WIDTH; j++) {
    let pieza = board.tiles[9][j].pieceType;
    if (pieza === PERRO) {
      board.tiles[9][j].pieceType = ROOK;
    }
  }

  for (let j = 0; j < BOARD_WIDTH; j++) {
    let pieza = board.tiles[0][j].pieceType;
    if (pieza === LEON) {
      board.tiles[0][j].pieceType = FAKEKING;
      if (currentTeam === WHITE) {
        marcaleonnegro(true);
        marcarposicionleonnegro("0," + j);
      } else {
        marcaleonblanco(true);
        marcarposicionleonblanco("0," + j);
      }
    }
  }

  for (let j = 0; j < BOARD_WIDTH; j++) {
    let pieza = board.tiles[9][j].pieceType;
    if (pieza === LEON) {
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

  for (let i = 0; i < BOARD_HEIGHT; i++) {
    for (let j = 0; j < BOARD_WIDTH; j++) {
      if (board.tiles[i][j].team === EMPTY) continue;

      if (board.tiles[i][j].team === WHITE) {
        chessCtx.fillStyle = "#FF0000";
      } else {
        chessCtx.fillStyle = "#0000FF";
      }

      chessCtx.font = "38px Arial";

      let pieceType = board.tiles[i][j].pieceType;
      let equipo = board.tiles[i][j].team;

      if (pieceType === 6) {
        if (equipo === WHITE) {
          var img1 = new Image();
          img1.src = ardillabco;
          img1.onload = () => {
            chessCtx.drawImage(
              img1,
              TILE_SIZE * (j + 1 / 11),
              TILE_SIZE * (i + 1 / 11),
              50,
              50
            );
          };
        } else {
          var img2 = new Image();
          img2.src = ardilla;
          img2.onload = () => {
            chessCtx.drawImage(
              img2,
              TILE_SIZE * (j + 1 / 11),
              TILE_SIZE * (i + 1 / 11),
              50,
              50
            );
          };
        }
      } else if (pieceType === 0) {
        if (equipo === WHITE) {
          var img3 = new Image();
          img3.src = peonbco;
          img3.onload = () => {
            chessCtx.drawImage(
              img3,
              TILE_SIZE * (j + 1 / 11),
              TILE_SIZE * (i + 1 / 11),
              50,
              50
            );
          };
        } else {
          var img4 = new Image();
          img4.src = peon;
          img4.onload = () => {
            chessCtx.drawImage(
              img4,
              TILE_SIZE * (j + 1 / 11),
              TILE_SIZE * (i + 1 / 11),
              50,
              50
            );
          };
        }
      } else if (pieceType === 1) {
        if (equipo === WHITE) {
          var img5 = new Image();
          img5.src = caballobco;
          img5.onload = () => {
            chessCtx.drawImage(
              img5,
              TILE_SIZE * (j + 1 / 11),
              TILE_SIZE * (i + 1 / 11),
              50,
              50
            );
          };
        } else {
          var img6 = new Image();
          img6.src = caballo;
          img6.onload = () => {
            chessCtx.drawImage(
              img6,
              TILE_SIZE * (j + 1 / 11),
              TILE_SIZE * (i + 1 / 11),
              50,
              50
            );
          };
        }
      } else if (pieceType === 2) {
        if (equipo === WHITE) {
          var img7 = new Image();
          img7.src = alfilbco;
          img7.onload = () => {
            chessCtx.drawImage(
              img7,
              TILE_SIZE * (j + 1 / 11),
              TILE_SIZE * (i + 1 / 11),
              50,
              50
            );
          };
        } else {
          var img8 = new Image();
          img8.src = alfil;
          img8.onload = () => {
            chessCtx.drawImage(
              img8,
              TILE_SIZE * (j + 1 / 11),
              TILE_SIZE * (i + 1 / 11),
              50,
              50
            );
          };
        }
      } else if (pieceType === 3) {
        if (equipo === WHITE) {
          var img9 = new Image();
          img9.src = torrebco;
          img9.onload = () => {
            chessCtx.drawImage(
              img9,
              TILE_SIZE * (j + 1 / 11),
              TILE_SIZE * (i + 1 / 11),
              50,
              50
            );
          };
        } else {
          var img10 = new Image();
          img10.src = torre;
          img10.onload = () => {
            chessCtx.drawImage(
              img10,
              TILE_SIZE * (j + 1 / 11),
              TILE_SIZE * (i + 1 / 11),
              50,
              50
            );
          };
        }
      } else if (pieceType === 4) {
        if (equipo === WHITE) {
          var img11 = new Image();
          img11.src = reinabco;
          img11.onload = () => {
            chessCtx.drawImage(
              img11,
              TILE_SIZE * (j + 1 / 11),
              TILE_SIZE * (i + 1 / 11),
              50,
              50
            );
          };
        } else {
          var img12 = new Image();
          img12.src = reina;
          img12.onload = () => {
            chessCtx.drawImage(
              img12,
              TILE_SIZE * (j + 1 / 11),
              TILE_SIZE * (i + 1 / 11),
              50,
              50
            );
          };
        }
      } else if (pieceType === 5) {
        if (equipo === WHITE) {
          var img13 = new Image();
          img13.src = reybco;
          img13.onload = () => {
            chessCtx.drawImage(
              img13,
              TILE_SIZE * (j + 1 / 11),
              TILE_SIZE * (i + 1 / 11),
              50,
              50
            );
          };
        } else {
          var img14 = new Image();
          img14.src = rey;
          img14.onload = () => {
            chessCtx.drawImage(
              img14,
              TILE_SIZE * (j + 1 / 11),
              TILE_SIZE * (i + 1 / 11),
              50,
              50
            );
          };
        }
      } else if (pieceType === 7) {
        if (equipo === WHITE) {
          var img15 = new Image();
          img15.src = conejobco;
          img15.onload = () => {
            chessCtx.drawImage(
              img15,
              TILE_SIZE * (j + 1 / 11),
              TILE_SIZE * (i + 1 / 11),
              50,
              50
            );
          };
        } else {
          var img16 = new Image();
          img16.src = conejo;
          img16.onload = () => {
            chessCtx.drawImage(
              img16,
              TILE_SIZE * (j + 1 / 11),
              TILE_SIZE * (i + 1 / 11),
              50,
              50
            );
          };
        }
      } else if (pieceType === 8) {
        if (equipo === WHITE) {
          var img17 = new Image();
          img17.src = perrobco;
          img17.onload = () => {
            chessCtx.drawImage(
              img17,
              TILE_SIZE * (j + 1 / 11),
              TILE_SIZE * (i + 1 / 11),
              50,
              50
            );
          };
        } else {
          var img18 = new Image();
          img18.src = perro;
          img18.onload = () => {
            chessCtx.drawImage(
              img18,
              TILE_SIZE * (j + 1 / 11),
              TILE_SIZE * (i + 1 / 11),
              50,
              50
            );
          };
        }
      } else if (pieceType === 9) {
        if (equipo === WHITE) {
          var img19 = new Image();
          img19.src = panterabco;
          img19.onload = () => {
            chessCtx.drawImage(
              img19,
              TILE_SIZE * (j + 1 / 11),
              TILE_SIZE * (i + 1 / 11),
              50,
              50
            );
          };
        } else {
          var img20 = new Image();
          img20.src = pantera;
          img20.onload = () => {
            chessCtx.drawImage(
              img20,
              TILE_SIZE * (j + 1 / 11),
              TILE_SIZE * (i + 1 / 11),
              50,
              50
            );
          };
        }
      } else if (pieceType === 10) {
        if (equipo === WHITE) {
          var img21 = new Image();
          img21.src = elefantebco;
          img21.onload = () => {
            chessCtx.drawImage(
              img21,
              TILE_SIZE * (j + 1 / 11),
              TILE_SIZE * (i + 1 / 11),
              50,
              50
            );
          };
        } else {
          var img22 = new Image();
          img22.src = elefante;
          img22.onload = () => {
            chessCtx.drawImage(
              img22,
              TILE_SIZE * (j + 1 / 11),
              TILE_SIZE * (i + 1 / 11),
              50,
              50
            );
          };
        }
      } else if (pieceType === 11) {
        if (equipo === WHITE) {
          var img23 = new Image();
          img23.src = leonbco;
          img23.onload = () => {
            chessCtx.drawImage(
              img23,
              TILE_SIZE * (j + 1 / 11),
              TILE_SIZE * (i + 1 / 11),
              50,
              50
            );
          };
        } else {
          var img24 = new Image();
          img24.src = leon;
          img24.onload = () => {
            chessCtx.drawImage(
              img24,
              TILE_SIZE * (j + 1 / 11),
              TILE_SIZE * (i + 1 / 11),
              50,
              50
            );
          };
        }
      } else if (pieceType === 12) {
        if (equipo === WHITE) {
          var img25 = new Image();
          img25.src = fakekingbco;
          img25.onload = () => {
            chessCtx.drawImage(
              img25,
              TILE_SIZE * (j + 1 / 11),
              TILE_SIZE * (i + 1 / 11),
              50,
              50
            );
          };
        } else {
          var img26 = new Image();
          img26.src = fakeking;
          img26.onload = () => {
            chessCtx.drawImage(
              img26,
              TILE_SIZE * (j + 1 / 11),
              TILE_SIZE * (i + 1 / 11),
              50,
              50
            );
          };
        }
      }
    }
  }
}

function updateWhiteCasualities() {
  updateCasualities(whiteCasualities, whiteCasualitiesText);
}

function updateBlackCasualities() {
  updateCasualities(blackCasualities, blackCasualitiesText);
}

function updateCasualities(casualities, text) {
  let none = true;

  for (let i = LEON; i >= PAWN; i--) {
    if (casualities[i] === 0) continue;

    if (none) {
      none = false;
    } else {
    }
  }
}

function updateTotalVictories() {}

function getOppositeTeam(team) {
  if (team === WHITE) return BLACK;
  else if (team === BLACK) return WHITE;
  else return EMPTY;
}

function checkTileUnderAttack(x, y) {
  //recorremos todo el tablero y llenamos el arreglo de casillas en peligro
  for (let xx = 0; xx <= 8; xx++) {
    for (let yy = 0; yy <= 9; yy++) {
      //vemos que la pieza sea enemiga
      if (board.tiles[yy][xx].team === getOppositeTeam(currentTeam)) {
        currentTeamJUSTCHECK = getOppositeTeam(currentTeam);
        let tile = board.tiles[yy][xx];
        if (tile.pieceType === PAWN) checkPossiblePlaysPawnJUSTCHECK(xx, yy);
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
  if (board.tiles[curY + direction][curX].pieceType !== ELEFANTE) {
    checkPossibleCaptureJUSTCHECK(curX, curY + direction);
  }

  if (
    curY + 2 * direction > 0 &&
    curY + 2 * direction > 0 &&
    curY + 2 * direction <= BOARD_HEIGHT - 1 &&
    board.tiles[curY + 1 * direction][curX].pieceType === EMPTY
  ) {
    // Advance two tile
    checkPossibleMoveJUSTCHECK(curX, curY + 2 * direction);
    if (board.tiles[curY + 2 * direction][curX].pieceType !== ELEFANTE) {
      checkPossibleCaptureJUSTCHECK(curX, curY + 2 * direction);
    }
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
  if (
    curX - 1 >= 0 &&
    board.tiles[curY + direction][curX - 1].pieceType !== ELEFANTE
  ) {
    checkPossibleCaptureJUSTCHECK(curX - 1, curY + direction);
  }
  if (
    curX - 2 >= 0 &&
    curY + 2 * direction > 0 &&
    curY + 2 * direction <= BOARD_HEIGHT - 1 &&
    board.tiles[curY + 2 * direction][curX - 2].pieceType !== ELEFANTE &&
    board.tiles[curY + 1 * direction][curX - 1].pieceType === EMPTY
  ) {
    checkPossibleCaptureJUSTCHECK(curX - 2, curY + 2 * direction);
  }

  // Check diagonal right capture
  if (
    curX + 1 <= BOARD_WIDTH - 1 &&
    board.tiles[curY + direction][curX + 1].pieceType !== ELEFANTE
  ) {
    checkPossibleCaptureJUSTCHECK(curX + 1, curY + direction);
  }
  if (
    curX + 2 <= BOARD_WIDTH - 1 &&
    curY + 2 * direction > 0 &&
    curY + 2 * direction <= BOARD_HEIGHT - 1 &&
    board.tiles[curY + 2 * direction][curX + 2].pieceType !== ELEFANTE &&
    board.tiles[curY + 1 * direction][curX + 1].pieceType === EMPTY
  ) {
    checkPossibleCaptureJUSTCHECK(curX + 2, curY + 2 * direction);
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
  /*
    if(board.tiles[y][x].pieceType === KING){
      if (currentTeamJUSTCHECK === WHITE){
        jaquereynegro = 'Si';	
        posicionreynegro = x+","+y;
        if(moverelreynegro(x,y) === false){
          alert("¡JAQUE MATE!");
        }else{
          alert("¡JAQUE!");	
        }
      }else{
        jaquereyblanco = 'Si';	
        posicionreyblanco = x+","+y;
        if(moverelreyblanco(x,y) === false){
          alert("¡JAQUE MATE!");
        }else{
          alert("¡JAQUE!");	
        }
      }
    }
  */
  return true;
}

function moverelreynegro(x, y) {
  //vemos si se puede movar a lugares vacios o con piezas enemigas dentro del rango de movimiento del rey

  //movemos al rey ala izq
  if (x - 1 < BOARD_WIDTH - 1 && x - 1 >= 0) {
    //console.log((x-1)+","+(y)+"type:"+board.tiles[y][x-1].pieceType+" attack:"+checkKingBlackMovepossible(x-1, y));

    if (
      board.tiles[y][x - 1].pieceType === EMPTY &&
      checkKingBlackMovepossible(x - 1, y) === false
    ) {
      //console.log("true");
      return true;
    }
  }
  //movemos al rey ala der
  if (x + 1 < BOARD_WIDTH - 1 && x + 1 >= 0) {
    //console.log((x+1)+","+(y)+"type:"+board.tiles[y][x+1].pieceType+" attack:"+checkKingBlackMovepossible(x+1, y));

    if (
      board.tiles[y][x + 1].pieceType === EMPTY &&
      checkKingBlackMovepossible(x + 1, y) === false
    ) {
      //console.log("true");
      return true;
    }
  }

  //movemos al rey arriba
  if (y - 1 < BOARD_HEIGHT - 1 && y - 1 >= 0) {
    //console.log((x)+","+(y-1)+"type:"+board.tiles[y-1][x].pieceType+" attack:"+checkKingBlackMovepossible(x, y-1));

    if (
      board.tiles[y - 1][x].pieceType === EMPTY &&
      checkKingBlackMovepossible(x, y - 1) === false
    ) {
      //console.log("true");
      return true;
    }
  }

  //movemos al rey abajo
  if (y + 1 < BOARD_HEIGHT - 1 && y + 1 >= 0) {
    //console.log((x)+","+(y+1)+"type:"+board.tiles[y+1][x].pieceType+" attack:"+checkKingBlackMovepossible(x, y+1));

    if (
      board.tiles[y + 1][x].pieceType === EMPTY &&
      checkKingBlackMovepossible(x, y + 1) === false
    ) {
      //console.log("true");
      return true;
    }
  }

  //movemos al rey diag izq arriba
  if (
    x - 1 < BOARD_WIDTH - 1 &&
    x - 1 >= 0 &&
    y - 1 < BOARD_HEIGHT - 1 &&
    y - 1 >= 0
  ) {
    //console.log((x-1)+","+(y-1)+"type:"+board.tiles[y-1][x-1].pieceType+" attack:"+checkKingBlackMovepossible(x-1, y-1));

    if (
      board.tiles[y - 1][x - 1].pieceType === EMPTY &&
      checkKingBlackMovepossible(x - 1, y - 1) === false
    ) {
      //console.log("true");
      return true;
    }
  }
  //movemos al rey ala der arriba
  if (
    x + 1 < BOARD_WIDTH - 1 &&
    x + 1 >= 0 &&
    y - 1 < BOARD_HEIGHT - 1 &&
    y - 1 >= 0
  ) {
    //console.log((x+1)+","+(y-1)+"type:"+board.tiles[y-1][x+1].pieceType+" attack:"+checkKingBlackMovepossible(x+1, y-1));

    if (
      board.tiles[y - 1][x + 1].pieceType === EMPTY &&
      checkKingBlackMovepossible(x + 1, y - 1) === false
    ) {
      //console.log("true");
      return true;
    }
  }
  //movemos al rey diag izq abajo
  if (
    x - 1 < BOARD_WIDTH - 1 &&
    x - 1 >= 0 &&
    y + 1 < BOARD_HEIGHT - 1 &&
    y + 1 >= 0
  ) {
    //console.log((x-1)+","+(y+1)+"type:"+board.tiles[y+1][x-1].pieceType+" attack:"+checkKingBlackMovepossible(x-1, y+1));

    if (
      board.tiles[y + 1][x - 1].pieceType === EMPTY &&
      checkKingBlackMovepossible(x - 1, y + 1) === false
    ) {
      //console.log("true");
      return true;
    }
  }

  //movemos al rey diag der abajo
  if (
    x + 1 < BOARD_WIDTH - 1 &&
    x + 1 >= 0 &&
    y + 1 < BOARD_HEIGHT - 1 &&
    y + 1 >= 0
  ) {
    //console.log((x+1)+","+(y+1)+"type:"+board.tiles[y+1][x+1].pieceType+" attack:"+checkKingBlackMovepossible(x+1, y+1));

    if (
      board.tiles[y + 1][x + 1].pieceType === EMPTY &&
      checkKingBlackMovepossible(x + 1, y + 1) === false
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
  if (x - 1 < BOARD_WIDTH - 1 && x - 1 >= 0) {
    if (
      board.tiles[y][x - 1].pieceType === EMPTY &&
      checkKingWhiteMovepossible(x - 1, y) === false
    ) {
      //console.log("true");
      return true;
    }
  }
  //movemos al rey ala der
  if (x + 1 < BOARD_WIDTH - 1 && x + 1 >= 0) {
    if (
      board.tiles[y][x + 1].pieceType === EMPTY &&
      checkKingWhiteMovepossible(x + 1, y) === false
    ) {
      //console.log("true");
      return true;
    }
  }

  //movemos al rey arriba
  if (y - 1 < BOARD_HEIGHT - 1 && y - 1 >= 0) {
    if (
      board.tiles[y - 1][x].pieceType === EMPTY &&
      checkKingWhiteMovepossible(x, y - 1) === false
    ) {
      //console.log("true");
      return true;
    }
  }

  //movemos al rey abajo
  if (y + 1 < BOARD_HEIGHT - 1 && y + 1 >= 0) {
    if (
      board.tiles[y + 1][x].pieceType === EMPTY &&
      checkKingWhiteMovepossible(x, y + 1) === false
    ) {
      //console.log("true");
      return true;
    }
  }

  //movemos al rey diag izq arriba
  if (
    x - 1 < BOARD_WIDTH - 1 &&
    x - 1 >= 0 &&
    y - 1 < BOARD_HEIGHT - 1 &&
    y - 1 >= 0
  ) {
    if (
      board.tiles[y - 1][x - 1].pieceType === EMPTY &&
      checkKingWhiteMovepossible(x - 1, y - 1) === false
    ) {
      //console.log("true");
      return true;
    }
  }
  //movemos al rey ala der arriba
  if (
    x + 1 < BOARD_WIDTH - 1 &&
    x + 1 >= 0 &&
    y - 1 < BOARD_HEIGHT - 1 &&
    y - 1 >= 0
  ) {
    if (
      board.tiles[y - 1][x + 1].pieceType === EMPTY &&
      checkKingWhiteMovepossible(x + 1, y - 1) === false
    ) {
      //console.log("true");
      return true;
    }
  }
  //movemos al rey diag izq abajo
  if (
    x - 1 < BOARD_WIDTH - 1 &&
    x - 1 >= 0 &&
    y + 1 < BOARD_HEIGHT - 1 &&
    y + 1 >= 0
  ) {
    if (
      board.tiles[y + 1][x - 1].pieceType === EMPTY &&
      checkKingWhiteMovepossible(x - 1, y + 1) === false
    ) {
      //console.log("true");
      return true;
    }
  }

  //movemos al rey diag der abajo
  if (
    x + 1 < BOARD_WIDTH - 1 &&
    x + 1 >= 0 &&
    y + 1 < BOARD_HEIGHT - 1 &&
    y + 1 >= 0
  ) {
    if (
      board.tiles[y + 1][x + 1].pieceType === EMPTY &&
      checkKingWhiteMovepossible(x + 1, y + 1) === false
    ) {
      //console.log("true");
      return true;
    }
  }

  return false;
}

//BLACK
function checkKingBlackMovepossible(x, y) {
  //recorremos todo el tablero y llenamos el arreglo de casillas en peligro
  for (let xx = 0; xx <= 8; xx++) {
    for (let yy = 0; yy <= 9; yy++) {
      //vemos que la pieza sea blanca
      if (board.tiles[yy][xx].team === WHITE) {
        let tile = board.tiles[yy][xx];
        if (tile.pieceType === PAWN && tile.pieceType)
          checkPossiblePlaysPawnAGAINSTBLACK(xx, yy);
        else if (tile.pieceType === KNIGHT && tile.pieceType)
          checkPossiblePlaysKnightAGAINSTBLACK(xx, yy);
        else if (tile.pieceType === BISHOP && tile.pieceType)
          checkPossiblePlaysBishopAGAINSTBLACK(xx, yy);
        else if (tile.pieceType === ROOK && tile.pieceType)
          checkPossiblePlaysRookAGAINSTBLACK(xx, yy);
        else if (tile.pieceType === QUEEN && tile.pieceType)
          checkPossiblePlaysQueenAGAINSTBLACK(xx, yy);
        else if (tile.pieceType === KING && tile.pieceType)
          checkPossiblePlaysKingAGAINSTBLACK(xx, yy);
        else if (tile.pieceType === ARDILLA && tile.pieceType)
          checkPossiblePlaysArdillaAGAINSTBLACK(xx, yy);
        else if (tile.pieceType === CONEJO && tile.pieceType)
          checkPossiblePlaysConejoAGAINSTBLACK(xx, yy);
        else if (tile.pieceType === PERRO && tile.pieceType)
          checkPossiblePlaysPerroAGAINSTBLACK(xx, yy);
        else if (tile.pieceType === PANTERA && tile.pieceType)
          checkPossiblePlaysPanteraAGAINSTBLACK(xx, yy);
        else if (tile.pieceType === ELEFANTE && tile.pieceType)
          checkPossiblePlaysElefanteAGAINSTBLACK(xx, yy);
        else if (tile.pieceType === LEON && tile.pieceType)
          checkPossiblePlaysLeonAGAINSTBLACK(xx, yy);

        //console.log("checando:"+tile.pieceType+" "+xx+"/"+yy);
      }
    }
  }
  if (casillasenpeligro.includes(x + "/" + y)) {
    //vaciamos el arreglo
    casillasenpeligro = [];
    return true;
  } else {
    //vaciamos el arreglo
    casillasenpeligro = [];
    return false;
  }
}

function checkPossiblePlaysPawnAGAINSTBLACK(curX, curY) {
  //OJO AQUI ESTOY TOMANDO currentTeam = WHITE
  let direction;

  direction = -1;

  if (curY + direction < 0 || curY + direction > BOARD_HEIGHT - 1) return;

  // Advance one tile
  checkPossibleMoveAGAINSTBLACK(curX, curY + direction);

  // Check diagonal left capture
  if (curX - 1 >= 0) {
    if (board.tiles[curY + direction][curX - 1].pieceType !== ELEFANTE) {
      if (board.tiles[curY + direction][curX - 1].pieceType !== LEON) {
        checkPossibleCaptureAGAINSTBLACK(curX - 1, curY + direction);
      }
    }
  }

  // Check diagonal right capture
  if (curX + 1 <= BOARD_WIDTH - 1) {
    if (board.tiles[curY + direction][curX + 1].pieceType !== ELEFANTE) {
      if (board.tiles[curY + direction][curX + 1].pieceType !== LEON) {
        checkPossibleCaptureAGAINSTBLACK(curX + 1, curY + direction);
      }
    }
  }
}
function checkPossiblePlaysConejoAGAINSTBLACK(curX, curY) {
  let direction;

  direction = -1;

  if (curY + direction < 0 || curY + direction > BOARD_HEIGHT - 1) return;

  // Advance one tile
  checkPossibleMoveAGAINSTBLACK(curX, curY + direction);

  // Advance two tile
  //si es un PAWN si se puede saltar Y COMER SI NO SOLO AVANZA
  if (board.tiles[curY + 1 * direction][curX].pieceType === EMPTY) {
    //vemos que no se salga del tablero
    if (curY + 2 * direction < BOARD_HEIGHT && curY + 2 * direction >= 0) {
      checkPossibleMoveAGAINSTBLACK(curX, curY + 2 * direction);
    }
  } else {
    if (
      board.tiles[curY + 1 * direction][curX].pieceType === PAWN &&
      board.tiles[curY + 1 * direction][curX].team !== WHITE
    ) {
      checkPossibleMoveAGAINSTBLACK(curX, curY + 2 * direction);
    }
  }

  // Check diagonal right capture
  if (curX + 1 <= BOARD_WIDTH - 1)
    checkPossibleMoveAGAINSTBLACK(curX + 1, curY + direction);
  // Check diagonal left capture
  if (curX - 1 >= 0) checkPossibleMoveAGAINSTBLACK(curX - 1, curY + direction);

  // Check diagonal left capture
  if (curX - 1 >= 0) {
    if (board.tiles[curY + direction][curX - 1].pieceType !== ELEFANTE) {
      checkPossibleCaptureAGAINSTBLACK(curX - 1, curY + direction);
    }
  }

  // Check diagonal right capture
  if (curX + 1 <= BOARD_WIDTH - 1) {
    if (board.tiles[curY + direction][curX + 1].pieceType !== ELEFANTE) {
      checkPossibleCaptureAGAINSTBLACK(curX + 1, curY + direction);
    }
  }
}
function checkPossiblePlaysArdillaAGAINSTBLACK(curX, curY) {
  let direction;

  direction = -1;

  if (curY + direction < 0 || curY + direction > BOARD_HEIGHT - 1) return;

  // Advance one tile
  checkPossibleMoveAGAINSTBLACK(curX, curY + direction);

  // Advance two tile
  //si es un PAWN O CONEJO si se puede saltar y comer sino no hacer nada
  if (
    curY + 1 * direction >= 0 &&
    curY + 1 * direction <= BOARD_HEIGHT - 1 &&
    curY + 2 * direction >= 0 &&
    curY + 2 * direction <= BOARD_HEIGHT - 1
  ) {
    if (board.tiles[curY + 1 * direction][curX].team !== WHITE) {
      if (
        board.tiles[curY + 1 * direction][curX].pieceType === 0 ||
        board.tiles[curY + 1 * direction][curX].pieceType === CONEJO ||
        board.tiles[curY + 1 * direction][curX].pieceType === EMPTY
      ) {
        checkPossibleMoveAGAINSTBLACK(curX, curY + 2 * direction);
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
      board.tiles[curY + 1 * direction][curX].team !== WHITE &&
      board.tiles[curY + 2 * direction][curX].team !== WHITE
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
        checkPossibleMoveAGAINSTBLACK(curX, curY + 3 * direction);
      }
    }
  }
  // Advance Horizontal tile
  if (curX > 0) {
    checkPossibleMoveAGAINSTBLACK(curX - 1, curY);
  }
  if (curX < 8) {
    checkPossibleMoveAGAINSTBLACK(curX + 1, curY);
  }

  // Check diagonal right move
  if (curX + 1 <= BOARD_WIDTH - 1)
    checkPossibleMoveAGAINSTBLACK(curX + 1, curY + direction);
  // Check diagonal left move
  if (curX - 1 >= 0) checkPossibleMoveAGAINSTBLACK(curX - 1, curY + direction);

  // Check diagonal left capture
  if (curX - 1 >= 0) {
    if (board.tiles[curY + direction][curX - 1].pieceType !== ELEFANTE) {
      checkPossibleCaptureAGAINSTBLACK(curX - 1, curY + direction);
    }
  }

  // Check diagonal right capture
  if (curX + 1 <= BOARD_WIDTH - 1) {
    if (board.tiles[curY + direction][curX + 1].pieceType !== ELEFANTE) {
      checkPossibleCaptureAGAINSTBLACK(curX + 1, curY + direction);
    }
  }
}
function checkPossiblePlaysPerroAGAINSTBLACK(curX, curY) {
  let direction;

  direction = -1;

  if (curY + direction < 0 || curY + direction > BOARD_HEIGHT - 1) return;

  // Advance one tile
  checkPossibleMoveAGAINSTBLACK(curX, curY + direction);
  if (board.tiles[curY + direction][curX].pieceType !== ELEFANTE) {
    checkPossibleCaptureAGAINSTBLACK(curX, curY + direction);
  }

  if (
    curY + 2 * direction > 0 &&
    curY + 2 * direction > 0 &&
    curY + 2 * direction <= BOARD_HEIGHT - 1 &&
    board.tiles[curY + 1 * direction][curX].pieceType === EMPTY
  ) {
    // Advance two tile
    checkPossibleMoveAGAINSTBLACK(curX, curY + 2 * direction);
    if (board.tiles[curY + 2 * direction][curX].pieceType !== ELEFANTE) {
      checkPossibleCaptureAGAINSTBLACK(curX, curY + 2 * direction);
    }
  }

  // Advance Horizontal tile
  if (curX > 0) {
    checkPossibleMoveAGAINSTBLACK(curX - 1, curY);
  }
  if (curX > 1 && board.tiles[curY][curX - 1].pieceType === EMPTY) {
    checkPossibleMoveAGAINSTBLACK(curX - 2, curY);
  }
  if (curX < 8) {
    checkPossibleMoveAGAINSTBLACK(curX + 1, curY);
  }
  if (curX < 7 && board.tiles[curY][curX + 1].pieceType === EMPTY) {
    checkPossibleMoveAGAINSTBLACK(curX + 2, curY);
  }

  // Check diagonal right movimiento
  if (curX + 1 <= BOARD_WIDTH - 1) {
    checkPossibleMoveAGAINSTBLACK(curX + 1, curY + direction);
  }
  if (
    curX + 2 <= BOARD_WIDTH - 1 &&
    board.tiles[curY + direction][curX + 1].pieceType === EMPTY
  ) {
    checkPossibleMoveAGAINSTBLACK(curX + 2, curY + 2 * direction);
  }

  // Check diagonal left movimiento
  if (curX - 1 >= 0) {
    checkPossibleMoveAGAINSTBLACK(curX - 1, curY + direction);
  }
  if (
    curX - 2 >= 0 &&
    board.tiles[curY + direction][curX - 1].pieceType === EMPTY
  ) {
    checkPossibleMoveAGAINSTBLACK(curX - 2, curY + 2 * direction);
  }

  // Check diagonal left capture
  if (
    curX - 1 >= 0 &&
    board.tiles[curY + direction][curX - 1].pieceType !== ELEFANTE
  ) {
    checkPossibleCaptureAGAINSTBLACK(curX - 1, curY + direction);
  }
  if (
    curX - 2 >= 0 &&
    curY + 2 * direction > 0 &&
    curY + 2 * direction <= BOARD_HEIGHT - 1 &&
    board.tiles[curY + 2 * direction][curX - 2].pieceType !== ELEFANTE &&
    board.tiles[curY + 1 * direction][curX - 1].pieceType === EMPTY
  ) {
    checkPossibleCaptureAGAINSTBLACK(curX - 2, curY + 2 * direction);
  }

  // Check diagonal right capture
  if (
    curX + 1 <= BOARD_WIDTH - 1 &&
    board.tiles[curY + direction][curX + 1].pieceType !== ELEFANTE
  ) {
    checkPossibleCaptureAGAINSTBLACK(curX + 1, curY + direction);
  }
  if (
    curX + 2 <= BOARD_WIDTH - 1 &&
    curY + 2 * direction > 0 &&
    curY + 2 * direction <= BOARD_HEIGHT - 1 &&
    board.tiles[curY + 2 * direction][curX + 2].pieceType !== ELEFANTE &&
    board.tiles[curY + 1 * direction][curX + 1].pieceType === EMPTY
  ) {
    checkPossibleCaptureAGAINSTBLACK(curX + 2, curY + 2 * direction);
  }
}
function checkPossiblePlaysKnightAGAINSTBLACK(curX, curY) {
  // Far left moves
  if (curX - 2 >= 0) {
    // Upper move
    if (curY - 1 >= 0) checkPossiblePlayAGAINSTBLACK(curX - 2, curY - 1);

    // Lower move
    if (curY + 1 <= BOARD_HEIGHT - 1)
      checkPossiblePlayAGAINSTBLACK(curX - 2, curY + 1);
  }

  // Near left moves
  if (curX - 1 >= 0) {
    // Upper move
    if (curY - 2 >= 0) checkPossiblePlayAGAINSTBLACK(curX - 1, curY - 2);

    // Lower move
    if (curY + 2 <= BOARD_HEIGHT - 1)
      checkPossiblePlayAGAINSTBLACK(curX - 1, curY + 2);
  }

  // Near right moves
  if (curX + 1 <= BOARD_WIDTH - 1) {
    // Upper move
    if (curY - 2 >= 0) checkPossiblePlayAGAINSTBLACK(curX + 1, curY - 2);

    // Lower move
    if (curY + 2 <= BOARD_HEIGHT - 1)
      checkPossiblePlayAGAINSTBLACK(curX + 1, curY + 2);
  }

  // Far right moves
  if (curX + 2 <= BOARD_WIDTH - 1) {
    // Upper move
    if (curY - 1 >= 0) checkPossiblePlayAGAINSTBLACK(curX + 2, curY - 1);

    // Lower move
    if (curY + 1 <= BOARD_HEIGHT - 1)
      checkPossiblePlayAGAINSTBLACK(curX + 2, curY + 1);
  }
}
function checkPossiblePlaysPanteraAGAINSTBLACK(curX, curY) {
  // Far left moves
  if (curX - 3 >= 0) {
    // Upper move
    if (curY - 1 >= 0) checkPossiblePlayAGAINSTBLACK(curX - 3, curY - 1);

    // Lower move
    if (curY + 1 <= BOARD_HEIGHT - 1)
      checkPossiblePlayAGAINSTBLACK(curX - 3, curY + 1);
  }

  // Far left moves
  if (curX - 2 >= 0) {
    // Upper move
    if (curY - 1 >= 0) checkPossiblePlayAGAINSTBLACK(curX - 2, curY - 1);

    // Lower move
    if (curY + 1 <= BOARD_HEIGHT - 1)
      checkPossiblePlayAGAINSTBLACK(curX - 2, curY + 1);
  }

  // Near left moves
  if (curX - 1 >= 0) {
    // Upper move
    if (curY - 2 >= 0) checkPossiblePlayAGAINSTBLACK(curX - 1, curY - 2);
    if (curY - 3 >= 0) checkPossiblePlayAGAINSTBLACK(curX - 1, curY - 3);

    // Lower move
    if (curY + 2 <= BOARD_HEIGHT - 1)
      checkPossiblePlayAGAINSTBLACK(curX - 1, curY + 2);
    if (curY + 3 <= BOARD_HEIGHT - 1)
      checkPossiblePlayAGAINSTBLACK(curX - 1, curY + 3);
  }

  // Near right moves
  if (curX + 1 <= BOARD_WIDTH - 1) {
    // Upper move
    if (curY - 2 >= 0) checkPossiblePlayAGAINSTBLACK(curX + 1, curY - 2);
    if (curY - 3 >= 0) checkPossiblePlayAGAINSTBLACK(curX + 1, curY - 3);

    // Lower move
    if (curY + 2 <= BOARD_HEIGHT - 1)
      checkPossiblePlayAGAINSTBLACK(curX + 1, curY + 2);
    if (curY + 3 <= BOARD_HEIGHT - 1)
      checkPossiblePlayAGAINSTBLACK(curX + 1, curY + 3);
  }

  // Far right moves
  if (curX + 2 <= BOARD_WIDTH - 1) {
    // Upper move
    if (curY - 1 >= 0) checkPossiblePlayAGAINSTBLACK(curX + 2, curY - 1);

    // Lower move
    if (curY + 1 <= BOARD_HEIGHT - 1)
      checkPossiblePlayAGAINSTBLACK(curX + 2, curY + 1);
  }

  if (curX + 3 <= BOARD_WIDTH - 1) {
    // Upper move
    if (curY - 1 >= 0) checkPossiblePlayAGAINSTBLACK(curX + 3, curY - 1);

    // Lower move
    if (curY + 1 <= BOARD_HEIGHT - 1)
      checkPossiblePlayAGAINSTBLACK(curX + 3, curY + 1);
  }
}
function checkPossiblePlaysRookAGAINSTBLACK(curX, curY) {
  // Upper move
  for (let i = 1; curY - i >= 0; i++) {
    if (checkPossiblePlayAGAINSTBLACK(curX, curY - i)) break;
  }

  // Right move
  for (let i = 1; curX + i <= BOARD_WIDTH - 1; i++) {
    if (checkPossiblePlayAGAINSTBLACK(curX + i, curY)) break;
  }

  // Lower move
  for (let i = 1; curY + i <= BOARD_HEIGHT - 1; i++) {
    if (checkPossiblePlayAGAINSTBLACK(curX, curY + i)) break;
  }

  // Left move
  for (let i = 1; curX - i >= 0; i++) {
    if (checkPossiblePlayAGAINSTBLACK(curX - i, curY)) break;
  }
}
function checkPossiblePlaysBishopAGAINSTBLACK(curX, curY) {
  // Upper-right move
  for (let i = 1; curX + i <= BOARD_WIDTH - 1 && curY - i >= 0; i++) {
    if (checkPossiblePlayAGAINSTBLACK(curX + i, curY - i)) break;
  }

  // Lower-right move
  for (
    let i = 1;
    curX + i <= BOARD_WIDTH - 1 && curY + i <= BOARD_HEIGHT - 1;
    i++
  ) {
    if (checkPossiblePlayAGAINSTBLACK(curX + i, curY + i)) break;
  }

  // Lower-left move
  for (let i = 1; curX - i >= 0 && curY + i <= BOARD_HEIGHT - 1; i++) {
    if (checkPossiblePlayAGAINSTBLACK(curX - i, curY + i)) break;
  }

  // Upper-left move
  for (let i = 1; curX - i >= 0 && curY - i >= 0; i++) {
    if (checkPossiblePlayAGAINSTBLACK(curX - i, curY - i)) break;
  }
}
function checkPossiblePlaysElefanteAGAINSTBLACK(curX, curY) {
  // Diagonal abajo a la derecha
  for (let i = 1; curX + i <= BOARD_WIDTH - 1 && curY - i >= 0 && i <= 2; i++) {
    if (curX + i <= BOARD_WIDTH - 1 && curY - i >= 0) {
      if (board.tiles[curY - 1][curX + 1].team !== currentTeam) {
        checkPossiblePlayAGAINSTBLACK(curX + i, curY - i);
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
      if (board.tiles[curY + 1][curX + 1].team !== currentTeam) {
        checkPossiblePlayAGAINSTBLACK(curX + i, curY + i);
      }
    }
  }

  // derecha
  for (let i = 1; curX + i <= BOARD_WIDTH - 1 && i <= 2; i++) {
    if (curX + i <= BOARD_WIDTH - 1) {
      if (board.tiles[curY][curX + 1].team !== currentTeam) {
        checkPossiblePlayAGAINSTBLACK(curX + i, curY);
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
      if (board.tiles[curY + 1][curX - 1].team !== currentTeam) {
        checkPossiblePlayAGAINSTBLACK(curX - i, curY + i);
      }
    }
  }

  // diagonal abajo izquierda
  for (let i = 1; curX - i >= 0 && curY - i >= 0 && i <= 2; i++) {
    if (curX - i >= 0 && curY - i >= 0) {
      if (board.tiles[curY - 1][curX - 1].team !== currentTeam) {
        checkPossiblePlayAGAINSTBLACK(curX - i, curY - i);
      }
    }
  }

  // izquierda
  for (let i = 1; curX - i >= 0 && i <= 2; i++) {
    if (curX - i >= 0) {
      if (board.tiles[curY][curX - 1].team !== currentTeam) {
        checkPossiblePlayAGAINSTBLACK(curX - i, curY);
      }
    }
  }

  // abajo
  for (let i = 1; curY - i >= 0 && i <= 2; i++) {
    if (curY - i >= 0) {
      if (board.tiles[curY - 1][curX].team !== currentTeam) {
        checkPossiblePlayAGAINSTBLACK(curX, curY - i);
      }
    }
  }

  // Arriba
  for (let i = 1; curY + i <= BOARD_HEIGHT - 1 && i <= 2; i++) {
    if (curY + i <= BOARD_HEIGHT - 1) {
      if (board.tiles[curY + 1][curX].team !== currentTeam) {
        checkPossiblePlayAGAINSTBLACK(curX, curY + i);
      }
    }
  }
}
function checkPossiblePlaysLeonAGAINSTBLACK(curX, curY) {
  // Upper-right move
  for (let i = 1; curX + i <= BOARD_WIDTH - 1 && curY - i >= 0 && i <= 2; i++) {
    if (checkPossiblePlayAGAINSTBLACK(curX + i, curY - i)) break;
  }

  // Lower-right move
  for (
    let i = 1;
    curX + i <= BOARD_WIDTH - 1 && curY + i <= BOARD_HEIGHT - 1 && i <= 2;
    i++
  ) {
    if (checkPossiblePlayAGAINSTBLACK(curX + i, curY + i)) break;
  }

  // Lower-left move
  for (
    let i = 1;
    curX - i >= 0 && curY + i <= BOARD_HEIGHT - 1 && i <= 2;
    i++
  ) {
    if (checkPossiblePlayAGAINSTBLACK(curX - i, curY + i)) break;
  }

  // Upper-left move
  for (let i = 1; curX - i >= 0 && curY - i >= 0 && i <= 2; i++) {
    if (checkPossiblePlayAGAINSTBLACK(curX - i, curY - i)) break;
  }

  // Upper move
  for (let i = 1; curY - i >= 0 && i <= 3; i++) {
    if (checkPossiblePlayAGAINSTBLACK(curX, curY - i)) break;
  }

  // Right move
  for (let i = 1; curX + i <= BOARD_WIDTH - 1 && i <= 3; i++) {
    if (checkPossiblePlayAGAINSTBLACK(curX + i, curY)) break;
  }

  // Lower move
  for (let i = 1; curY + i <= BOARD_HEIGHT - 1 && i <= 3; i++) {
    if (checkPossiblePlayAGAINSTBLACK(curX, curY + i)) break;
  }

  // Left move
  for (let i = 1; curX - i >= 0 && i <= 3; i++) {
    if (checkPossiblePlayAGAINSTBLACK(curX - i, curY)) break;
  }
}

function checkPossiblePlaysQueenAGAINSTBLACK(curX, curY) {
  checkPossiblePlaysBishopAGAINSTBLACK(curX, curY);
  checkPossiblePlaysRookAGAINSTBLACK(curX, curY);
}
function checkPossiblePlaysKingAGAINSTBLACK(curX, curY) {
  for (let i = -1; i <= 1; i++) {
    if (curY + i < 0 || curY + i > BOARD_HEIGHT - 1) continue;

    for (let j = -1; j <= 1; j++) {
      if (curX + j < 0 || curX + j > BOARD_WIDTH - 1) continue;
      if (i === 0 && j === 0) continue;

      checkPossiblePlayAGAINSTBLACK(curX + j, curY + i);
    }
  }
}

function checkPossiblePlayAGAINSTBLACK(x, y) {
  if (checkPossibleCaptureAGAINSTBLACK(x, y)) {
    return true;
  }
  return !checkPossibleMoveAGAINSTBLACK(x, y);
}
function checkPossibleMoveAGAINSTBLACK(x, y) {
  if (board.tiles[y][x].team !== EMPTY) return false;
  casillasenpeligro.push(x + "/" + y);
  return true;
}
function checkPossibleCaptureAGAINSTBLACK(x, y) {
  if (board.tiles[y][x].team !== BLACK) return false;
  casillasenpeligro.push(x + "/" + y);

  if (board.tiles[y][x].pieceType === KING) {
    jaquereynegro = "Si";
    posicionreynegro = x + "," + y;
    alert("¡JAQUE!");
  }
  return true;
}

//WHITE
function checkKingWhiteMovepossible(x, y) {
  //recorremos todo el tablero y llenamos el arreglo de casillas en peligro
  for (let xx = 0; xx <= 8; xx++) {
    for (let yy = 0; yy <= 9; yy++) {
      //vemos que la pieza sea negra
      if (board.tiles[yy][xx].team === BLACK) {
        let tile = board.tiles[yy][xx];
        if (tile.pieceType === PAWN && tile.pieceType)
          checkPossiblePlaysPawnAGAINSTWHITE(xx, yy);
        else if (tile.pieceType === KNIGHT && tile.pieceType)
          checkPossiblePlaysKnightAGAINSTWHITE(xx, yy);
        else if (tile.pieceType === BISHOP && tile.pieceType)
          checkPossiblePlaysBishopAGAINSTWHITE(xx, yy);
        else if (tile.pieceType === ROOK && tile.pieceType)
          checkPossiblePlaysRookAGAINSTWHITE(xx, yy);
        else if (tile.pieceType === QUEEN && tile.pieceType)
          checkPossiblePlaysQueenAGAINSTWHITE(xx, yy);
        else if (tile.pieceType === KING && tile.pieceType)
          checkPossiblePlaysKingAGAINSTWHITE(xx, yy);
        else if (tile.pieceType === ARDILLA && tile.pieceType)
          checkPossiblePlaysArdillaAGAINSTWHITE(xx, yy);
        else if (tile.pieceType === CONEJO && tile.pieceType)
          checkPossiblePlaysConejoAGAINSTWHITE(xx, yy);
        else if (tile.pieceType === PERRO && tile.pieceType)
          checkPossiblePlaysPerroAGAINSTWHITE(xx, yy);
        else if (tile.pieceType === PANTERA && tile.pieceType)
          checkPossiblePlaysPanteraAGAINSTWHITE(xx, yy);
        else if (tile.pieceType === ELEFANTE && tile.pieceType)
          checkPossiblePlaysElefanteAGAINSTWHITE(xx, yy);
        else if (tile.pieceType === LEON && tile.pieceType)
          checkPossiblePlaysLeonAGAINSTWHITE(xx, yy);

        //console.log("checando:"+tile.pieceType+" "+xx+"/"+yy);
      }
    }
  }
  if (casillasenpeligro.includes(x + "/" + y)) {
    //vaciamos el arreglo
    casillasenpeligro = [];
    return true;
  } else {
    //vaciamos el arreglo
    casillasenpeligro = [];
    return false;
  }
}

function checkPossiblePlaysPawnAGAINSTWHITE(curX, curY) {
  //OJO AQUI ESTOY TOMANDO currentTeam = BLACK
  let direction;

  direction = 1;

  if (curY + direction < 0 || curY + direction > BOARD_HEIGHT - 1) return;

  // Advance one tile
  checkPossibleMoveAGAINSTWHITE(curX, curY + direction);

  // Check diagonal left capture
  if (curX - 1 >= 0) {
    if (board.tiles[curY + direction][curX - 1].pieceType !== ELEFANTE) {
      if (board.tiles[curY + direction][curX - 1].pieceType !== LEON) {
        checkPossibleCaptureAGAINSTWHITE(curX - 1, curY + direction);
      }
    }
  }

  // Check diagonal right capture
  if (curX + 1 <= BOARD_WIDTH - 1) {
    if (board.tiles[curY + direction][curX + 1].pieceType !== ELEFANTE) {
      if (board.tiles[curY + direction][curX + 1].pieceType !== LEON) {
        checkPossibleCaptureAGAINSTWHITE(curX + 1, curY + direction);
      }
    }
  }
}
function checkPossiblePlaysConejoAGAINSTWHITE(curX, curY) {
  let direction;

  direction = 1;

  if (curY + direction < 0 || curY + direction > BOARD_HEIGHT - 1) return;

  // Advance one tile
  checkPossibleMoveAGAINSTWHITE(curX, curY + direction);

  // Advance two tile
  //si es un PAWN si se puede saltar Y COMER SI NO SOLO AVANZA
  if (board.tiles[curY + 1 * direction][curX].pieceType === EMPTY) {
    //vemos que no se salga del tablero
    if (curY + 2 * direction < BOARD_HEIGHT && curY + 2 * direction >= 0) {
      checkPossibleMoveAGAINSTWHITE(curX, curY + 2 * direction);
    }
  } else {
    if (
      board.tiles[curY + 1 * direction][curX].pieceType === PAWN &&
      board.tiles[curY + 1 * direction][curX].team !== BLACK
    ) {
      checkPossibleMoveAGAINSTWHITE(curX, curY + 2 * direction);
    }
  }

  // Check diagonal right capture
  if (curX + 1 <= BOARD_WIDTH - 1)
    checkPossibleMoveAGAINSTWHITE(curX + 1, curY + direction);
  // Check diagonal left capture
  if (curX - 1 >= 0) checkPossibleMoveAGAINSTWHITE(curX - 1, curY + direction);

  // Check diagonal left capture
  if (curX - 1 >= 0) {
    if (board.tiles[curY + direction][curX - 1].pieceType !== ELEFANTE) {
      checkPossibleCaptureAGAINSTWHITE(curX - 1, curY + direction);
    }
  }

  // Check diagonal right capture
  if (curX + 1 <= BOARD_WIDTH - 1) {
    if (board.tiles[curY + direction][curX + 1].pieceType !== ELEFANTE) {
      checkPossibleCaptureAGAINSTWHITE(curX + 1, curY + direction);
    }
  }
}
function checkPossiblePlaysArdillaAGAINSTWHITE(curX, curY) {
  let direction;

  direction = 1;

  if (curY + direction < 0 || curY + direction > BOARD_HEIGHT - 1) return;

  // Advance one tile
  checkPossibleMoveAGAINSTWHITE(curX, curY + direction);

  // Advance two tile
  //si es un PAWN O CONEJO si se puede saltar y comer sino no hacer nada
  if (
    curY + 1 * direction >= 0 &&
    curY + 1 * direction <= BOARD_HEIGHT - 1 &&
    curY + 2 * direction >= 0 &&
    curY + 2 * direction <= BOARD_HEIGHT - 1
  ) {
    if (board.tiles[curY + 1 * direction][curX].team !== BLACK) {
      if (
        board.tiles[curY + 1 * direction][curX].pieceType === 0 ||
        board.tiles[curY + 1 * direction][curX].pieceType === CONEJO ||
        board.tiles[curY + 1 * direction][curX].pieceType === EMPTY
      ) {
        checkPossibleMoveAGAINSTWHITE(curX, curY + 2 * direction);
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
      board.tiles[curY + 1 * direction][curX].team !== BLACK &&
      board.tiles[curY + 2 * direction][curX].team !== BLACK
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
        checkPossibleMoveAGAINSTWHITE(curX, curY + 3 * direction);
      }
    }
  }
  // Advance Horizontal tile
  if (curX > 0) {
    checkPossibleMoveAGAINSTWHITE(curX - 1, curY);
  }
  if (curX < 8) {
    checkPossibleMoveAGAINSTWHITE(curX + 1, curY);
  }

  // Check diagonal right move
  if (curX + 1 <= BOARD_WIDTH - 1)
    checkPossibleMoveAGAINSTWHITE(curX + 1, curY + direction);
  // Check diagonal left move
  if (curX - 1 >= 0) checkPossibleMoveAGAINSTWHITE(curX - 1, curY + direction);

  // Check diagonal left capture
  if (curX - 1 >= 0) {
    if (board.tiles[curY + direction][curX - 1].pieceType !== ELEFANTE) {
      checkPossibleCaptureAGAINSTWHITE(curX - 1, curY + direction);
    }
  }

  // Check diagonal right capture
  if (curX + 1 <= BOARD_WIDTH - 1) {
    if (board.tiles[curY + direction][curX + 1].pieceType !== ELEFANTE) {
      checkPossibleCaptureAGAINSTWHITE(curX + 1, curY + direction);
    }
  }
}
function checkPossiblePlaysPerroAGAINSTWHITE(curX, curY) {
  let direction;

  direction = 1;

  if (curY + direction < 0 || curY + direction > BOARD_HEIGHT - 1) return;

  // Advance one tile
  checkPossibleMoveAGAINSTWHITE(curX, curY + direction);
  if (board.tiles[curY + direction][curX].pieceType !== ELEFANTE) {
    checkPossibleCaptureAGAINSTWHITE(curX, curY + direction);
  }

  if (
    curY + 2 * direction > 0 &&
    curY + 2 * direction > 0 &&
    curY + 2 * direction <= BOARD_HEIGHT - 1 &&
    board.tiles[curY + 1 * direction][curX].pieceType === EMPTY
  ) {
    // Advance two tile
    checkPossibleMoveAGAINSTWHITE(curX, curY + 2 * direction);
    if (board.tiles[curY + 2 * direction][curX].pieceType !== ELEFANTE) {
      checkPossibleCaptureAGAINSTWHITE(curX, curY + 2 * direction);
    }
  }

  // Advance Horizontal tile
  if (curX > 0) {
    checkPossibleMoveAGAINSTWHITE(curX - 1, curY);
  }
  if (curX > 1 && board.tiles[curY][curX - 1].pieceType === EMPTY) {
    checkPossibleMoveAGAINSTWHITE(curX - 2, curY);
  }
  if (curX < 8) {
    checkPossibleMoveAGAINSTWHITE(curX + 1, curY);
  }
  if (curX < 7 && board.tiles[curY][curX + 1].pieceType === EMPTY) {
    checkPossibleMoveAGAINSTWHITE(curX + 2, curY);
  }

  // Check diagonal right movimiento
  if (curX + 1 <= BOARD_WIDTH - 1) {
    checkPossibleMoveAGAINSTWHITE(curX + 1, curY + direction);
  }
  if (
    curX + 2 <= BOARD_WIDTH - 1 &&
    board.tiles[curY + direction][curX + 1].pieceType === EMPTY
  ) {
    checkPossibleMoveAGAINSTWHITE(curX + 2, curY + 2 * direction);
  }

  // Check diagonal left movimiento
  if (curX - 1 >= 0) {
    checkPossibleMoveAGAINSTWHITE(curX - 1, curY + direction);
  }
  if (
    curX - 2 >= 0 &&
    board.tiles[curY + direction][curX - 1].pieceType === EMPTY
  ) {
    checkPossibleMoveAGAINSTWHITE(curX - 2, curY + 2 * direction);
  }

  // Check diagonal left capture
  if (
    curX - 1 >= 0 &&
    board.tiles[curY + direction][curX - 1].pieceType !== ELEFANTE
  ) {
    checkPossibleCaptureAGAINSTWHITE(curX - 1, curY + direction);
  }
  if (
    curX - 2 >= 0 &&
    curY + 2 * direction > 0 &&
    curY + 2 * direction <= BOARD_HEIGHT - 1 &&
    board.tiles[curY + 2 * direction][curX - 2].pieceType !== ELEFANTE &&
    board.tiles[curY + 1 * direction][curX - 1].pieceType === EMPTY
  ) {
    checkPossibleCaptureAGAINSTWHITE(curX - 2, curY + 2 * direction);
  }

  // Check diagonal right capture
  if (
    curX + 1 <= BOARD_WIDTH - 1 &&
    board.tiles[curY + direction][curX + 1].pieceType !== ELEFANTE
  ) {
    checkPossibleCaptureAGAINSTWHITE(curX + 1, curY + direction);
  }
  if (
    curX + 2 <= BOARD_WIDTH - 1 &&
    curY + 2 * direction > 0 &&
    curY + 2 * direction <= BOARD_HEIGHT - 1 &&
    board.tiles[curY + 2 * direction][curX + 2].pieceType !== ELEFANTE &&
    board.tiles[curY + 1 * direction][curX + 1].pieceType === EMPTY
  ) {
    checkPossibleCaptureAGAINSTWHITE(curX + 2, curY + 2 * direction);
  }
}
function checkPossiblePlaysKnightAGAINSTWHITE(curX, curY) {
  // Far left moves
  if (curX - 2 >= 0) {
    // Upper move
    if (curY - 1 >= 0) checkPossiblePlayAGAINSTWHITE(curX - 2, curY - 1);

    // Lower move
    if (curY + 1 <= BOARD_HEIGHT - 1)
      checkPossiblePlayAGAINSTWHITE(curX - 2, curY + 1);
  }

  // Near left moves
  if (curX - 1 >= 0) {
    // Upper move
    if (curY - 2 >= 0) checkPossiblePlayAGAINSTWHITE(curX - 1, curY - 2);

    // Lower move
    if (curY + 2 <= BOARD_HEIGHT - 1)
      checkPossiblePlayAGAINSTWHITE(curX - 1, curY + 2);
  }

  // Near right moves
  if (curX + 1 <= BOARD_WIDTH - 1) {
    // Upper move
    if (curY - 2 >= 0) checkPossiblePlayAGAINSTWHITE(curX + 1, curY - 2);

    // Lower move
    if (curY + 2 <= BOARD_HEIGHT - 1)
      checkPossiblePlayAGAINSTWHITE(curX + 1, curY + 2);
  }

  // Far right moves
  if (curX + 2 <= BOARD_WIDTH - 1) {
    // Upper move
    if (curY - 1 >= 0) checkPossiblePlayAGAINSTWHITE(curX + 2, curY - 1);

    // Lower move
    if (curY + 1 <= BOARD_HEIGHT - 1)
      checkPossiblePlayAGAINSTWHITE(curX + 2, curY + 1);
  }
}
function checkPossiblePlaysPanteraAGAINSTWHITE(curX, curY) {
  // Far left moves
  if (curX - 3 >= 0) {
    // Upper move
    if (curY - 1 >= 0) checkPossiblePlayAGAINSTWHITE(curX - 3, curY - 1);

    // Lower move
    if (curY + 1 <= BOARD_HEIGHT - 1)
      checkPossiblePlayAGAINSTWHITE(curX - 3, curY + 1);
  }

  // Far left moves
  if (curX - 2 >= 0) {
    // Upper move
    if (curY - 1 >= 0) checkPossiblePlayAGAINSTWHITE(curX - 2, curY - 1);

    // Lower move
    if (curY + 1 <= BOARD_HEIGHT - 1)
      checkPossiblePlayAGAINSTWHITE(curX - 2, curY + 1);
  }

  // Near left moves
  if (curX - 1 >= 0) {
    // Upper move
    if (curY - 2 >= 0) checkPossiblePlayAGAINSTWHITE(curX - 1, curY - 2);
    if (curY - 3 >= 0) checkPossiblePlayAGAINSTWHITE(curX - 1, curY - 3);

    // Lower move
    if (curY + 2 <= BOARD_HEIGHT - 1)
      checkPossiblePlayAGAINSTWHITE(curX - 1, curY + 2);
    if (curY + 3 <= BOARD_HEIGHT - 1)
      checkPossiblePlayAGAINSTWHITE(curX - 1, curY + 3);
  }

  // Near right moves
  if (curX + 1 <= BOARD_WIDTH - 1) {
    // Upper move
    if (curY - 2 >= 0) checkPossiblePlayAGAINSTWHITE(curX + 1, curY - 2);
    if (curY - 3 >= 0) checkPossiblePlayAGAINSTWHITE(curX + 1, curY - 3);

    // Lower move
    if (curY + 2 <= BOARD_HEIGHT - 1)
      checkPossiblePlayAGAINSTWHITE(curX + 1, curY + 2);
    if (curY + 3 <= BOARD_HEIGHT - 1)
      checkPossiblePlayAGAINSTWHITE(curX + 1, curY + 3);
  }

  // Far right moves
  if (curX + 2 <= BOARD_WIDTH - 1) {
    // Upper move
    if (curY - 1 >= 0) checkPossiblePlayAGAINSTWHITE(curX + 2, curY - 1);

    // Lower move
    if (curY + 1 <= BOARD_HEIGHT - 1)
      checkPossiblePlayAGAINSTWHITE(curX + 2, curY + 1);
  }

  if (curX + 3 <= BOARD_WIDTH - 1) {
    // Upper move
    if (curY - 1 >= 0) checkPossiblePlayAGAINSTWHITE(curX + 3, curY - 1);

    // Lower move
    if (curY + 1 <= BOARD_HEIGHT - 1)
      checkPossiblePlayAGAINSTWHITE(curX + 3, curY + 1);
  }
}
function checkPossiblePlaysRookAGAINSTWHITE(curX, curY) {
  // Upper move
  for (let i = 1; curY - i >= 0; i++) {
    if (checkPossiblePlayAGAINSTWHITE(curX, curY - i)) break;
  }

  // Right move
  for (let i = 1; curX + i <= BOARD_WIDTH - 1; i++) {
    if (checkPossiblePlayAGAINSTWHITE(curX + i, curY)) break;
  }

  // Lower move
  for (let i = 1; curY + i <= BOARD_HEIGHT - 1; i++) {
    if (checkPossiblePlayAGAINSTWHITE(curX, curY + i)) break;
  }

  // Left move
  for (let i = 1; curX - i >= 0; i++) {
    if (checkPossiblePlayAGAINSTWHITE(curX - i, curY)) break;
  }
}
function checkPossiblePlaysBishopAGAINSTWHITE(curX, curY) {
  // Upper-right move
  for (let i = 1; curX + i <= BOARD_WIDTH - 1 && curY - i >= 0; i++) {
    if (checkPossiblePlayAGAINSTWHITE(curX + i, curY - i)) break;
  }

  // Lower-right move
  for (
    let i = 1;
    curX + i <= BOARD_WIDTH - 1 && curY + i <= BOARD_HEIGHT - 1;
    i++
  ) {
    if (checkPossiblePlayAGAINSTWHITE(curX + i, curY + i)) break;
  }

  // Lower-left move
  for (let i = 1; curX - i >= 0 && curY + i <= BOARD_HEIGHT - 1; i++) {
    if (checkPossiblePlayAGAINSTWHITE(curX - i, curY + i)) break;
  }

  // Upper-left move
  for (let i = 1; curX - i >= 0 && curY - i >= 0; i++) {
    if (checkPossiblePlayAGAINSTWHITE(curX - i, curY - i)) break;
  }
}
function checkPossiblePlaysElefanteAGAINSTWHITE(curX, curY) {
  // Diagonal abajo a la derecha
  for (let i = 1; curX + i <= BOARD_WIDTH - 1 && curY - i >= 0 && i <= 2; i++) {
    if (curX + i <= BOARD_WIDTH - 1 && curY - i >= 0) {
      if (board.tiles[curY - 1][curX + 1].team !== currentTeam) {
        checkPossiblePlayAGAINSTWHITE(curX + i, curY - i);
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
      if (board.tiles[curY + 1][curX + 1].team !== currentTeam) {
        checkPossiblePlayAGAINSTWHITE(curX + i, curY + i);
      }
    }
  }

  // derecha
  for (let i = 1; curX + i <= BOARD_WIDTH - 1 && i <= 2; i++) {
    if (curX + i <= BOARD_WIDTH - 1) {
      if (board.tiles[curY][curX + 1].team !== currentTeam) {
        checkPossiblePlayAGAINSTWHITE(curX + i, curY);
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
      if (board.tiles[curY + 1][curX - 1].team !== currentTeam) {
        checkPossiblePlayAGAINSTWHITE(curX - i, curY + i);
      }
    }
  }

  // diagonal abajo izquierda
  for (let i = 1; curX - i >= 0 && curY - i >= 0 && i <= 2; i++) {
    if (curX - i >= 0 && curY - i >= 0) {
      if (board.tiles[curY - 1][curX - 1].team !== currentTeam) {
        checkPossiblePlayAGAINSTWHITE(curX - i, curY - i);
      }
    }
  }

  // izquierda
  for (let i = 1; curX - i >= 0 && i <= 2; i++) {
    if (curX - i >= 0) {
      if (board.tiles[curY][curX - 1].team !== currentTeam) {
        checkPossiblePlayAGAINSTWHITE(curX - i, curY);
      }
    }
  }

  // abajo
  for (let i = 1; curY - i >= 0 && i <= 2; i++) {
    if (curY - i >= 0) {
      if (board.tiles[curY - 1][curX].team !== currentTeam) {
        checkPossiblePlayAGAINSTWHITE(curX, curY - i);
      }
    }
  }

  // Arriba
  for (let i = 1; curY + i <= BOARD_HEIGHT - 1 && i <= 2; i++) {
    if (curY + i <= BOARD_HEIGHT - 1) {
      if (board.tiles[curY + 1][curX].team !== currentTeam) {
        checkPossiblePlayAGAINSTWHITE(curX, curY + i);
      }
    }
  }
}
function checkPossiblePlaysLeonAGAINSTWHITE(curX, curY) {
  // Upper-right move
  for (let i = 1; curX + i <= BOARD_WIDTH - 1 && curY - i >= 0 && i <= 2; i++) {
    if (checkPossiblePlayAGAINSTWHITE(curX + i, curY - i)) break;
  }

  // Lower-right move
  for (
    let i = 1;
    curX + i <= BOARD_WIDTH - 1 && curY + i <= BOARD_HEIGHT - 1 && i <= 2;
    i++
  ) {
    if (checkPossiblePlayAGAINSTWHITE(curX + i, curY + i)) break;
  }

  // Lower-left move
  for (
    let i = 1;
    curX - i >= 0 && curY + i <= BOARD_HEIGHT - 1 && i <= 2;
    i++
  ) {
    if (checkPossiblePlayAGAINSTWHITE(curX - i, curY + i)) break;
  }

  // Upper-left move
  for (let i = 1; curX - i >= 0 && curY - i >= 0 && i <= 2; i++) {
    if (checkPossiblePlayAGAINSTWHITE(curX - i, curY - i)) break;
  }

  // Upper move
  for (let i = 1; curY - i >= 0 && i <= 3; i++) {
    if (checkPossiblePlayAGAINSTWHITE(curX, curY - i)) break;
  }

  // Right move
  for (let i = 1; curX + i <= BOARD_WIDTH - 1 && i <= 3; i++) {
    if (checkPossiblePlayAGAINSTWHITE(curX + i, curY)) break;
  }

  // Lower move
  for (let i = 1; curY + i <= BOARD_HEIGHT - 1 && i <= 3; i++) {
    if (checkPossiblePlayAGAINSTWHITE(curX, curY + i)) break;
  }

  // Left move
  for (let i = 1; curX - i >= 0 && i <= 3; i++) {
    if (checkPossiblePlayAGAINSTWHITE(curX - i, curY)) break;
  }
}
function checkPossiblePlaysQueenAGAINSTWHITE(curX, curY) {
  checkPossiblePlaysBishopAGAINSTWHITE(curX, curY);
  checkPossiblePlaysRookAGAINSTWHITE(curX, curY);
}
function checkPossiblePlaysKingAGAINSTWHITE(curX, curY) {
  for (let i = -1; i <= 1; i++) {
    if (curY + i < 0 || curY + i > BOARD_HEIGHT - 1) continue;

    for (let j = -1; j <= 1; j++) {
      if (curX + j < 0 || curX + j > BOARD_WIDTH - 1) continue;
      if (i === 0 && j === 0) continue;

      checkPossiblePlayAGAINSTWHITE(curX + j, curY + i);
    }
  }
}

function checkPossiblePlayAGAINSTWHITE(x, y) {
  if (checkPossibleCaptureAGAINSTWHITE(x, y)) {
    return true;
  }
  return !checkPossibleMoveAGAINSTWHITE(x, y);
}
function checkPossibleMoveAGAINSTWHITE(x, y) {
  if (board.tiles[y][x].team !== EMPTY) return false;
  casillasenpeligro.push(x + "/" + y);
  return true;
}
function checkPossibleCaptureAGAINSTWHITE(x, y) {
  if (board.tiles[y][x].team !== WHITE) return false;
  casillasenpeligro.push(x + "/" + y);
  if (board.tiles[y][x].pieceType === KING) {
    jaquereyblanco = "Si";
    posicionreyblanco = x + "," + y;
    alert("¡JAQUE!");
  }
  return true;
}
async function guardar_comer_al_paso(coord) {
  await getGameDbRef()
    .update({
      comeralpaso: coord,
    })
    .catch(console.error);
}
async function guardar_comer_al_paso_conejo(coord) {
  await getGameDbRef()
    .update({
      comeralpasoconejo: coord,
    })
    .catch(console.error);
}
async function guardar_comer_al_paso_ardilla(coord) {
  await getGameDbRef()
    .update({
      comeralpasoardilla: coord,
    })
    .catch(console.error);
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
      document.getElementById("numero_turno").innerHTML = numero_turno;
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
  } catch (error) {}

  await getGameDbRef()
    .update({
      jugadasPorBloque: [],
    })
    .catch(console.error);
}

async function jugada_contains(jugada) {
  try {
    return Object.keys(serverGameData?.jugadasPorBloque)?.contains(jugada);
  } catch (error) {
    return false;
  }
}
