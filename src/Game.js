import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { joinGame, newGame, updateGame } from "./redux/gameAction";
import firebase from "firebase";
import { useParams } from "react-router-dom";
import { GameConst } from "./config/Constants";

/**
 * imgs
 */
import alfil from "./assets/svg/alfil.svg";
import alfilbco from "./assets/svg/alfilbco.svg";
import ardilla from "./assets/svg/ardilla.svg";
import ardillabco from "./assets/svg/ardillabco.svg";
import caballo from "./assets/svg/caballo.svg";
import caballobco from "./assets/svg/caballobco.svg";
import conejo from "./assets/svg/conejo.svg";
import conejobco from "./assets/svg/conejobco.svg";
import elefante from "./assets/svg/elefante.svg";
import elefantebco from "./assets/svg/elefantebco.svg";
import leon from "./assets/svg/leon.svg";
import leonbco from "./assets/svg/leonbco.svg";
import pantera from "./assets/svg/pantera.svg";
import panterabco from "./assets/svg/panterabco.svg";
import peon from "./assets/svg/peon.svg";
import peonbco from "./assets/svg/peonbco.svg";
import perro from "./assets/svg/perro.svg";
import perrobco from "./assets/svg/perrobco.svg";
import reina from "./assets/svg/reina.svg";
import reinabco from "./assets/svg/reinabco.svg";
import rey from "./assets/svg/rey.svg";
import reybco from "./assets/svg/reybco.svg";
import torre from "./assets/svg/torre.svg";
import torrebco from "./assets/svg/torrebco.svg";

export function Game() {
  const { lobbyItemId } = useParams();
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const game = useSelector((state) => state.game);
  const { loading } = useSelector((state) => state.ui);
  const [gameData, setGameData] = useState({});
  const chessCanvas = document.getElementById("chessCanvas");
  const chessCtx = chessCanvas.getContext("2d");

  return (
    <section className="hero is-primary is-fullheight">
      <div className="hero-head"></div>

      <div className="hero-body">
        <div className="container has-text-centered">
          <canvas id="chessCanvas"></canvas>
        </div>
      </div>

      <div className="hero-foot">
        <nav className="tabs">
          <div className="container"></div>
        </nav>
      </div>
    </section>
  );
}
