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
import { MyNavbar } from "./Navbar";
import { MyFooter } from "./Footer";

export function Comprar() {

    return (
        <section className="fondo_principal">
            <MyNavbar />
            
            <section className="encabezado">
                <header className="masthead">
                    <Container>
                        <Row>
                            <Col xs={12} style={{ padding: 0 }}>
                                <div className="site-heading">
                                    <h1>Comprar</h1>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </header>
            </section>
            
            <MyFooter/>

        </section>
    );
}