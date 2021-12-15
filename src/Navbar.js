import React, { useState } from "react";
import { Navbar, Container, Nav, NavDropdown, Button, Modal } from "react-bootstrap";

import logo from "./images/logo-megachess.png";
import { useOnlineState } from "./hooks/useOnlineState";
import firebase from 'firebase';


export function MyNavbar() {
    const isOnline = useOnlineState();

    const createGame = () => {
        window.location = "/game";
        localStorage.setItem('clave_privada', '');
        localStorage.setItem('time', 'true');
        localStorage.setItem('moves', 'true');
        return;
    };

    const createPrivateGame = () => {
        window.location = "/game";

        const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result1= '';
        const charactersLength = characters.length;
        const num = 5;

        for ( let i = 0; i < num; i++ ) {
            result1 += characters.charAt(Math.floor(Math.random() * charactersLength));
        }

        localStorage.setItem('clave_privada', result1);
        localStorage.setItem('time', 'true');
        localStorage.setItem('moves', 'true');
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
                <Nav className="mr-auto">
                    
                        <Nav.Link href="/">Inicio</Nav.Link>
                        <NavDropdown title="Aprender" id="basic-nav-dropdown">
                            <NavDropdown.Item href="/videos">Videos</NavDropdown.Item>
                            <NavDropdown.Item href="/movimientos">Movimientos</NavDropdown.Item>
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
                                {isOnline ? (
                                <div>    
                                    <button onClick={createPrivateGame} className="btn btn-success" style={{margin:"5px"}}>Privada</button>
                                    <button onClick={createGame} className="btn btn-success" style={{margin:"5px"}}>Pública</button>
                                </div>
                                ) : (
                                <div>    
                                    <button onClick={createGame} className="btn btn-success" style={{margin:"5px"}}>Pública</button>
                                </div>
                                )}
                                </div>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleClose}>Cerrar</Button>
                            </Modal.Footer>
                        </Modal>
                    
                    
                    {isOnline ? (<Nav.Link onClick={() => { firebase.auth().signOut(); window.location = "/lobby" }}>Cerrar sesion</Nav.Link>) : (<Nav.Link href="/login">Iniciar sesion</Nav.Link>)}

                </Nav>
            </Navbar.Collapse>
        </Container>
    </Navbar>);
}
