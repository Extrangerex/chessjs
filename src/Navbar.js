import { Navbar, Container, Nav, NavDropdown, Button } from "react-bootstrap";
import logo from "./images/logo-megachess.png";
import { useOnlineState } from "./hooks/useOnlineState";
import firebase from 'firebase';


export function MyNavbar() {
    const isOnline = useOnlineState();

    const createGame = () => {
        window.location = "/game";
        return;
    };

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

                        <Button onClick={createGame}>Crear Sala</Button>
                    </div>
                    <div className="flex-grow-1"></div>
                    {isOnline ? (<Nav.Link onClick={() => { firebase.auth().signOut(); window.location = "/lobby" }}>Cerrar sesion</Nav.Link>) : (<Nav.Link href="/login">Iniciar sesion</Nav.Link>)}

                </Nav>
            </Navbar.Collapse>
        </Container>
    </Navbar>);
}