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

let numero_jugada = -1;
let jugada_actual;
let move;
let currentTeam;
let ultimomovimiento;

let fakeboard;
let inicio_analisis = true;

let curX;
let curY;

let ultimapiezacapturadablanca;

let lobbyItemKey;

let serverGameData = {};

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


async function startGame() {
  const lobbyDbRef = getGameDbRef(lobbyItemKey);
  lobbyDbRef.on("value", async (snapshot) => {
    if (!snapshot.exists()) {
      return;
    }
    serverGameData = snapshot.val();


    //cargamos el tablero    
    if (inicio_analisis === true) {
      // fakeboard = new Board(snapshot?.toJSON()?.board);
      fakeboard = new Board();
      inicio_analisis = false;
    } else {
      fakeboard = new Board(snapshot?.toJSON()?.fakeboard);
    }


    //contamos las jugadas
    var jugadas = serverGameData?.jugadas;


    if (jugadas !== null && jugadas !== undefined) {
      var total_jugadas = Object.keys(jugadas).length;
      if (numero_jugada === -1) {
        move = total_jugadas;
      } else {
        move = numero_jugada;
      }
      document.getElementById('total_jugadas').innerHTML = "Jugada " + move + "/" + total_jugadas;
    } else {
      var total_jugadas = 0;
      document.getElementById('total_jugadas').innerHTML = "Jugada " + move + "/" + total_jugadas;
    }

    repaintBoard();

    var ultimomovimiento = serverGameData?.ultimo_movimiento;

    if (ultimomovimiento !== null && ultimomovimiento !== undefined) {
      const combo_ultimomovimiento = ultimomovimiento.split("/");
      if (combo_ultimomovimiento[1] !== null && combo_ultimomovimiento[1] !== undefined && combo_ultimomovimiento[2] !== null && combo_ultimomovimiento[2] !== undefined) {
        const combo_oldxy = combo_ultimomovimiento[1].split(",");
        const combo_newxy = combo_ultimomovimiento[2].split(",");


        marcar_ultimo_movimiento(
          parseInt(combo_newxy[0]),
          parseInt(combo_newxy[1]),
          parseInt(combo_oldxy[0]),
          parseInt(combo_oldxy[1])
        );

      }
    }


  });


  curX = -1;
  curY = -1;



}

export async function onClick(Y, X) {

  //  repaintBoard();
}


function moveSelectedPiece(x, y, piece, oldX, oldY, lost, lost_team) {
  var TeaM = getOppositeTeam(lost_team);
  //movemos la pieza
  //console.log(x, y, piece, oldX, oldY, lost, lost_team);

  //enroque y desenroque
  if (piece === KING) {
    //enroque blancas
    if (
      (x === 4 &&
        oldY === 9 &&
        oldX === 7 &&
        y === 9) ||
      (x === 4 &&
        oldY === 9 &&
        oldX === 6 &&
        y === 9)
    ) {
      //vaciamos la posicion de la torre
      fakeboard.tiles[9][8].pieceType = EMPTY;
      fakeboard.tiles[9][8].team = EMPTY;

      //nueva posicion de la torre
      fakeboard.tiles[9][5].pieceType = ROOK;
      fakeboard.tiles[9][5].team = 0;
    }
    //vemos si es enroque con la torre1
    if (
      (x === 4 &&
        oldY === 9 &&
        oldX === 1 &&
        y === 9) ||
      (x === 4 &&
        oldY === 9 &&
        oldX === 2 &&
        y === 9)
    ) {
      //vaciamos la posicion de la torre
      fakeboard.tiles[9][0].pieceType = EMPTY;
      fakeboard.tiles[9][0].team = EMPTY;

      //nueva posicion de la torre
      fakeboard.tiles[9][3].pieceType = ROOK;
      fakeboard.tiles[9][3].team = 0;
    }

    //enroque negras
    if (
      (x === 4 &&
        oldY === 0 &&
        oldX === 7 &&
        y === 0) ||
      (x === 4 &&
        oldY === 0 &&
        oldX === 6 &&
        y === 0)
    ) {
      //vaciamos la posicion de la torre
      fakeboard.tiles[0][8].pieceType = EMPTY;
      fakeboard.tiles[0][8].team = EMPTY;

      //nueva posicion de la torre
      fakeboard.tiles[0][5].pieceType = ROOK;
      fakeboard.tiles[0][5].team = 1;
    }
    //vemos si es enroque con la torre1
    if (
      (x === 4 &&
        oldY === 0 &&
        oldX === 1 &&
        y === 0) ||
      (x === 4 &&
        oldY === 0 &&
        oldX === 2 &&
        y === 0)
    ) {
      //vaciamos la posicion de la torre
      fakeboard.tiles[0][0].pieceType = EMPTY;
      fakeboard.tiles[0][0].team = EMPTY;

      //nueva posicion de la torre
      fakeboard.tiles[0][3].pieceType = ROOK;
      fakeboard.tiles[0][3].team = 1;
    }

    //desenroque blancas
    if (
      (oldX === 4 &&
        oldY === 9 &&
        x === 7 &&
        y === 9) ||
      (oldX === 4 &&
        oldY === 9 &&
        x === 6 &&
        y === 9)
    ) {
      //nueva posicion de la torre
      fakeboard.tiles[9][8].pieceType = ROOK;
      fakeboard.tiles[9][8].team = 0;
      
      //vaciamos la posicion de la torre
      fakeboard.tiles[9][5].pieceType = EMPTY;
      fakeboard.tiles[9][5].team = EMPTY;
    }
    //vemos si es enroque con la torre1
    if (
      (oldX === 4 &&
        oldY === 9 &&
        x === 1 &&
        y === 9) ||
      (oldX === 4 &&
        oldY === 9 &&
        x === 2 &&
        y === 9)
    ) {
      //nueva posicion de la torre
      fakeboard.tiles[9][0].pieceType = ROOK;
      fakeboard.tiles[9][0].team = 0;
      
      //vaciamos la posicion de la torre
      fakeboard.tiles[9][3].pieceType = EMPTY;
      fakeboard.tiles[9][3].team = EMPTY;
    }

    //desenroque negras
    if (
      (oldX === 4 &&
        oldY === 0 &&
        x === 7 &&
        y === 0) ||
      (oldX === 4 &&
        oldY === 0 &&
        x === 6 &&
        y === 0)
    ) {
      //nueva posicion de la torre
      fakeboard.tiles[0][8].pieceType = ROOK;
      fakeboard.tiles[0][8].team = 1;
      
      //vaciamos la posicion de la torre
      fakeboard.tiles[0][5].pieceType = EMPTY;
      fakeboard.tiles[0][5].team = EMPTY;
    }
    //vemos si es enroque con la torre1
    if (
      (oldX === 4 &&
        oldY === 0 &&
        x === 1 &&
        y === 0) ||
      (oldX === 4 &&
        oldY === 0 &&
        x === 2 &&
        y === 0)
    ) {
      //nueva posicion de la torre
      fakeboard.tiles[0][0].pieceType = ROOK;
      fakeboard.tiles[0][0].team = 1;
      
      //vaciamos la posicion de la torre
      fakeboard.tiles[0][3].pieceType = EMPTY;
      fakeboard.tiles[0][3].team = EMPTY;
    }
  
  }

  //comio elefante
  if (piece === ELEFANTE) {
    // Upper-right move
    if (oldX + 2 === x && oldY - 2 === y) {
      ultimapiezacapturadablanca =
        fakeboard.tiles[oldY - 1][oldX + 1].pieceType;
      
      //capturamos la ficha
      fakeboard.tiles[oldY - 1][oldX + 1].pieceType = EMPTY;
      fakeboard.tiles[oldY - 1][oldX + 1].team = EMPTY;
    }

    // Lower-right move
    if (oldX + 2 === x && oldY + 2 === y) {
      ultimapiezacapturadablanca =
        fakeboard.tiles[oldY + 1][oldX + 1].pieceType;
      
      //capturamos la ficha
      fakeboard.tiles[oldY + 1][oldX + 1].pieceType = EMPTY;
      fakeboard.tiles[oldY + 1][oldX + 1].team = EMPTY;
    }
    // Lower-left move
    if (oldX - 2 === x && oldY + 2 === y) {
      ultimapiezacapturadablanca =
        fakeboard.tiles[oldY + 1][oldX - 1].pieceType;
      
      //capturamos la ficha
      fakeboard.tiles[oldY + 1][oldX - 1].pieceType = EMPTY;
      fakeboard.tiles[oldY + 1][oldX - 1].team = EMPTY;
    }
    // Upper-left move
    if (oldX - 2 === x && oldY - 2 === y) {
      ultimapiezacapturadablanca =
        fakeboard.tiles[oldY - 1][oldX - 1].pieceType;
      
      //capturamos la ficha
      fakeboard.tiles[oldY - 1][oldX - 1].pieceType = EMPTY;
      fakeboard.tiles[oldY - 1][oldX - 1].team = EMPTY;
    }
    // Upper move
    if (oldX === x && oldY - 2 === y) {
      ultimapiezacapturadablanca =
        fakeboard.tiles[oldY - 1][oldX].pieceType + "/" + oldX + "," + (oldY - 1);
      
      //capturamos la ficha
      fakeboard.tiles[oldY - 1][oldX].pieceType = EMPTY;
      fakeboard.tiles[oldY - 1][oldX].team = EMPTY;
    }
    // Right move
    if (oldX + 2 === x && oldY === y) {
      ultimapiezacapturadablanca =
        fakeboard.tiles[oldY][oldX + 1].pieceType;
      
      //capturamos la ficha
      fakeboard.tiles[oldY][oldX + 1].pieceType = EMPTY;
      fakeboard.tiles[oldY][oldX + 1].team = EMPTY;
    }
    // Lower move
    if (oldX === x && oldY + 2 === y) {
      ultimapiezacapturadablanca =
        fakeboard.tiles[oldY + 1][oldX].pieceType;
      
      //capturamos la ficha
      fakeboard.tiles[oldY + 1][oldX].pieceType = EMPTY;
      fakeboard.tiles[oldY + 1][oldX].team = EMPTY;
    }
    // Left move
    if (oldX - 2 === x && oldY === y) {
      ultimapiezacapturadablanca =
        fakeboard.tiles[oldY][oldX - 1].pieceType;
      
      //capturamos la ficha
      fakeboard.tiles[oldY][oldX - 1].pieceType = EMPTY;
      fakeboard.tiles[oldY][oldX - 1].team = EMPTY;
    }
  }

  //comio ardilla
  //comio conejo
  //comio peon
  
  


  //descoronacion
  if ((parseInt(y) === 9 && fakeboard.tiles[y][x].team === BLACK) || (parseInt(y) === 0 && fakeboard.tiles[y][x].team === WHITE)) {

    if (fakeboard.tiles[y][x].pieceType === BISHOP) fakeboard.tiles[oldY][oldX].pieceType = piece;
    else if (fakeboard.tiles[y][x].pieceType === ROOK) fakeboard.tiles[oldY][oldX].pieceType = piece;
    else if (fakeboard.tiles[y][x].pieceType === QUEEN) fakeboard.tiles[oldY][oldX].pieceType = piece;
    else if (fakeboard.tiles[y][x].pieceType === FAKEKING) fakeboard.tiles[oldY][oldX].pieceType = piece;
    else fakeboard.tiles[oldY][oldX].pieceType = fakeboard.tiles[y][x].pieceType;

  } else {

    fakeboard.tiles[oldY][oldX].pieceType = fakeboard.tiles[y][x].pieceType;

  }

  fakeboard.tiles[oldY][oldX].team = fakeboard.tiles[y][x].team;

  if (lost !== -1) {
    fakeboard.tiles[y][x].pieceType = lost;
    fakeboard.tiles[y][x].team = lost_team;
  } else {
    fakeboard.tiles[y][x].pieceType = EMPTY;
    fakeboard.tiles[y][x].team = EMPTY;
  }

  ultimomovimiento =
    piece + "/" + oldX + "," + oldY + "/" + x + "," + y + "/" + currentTeam;

  getGameDbRef()
    .update({
      ultimo_movimiento_analisis: ultimomovimiento,
      fakeboard,
    })
    .catch(console.error);
  //curX = -1;
  //curY = -1;

  repaintBoard();

  var ultimomovimiento = serverGameData?.ultimo_movimiento_analisis;

  if (ultimomovimiento !== null && ultimomovimiento !== undefined) {
    const combo_ultimomovimiento = ultimomovimiento.split("/");
    if (combo_ultimomovimiento[1] !== null && combo_ultimomovimiento[1] !== undefined && combo_ultimomovimiento[2] !== null && combo_ultimomovimiento[2] !== undefined) {
      const combo_oldxy = combo_ultimomovimiento[1].split(",");
      const combo_newxy = combo_ultimomovimiento[2].split(",");


      marcar_ultimo_movimiento(
        parseInt(combo_newxy[0]),
        parseInt(combo_newxy[1]),
        parseInt(combo_oldxy[0]),
        parseInt(combo_oldxy[1])
      );

    }
  }

}

async function repaintBoard() {
  drawBoard();
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

function drawPieces() {
  //coronacion
  for (let j = 0; j < BOARD_WIDTH; j++) {
    let pieza = fakeboard.tiles[9][j].pieceType;
    if (pieza === PAWN) {
      fakeboard.tiles[9][j].pieceType = BISHOP;
    }
  }

  for (let j = 0; j < BOARD_WIDTH; j++) {
    let pieza = fakeboard.tiles[0][j].pieceType;
    if (pieza === PAWN) {
      fakeboard.tiles[0][j].pieceType = BISHOP;
    }
  }

  for (let j = 0; j < BOARD_WIDTH; j++) {
    let pieza = fakeboard.tiles[0][j].pieceType;
    if (pieza === CONEJO) {
      fakeboard.tiles[0][j].pieceType = ROOK;
    }
  }

  for (let j = 0; j < BOARD_WIDTH; j++) {
    let pieza = fakeboard.tiles[9][j].pieceType;
    if (pieza === CONEJO) {
      fakeboard.tiles[9][j].pieceType = ROOK;
    }
  }

  for (let j = 0; j < BOARD_WIDTH; j++) {
    let pieza = fakeboard.tiles[0][j].pieceType;
    if (pieza === ARDILLA) {
      fakeboard.tiles[0][j].pieceType = QUEEN;
    }
  }

  for (let j = 0; j < BOARD_WIDTH; j++) {
    let pieza = fakeboard.tiles[9][j].pieceType;
    if (pieza === ARDILLA) {
      fakeboard.tiles[9][j].pieceType = QUEEN;
    }
  }


  for (let j = 0; j < BOARD_WIDTH; j++) {
    let pieza = fakeboard.tiles[0][j].pieceType;
    let equipo = fakeboard.tiles[0][j].team;

    if (pieza === LEON && equipo === WHITE) {
      fakeboard.tiles[0][j].pieceType = FAKEKING;
    }
  }

  for (let j = 0; j < BOARD_WIDTH; j++) {
    let pieza = fakeboard.tiles[9][j].pieceType;
    let equipo = fakeboard.tiles[9][j].team;

    if (pieza === LEON && equipo === BLACK) {
      fakeboard.tiles[9][j].pieceType = FAKEKING;
    }
  }
  //fin coronacion

  //pintamos las piezas
  for (let i = 0; i < BOARD_HEIGHT; i++) {
    for (let j = 0; j < BOARD_WIDTH; j++) {

      let pieceType = fakeboard.tiles[i][j].pieceType;
      let equipo = fakeboard.tiles[i][j].team;
      let coordenada = "y" + i + "x" + j;
      let elemento = document.getElementById(coordenada);

      if (fakeboard.tiles[i][j].team === EMPTY) {
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


function getOppositeTeam(team) {
  if (team === WHITE) return BLACK;
  else if (team === BLACK) return WHITE;
  else return EMPTY;
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

}

export function next_move() {

  if (numero_jugada === -1) {
    var jugadas = serverGameData?.jugadas;
    if (jugadas !== null && jugadas !== undefined) {
      var total_jugadas = Object.keys(jugadas).length;
      //numero_jugada = total_jugadas;
      numero_jugada = 0;
    }
  }

  var jugadas = serverGameData?.jugadas;
  if (jugadas !== null && jugadas !== undefined) {
    var total_jugadas = Object.keys(jugadas).length;
    var elementos = Array.from(Object.entries(jugadas));
    if (numero_jugada < total_jugadas) {


      jugada_actual = elementos[numero_jugada][1]['movimiento'];

      var codigo_actual = elementos[numero_jugada][1]['codigo'];
      var combo_codigo_actual = codigo_actual.split("/");
      var comboOLD = combo_codigo_actual[1].split(",");
      var comboNEW = combo_codigo_actual[2].split(",");
      var newx = parseInt(comboNEW[0]);
      var newy = parseInt(comboNEW[1]);
      var piece = parseInt(combo_codigo_actual[0]);
      var oldX = parseInt(comboOLD[0]);
      var oldY = parseInt(comboOLD[1]);

      var lost_piece = -1;
      var lost_team = -1;


      moveSelectedPiece(oldX, oldY, piece, newx, newy, lost_piece, lost_team);

      document.getElementById('jugada_actual').innerHTML = elementos[numero_jugada][1]['movimiento'];
      numero_jugada++;
    }
  }

}
export function prev_move() {

  //buscamos numero de jugada
  if (numero_jugada === -1) {
    var jugadas = serverGameData?.jugadas;
    if (jugadas !== null && jugadas !== undefined) {
      var total_jugadas = Object.keys(jugadas).length;
      //numero_jugada = total_jugadas;
      numero_jugada = 0;
    }
  }

  var jugadas = serverGameData?.jugadas;
  if (jugadas !== null && jugadas !== undefined) {
    var total_jugadas = Object.keys(jugadas).length;
    var elementos = Array.from(Object.entries(jugadas));
    if (numero_jugada > 0) {
      numero_jugada--;

      jugada_actual = elementos[numero_jugada][1]['movimiento'];

      var codigo_actual = elementos[numero_jugada][1]['codigo'];
      var combo_codigo_actual = codigo_actual.split("/");
      var comboOLD = combo_codigo_actual[1].split(",");
      var comboNEW = combo_codigo_actual[2].split(",");
      var newx = parseInt(comboNEW[0]);
      var newy = parseInt(comboNEW[1]);
      var piece = parseInt(combo_codigo_actual[0]);
      var oldX = parseInt(comboOLD[0]);
      var oldY = parseInt(comboOLD[1]);
      var Team = parseInt(combo_codigo_actual[3]);
      var lost_piece = parseInt(combo_codigo_actual[4]);
      var lost_team = getOppositeTeam(Team);


      moveSelectedPiece(newx, newy, piece, oldX, oldY, lost_piece, lost_team);
      document.getElementById('jugada_actual').innerHTML = elementos[numero_jugada][1]['movimiento'];
    }
  }

}

