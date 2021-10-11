import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import firebase from "firebase";

import "bootstrap/dist/css/bootstrap.css";
import { Container, Row, Col } from 'react-bootstrap';
import logo_footer from "./images/logo-megachess-bco.svg";
import "./css/lobby.css";
import { MyNavbar } from "./Navbar";
import Swal from "sweetalert2";


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

    function handleSubmit(event) {
        event.preventDefault()
        const clave = event.currentTarget.elements.clave_sala.value;
        const sala = event.currentTarget.elements.id_sala.value;

        //buscamos si coincide
        const referencia = firebase.database().ref("lobby/" + sala + "/clave_privada");
        referencia.on("value", (snap) => {
            if (snap?.val() === null) {
                return;
            }
            const clave_guardada_sala = snap.val();
            if (clave_guardada_sala === clave) {
                window.location = `/game/${sala}`
            } else {
                Swal.fire({
                    title: "Opps..",
                    text: "Clave incorrecta",
                });
            }
        });
    }

    return (
        <section>
            <MyNavbar />
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
                                <th>Tipo:</th>
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
                                            <td data-title="Tipo:">
                                                {element.clave_privada === "" ? (<span>Pública</span>) : (<span>Privada</span>)}
                                            </td>
                                            <td data-title="Acciones:">
                                                {
                                                    element?.clave_privada === "" ?
                                                        (element?.player1 === auth?.user?.uid ||
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
                                                        )
                                                        )
                                                        :
                                                        (
                                                            <form onSubmit={handleSubmit}>
                                                                <input id="clave_sala" type="text" placeholder="Ingresa la Clave" />
                                                                <input id="id_sala" type="hidden" value={key} />
                                                                <input style={{ marginLeft: "5px" }} className="btn btn-info" type="submit" value="Entrar" />
                                                            </form>
                                                        )
                                                }

                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td data-title="Mensaje:" colSpan="4" >
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
