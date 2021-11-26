import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { joinGame, newGame } from "./redux/gameAction";
import { useParams } from "react-router-dom";
import * as chess from "./lib/chess";
import "./Game.css";

import "bootstrap/dist/css/bootstrap.css";
import { Container, Row, Col, Navbar, NavDropdown, Nav, Table } from "react-bootstrap";

import logo from "./images/logo-megachess.png";
//import { MyFooter } from "./Footer";
import peon from "./assets/svg/peon.svg";
import peonbco from "./assets/svg/peonbco.svg";
import vacio from "./assets/svg/vacio.svg";

import firebase from "firebase";

export function Game() {
  const { lobbyItemId } = useParams();
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const game = useSelector((state) => state.game);
  const { loading } = useSelector((state) => state.ui);
  const [chat, setChat] = useState({});
  const [jugadas, setJugadas] = useState({});
  const [serverData, setServerData] = useState({});

  const [infoside, setSide] = useState({});
  const [infoplayer1, setPlayer1] = useState({});


  //actualiza todos los relojes cada segundo
  const timerInterval = setInterval(() => {
    if (serverData?.createdAt != null) {
      chess.setTimerFromCreatedAt();
    }
  }, 1000);

  useEffect(() => {
    if (!game?.lobbyRef) {
      if (lobbyItemId === undefined) {
        dispatch(newGame(auth?.user?.uid));
      } else {
        dispatch(joinGame(lobbyItemId, auth?.user?.uid));
      }
    }
    if (game?.lobbyRef != null) {
      chess.onLoad(game?.lobbyRef);
    }

    const chatRef = firebase.database().ref(`${game?.lobbyRef}/chat`);
    const jugadasRef = firebase.database().ref(`${game?.lobbyRef}/jugadas`);
    const gameRef = firebase.database().ref(`${game?.lobbyRef}`);

    const player1Ref = firebase.database().ref(`${game?.lobbyRef}/player1`);


    // firebase.database().ref("lobby").remove();

    gameRef.on("value", (snapshot) => {
      if (!snapshot.exists()) {
        return;
      }

      setServerData(snapshot.val());
    });

    chatRef.on("value", (snapshot) => {
      if (!snapshot.exists()) {
        return;
      }
      setChat(snapshot.val());
      //mandamos el scroll hasta abajo
      var chatBox = document.getElementById("chat_mensajes");
      chatBox.scrollTop = chatBox.scrollHeight;
    });

    jugadasRef.on("value", (snapshot) => {
      if (!snapshot.exists()) {
        return;
      }
      setJugadas(snapshot.val());
      //mandamos el scroll hasta abajo
      var jugadasBox = document.getElementById("jugadas");
      jugadasBox.scrollTop = jugadasBox.scrollHeight;
    });


    player1Ref.on("value", (snapshot) => {
      if (!snapshot.exists()) {
        return;
      }
      setPlayer1(snapshot.val());
    });


    return () => {
      clearInterval(timerInterval);
      chatRef.off("value");
      jugadasRef.off("value");
    };
  }, [dispatch, auth, game, lobbyItemId]);


  return (
    <section>
      <Navbar bg="light" expand="md">
        <Container>
          <Navbar.Brand href="/">
            <img src={logo} alt="" />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link href="/">Inicio</Nav.Link>
              <NavDropdown title="Aprender" id="basic-nav-dropdown">
                <NavDropdown.Item href="/videos">Videos</NavDropdown.Item>
                <NavDropdown.Item href="/movimientos">
                  Movimientos
                </NavDropdown.Item>
                <NavDropdown.Item href="/piezas">Piezas</NavDropdown.Item>
              </NavDropdown>
              <Nav.Link href="/lobby">Lobby</Nav.Link>
              <Nav.Link href="/blog">Blog</Nav.Link>
              <Nav.Link href="/comprar">Comprar</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container fluid id="fondo_juego">
        <Row>
          {/*solo para pc*/}
          <Col className='d-lg-block d-none' lg={{ span: 2, order: 1 }} style={{ padding: 0 }}>
            <div align="center" id="clave"></div>
            <div align="center" style={{ height: "40vh" }}>
              <img
                id="jugador2"
                src={peon}
                alt=""
                style={{ width: "100px", height: "100px", marginTop: "12vh" }}
              ></img>
              <br></br>
              <p id="negras_comidas"></p>
            </div>
            <div align="center" style={{ height: "10vh" }}>

            </div>
            <div align="center" style={{ height: "45vh" }}>
              <img
                id="jugador1"
                src={peonbco}
                alt=""
                style={{
                  border: "1px solid white",
                  borderRadius: "50%",
                  padding: "5px",
                  width: "100px",
                  height: "100px",
                  marginTop: "10vh",
                }}
              ></img>
              <br></br>
              <p id="blancas_comidas"></p>
            </div>
          </Col>
          <Col xs={{ span: 11, order: 2 }} lg={{ span: 6, order: 3 }} style={{ padding: 0 }}>

            <div align="center" className="tablero">

              {infoplayer1 === firebase?.auth()?.currentUser?.uid ? (

                <Table responsive>
                  <tbody>
                    <tr>
                      <td className="marker">
                        <button
                          id="bloque10"
                          className="block_marker"
                        ></button>
                      </td>
                      <td id="celda_y0x0" onClick={() => chess.onClick(0, 0)}>
                        <span className="nomenclatura_numero">10</span>
                        <span >
                          <img src={vacio} id="y0x0" alt="" />
                        </span>
                      </td>
                      <td className= "side_light" id="celda_y0x1" onClick={() => chess.onClick(0, 1)}>
                        <span >
                          <img src={vacio} id="y0x1" alt="" />
                        </span>
                      </td>
                      <td id="celda_y0x2" onClick={() => chess.onClick(0, 2)}>
                        <span >
                          <img src={vacio} id="y0x2" alt="" />
                        </span>
                      </td>
                      <td className= "side_light" id="celda_y0x3" onClick={() => chess.onClick(0, 3)}>
                        <span >
                          <img src={vacio} id="y0x3" alt="" />
                        </span>
                      </td>
                      <td id="celda_y0x4" onClick={() => chess.onClick(0, 4)}>
                        <span >
                          <img src={vacio} id="y0x4" alt="" />
                        </span>
                      </td>
                      <td className= "side_light" id="celda_y0x5" onClick={() => chess.onClick(0, 5)}>
                        <span >
                          <img src={vacio} id="y0x5" alt="" />
                        </span>
                      </td>
                      <td id="celda_y0x6" onClick={() => chess.onClick(0, 6)}>
                        <span >
                          <img src={vacio} id="y0x6" alt="" />
                        </span>
                      </td>
                      <td className= "side_light" id="celda_y0x7" onClick={() => chess.onClick(0, 7)}>
                        <span >
                          <img src={vacio} id="y0x7" alt="" />
                        </span>
                      </td>
                      <td id="celda_y0x8" onClick={() => chess.onClick(0, 8)}>
                        <span >
                          <img src={vacio} id="y0x8" alt="" />
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="marker">
                        <button
                          id="bloque9"
                          className="block_marker"
                        ></button>
                      </td>
                      <td className= "side_light" id="celda_y1x0" onClick={() => chess.onClick(1, 0)}>
                        <span className="nomenclatura_numero">9</span>
                        <span >
                          <img src={vacio} id="y1x0" alt="" />
                        </span>
                      </td>
                      <td id="celda_y1x1" onClick={() => chess.onClick(1, 1)}>
                        <span >
                          <img src={vacio} id="y1x1" alt="" />
                        </span>
                      </td>
                      <td className= "side_light" id="celda_y1x2" onClick={() => chess.onClick(1, 2)}>
                        <span >
                          <img src={vacio} id="y1x2" alt="" />
                        </span>
                      </td>
                      <td id="celda_y1x3" onClick={() => chess.onClick(1, 3)}>
                        <span >
                          <img src={vacio} id="y1x3" alt="" />
                        </span>
                      </td>
                      <td className= "side_light" id="celda_y1x4" onClick={() => chess.onClick(1, 4)}>
                        <span >
                          <img src={vacio} id="y1x4" alt="" />
                        </span>
                      </td>
                      <td id="celda_y1x5" onClick={() => chess.onClick(1, 5)}>
                        <span >
                          <img src={vacio} id="y1x5" alt="" />
                        </span>
                      </td>
                      <td className= "side_light" id="celda_y1x6" onClick={() => chess.onClick(1, 6)}>
                        <span >
                          <img src={vacio} id="y1x6" alt="" />
                        </span>
                      </td>
                      <td id="celda_y1x7" onClick={() => chess.onClick(1, 7)}>
                        <span >
                          <img src={vacio} id="y1x7" alt="" />
                        </span>
                      </td>
                      <td className= "side_light" id="celda_y1x8" onClick={() => chess.onClick(1, 8)}>
                        <span >
                          <img src={vacio} id="y1x8" alt="" />
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="marker">
                        <button
                          id="bloque8"
                          className="block_marker"
                        ></button>
                      </td>
                      <td id="celda_y2x0" onClick={() => chess.onClick(2, 0)}>
                        <span className="nomenclatura_numero">8</span>
                        <span >
                          <img src={vacio} id="y2x0" alt="" />
                        </span>
                      </td>
                      <td className= "side_light" id="celda_y2x1" onClick={() => chess.onClick(2, 1)}>
                        <span >
                          <img src={vacio} id="y2x1" alt="" />
                        </span>
                      </td>
                      <td id="celda_y2x2" onClick={() => chess.onClick(2, 2)}>
                        <span >
                          <img src={vacio} id="y2x2" alt="" />
                        </span>
                      </td>
                      <td className= "side_light" id="celda_y2x3" onClick={() => chess.onClick(2, 3)}>
                        <span >
                          <img src={vacio} id="y2x3" alt="" />
                        </span>
                      </td>
                      <td id="celda_y2x4" onClick={() => chess.onClick(2, 4)}>
                        <span >
                          <img src={vacio} id="y2x4" alt="" />
                        </span>
                      </td>
                      <td className= "side_light" id="celda_y2x5" onClick={() => chess.onClick(2, 5)}>
                        <span >
                          <img src={vacio} id="y2x5" alt="" />
                        </span>
                      </td>
                      <td id="celda_y2x6" onClick={() => chess.onClick(2, 6)}>
                        <span >
                          <img src={vacio} id="y2x6" alt="" />
                        </span>
                      </td>
                      <td className= "side_light" id="celda_y2x7" onClick={() => chess.onClick(2, 7)}>
                        <span >
                          <img src={vacio} id="y2x7" alt="" />
                        </span>
                      </td>
                      <td id="celda_y2x8" onClick={() => chess.onClick(2, 8)}>
                        <span >
                          <img src={vacio} id="y2x8" alt="" />
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="marker">
                        <button
                          id="bloque7"
                          className="block_marker"
                        ></button>
                      </td>
                      <td className= "side_light" id="celda_y3x0" onClick={() => chess.onClick(3, 0)}>
                        <span className="nomenclatura_numero">7</span>
                        <span>
                          <img src={vacio} id="y3x0" alt="" />
                        </span>
                      </td>
                      <td className="middle_dark" id="celda_y3x1" onClick={() => chess.onClick(3, 1)}>
                        <span>
                          <img src={vacio} id="y3x1" alt="" />
                        </span>
                      </td>
                      <td className= "side_light" id="celda_y3x2" onClick={() => chess.onClick(3, 2)}>
                        <span>
                          <img src={vacio} id="y3x2" alt="" />
                        </span>
                      </td>
                      <td className="middle_dark" id="celda_y3x3" onClick={() => chess.onClick(3, 3)}>
                        <span>
                          <img src={vacio} id="y3x3" alt="" />
                        </span>
                      </td>
                      <td className= "side_light" id="celda_y3x4" onClick={() => chess.onClick(3, 4)}>
                        <span>
                          <img src={vacio} id="y3x4" alt="" />
                        </span>
                      </td>
                      <td className="middle_dark" id="celda_y3x5" onClick={() => chess.onClick(3, 5)}>
                        <span>
                          <img src={vacio} id="y3x5" alt="" />
                        </span>
                      </td>
                      <td className= "side_light" id="celda_y3x6" onClick={() => chess.onClick(3, 6)}>
                        <span>
                          <img src={vacio} id="y3x6" alt="" />
                        </span>
                      </td>
                      <td className="middle_dark" id="celda_y3x7" onClick={() => chess.onClick(3, 7)}>
                        <span>
                          <img src={vacio} id="y3x7" alt="" />
                        </span>
                      </td>
                      <td className= "side_light" id="celda_y3x8" onClick={() => chess.onClick(3, 8)}>
                        <span>
                          <img src={vacio} id="y3x8" alt="" />
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="marker">
                        <button
                          id="bloque6"
                          className="block_marker"
                        ></button>
                      </td>
                      <td className="middle_dark" id="celda_y4x0" onClick={() => chess.onClick(4, 0)}>
                        <span className="nomenclatura_numero">6</span>
                        <span>
                          <img src={vacio} id="y4x0" alt="" />
                        </span>
                      </td>
                      <td className= "side_light" id="celda_y4x1" onClick={() => chess.onClick(4, 1)}>
                        <span>
                          <img src={vacio} id="y4x1" alt="" />
                        </span>
                      </td>
                      <td className="middle_dark" id="celda_y4x2" onClick={() => chess.onClick(4, 2)}>
                        <span>
                          <img src={vacio} id="y4x2" alt="" />
                        </span>
                      </td>
                      <td className= "side_light" id="celda_y4x3" onClick={() => chess.onClick(4, 3)}>
                        <span>
                          <img src={vacio} id="y4x3" alt="" />
                        </span>
                      </td>
                      <td className="middle_dark" id="celda_y4x4" onClick={() => chess.onClick(4, 4)}>
                        <span>
                          <img src={vacio} id="y4x4" alt="" />
                        </span>
                      </td>
                      <td className= "side_light" id="celda_y4x5" onClick={() => chess.onClick(4, 5)}>
                        <span>
                          <img src={vacio} id="y4x5" alt="" />
                        </span>
                      </td>
                      <td className="middle_dark" id="celda_y4x6" onClick={() => chess.onClick(4, 6)}>
                        <span>
                          <img src={vacio} id="y4x6" alt="" />
                        </span>
                      </td>
                      <td className= "side_light" id="celda_y4x7" onClick={() => chess.onClick(4, 7)}>
                        <span>
                          <img src={vacio} id="y4x7" alt="" />
                        </span>
                      </td>
                      <td className="middle_dark" id="celda_y4x8" onClick={() => chess.onClick(4, 8)}>
                        <span>
                          <img src={vacio} id="y4x8" alt="" />
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="marker">
                        <button
                          id="bloque5"
                          className="block_marker"
                        ></button>
                      </td>
                      <td className= "side_light" id="celda_y5x0" onClick={() => chess.onClick(5, 0)}>
                        <span className="nomenclatura_numero">5</span>
                        <span>
                          <img src={vacio} id="y5x0" alt="" />
                        </span>
                      </td>
                      <td className="middle_dark" id="celda_y5x1" onClick={() => chess.onClick(5, 1)}>
                        <span>
                          <img src={vacio} id="y5x1" alt="" />
                        </span>
                      </td>
                      <td className= "side_light" id="celda_y5x2" onClick={() => chess.onClick(5, 2)}>
                        <span>
                          <img src={vacio} id="y5x2" alt="" />
                        </span>
                      </td>
                      <td className="middle_dark" id="celda_y5x3" onClick={() => chess.onClick(5, 3)}>
                        <span>
                          <img src={vacio} id="y5x3" alt="" />
                        </span>
                      </td>
                      <td className= "side_light" id="celda_y5x4" onClick={() => chess.onClick(5, 4)}>
                        <span>
                          <img src={vacio} id="y5x4" alt="" />
                        </span>
                      </td>
                      <td className="middle_dark" id="celda_y5x5" onClick={() => chess.onClick(5, 5)}>
                        <span>
                          <img src={vacio} id="y5x5" alt="" />
                        </span>
                      </td>
                      <td className= "side_light" id="celda_y5x6" onClick={() => chess.onClick(5, 6)}>
                        <span>
                          <img src={vacio} id="y5x6" alt="" />
                        </span>
                      </td>
                      <td className="middle_dark" id="celda_y5x7" onClick={() => chess.onClick(5, 7)}>
                        <span>
                          <img src={vacio} id="y5x7" alt="" />
                        </span>
                      </td>
                      <td className= "side_light" id="celda_y5x8" onClick={() => chess.onClick(5, 8)}>
                        <span>
                          <img src={vacio} id="y5x8" alt="" />
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="marker">
                        <button
                          id="bloque4"
                          className="block_marker"
                        ></button>
                      </td>
                      <td className="middle_dark" id="celda_y6x0" onClick={() => chess.onClick(6, 0)}>
                        <span className="nomenclatura_numero">4</span>
                        <span>
                          <img src={vacio} id="y6x0" alt="" />
                        </span>
                      </td>
                      <td className= "side_light" id="celda_y6x1" onClick={() => chess.onClick(6, 1)}>
                        <span>
                          <img src={vacio} id="y6x1" alt="" />
                        </span>
                      </td>
                      <td className="middle_dark" id="celda_y6x2" onClick={() => chess.onClick(6, 2)}>
                        <span>
                          <img src={vacio} id="y6x2" alt="" />
                        </span>
                      </td>
                      <td className= "side_light" id="celda_y6x3" onClick={() => chess.onClick(6, 3)}>
                        <span>
                          <img src={vacio} id="y6x3" alt="" />
                        </span>
                      </td>
                      <td className="middle_dark" id="celda_y6x4" onClick={() => chess.onClick(6, 4)}>
                        <span>
                          <img src={vacio} id="y6x4" alt="" />
                        </span>
                      </td>
                      <td className= "side_light" id="celda_y6x5" onClick={() => chess.onClick(6, 5)}>
                        <span>
                          <img src={vacio} id="y6x5" alt="" />
                        </span>
                      </td>
                      <td className="middle_dark" id="celda_y6x6" onClick={() => chess.onClick(6, 6)}>
                        <span>
                          <img src={vacio} id="y6x6" alt="" />
                        </span>
                      </td>
                      <td className= "side_light" id="celda_y6x7" onClick={() => chess.onClick(6, 7)}>
                        <span>
                          <img src={vacio} id="y6x7" alt="" />
                        </span>
                      </td>
                      <td className="middle_dark" id="celda_y6x8" onClick={() => chess.onClick(6, 8)}>
                        <span>
                          <img src={vacio} id="y6x8" alt="" />
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="marker">
                        <button
                          id="bloque3"
                          className="block_marker"
                        ></button>
                      </td>
                      <td className= "side_light" id="celda_y7x0" onClick={() => chess.onClick(7, 0)}>
                        <span className="nomenclatura_numero">3</span>
                        <span >
                          <img src={vacio} id="y7x0" alt="" />
                        </span>
                      </td>
                      <td id="celda_y7x1" onClick={() => chess.onClick(7, 1)}>
                        <span >
                          <img src={vacio} id="y7x1" alt="" />
                        </span>
                      </td>
                      <td className= "side_light" id="celda_y7x2" onClick={() => chess.onClick(7, 2)}>
                        <span >
                          <img src={vacio} id="y7x2" alt="" />
                        </span>
                      </td>
                      <td id="celda_y7x3" onClick={() => chess.onClick(7, 3)}>
                        <span >
                          <img src={vacio} id="y7x3" alt="" />
                        </span>
                      </td>
                      <td className= "side_light" id="celda_y7x4" onClick={() => chess.onClick(7, 4)}>
                        <span >
                          <img src={vacio} id="y7x4" alt="" />
                        </span>
                      </td>
                      <td id="celda_y7x5" onClick={() => chess.onClick(7, 5)}>
                        <span >
                          <img src={vacio} id="y7x5" alt="" />
                        </span>
                      </td>
                      <td className= "side_light" id="celda_y7x6" onClick={() => chess.onClick(7, 6)}>
                        <span >
                          <img src={vacio} id="y7x6" alt="" />
                        </span>
                      </td>
                      <td id="celda_y7x7" onClick={() => chess.onClick(7, 7)}>
                        <span >
                          <img src={vacio} id="y7x7" alt="" />
                        </span>
                      </td>
                      <td className= "side_light" id="celda_y7x8" onClick={() => chess.onClick(7, 8)}>
                        <span >
                          <img src={vacio} id="y7x8" alt="" />
                        </span>
                      </td>

                    </tr>
                    <tr>
                      <td className="marker">
                        <button
                          id="bloque2"
                          className="block_marker"
                        ></button>
                      </td>
                      <td  id="celda_y8x0" onClick={() => chess.onClick(8, 0)}>
                        <span className="nomenclatura_numero">2</span>
                        <span >
                          <img src={vacio} id="y8x0" alt="" />
                        </span>
                      </td>
                      <td className= "side_light" id="celda_y8x1" onClick={() => chess.onClick(8, 1)}>
                        <span >
                          <img src={vacio} id="y8x1" alt="" />
                        </span>
                      </td>
                      <td  id="celda_y8x2" onClick={() => chess.onClick(8, 2)}>
                        <span >
                          <img src={vacio} id="y8x2" alt="" />
                        </span>
                      </td>
                      <td className= "side_light" id="celda_y8x3" onClick={() => chess.onClick(8, 3)}>
                        <span >
                          <img src={vacio} id="y8x3" alt="" />
                        </span>
                      </td>
                      <td  id="celda_y8x4" onClick={() => chess.onClick(8, 4)}>
                        <span >
                          <img src={vacio} id="y8x4" alt="" />
                        </span>
                      </td>
                      <td className= "side_light" id="celda_y8x5" onClick={() => chess.onClick(8, 5)}>
                        <span >
                          <img src={vacio} id="y8x5" alt="" />
                        </span>
                      </td>
                      <td  id="celda_y8x6" onClick={() => chess.onClick(8, 6)}>
                        <span >
                          <img src={vacio} id="y8x6" alt="" />
                        </span>
                      </td>
                      <td className= "side_light" id="celda_y8x7" onClick={() => chess.onClick(8, 7)}>
                        <span >
                          <img src={vacio} id="y8x7" alt="" />
                        </span>
                      </td>
                      <td id="celda_y8x8" onClick={() => chess.onClick(8, 8)}>
                        <span >
                          <img src={vacio} id="y8x8" alt="" />
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="marker">
                        <button
                          id="bloque1"
                          className="block_marker"
                        ></button>
                      </td>
                      <td className= "side_light" id="celda_y9x0" onClick={() => chess.onClick(9, 0)}>
                        <span className="nomenclatura_numero">1</span>
                        <span className="nomenclatura_letra">a</span>
                        <span >
                          <img src={vacio} id="y9x0" alt="" />
                        </span>
                      </td>
                      <td id="celda_y9x1" onClick={() => chess.onClick(9, 1)}>
                        <span className="nomenclatura_letra">b</span>
                        <span >
                          <img src={vacio} id="y9x1" alt="" />
                        </span>
                      </td>
                      <td className= "side_light" id="celda_y9x2" onClick={() => chess.onClick(9, 2)}>
                        <span className="nomenclatura_letra">c</span>
                        <span >
                          <img src={vacio} id="y9x2" alt="" />
                        </span>
                      </td>
                      <td id="celda_y9x3" onClick={() => chess.onClick(9, 3)}>
                        <span className="nomenclatura_letra">d</span>
                        <span >
                          <img src={vacio} id="y9x3" alt="" />
                        </span>
                      </td>
                      <td className= "side_light" id="celda_y9x4" onClick={() => chess.onClick(9, 4)}>
                        <span className="nomenclatura_letra">e</span>
                        <span >
                          <img src={vacio} id="y9x4" alt="" />
                        </span>
                      </td>
                      <td id="celda_y9x5" onClick={() => chess.onClick(9, 5)}>
                        <span className="nomenclatura_letra">f</span>
                        <span >
                          <img src={vacio} id="y9x5" alt="" />
                        </span>
                      </td>
                      <td className= "side_light" id="celda_y9x6" onClick={() => chess.onClick(9, 6)}>
                        <span className="nomenclatura_letra">g</span>
                        <span >
                          <img src={vacio} id="y9x6" alt="" />
                        </span>
                      </td>
                      <td id="celda_y9x7" onClick={() => chess.onClick(9, 7)}>
                        <span className="nomenclatura_letra">h</span>
                        <span >
                          <img src={vacio} id="y9x7" alt="" />
                        </span>
                      </td>
                      <td className= "side_light" id="celda_y9x8" onClick={() => chess.onClick(9, 8)}>
                        <span className="nomenclatura_letra">i</span>
                        <span >
                          <img src={vacio} id="y9x8" alt="" />
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="marker"></td>
                      <td className="marker">
                        <button className="btnturno"
                          id="jugada1"
                        ></button>
                      </td>
                      <td className="marker">
                        <button className="btnturno"
                          id="jugada2"
                        ></button>
                      </td>
                      <td className="marker">
                        <button className="btnturno"
                          id="jugada3"
                        ></button>
                      </td>
                      <td className="marker">
                        <button className="btnturno"
                          id="jugada4"
                        ></button>
                      </td>
                      <td className="marker">
                        <button className="btnturno"
                          id="jugada5"
                        ></button>
                      </td>
                      <td className="marker">
                        <button className="btnturno"
                          id="jugada6"
                        ></button>
                      </td>
                      <td className="marker">
                        <button className="btnturno"
                          id="jugada7"
                        ></button>
                      </td>
                      <td className="marker">
                        <button className="btnturno"
                          id="jugada8"
                        ></button>
                      </td>
                      <td className="marker">
                        <button className="btnturno"
                          id="jugada9"
                        ></button>
                      </td>
                    </tr>
                  </tbody>
                </Table>

              ) : (

                <Table responsive>
                  <tbody>
                    <tr>
                      <td className="marker">
                        <button
                          id="bloque10"
                          className="block_marker"
                        ></button>
                      </td>
                      <td className= "side_light" id="celda_y9x8" onClick={() => chess.onClick(9, 8)}>
                        <span className="nomenclatura_letra">i</span>
                        <span >
                          <img src={vacio} id="y9x8" alt="" />
                        </span>
                      </td>
                      <td id="celda_y9x7" onClick={() => chess.onClick(9, 7)}>
                        <span className="nomenclatura_letra">h</span>
                        <span >
                          <img src={vacio} id="y9x7" alt="" />
                        </span>
                      </td>
                      <td className= "side_light" id="celda_y9x6" onClick={() => chess.onClick(9, 6)}>
                        <span className="nomenclatura_letra">g</span>
                        <span >
                          <img src={vacio} id="y9x6" alt="" />
                        </span>
                      </td>
                      <td id="celda_y9x5" onClick={() => chess.onClick(9, 5)}>
                        <span className="nomenclatura_letra">f</span>
                        <span >
                          <img src={vacio} id="y9x5" alt="" />
                        </span>
                      </td>
                      <td className= "side_light" id="celda_y9x4" onClick={() => chess.onClick(9, 4)}>
                        <span className="nomenclatura_letra">e</span>
                        <span >
                          <img src={vacio} id="y9x4" alt="" />
                        </span>
                      </td>
                      <td id="celda_y9x3" onClick={() => chess.onClick(9, 3)}>
                        <span className="nomenclatura_letra">d</span>
                        <span >
                          <img src={vacio} id="y9x3" alt="" />
                        </span>
                      </td>
                      <td className= "side_light" id="celda_y9x2" onClick={() => chess.onClick(9, 2)}>
                        <span className="nomenclatura_letra">c</span>
                        <span >
                          <img src={vacio} id="y9x2" alt="" />
                        </span>
                      </td>
                      <td id="celda_y9x1" onClick={() => chess.onClick(9, 1)}>
                        <span className="nomenclatura_letra">b</span>
                        <span >
                          <img src={vacio} id="y9x1" alt="" />
                        </span>
                      </td>
                      <td className= "side_light" id="celda_y9x0" onClick={() => chess.onClick(9, 0)}>
                        <span className="nomenclatura_numero">1</span>
                        <span className="nomenclatura_letra">a</span>
                        <span >
                          <img src={vacio} id="y9x0" alt="" />
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="marker">
                        <button
                          id="bloque9"
                          className="block_marker"
                        ></button>
                      </td>
                      <td id="celda_y8x8" onClick={() => chess.onClick(8, 8)}>
                        <span >
                          <img src={vacio} id="y8x8" alt="" />
                        </span>
                      </td>
                      <td className= "side_light" id="celda_y8x7" onClick={() => chess.onClick(8, 7)}>
                        <span >
                          <img src={vacio} id="y8x7" alt="" />
                        </span>
                      </td>
                      <td id="celda_y8x6" onClick={() => chess.onClick(8, 6)}>
                        <span >
                          <img src={vacio} id="y8x6" alt="" />
                        </span>
                      </td>
                      <td className= "side_light" id="celda_y8x5" onClick={() => chess.onClick(8, 5)}>
                        <span >
                          <img src={vacio} id="y8x5" alt="" />
                        </span>
                      </td>
                      <td id="celda_y8x4" onClick={() => chess.onClick(8, 4)}>
                        <span >
                          <img src={vacio} id="y8x4" alt="" />
                        </span>
                      </td>
                      <td className= "side_light" id="celda_y8x3" onClick={() => chess.onClick(8, 3)}>
                        <span >
                          <img src={vacio} id="y8x3" alt="" />
                        </span>
                      </td>
                      <td id="celda_y8x2" onClick={() => chess.onClick(8, 2)}>
                        <span >
                          <img src={vacio} id="y8x2" alt="" />
                        </span>
                      </td>
                      <td className= "side_light" id="celda_y8x1" onClick={() => chess.onClick(8, 1)}>
                        <span >
                          <img src={vacio} id="y8x1" alt="" />
                        </span>
                      </td>
                      <td id="celda_y8x0" onClick={() => chess.onClick(8, 0)}>
                        <span className="nomenclatura_numero">2</span>
                        <span >
                          <img src={vacio} id="y8x0" alt="" />
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="marker">
                        <button
                          id="bloque8"
                          className="block_marker"
                        ></button>
                      </td>
                      <td className= "side_light" id="celda_y7x8" onClick={() => chess.onClick(7, 8)}>
                        <span >
                          <img src={vacio} id="y7x8" alt="" />
                        </span>
                      </td>
                      <td id="celda_y7x7" onClick={() => chess.onClick(7, 7)}>
                        <span >
                          <img src={vacio} id="y7x7" alt="" />
                        </span>
                      </td>
                      <td className= "side_light" id="celda_y7x6" onClick={() => chess.onClick(7, 6)}>
                        <span >
                          <img src={vacio} id="y7x6" alt="" />
                        </span>
                      </td>
                      <td id="celda_y7x5" onClick={() => chess.onClick(7, 5)}>
                        <span >
                          <img src={vacio} id="y7x5" alt="" />
                        </span>
                      </td>
                      <td className= "side_light" id="celda_y7x4" onClick={() => chess.onClick(7, 4)}>
                        <span >
                          <img src={vacio} id="y7x4" alt="" />
                        </span>
                      </td>
                      <td id="celda_y7x3" onClick={() => chess.onClick(7, 3)}>
                        <span >
                          <img src={vacio} id="y7x3" alt="" />
                        </span>
                      </td>
                      <td className= "side_light" id="celda_y7x2" onClick={() => chess.onClick(7, 2)}>
                        <span >
                          <img src={vacio} id="y7x2" alt="" />
                        </span>
                      </td>
                      <td id="celda_y7x1" onClick={() => chess.onClick(7, 1)}>
                        <span >
                          <img src={vacio} id="y7x1" alt="" />
                        </span>
                      </td>
                      <td className= "side_light" id="celda_y7x0" onClick={() => chess.onClick(7, 0)}>
                        <span className="nomenclatura_numero">3</span>
                        <span >
                          <img src={vacio} id="y7x0" alt="" />
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="marker">
                        <button
                          id="bloque7"
                          className="block_marker"
                        ></button>
                      </td>
                      <td className="middle_dark" id="celda_y6x8" onClick={() => chess.onClick(6, 8)}>
                        <span>
                          <img src={vacio} id="y6x8" alt="" />
                        </span>
                      </td>
                      <td className= "side_light" id="celda_y6x7" onClick={() => chess.onClick(6, 7)}>
                        <span>
                          <img src={vacio} id="y6x7" alt="" />
                        </span>
                      </td>
                      <td className="middle_dark" id="celda_y6x6" onClick={() => chess.onClick(6, 6)}>
                        <span>
                          <img src={vacio} id="y6x6" alt="" />
                        </span>
                      </td>
                      <td className= "side_light" id="celda_y6x5" onClick={() => chess.onClick(6, 5)}>
                        <span>
                          <img src={vacio} id="y6x5" alt="" />
                        </span>
                      </td>
                      <td className="middle_dark" id="celda_y6x4" onClick={() => chess.onClick(6, 4)}>
                        <span>
                          <img src={vacio} id="y6x4" alt="" />
                        </span>
                      </td>
                      <td className= "side_light" id="celda_y6x3" onClick={() => chess.onClick(6, 3)}>
                        <span>
                          <img src={vacio} id="y6x3" alt="" />
                        </span>
                      </td>
                      <td className="middle_dark" id="celda_y6x2" onClick={() => chess.onClick(6, 2)}>
                        <span>
                          <img src={vacio} id="y6x2" alt="" />
                        </span>
                      </td>
                      <td className= "side_light" id="celda_y6x1" onClick={() => chess.onClick(6, 1)}>
                        <span>
                          <img src={vacio} id="y6x1" alt="" />
                        </span>
                      </td>
                      <td className="middle_dark" id="celda_y6x0" onClick={() => chess.onClick(6, 0)}>
                        <span className="nomenclatura_numero">4</span>
                        <span>
                          <img src={vacio} id="y6x0" alt="" />
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="marker">
                        <button
                          id="bloque6"
                          className="block_marker"
                        ></button>
                      </td>
                      <td className= "side_light" id="celda_y5x8" onClick={() => chess.onClick(5, 8)}>
                        <span>
                          <img src={vacio} id="y5x8" alt="" />
                        </span>
                      </td>
                      <td className="middle_dark" id="celda_y5x7" onClick={() => chess.onClick(5, 7)}>
                        <span>
                          <img src={vacio} id="y5x7" alt="" />
                        </span>
                      </td>
                      <td className= "side_light" id="celda_y5x6" onClick={() => chess.onClick(5, 6)}>
                        <span>
                          <img src={vacio} id="y5x6" alt="" />
                        </span>
                      </td>
                      <td className="middle_dark" id="celda_y5x5" onClick={() => chess.onClick(5, 5)}>
                        <span>
                          <img src={vacio} id="y5x5" alt="" />
                        </span>
                      </td>
                      <td className= "side_light" id="celda_y5x4" onClick={() => chess.onClick(5, 4)}>
                        <span>
                          <img src={vacio} id="y5x4" alt="" />
                        </span>
                      </td>
                      <td className="middle_dark" id="celda_y5x3" onClick={() => chess.onClick(5, 3)}>
                        <span>
                          <img src={vacio} id="y5x3" alt="" />
                        </span>
                      </td>
                      <td className= "side_light" id="celda_y5x2" onClick={() => chess.onClick(5, 2)}>
                        <span>
                          <img src={vacio} id="y5x2" alt="" />
                        </span>
                      </td>
                      <td className="middle_dark" id="celda_y5x1" onClick={() => chess.onClick(5, 1)}>
                        <span>
                          <img src={vacio} id="y5x1" alt="" />
                        </span>
                      </td>
                      <td className= "side_light" id="celda_y5x0" onClick={() => chess.onClick(5, 0)}>
                        <span className="nomenclatura_numero">5</span>
                        <span>
                          <img src={vacio} id="y5x0" alt="" />
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="marker">
                        <button
                          id="bloque5"
                          className="block_marker"
                        ></button>
                      </td>
                      <td className="middle_dark" id="celda_y4x8" onClick={() => chess.onClick(4, 8)}>
                        <span>
                          <img src={vacio} id="y4x8" alt="" />
                        </span>
                      </td>
                      <td className= "side_light" id="celda_y4x7" onClick={() => chess.onClick(4, 7)}>
                        <span>
                          <img src={vacio} id="y4x7" alt="" />
                        </span>
                      </td>
                      <td className="middle_dark" id="celda_y4x6" onClick={() => chess.onClick(4, 6)}>
                        <span>
                          <img src={vacio} id="y4x6" alt="" />
                        </span>
                      </td>
                      <td className= "side_light" id="celda_y4x5" onClick={() => chess.onClick(4, 5)}>
                        <span>
                          <img src={vacio} id="y4x5" alt="" />
                        </span>
                      </td>
                      <td className="middle_dark" id="celda_y4x4" onClick={() => chess.onClick(4, 4)}>
                        <span>
                          <img src={vacio} id="y4x4" alt="" />
                        </span>
                      </td>
                      <td className= "side_light" id="celda_y4x3" onClick={() => chess.onClick(4, 3)}>
                        <span>
                          <img src={vacio} id="y4x3" alt="" />
                        </span>
                      </td>
                      <td className="middle_dark" id="celda_y4x2" onClick={() => chess.onClick(4, 2)}>
                        <span>
                          <img src={vacio} id="y4x2" alt="" />
                        </span>
                      </td>
                      <td className= "side_light" id="celda_y4x1" onClick={() => chess.onClick(4, 1)}>
                        <span>
                          <img src={vacio} id="y4x1" alt="" />
                        </span>
                      </td>
                      <td className="middle_dark" id="celda_y4x0" onClick={() => chess.onClick(4, 0)}>
                        <span className="nomenclatura_numero">6</span>
                        <span>
                          <img src={vacio} id="y4x0" alt="" />
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="marker">
                        <button
                          id="bloque4"
                          className="block_marker"
                        ></button>
                      </td>
                      <td className= "side_light" id="celda_y3x8" onClick={() => chess.onClick(3, 8)}>
                        <span>
                          <img src={vacio} id="y3x8" alt="" />
                        </span>
                      </td>
                      <td className="middle_dark" id="celda_y3x7" onClick={() => chess.onClick(3, 7)}>
                        <span>
                          <img src={vacio} id="y3x7" alt="" />
                        </span>
                      </td>
                      <td className= "side_light" id="celda_y3x6" onClick={() => chess.onClick(3, 6)}>
                        <span>
                          <img src={vacio} id="y3x6" alt="" />
                        </span>
                      </td>
                      <td className="middle_dark" id="celda_y3x5" onClick={() => chess.onClick(3, 5)}>
                        <span>
                          <img src={vacio} id="y3x5" alt="" />
                        </span>
                      </td>
                      <td className= "side_light" id="celda_y3x4" onClick={() => chess.onClick(3, 4)}>
                        <span>
                          <img src={vacio} id="y3x4" alt="" />
                        </span>
                      </td>
                      <td className="middle_dark" id="celda_y3x3" onClick={() => chess.onClick(3, 3)}>
                        <span>
                          <img src={vacio} id="y3x3" alt="" />
                        </span>
                      </td>
                      <td className= "side_light" id="celda_y3x2" onClick={() => chess.onClick(3, 2)}>
                        <span>
                          <img src={vacio} id="y3x2" alt="" />
                        </span>
                      </td>
                      <td className="middle_dark" id="celda_y3x1" onClick={() => chess.onClick(3, 1)}>
                        <span>
                          <img src={vacio} id="y3x1" alt="" />
                        </span>
                      </td>
                      <td className= "side_light" id="celda_y3x0" onClick={() => chess.onClick(3, 0)}>
                        <span className="nomenclatura_numero">7</span>
                        <span>
                          <img src={vacio} id="y3x0" alt="" />
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="marker">
                        <button
                          id="bloque3"
                          className="block_marker"
                        ></button>
                      </td>
                      <td id="celda_y2x8" onClick={() => chess.onClick(2, 8)}>
                        <span >
                          <img src={vacio} id="y2x8" alt="" />
                        </span>
                      </td>
                      <td className= "side_light" id="celda_y2x7" onClick={() => chess.onClick(2, 7)}>
                        <span >
                          <img src={vacio} id="y2x7" alt="" />
                        </span>
                      </td>
                      <td id="celda_y2x6" onClick={() => chess.onClick(2, 6)}>
                        <span >
                          <img src={vacio} id="y2x6" alt="" />
                        </span>
                      </td>
                      <td className= "side_light" id="celda_y2x5" onClick={() => chess.onClick(2, 5)}>
                        <span >
                          <img src={vacio} id="y2x5" alt="" />
                        </span>
                      </td>
                      <td id="celda_y2x4" onClick={() => chess.onClick(2, 4)}>
                        <span >
                          <img src={vacio} id="y2x4" alt="" />
                        </span>
                      </td>
                      <td className= "side_light" id="celda_y2x3" onClick={() => chess.onClick(2, 3)}>
                        <span >
                          <img src={vacio} id="y2x3" alt="" />
                        </span>
                      </td>
                      <td id="celda_y2x2" onClick={() => chess.onClick(2, 2)}>
                        <span >
                          <img src={vacio} id="y2x2" alt="" />
                        </span>
                      </td>
                      <td className= "side_light" id="celda_y2x1" onClick={() => chess.onClick(2, 1)}>
                        <span >
                          <img src={vacio} id="y2x1" alt="" />
                        </span>
                      </td>
                      <td id="celda_y2x0" onClick={() => chess.onClick(2, 0)}>
                        <span className="nomenclatura_numero">8</span>
                        <span >
                          <img src={vacio} id="y2x0" alt="" />
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="marker">
                        <button
                          id="bloque2"
                          className="block_marker"
                        ></button>
                      </td>
                      <td className= "side_light" id="celda_y1x8" onClick={() => chess.onClick(1, 8)}>
                        <span >
                          <img src={vacio} id="y1x8" alt="" />
                        </span>
                      </td>
                      <td id="celda_y1x7" onClick={() => chess.onClick(1, 7)}>
                        <span >
                          <img src={vacio} id="y1x7" alt="" />
                        </span>
                      </td>
                      <td className= "side_light" id="celda_y1x6" onClick={() => chess.onClick(1, 6)}>
                        <span >
                          <img src={vacio} id="y1x6" alt="" />
                        </span>
                      </td>
                      <td id="celda_y1x5" onClick={() => chess.onClick(1, 5)}>
                        <span >
                          <img src={vacio} id="y1x5" alt="" />
                        </span>
                      </td>
                      <td className= "side_light" id="celda_y1x4" onClick={() => chess.onClick(1, 4)}>
                        <span >
                          <img src={vacio} id="y1x4" alt="" />
                        </span>
                      </td>
                      <td id="celda_y1x3" onClick={() => chess.onClick(1, 3)}>
                        <span >
                          <img src={vacio} id="y1x3" alt="" />
                        </span>
                      </td>
                      <td className= "side_light" id="celda_y1x2" onClick={() => chess.onClick(1, 2)}>
                        <span >
                          <img src={vacio} id="y1x2" alt="" />
                        </span>
                      </td>
                      <td id="celda_y1x1" onClick={() => chess.onClick(1, 1)}>
                        <span >
                          <img src={vacio} id="y1x1" alt="" />
                        </span>
                      </td>
                      <td className= "side_light" id="celda_y1x0" onClick={() => chess.onClick(1, 0)}>
                        <span className="nomenclatura_numero">9</span>
                        <span >
                          <img src={vacio} id="y1x0" alt="" />
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="marker">
                        <button
                          id="bloque1"
                          className="block_marker"
                        ></button>
                      </td>
                      <td id="celda_y0x8" onClick={() => chess.onClick(0, 8)}>
                        <span >
                          <img src={vacio} id="y0x8" alt="" />
                        </span>
                      </td>
                      <td className= "side_light" id="celda_y0x7" onClick={() => chess.onClick(0, 7)}>
                        <span >
                          <img src={vacio} id="y0x7" alt="" />
                        </span>
                      </td>
                      <td id="celda_y0x6" onClick={() => chess.onClick(0, 6)}>
                        <span >
                          <img src={vacio} id="y0x6" alt="" />
                        </span>
                      </td>
                      <td className= "side_light" id="celda_y0x5" onClick={() => chess.onClick(0, 5)}>
                        <span >
                          <img src={vacio} id="y0x5" alt="" />
                        </span>
                      </td>
                      <td id="celda_y0x4" onClick={() => chess.onClick(0, 4)}>
                        <span >
                          <img src={vacio} id="y0x4" alt="" />
                        </span>
                      </td>
                      <td className= "side_light" id="celda_y0x3" onClick={() => chess.onClick(0, 3)}>
                        <span >
                          <img src={vacio} id="y0x3" alt="" />
                        </span>
                      </td>
                      <td id="celda_y0x2" onClick={() => chess.onClick(0, 2)}>
                        <span >
                          <img src={vacio} id="y0x2" alt="" />
                        </span>
                      </td>
                      <td className= "side_light" id="celda_y0x1" onClick={() => chess.onClick(0, 1)}>
                        <span >
                          <img src={vacio} id="y0x1" alt="" />
                        </span>
                      </td>
                      <td id="celda_y0x0" onClick={() => chess.onClick(0, 0)}>
                        <span className="nomenclatura_numero">10</span>
                        <span >
                          <img src={vacio} id="y0x0" alt="" />
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="marker"></td>
                      <td className="marker">
                        <button className="btnturno"
                          id="jugada1"
                        ></button>
                      </td>
                      <td className="marker">
                        <button className="btnturno"
                          id="jugada2"
                        ></button>
                      </td>
                      <td className="marker">
                        <button className="btnturno"
                          id="jugada3"
                        ></button>
                      </td>
                      <td className="marker">
                        <button className="btnturno"
                          id="jugada4"
                        ></button>
                      </td>
                      <td className="marker">
                        <button className="btnturno"
                          id="jugada5"
                        ></button>
                      </td>
                      <td className="marker">
                        <button className="btnturno"
                          id="jugada6"
                        ></button>
                      </td>
                      <td className="marker">
                        <button className="btnturno"
                          id="jugada7"
                        ></button>
                      </td>
                      <td className="marker">
                        <button className="btnturno"
                          id="jugada8"
                        ></button>
                      </td>
                      <td className="marker">
                        <button className="btnturno"
                          id="jugada9"
                        ></button>
                      </td>
                    </tr>
                  </tbody>
                </Table>

              )
              }

            </div>
          </Col>
          {/*solo para movil*/}
          <Col className='d-block d-lg-none' xs={{ span: 12, order: 3 }}  style={{ padding: 0 }}>
              <div align="center" id="clave_movil"></div>
          </Col>  
          <Col className='d-block d-lg-none' xs={{ span: 6, order: 3 }}  style={{ padding: 0 }}>
            
            <div align="center">
              <img
                id="jugador2_movil"
                src={peon}
                alt=""
                style={{ width: "35px", height: "35px", marginTop: "5px" }}
              ></img>
              <br></br>
              <p id="negras_comidas_movil" style={{color:"white"}}></p>
            </div>
          </Col>  
          <Col className='d-block d-lg-none' xs={{ span: 6, order: 3 }}  style={{ padding: 0 }}> 
            <div align="center">
              <img
                id="jugador1_movil"
                src={peonbco}
                alt=""
                style={{
                  border: "1px solid white",
                  borderRadius: "50%",
                  padding: "5px",
                  width: "35px",
                  height: "35px",
                  marginTop: "5px",
                }}
              ></img>
              <br></br>
              <p id="blancas_comidas_movil" style={{color:"white"}}></p>
            </div>
          </Col>


          <Col xs={{ span: 12, order: 4 }} lg={{ span: 3, order: 4 }}>
            <div align="center" id="extras">
              <ul align="center" className="d-flex justify-content-between p-1">
                <li>
                  <i className="fa fa-clock" style={{ color: "#657696" }}></i> Blancas: <span id="time_toplay_player1"></span>
                </li>
                <li>
                  <i className="fa fa-clock" style={{ color: "#657696" }}></i> Negras: <span id="time_toplay_player2"></span>
                </li>
                <li>
                  <i className="fa fa-clock" style={{ color: "#657696" }}></i> <span id="time_createdat"></span>
                </li>
              </ul>

              <ul align="center" className="d-flex justify-content-between p-1">
                <li>
                  Turno: <span id="numero_turno"></span>
                </li>
                <li>
                  Bloque: <span id="bloque"></span>
                </li>
              </ul>
              <div id="jugadas" align="center">
                {Object.keys(jugadas).length > 0 ? (
                  Object.keys(jugadas).map((llave) => {
                    const element = jugadas[llave];
                    if (element.player === 0) {
                      return (
                        <p key={element.createdAt}
                          align="right"
                          style={{
                            marginBottom: "0",
                            overflowWrap: "normal",
                            fontSize: ".75rem",
                          }}
                        >
                          <span style={{ color: "white" }}>
                            {element.movimiento}
                          </span>
                        </p>
                      );
                    } else {
                      return (
                        <p key={element.createdAt}
                          align="left"
                          style={{
                            marginBottom: "0",
                            overflowWrap: "normal",
                            fontSize: ".75rem",
                          }}
                        >
                          <span style={{ color: "white" }} >
                            {element.movimiento}
                          </span>
                        </p>
                      );
                    }
                  })
                ) : (
                  <p align="center" style={{ margin: "5px" }}>
                    <span></span>
                  </p>
                )}
              </div>
              <h4 align="center" id="turno">
                {" "}
              </h4>
              <div id="chat_mensajes">
                {Object.keys(chat).length > 0 ? (
                  Object.keys(chat).map((key) => {
                    const element = chat[key];
                    const msgClass =
                      element.uid !== auth?.user?.uid ? true : false;

                    return (
                      <p key={element.createdAt}
                        style={{
                          padding: ".25em",
                          textAlign: msgClass ? "left" : "right",
                          overflowWrap: "normal",
                          fontSize: "1.2rem",
                        }}
                      >
                        <span
                          className={`badge badge-info ${msgClass ? "is-success" : "is-info"
                            }`}
                        >
                          {element.msg}
                        </span>
                      </p>
                    );
                  })
                ) : (
                  <p align="center" style={{ margin: "5px" }}>
                    <span></span>
                  </p>
                )}
              </div>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const value = e.target.elements.userInput.value;
                  await firebase
                    .database()
                    .ref(`${game?.lobbyRef}`)
                    .child("chat")
                    .push()
                    .set({
                      uid: firebase.auth().currentUser?.uid,
                      msg: value,
                      createdAt: Date.now(),
                    });
                  e.target.reset();
                  //mandamos el scroll hasta abajo
                  var chatBox = document.getElementById("chat_mensajes");
                  chatBox.scrollTop = chatBox.scrollHeight;
                }}
              >
                <div className="form-group">
                  <input
                    className="form-control"
                    name="userInput"
                    type="text"
                    placeholder="Escribe tu mensaje"
                  />
                </div>
                <div
                  align="center"
                  style={{
                    backgroundColor: "#1B232F",
                    paddingTop: "10px",
                    paddingBottom: "5px",
                  }}
                >
                  <button className="btn btn_enviar">Enviar</button>
                  <p style={{ marginTop: "10px", color: "white" }}>
                    <a href="#!">Regístrate</a> para usar el chat
                  </p>
                </div>
              </form>
            </div>
          </Col>
          <Col xs={{ span: 12, order: 5 }} md={{ span: 1, order: 5 }} style={{ padding: 0 }}></Col>
        </Row>
      </Container>
      
      

    </section>
  );
}
