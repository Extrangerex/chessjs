import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import { Container, Row, Col, Navbar, NavDropdown, Nav } from 'react-bootstrap';

import "./css/Footer-Dark.css";

import "./fonts/fontawesome-all.min.css";
import "./fonts/ionicons.min.css";
import "./fonts/line-awesome.min.css";
import "./fonts/fontawesome5-overrides.min.css";
import "./css/Social-Icons.css";

import "./css/menu.css";
import "./css/footer.css";
import "./css/encabezado.css";
import "./Movimientos.css";

import logo from "./images/logo-megachess.png";
import logo_footer from "./images/logo-megachess-bco.svg";
import rey from "./images/tableros/rey.png";
import mov_rey from "./images/tableros/mov-rey.png";
import dama from "./images/tableros/dama.png";
import mov_dama from "./images/tableros/mov-dama.png";
import elefante from "./images/tableros/elefante.png";
import mov_elefante from "./images/tableros/mov-elefante.png";
import pantera from "./images/tableros/pantera.png";
import mov_pantera from "./images/tableros/mov-pantera.png";
import torre from "./images/tableros/torre.png";
import mov_torre from "./images/tableros/mov-torre.png";
import leon from "./images/tableros/leon.png";
import mov_leon from "./images/tableros/mov-leon.png";
import alfil from "./images/tableros/alfil.png";
import mov_alfil from "./images/tableros/mov-alfil.png";
import perro from "./images/tableros/perro.png";
import mov_perro from "./images/tableros/mov-perro.png";
import caballo from "./images/tableros/caballo.png";
import mov_caballo from "./images/tableros/mov-caballo.png";
import ardilla from "./images/tableros/ardilla.png";
import mov_ardilla from "./images/tableros/mov-ardilla.png";
import conejo from "./images/tableros/conejo.png";
import mov_conejo from "./images/tableros/mov-conejo.png";
import peon from "./images/tableros/peon.png";
import mov_peon from "./images/tableros/mov-peon.png";


export function Movimientos() {
        
    const imagenes = [rey,dama,elefante,pantera,torre,leon,alfil,perro,caballo,ardilla,conejo,peon];
    const tableros = [mov_rey,mov_dama,mov_elefante,mov_pantera,mov_torre,mov_leon,mov_alfil,mov_perro,mov_caballo,mov_ardilla,mov_conejo,mov_peon];
    
    const [numeroimagen, setNumeroImagen] = useState(0);
    
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
                                    <h1>Piezas de MegaChess</h1>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </header>
            </section>
            <section>
                <Container>
                    <Row>
                        <Col xs={12} md={6} style={{ padding: 0 }}>
                            <div align="center">
                                <img src={tableros[numeroimagen]} className="img-fluid" alt=""></img>
                                <br></br><br></br>
                                <img src={imagenes[numeroimagen]} className="img-fluid pieza" alt=""></img>
                            </div>
                        </Col>
                        <Col xs={12} md={6} style={{ padding: 0 }}>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Pieza</th>
                                        <th>Símbolo</th>
                                        <th>Valor</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>1</td>
                                        <td><button onClick={() => setNumeroImagen(0)}  className="btn btn-info">REY</button></td>
                                        <td>♔</td>
                                        <td>10 pts</td>
                                    </tr>
                                    <tr>
                                        <td>2</td>
                                        <td><button onClick={() => setNumeroImagen(1)} className="btn btn-info">DAMA</button></td>
                                        <td>♕</td>
                                        <td>9 pts</td>
                                    </tr>
                                    <tr>
                                        <td>3</td>
                                        <td><button onClick={() => setNumeroImagen(2)} className="btn btn-info">ELEFANTE</button></td>
                                        <td>El</td>
                                        <td>7 pts</td>
                                    </tr>
                                    <tr>
                                        <td>4</td>
                                        <td><button onClick={() => setNumeroImagen(3)} className="btn btn-info">PANTERA</button></td>
                                        <td>Pa</td>
                                        <td>7 pts</td>
                                    </tr>
                                    <tr>
                                        <td>5</td>
                                        <td><button onClick={() => setNumeroImagen(4)} className="btn btn-info">TORRE</button></td>
                                        <td>♖</td>
                                        <td>7 pts</td>
                                    </tr>
                                    <tr>
                                        <td>6</td>
                                        <td><button onClick={() => setNumeroImagen(5)} className="btn btn-info">LEÓN</button></td>
                                        <td>Le</td>
                                        <td>8 pts</td>
                                    </tr>
                                    <tr>
                                        <td>7</td>
                                        <td><button onClick={() => setNumeroImagen(6)} className="btn btn-info">ALFIL</button></td>
                                        <td>♗</td>
                                        <td>6 pts</td>
                                    </tr>
                                    <tr>
                                        <td>8</td>
                                        <td><button onClick={() => setNumeroImagen(7)} className="btn btn-info">PERRO</button></td>
                                        <td>Pe</td>
                                        <td>4 pts</td>
                                    </tr>
                                    <tr>
                                        <td>9</td>
                                        <td><button onClick={() => setNumeroImagen(8)} className="btn btn-info">CABALLO</button></td>
                                        <td>♘</td>
                                        <td>5 pts</td>
                                    </tr>
                                    <tr>
                                        <td>10</td>
                                        <td><button onClick={() => setNumeroImagen(9)} className="btn btn-info">ARDILLA</button></td>
                                        <td>Ar</td>
                                        <td>3 pts</td>
                                    </tr>
                                    <tr>
                                        <td>11</td>
                                        <td><button onClick={() => setNumeroImagen(10)} className="btn btn-info">CONEJO</button></td>
                                        <td>Co</td>
                                        <td>2 pts</td>
                                    </tr>
                                    <tr>
                                        <td>12</td>
                                        <td><button onClick={() => setNumeroImagen(11)} className="btn btn-info">PEONES</button></td>
                                        <td>♙</td>
                                        <td>1 pts</td>
                                    </tr>
                                </tbody>
                            </table>
                        </Col>
                    </Row>
                </Container>
            </section>
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
