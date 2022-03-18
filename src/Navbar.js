import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";

import logo from "./images/logo-megachess.png";
import { useOnlineState } from "./hooks/useOnlineState";
import firebase from 'firebase';


export function MyNavbar() {
    const isOnline = useOnlineState();

    

    return (
    <Navbar expand="md" class="fondo_principal">
        <Container>
            <Navbar.Brand href="/">
                <img src={logo} alt="" />
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    
                        <Nav.Link href="/">Inicio</Nav.Link>
                        <NavDropdown title="Aprender" id="basic-nav-dropdown">
                            <NavDropdown.Item href="/reglas">Reglas</NavDropdown.Item>
                            <NavDropdown.Item href="/movimientos">Movimientos</NavDropdown.Item>
                        </NavDropdown>
                        <Nav.Link href="/lobby">Sala de Juegos</Nav.Link>
                        <Nav.Link href="/blog">Blog</Nav.Link>
                        <Nav.Link href="/comprar">Comprar</Nav.Link>

                                          
                    
                    {isOnline ? (<Nav.Link onClick={() => { firebase.auth().signOut(); window.location = "/lobby" }}>Cerrar sesion</Nav.Link>) : (<Nav.Link href="/login">Iniciar sesion</Nav.Link>)}

                </Nav>
            </Navbar.Collapse>
        </Container>
    </Navbar>);
}
