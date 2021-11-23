import React, { useState } from "react";
import { Container, Col, Row } from "react-bootstrap";
import axios from 'axios';
import "./css/Footer-Dark.css";
import "./fonts/ionicons.min.css";
import "./css/Social-Icons.css";
import "./css/footer.css";
import logo_footer from "./images/logo-megachess-bco.svg";

export function MyFooter() {
    
    const [redes_sociales, setRedes_sociales] = useState({});
    axios.get('https://www.agencianuba.com/megachess_panel/apis/redes_sociales.php?opcion=1&Idusuario=123456789&Clientid=1')
    .then(res => {
        setRedes_sociales(res.data);
    })
        
    var map = Object.values(redes_sociales);
    const link_facebook  = map[0];
    const link_instagram = map[1];
    const link_twitter  = map[2];
    const link_youtube   = map[3];
   
    return (
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
                    <p style={{ textAlign: "center" }}>Diseñado por 
                        <a href="https://www.agencianuba.com" target="_blank" rel="noreferrer"> Agencia NUBA</a>
                    </p>
                </Col>
                <Col xs={12} lg={3} style={{ padding: 0 }}>
                    <div className="item social">
                        <a href={link_facebook} target="_blank" rel="noopener noreferrer">
                            <i className="icon ion-social-facebook"></i>
                        </a>
                        <a href={link_twitter}  target="_blank" rel="noopener noreferrer">
                            <i className="la la-twitter"></i>
                        </a>
                        <a href={link_youtube}  target="_blank" rel="noopener noreferrer">
                            <i className="icon ion-social-youtube-outline"></i>
                        </a>
                        <a href={link_instagram}  target="_blank" rel="noopener noreferrer">
                            <i className="fab fa-instagram"></i>
                        </a>
                    </div>
                </Col>
            </Row>
        </Container>
    </footer>
    );
}
