import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import firebase from "firebase";

import "bootstrap/dist/css/bootstrap.css";
import { Container, Row, Col, Navbar, NavDropdown, Nav, Button } from 'react-bootstrap';
import logo from "./images/logo-megachess.png";
import logo_footer from "./images/logo-megachess-bco.svg";
import "./css/lobby.css";


export function Lobby() {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  const [lobby, setLobby] = useState({});
  useEffect(() => {
    const lobbyRef = firebase.database().ref("lobby");

    lobbyRef.on("value", (snap) => {
      if (snap?.val() === null) {
        return;
      }
      setLobby(snap.val());
    });

    return () => {
      lobbyRef.off("value");
    };
  }, [dispatch]);

  const createGame = () => {
    window.location = "/game";
    return;
  };

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
                <NavDropdown.Item href="/movimientos">Movimientos</NavDropdown.Item>
                <NavDropdown.Item href="/piezas">Piezas</NavDropdown.Item>
              </NavDropdown>
              <Nav.Link href="/lobby">Lobby</Nav.Link>
              <Nav.Link href="/blog">Blog</Nav.Link>
              <Nav.Link href="/comprar">Comprar</Nav.Link>
              <Button onClick={createGame}>Crear Sala</Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <section className="encabezado">
        <header className="masthead">
          <Container>
            <Row>
              <Col xs={12} style={{ padding: 0 }}>
                <div className="site-heading">
                  <h1>Elige una opción para comenzar a jugar</h1>
                </div>
              </Col>
            </Row>
          </Container>
        </header>
      </section>
      <Container>
        <Row id="no-more-tables">
          <table className="table">
            <thead>
              <tr>
                <th>Creador:</th>
                <th>Estado:</th>
                <th>Acciones:</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(lobby).length > 0 ? (
                Object.keys(lobby).map((key) => {
                  const element = lobby[key];

                  return (
                    <tr key={key}>
                      <td data-title="Creador:"><span id="code">{element.player1}</span></td>
                      <td data-title="Estado:">{element.status}</td>
                      <td data-title="Acciones:">
                        {element?.player1 === auth?.user?.uid ||
                          element?.player2 === auth?.user?.uid ? (
                          <button
                            className="btn btn-success"
                            onClick={() => (window.location = `/game/${key}`)}
                          >
                            Volver a jugar
                          </button>
                        ) : (
                          <button
                            className="btn btn-danger"
                            onClick={() => (window.location = `/game/${key}`)}
                          >
                            Jugar
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td data-title="Mensaje:" colSpan="3" >
                    Aun no hay juegos en espera, ¿por qué no creas uno?
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </Row>
      </Container>
      <footer className="footer-dark">
        <Container>
          <Row>
            <Col xs={12} lg={1} style={{ padding: 0 }}>
              <p id="logo_footer"><img src={logo_footer} alt="" /></p>
            </Col>
            <Col xs={12} lg={5} style={{ padding: 0 }}>
              <p id="marca_footer"> Mega Chess ® 2021 Todos los derechos reservados.</p>
            </Col>
            <Col xs={12} lg={3} style={{ padding: 0 }}>
              <p style={{ textAlign: "center" }}>Diseñado por Agencia NUBA</p>
            </Col>
            <Col xs={12} lg={3} style={{ padding: 0 }}>
              <div className="item social"><a href="#!"><i className="icon ion-social-facebook"></i></a><a href="#!"><i className="la la-twitter"></i></a><a href="#!"><i className="icon ion-social-youtube-outline"></i></a><a href="#!"><i className="fab fa-instagram"></i></a></div>
            </Col>
          </Row>
        </Container>
      </footer>
    </section>
  );
}
