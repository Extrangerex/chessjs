import { Board } from "../models/Board";
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

const initialGameReducerState = {
  gameData: null,
  side: "black" || "whites",
  timeStamp: null,
  colors: {
    whiteTileColor: "rgb(222, 224, 223)",
    blackTileColor: "rgb(105,107,106)",
    middleTileColor: "rgb(150, 150, 150)",
    highLightTileColor: "rgb(139, 102, 53)",
  },
  piecesCharacters: {
    0: "♙",
    1: "♘",
    2: "♗",
    3: "♖",
    4: "♕",
    5: "♔",
    6: "A",
    7: "C",
    8: "D",
    9: "P",
    10: "E",
    11: "L",
  },
  canvas: null,
  curX: null,
  curY: null,
  whiteCasualities: null,
  blackCasualities: null,
  whiteVictories: null,
  blackVictories: null,
  njblancas: null,
  njnegras: null,
  tmpjuego: null,
  contadorleonnegro: null,
  contadorleonblanco: null,
  contadorreyblanco: null,
  contadorreynegro: null,
  contadortorre1blanco: null,
  contadortorre1negro: null,
  contadortorre2blanco: null,
  contadortorre2negro: null,
  casillasenpeligro: [],
  jaquereyblanco: null,
  jaquereynegro: null,
  posicionreynegro: '4,0',
  posicionreyblanco: "4,9",
  comeralpaso: null,
  ultimapiezacapturadanegra: null,
  ultimapiezacapturadablanca: null,
  ultimotipodemovimiento: null,
  ultimomovimiento: null,
  tablero: [],


};

export const gameReducer = (state = {}, action) => {
  switch (action.type) {
    case types.initGame:
      return {
        ...state,
        gameData: new Board()
      }
    default:
      return state;
  }
};

const initialUiReducerState = {
  msgError: null,
  loading: false,
};

export const uiReducer = (state = initialUiReducerState, action) => {
  switch (action.type) {
    case types.uiStartLoading:
      return {
        ...state,
        loading: action.loading,
      };
    case types.uiFinishLoading:
      return {
        ...state,
        loading: false,
      };
    case types.uiSetError:
      return {
        ...state,
        msgError: action.error,
      };
    case types.uiClearError:
      return {
        ...state,
        msgError: null,
      };
    default:
      return state;
  }
};
