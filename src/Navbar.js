import React, { useState } from "react";
import { Navbar, Container, Nav, NavDropdown, Button, Modal } from "react-bootstrap";
import logo from "./images/logo-megachess.png";
import { useOnlineState } from "./hooks/useOnlineState";
import firebase from 'firebase';


export function MyNavbar() {
    const isOnline = useOnlineState();

    const createGame = () => {
        window.location = "/game";
        return;
    };
    const [show, setShow] = useState(false);
    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);

    return (<Navbar bg="light" expand="md">
        <Container>
            <Navbar.Brand href="/">
                <img src={logo} alt="" />
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto d-flex">
                    <div className="d-flex flex-fill">
                        <Nav.Link href="/">Inicio</Nav.Link>
                        <NavDropdown title="Aprender" id="basic-nav-dropdown">
                            <NavDropdown.Item href="/videos">Videos</NavDropdown.Item>
                            <NavDropdown.Item href="/movimientos">Movimientos</NavDropdown.Item>
                            <NavDropdown.Item href="/piezas">Piezas</NavDropdown.Item>
                        </NavDropdown>
                        <Nav.Link href="/lobby">Lobby</Nav.Link>
                        <Nav.Link href="/blog">Blog</Nav.Link>
                        <Nav.Link href="/comprar">Comprar</Nav.Link>

                        <Button onClick={handleShow}>Crear Sala</Button>
                        <Modal show={show}>
                            <Modal.Header closeButton onClick={handleClose}>
                                <Modal.Title>Seleccione el tipo de partida</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <div align="center">
                                    <button className="btn btn-success" style={{margin:"5px"}}>Privada</button>
                                    <button onClick={createGame} className="btn btn-success" style={{margin:"5px"}}>Pública</button>
                                </div>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleClose}>Cerrar</Button>
                            </Modal.Footer>
                        </Modal>
                    </div>
                    <div className="flex-grow-1"></div>
                    {isOnline ? (<Nav.Link onClick={() => { firebase.auth().signOut(); window.location = "/lobby" }}>Cerrar sesion</Nav.Link>) : (<Nav.Link href="/login">Iniciar sesion</Nav.Link>)}

                </Nav>
            </Navbar.Collapse>
        </Container>
    </Navbar>);
}
