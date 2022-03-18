import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import firebase from "firebase";

import "bootstrap/dist/css/bootstrap.css";
import { Container, Row, Col, Button, Modal } from "react-bootstrap";
import { MyFooter } from "./Footer";
import "./css/lobby.css";
import { MyNavbar } from "./Navbar";
import Swal from "sweetalert2";
import { useOnlineState } from "./hooks/useOnlineState";

export function Lobby() {
    const isOnline = useOnlineState();
    const dispatch = useDispatch();
    const auth = useSelector((state) => state.auth);

    const [show2, setShow2] = useState(false);
    const [show3, setShow3] = useState(false);
    const [show4, setShow4] = useState(false);

    const [show5, setShow5] = useState(false);//desafio/privada(45,30,15)
    const [show6, setShow6] = useState(false);//desafio/publica(45,30,15)

    const handleShow2 = () => setShow2(true);
    const handleClose2 = () => setShow2(false);

    const handleShow3 = () => setShow3(true);
    const handleClose3 = () => setShow3(false);

    const handleShow4 = () => setShow4(true);
    const handleClose4 = () => setShow4(false);

    const handleShow5 = () => setShow5(true);
    const handleClose5 = () => setShow5(false);

    const handleShow6 = () => setShow6(true);
    const handleClose6 = () => setShow6(false);

    const createGame45 = () => {
        window.location = "/game";
        localStorage.setItem('clave_privada', '');
        localStorage.setItem('time', 'true');
        localStorage.setItem('minutes', 45);
        localStorage.setItem('moves', 'true');
        return;
    };
    const createGame30 = () => {
        window.location = "/game";
        localStorage.setItem('clave_privada', '');
        localStorage.setItem('time', 'true');
        localStorage.setItem('minutes', 30);
        localStorage.setItem('moves', 'true');
        return;
    };
    const createGame15 = () => {
        window.location = "/game";
        localStorage.setItem('clave_privada', '');
        localStorage.setItem('time', 'true');
        localStorage.setItem('minutes', 15);
        localStorage.setItem('moves', 'true');
        return;
    };

    const createPrivateGame45 = () => {
        window.location = "/game";

        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result1 = '';
        const charactersLength = characters.length;
        const num = 5;

        for (let i = 0; i < num; i++) {
            result1 += characters.charAt(Math.floor(Math.random() * charactersLength));
        }

        localStorage.setItem('clave_privada', result1);
        localStorage.setItem('time', 'true');
        localStorage.setItem('minutes', 45);
        localStorage.setItem('moves', 'true');
        return;
    };
    const createPrivateGame30 = () => {
        window.location = "/game";

        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result1 = '';
        const charactersLength = characters.length;
        const num = 5;

        for (let i = 0; i < num; i++) {
            result1 += characters.charAt(Math.floor(Math.random() * charactersLength));
        }

        localStorage.setItem('clave_privada', result1);
        localStorage.setItem('time', 'true');
        localStorage.setItem('minutes', 30);
        localStorage.setItem('moves', 'true');
        return;
    };

    const createPrivateGame15 = () => {
        window.location = "/game";

        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result1 = '';
        const charactersLength = characters.length;
        const num = 5;

        for (let i = 0; i < num; i++) {
            result1 += characters.charAt(Math.floor(Math.random() * charactersLength));
        }

        localStorage.setItem('clave_privada', result1);
        localStorage.setItem('time', 'true');
        localStorage.setItem('minutes', 15);
        localStorage.setItem('moves', 'true');
        return;
    };

    const createNoTimeGame = () => {
        window.location = "/game";
        localStorage.setItem('clave_privada', '');
        localStorage.setItem('time', 'false');
        localStorage.setItem('minutes', 45);
        localStorage.setItem('moves', 'true');

        return;
    };

    const createNoTimeGamePrivate = () => {
        window.location = "/game";

        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result1 = '';
        const charactersLength = characters.length;
        const num = 5;

        for (let i = 0; i < num; i++) {
            result1 += characters.charAt(Math.floor(Math.random() * charactersLength));
        }

        localStorage.setItem('clave_privada', result1);
        localStorage.setItem('time', 'false');
        localStorage.setItem('minutes', 45);
        localStorage.setItem('moves', 'true');

        return;
    };

    const createNotAnyGame = () => {
        window.location = "/game";
        localStorage.setItem('clave_privada', '');
        localStorage.setItem('time', 'false');
        localStorage.setItem('minutes', 45);
        localStorage.setItem('moves', 'false');
        return;
    };

    const createNotAnyGamePrivate = () => {
        window.location = "/game";

        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result1 = '';
        const charactersLength = characters.length;
        const num = 5;

        for (let i = 0; i < num; i++) {
            result1 += characters.charAt(Math.floor(Math.random() * charactersLength));
        }

        localStorage.setItem('clave_privada', result1);
        localStorage.setItem('time', 'false');
        localStorage.setItem('minutes', 45);
        localStorage.setItem('moves', 'false');
        return;
    };

    const [show, setShow] = useState(false);
    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);

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
                <Row>
                    <Col xs={12} md={4} className="centrar">
                        <Button onClick={handleShow2} className="btn btn-info" style={{ margin: "5px" }}>Desafío</Button>
                        <Modal show={show2}>
                            <Modal.Header closeButton onClick={handleClose2}>
                                <Modal.Title>Desafío</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <div align="center">
                                    <h4>Seleccione el tipo de partida</h4>
                                    {isOnline ? (
                                        <div>
                                            <button onClick={handleShow5} className="btn btn-success" style={{ margin: "5px" }}>Privada</button>
                                            <button onClick={handleShow6} className="btn btn-success" style={{ margin: "5px" }}>Pública</button>
                                        </div>
                                    ) : (
                                        <div>
                                            <button onClick={handleShow6} className="btn btn-success" style={{ margin: "5px" }}>Pública</button>
                                        </div>
                                    )}
                                </div>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleClose2}>Cerrar</Button>
                            </Modal.Footer>
                        </Modal>
                        <Modal show={show5}>
                            <Modal.Header closeButton onClick={handleClose5}>
                                <Modal.Title>Desafío/Privada</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <div align="center">
                                    <h4>Seleccione el tiempo</h4>
                                    <div>
                                        <button onClick={createPrivateGame45} className="btn btn-success" style={{ margin: "5px" }}>Normal(45min.)</button>
                                        <button onClick={createPrivateGame30} className="btn btn-success" style={{ margin: "5px" }}>Rápida(30min.)</button>
                                        <button onClick={createPrivateGame15} className="btn btn-success" style={{ margin: "5px" }}>Relámpago(15min.)</button>
                                    </div>

                                </div>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleClose5}>Cerrar</Button>
                            </Modal.Footer>
                        </Modal>
                        <Modal show={show6}>
                            <Modal.Header closeButton onClick={handleClose6}>
                                <Modal.Title>Desafío/Pública</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <div align="center">
                                    <div>
                                        <button onClick={createGame45} className="btn btn-success" style={{ margin: "5px" }}>Normal(45min.)</button>
                                        <button onClick={createGame30} className="btn btn-success" style={{ margin: "5px" }}>Rápida(30min.)</button>
                                        <button onClick={createGame15} className="btn btn-success" style={{ margin: "5px" }}>Relámpago(15min.)</button>
                                    </div>
                                </div>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleClose6}>Cerrar</Button>
                            </Modal.Footer>
                        </Modal>
                    </Col>
                    <Col xs={12} md={4} className="centrar">
                        <Button onClick={handleShow3} className="btn btn-info" style={{ margin: "5px" }}>Reto</Button>
                        <Modal show={show3}>
                            <Modal.Header closeButton onClick={handleClose3}>
                                <Modal.Title>Reto</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <div align="center">
                                    <h4>Seleccione el tipo de partida</h4>
                                    {isOnline ? (
                                        <div>
                                            <button onClick={createNoTimeGamePrivate} className="btn btn-success" style={{ margin: "5px" }}>Privada</button>
                                            <button onClick={createNoTimeGame} className="btn btn-success" style={{ margin: "5px" }}>Pública</button>
                                        </div>
                                    ) : (
                                        <div>
                                            <button onClick={createNoTimeGame} className="btn btn-success" style={{ margin: "5px" }}>Pública</button>
                                        </div>
                                    )}
                                </div>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleClose3}>Cerrar</Button>
                            </Modal.Footer>
                        </Modal>
                    </Col>
                    <Col xs={12} md={4} className="centrar">
                        <Button onClick={handleShow4} className="btn btn-info" style={{ margin: "5px" }}>Relax</Button>
                        <Modal show={show4}>
                            <Modal.Header closeButton onClick={handleClose4}>
                                <Modal.Title>Relax</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <div align="center">
                                    <h4>Seleccione el tipo de partida</h4>
                                    {isOnline ? (
                                        <div>
                                            <button onClick={createNotAnyGamePrivate} className="btn btn-success" style={{ margin: "5px" }}>Privada</button>
                                            <button onClick={createNotAnyGame} className="btn btn-success" style={{ margin: "5px" }}>Pública</button>
                                        </div>
                                    ) : (
                                        <div>
                                            <button onClick={createNotAnyGame} className="btn btn-success" style={{ margin: "5px" }}>Pública</button>
                                        </div>
                                    )}
                                </div>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleClose4}>Cerrar</Button>
                            </Modal.Footer>
                        </Modal>
                    </Col>
                </Row>
                <Row id="no-more-tables">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Id:</th>
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
                                    const hoy = new Date();
                                    const fechacreacion = element.fecha_creacion;
                                    if (isOnline) {
                                        if (element.creador !== 'Anonimo') {
                                            return (
                                                <tr key={key}>
                                                    <td data-title="Id:">{element.id_partida}</td>
                                                    <td data-title="Creador:"><span id="code">{element.creador}</span></td>
                                                    <td data-title="Estado:">{element.status}</td>
                                                    <td data-title="Tipo:">
                                                        {element.clave_privada === "" ? (<span>Pública</span>) : (<span>Privada</span>)}
                                                    </td>
                                                    <td data-title="Acciones:">
                                                        {
                                                            element?.clave_privada === "" ?
                                                                (element?.status !== "playing" && element?.status !== "waiting" && element?.status !== "pause" ? (
                                                                    <button
                                                                        className="btn btn-success"
                                                                        onClick={() => (window.location = `/review/${key}`)}
                                                                    >
                                                                        Analizar
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
                                                                (element?.status !== "playing" && element?.status !== "waiting" && element?.status !== "pause" ? (
                                                                    <button
                                                                        className="btn btn-success"
                                                                        onClick={() => (window.location = `/review/${key}`)}
                                                                    >
                                                                        Analizar
                                                                    </button>
                                                                ) : (
                                                                    <form onSubmit={handleSubmit}>
                                                                        <input id="clave_sala" type="text" placeholder="Ingresa la Clave" />
                                                                        <input id="id_sala" type="hidden" value={key} />
                                                                        <input style={{ marginLeft: "5px" }} className="btn btn-info" type="submit" value="Entrar" />
                                                                    </form>
                                                                )
                                                                )
                                                        }

                                                    </td>
                                                </tr>
                                            );
                                        }
                                    } else {
                                        if ((element.creador === 'Anonimo' && element.status === 'playing' && (hoy >= fechacreacion || fechacreacion === undefined)) || (element.creador === 'Anonimo' && element.status === 'waiting' && (hoy >= fechacreacion || fechacreacion === undefined))) {
                                            return (
                                                <tr key={key}>
                                                    <td data-title="Id:">{element.id_partida}</td>
                                                    <td data-title="Creador:"><span id="code">{element.creador}</span></td>
                                                    <td data-title="Estado:">{element.status}</td>
                                                    <td data-title="Tipo:">
                                                        {element.clave_privada === "" ? (<span>Pública</span>) : (<span>Privada</span>)}
                                                    </td>
                                                    <td data-title="Acciones:">
                                                        {
                                                            element?.clave_privada === "" ?
                                                                (element?.status !== "playing" && element?.status !== "waiting" && element?.status !== "pause" ? (
                                                                    <button
                                                                        className="btn btn-success"
                                                                        onClick={() => (window.location = `/review/${key}`)}
                                                                    >
                                                                        Analizar
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
                                                                (element?.status !== "playing" && element?.status !== "waiting" && element?.status !== "pause" ? (
                                                                    <button
                                                                        className="btn btn-success"
                                                                        onClick={() => (window.location = `/review/${key}`)}
                                                                    >
                                                                        Analizar
                                                                    </button>
                                                                ) : (
                                                                    <form onSubmit={handleSubmit}>
                                                                        <input id="clave_sala" type="text" placeholder="Ingresa la Clave" />
                                                                        <input id="id_sala" type="hidden" value={key} />
                                                                        <input style={{ marginLeft: "5px" }} className="btn btn-info" type="submit" value="Entrar" />
                                                                    </form>
                                                                )
                                                                )
                                                        }

                                                    </td>
                                                </tr>
                                            );
                                        }
                                    }
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
            <MyFooter />
        </section>
    );
}
