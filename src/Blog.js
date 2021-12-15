import { useState } from "react";
import axios from 'axios';
import "bootstrap/dist/css/bootstrap.css";
import { Container, Row, Col, Navbar, NavDropdown, Nav } from 'react-bootstrap';


import "./fonts/fontawesome-all.min.css";
import "./fonts/ionicons.min.css";
import "./fonts/line-awesome.min.css";
import "./fonts/fontawesome5-overrides.min.css";
import "./css/Social-Icons.css";

import "./css/menu.css";
import "./css/encabezado.css";

import logo from "./images/logo-megachess.png";
import { MyFooter } from "./Footer";

export function Blog() {

    const [publicaciones, setPublicaciones] = useState({});

    axios.get('https://www.agencianuba.com/megachess_panel/apis/blog.php?opcion=3&Idusuario=123456789&Clientid=1')
        .then(res => {
           //console.log(res.data);
            setPublicaciones(res.data);
        })
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
                                    <h1>Blog</h1>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </header>
            </section>

            <ul style={{ listStyle: "none" }}>
                {Object.keys(publicaciones).length > 0 ? (
                    Object.keys(publicaciones).map((llave) => {
                        const element = publicaciones[llave];
                        return (
                            <li key={element.id}>
                                <Row className="justify-content-center align-items-center minh-100">
                                    <Col sm={12} lg={6} className="order-lg-1">
                                        <div className="p-5">
                                            <img className="img-thumbnail img-fluid" src={element.imagen64} alt=""></img>
                                        </div>
                                    </Col>
                                    <Col sm={12} lg={6} className="order-lg-2">
                                        <div className="p-5">
                                            <h2>
                                                <strong>{element.titulo}</strong>
                                            </h2>
                                            <p>{element.body}</p>
                                        </div>
                                    </Col>
                                </Row>
                            </li>
                        );
                    })
                ) : (
                    <li></li>
                )}
            </ul>

            <MyFooter />

        </section>
    );

}
