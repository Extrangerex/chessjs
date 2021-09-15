import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { joinGame, newGame } from "./redux/gameAction";
import { useParams } from "react-router-dom";
import * as chess from "./lib/chess";
import "./Game.css";

import "bootstrap/dist/css/bootstrap.css";
import { Container, Row, Col, Navbar, NavDropdown, Nav } from "react-bootstrap";

import logo from "./images/logo-megachess.png";
import logo_footer from "./images/logo-megachess-bco.svg";
import peon from "./assets/svg/peon.svg";
import peonbco from "./assets/svg/peonbco.svg";

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
          <Col xs={12} md={2} style={{ padding: 0 }}>
            <div align="center" style={{ height: "40vh" }}>
              <img
                id="jugador2"
                src={peon}
                alt=""
                style={{ width: "100px", height: "100px", marginTop: "12vh" }}
              ></img>
              <br></br>
              <p style={{color:"white",fontSize: ".75rem",margin:0}} id = "negras_comidas"></p>
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
              <p style={{color:"white",fontSize: ".75rem",margin:0}} id = "blancas_comidas"></p>
            </div>
          </Col>
          <Row>
            <Col xs={12} md={1} style={{ padding: 0 }}>
              <div align="right" style={{ marginTop: "20px" }}>
                <button
                  id="bloque10"
                  style={{
                    margin: "20px",
                    width: "16px",
                    height: "16px",
                    borderRadius: "8px",
                    border: "0",
                  }}
                ></button>
                <br></br>
                <button
                  id="bloque9"
                  style={{
                    margin: "20px",
                    width: "16px",
                    height: "16px",
                    borderRadius: "8px",
                    border: "0",
                  }}
                ></button>
                <br></br>
                <button
                  id="bloque8"
                  style={{
                    margin: "20px",
                    width: "16px",
                    height: "16px",
                    borderRadius: "8px",
                    border: "0",
                  }}
                ></button>
                <br></br>
                <button
                  id="bloque7"
                  style={{
                    margin: "20px",
                    width: "16px",
                    height: "16px",
                    borderRadius: "8px",
                    border: "0",
                  }}
                ></button>
                <br></br>
                <button
                  id="bloque6"
                  style={{
                    margin: "20px",
                    width: "16px",
                    height: "16px",
                    borderRadius: "8px",
                    border: "0",
                  }}
                ></button>
                <br></br>
                <button
                  id="bloque5"
                  style={{
                    margin: "20px",
                    width: "16px",
                    height: "16px",
                    borderRadius: "8px",
                    border: "0",
                  }}
                ></button>
                <br></br>
                <button
                  id="bloque4"
                  style={{
                    margin: "20px",
                    width: "16px",
                    height: "16px",
                    borderRadius: "8px",
                    border: "0",
                  }}
                ></button>
                <br></br>
                <button
                  id="bloque3"
                  style={{
                    margin: "20px",
                    width: "16px",
                    height: "16px",
                    borderRadius: "8px",
                    border: "0",
                  }}
                ></button>
                <br></br>
                <button
                  id="bloque2"
                  style={{
                    margin: "20px",
                    width: "16px",
                    height: "16px",
                    borderRadius: "8px",
                    border: "0",
                  }}
                ></button>
                <br></br>
                <button
                  id="bloque1"
                  style={{
                    margin: "20px",
                    width: "16px",
                    height: "16px",
                    borderRadius: "8px",
                    border: "0",
                  }}
                ></button>
              </div>
            </Col>
            <Col style={{ padding: 0 }}>
              <canvas id="chessCanvas" width="600" height="600"></canvas>

              <Row style={{ maxWidth: "600px" }}>
                <button className="btnturno"
                  id="jugada1"
                ></button>

                <button className="btnturno"
                  id="jugada2"
                ></button>

                <button className="btnturno"
                  id="jugada3"
                ></button>

                <button className="btnturno"
                  id="jugada4"
                ></button>

                <button className="btnturno"
                  id="jugada5"
                ></button>

                <button className="btnturno"
                  id="jugada6"
                ></button>

                <button className="btnturno"
                  id="jugada7"
                  
                ></button>

                <button className="btnturno"
                  id="jugada8"
                ></button>

                <button className="btnturno"
                  id="jugada9"
                ></button>
              </Row>
            </Col>
          </Row>
          <Col xs={12} md={3}>
            <div id="extras">
              <ul align="center" className="d-flex justify-content-between p-1">
                <li>
                <i className="fa fa-clock" style={{color:"#657696"}}></i> Jugada: <span id="time_play"></span>
                </li>
                <li>
                  <i className="fa fa-clock" style={{color:"#657696"}}></i> <span id="time_createdat"></span>
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
                    return (
                      <p
                        align="left"
                        style={{
                          marginBottom: "0",
                          overflowWrap: "normal",
                          fontSize: ".75rem",
                        }}
                      >
                        <span style={{ color: "white" }} key={llave.createdAt}>
                          {element.movimiento}
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
              <h4 align="center" id="turno">
                {" "}
              </h4>
              <div id="chat_mensajes">
                {Object.keys(chat).length > 0 ? (
                  Object.keys(chat).map((key, i) => {
                    const element = chat[key];
                    const msgClass =
                      element.uid !== auth?.user?.uid ? true : false;

                    return (
                      <p
                        style={{
                          padding: ".25em",
                          textAlign: msgClass ? "left" : "right",
                          overflowWrap: "normal",
                          fontSize: "1.2rem",
                        }}
                      >
                        <span
                          key={key}
                          className={`badge badge-info ${
                            msgClass ? "is-success" : "is-info"
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
          <Col xs={12} md={1} style={{ padding: 0 }}></Col>
        </Row>
      </Container>
      <footer className="footer-dark">
        <Container>
          <Row>
            <Col xs={12} lg={1} style={{ padding: 0 }}>
              <p id="logo_footer">
                <img src={logo_footer} alt="" />
              </p>
            </Col>
            <Col xs={12} lg={5} style={{ padding: 0 }}>
              <p id="marca_footer">
                {" "}
                Mega Chess ® 2021 Todos los derechos reservados.
              </p>
            </Col>
            <Col xs={12} lg={3} style={{ padding: 0 }}>
              <p style={{ textAlign: "center" }}>Diseñado por Agencia NUBA</p>
            </Col>
            <Col xs={12} lg={3} style={{ padding: 0 }}>
              <div className="item social">
                <a href="#!">
                  <i className="icon ion-social-facebook"></i>
                </a>
                <a href="#!">
                  <i className="la la-twitter"></i>
                </a>
                <a href="#!">
                  <i className="icon ion-social-youtube-outline"></i>
                </a>
                <a href="#!">
                  <i className="fab fa-instagram"></i>
                </a>
              </div>
            </Col>
          </Row>
        </Container>
      </footer>
    </section>
  );
}
