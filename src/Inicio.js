import React, { useState } from "react";
import { useOnlineState } from "./hooks/useOnlineState"
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { ReactSwal } from "./utils/SwalUtils";
import axios from 'axios';
import firebase from 'firebase';
import "bootstrap/dist/css/bootstrap.css";
import { Container, Row, Col, Button, Modal } from 'react-bootstrap';

import "./fonts/fontawesome-all.min.css";
import "./fonts/ionicons.min.css";
import "./fonts/line-awesome.min.css";
import "./fonts/fontawesome5-overrides.min.css";
import "./css/Social-Icons.css";

import "./css/menu.css";
import "./inicio.css";


import popup from "./images/pop-up.jpg";

import { MyNavbar } from "./Navbar";
import { MyFooter } from "./Footer";

export function Inicio() {
    const [show, setShow] = useState(false);
    const [show2, setShow2] = useState(false);//desafio(publica,privada)
    const [show3, setShow3] = useState(false);//reto(publica,privada)
    const [show4, setShow4] = useState(false);//relax(publica,privada)

    const [show5, setShow5] = useState(false);//desafio/privada(45,30,15)
    const [show6, setShow6] = useState(false);//desafio/publica(45,30,15)


    const [setLoading] = useState(false);
    const { reset } = useForm();

    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);
    window.addEventListener('load', handleShow);

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

    const isOnline = useOnlineState();
    const loginForm = useForm();
    const NewsForm = useForm();

    const onLoginSubmit = data => {
        reset();
        //setLoading(true);

        firebase.auth().createUserWithEmailAndPassword(data.emailAddress, data.password).then((user) => {
            ReactSwal.fire({
                title: "Felicidades!",
                icon: "success",
                text: "Tu cuenta ha sido creada correctamente"
            }).then(() => {
                handleClose();
            });
        }).catch((error) => {
            ReactSwal.fire({
                title: "Opps..",
                icon: "error",
                text: error.toString()
            });
        }).finally(() => {
            //  setLoading(false);
        })
    }

    const onNewsSubmit = data => {
        reset();
        //setLoading(true);

        axios.post('https://www.agencianuba.com/megachess_panel/apis/newsletter.php', {
            Idusuario: "123456789",
            Clientid: 1,
            correo: data.emailAddress
        })

            .then(res => {
                ReactSwal.fire({
                    title: "Aviso",
                    icon: "success",
                    text: res.data.mensaje
                }).then(() => {
                    handleClose();
                });
            }).catch((error) => {
                ReactSwal.fire({
                    title: "Opps..",
                    icon: "error",
                    text: error.toString()
                });
            }).finally(() => {
                //setLoading(false);
            })
    }

    /*
    useEffect(() => {
        console.log(isOnline);
        if (isOnline) {
            window.location = "/lobby";
        }
    }, [isOnline])
    */

    const [publicaciones, setPublicaciones] = useState({});

    axios.get('https://www.agencianuba.com/megachess_panel/apis/blog.php?opcion=1&Idusuario=123456789&Clientid=1')
        .then(res => {
            //console.log(JSON.stringify(res.data[0]['id']));
            setPublicaciones(res.data);

        })

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


                            <Col xs={12} md={4} style={{ padding: 0 }}>

                                <div className="card-body">
                                    <i className="fas fa-chess-rook"></i>
                                    <h4 className="card-title">
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
                                    </h4>
                                    <p className="card-text">Crea una partida con un límite de tiempo de 45,30 ó 15 min. y 90 turnos por jugador.</p>
                                </div>

                            </Col>

                            <Col xs={12} md={4} style={{ padding: 0 }}>

                                <div className="card-body">
                                    <i className="fas fa-chess"></i>
                                    <h4 className="card-title">
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
                                    </h4>
                                    <p className="card-text">Crea una partida sin límite de tiempo y 90 turnos por jugador</p>
                                </div>

                            </Col>

                            <Col xs={12} md={4} style={{ padding: 0 }}>

                                <div className="card-body">
                                    <i className="fas fa-chess-board"></i>
                                    <h4 className="card-title">
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
                                    </h4>
                                    <p className="card-text">Crea una partida sin límite de tiempo ni turnos.</p>
                                </div>

                            </Col>


                        </Row>
                    </Container>
                </header>
            </section>

            <section>
                <div className="banner">
                    <h4 className="banner_content">Un juego con 16 piezas es un reto pero con 27...es una ¡experiencia insuperable!</h4>
                </div>
            </section>

            <section className="post">
                <Container>
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
                </Container>
            </section>

            <section className="newsletter">
                <Container>
                    <Row className="banner">
                        <div className="intro">
                            <h2 align="center">Suscríbete ahora para noticias y novedades relacionadas con el mundo del Chess.</h2>
                        </div>
                        <Col xs={12}>
                            <form className="form-inline justify-content-center align-items-center " method="post" onSubmit={NewsForm.handleSubmit(onNewsSubmit)}>
                                <div className="form-group">
                                    <input className="form-control" {...NewsForm.register("emailAddress", { required: true })} type="email" placeholder="Escribe tu correo electrónico" />
                                    {NewsForm.formState.errors.emailAddress?.type === 'required' && "Email address is required"}
                                </div>
                                <div className="form-group">
                                    <button className="btn btn-newsletter" type="submit" >SUSCRIBIRME</button>
                                </div>
                            </form>
                        </Col>
                    </Row>
                </Container>
            </section>

            <MyFooter />

            <Modal id="popup" show={show}>
                <Modal.Header closeButton onClick={handleClose}>
                    <Modal.Title style={{ color: "#135eae" }}>Aprende a jugar MegaChess70</Modal.Title>
                </Modal.Header>
                <Modal.Body className="show-grid">
                    <Container>
                        <Row>
                            <Col xs={12} md={6}>
                                <form onSubmit={loginForm.handleSubmit(onLoginSubmit)}>
                                    <div className="form-group" style={{ marginTop: "16px" }}>
                                        <label>Correo electrónico</label>
                                        <input className="form-control" {...loginForm.register("emailAddress", { required: true })} type="email" placeholder="ej. jhohn@example.com" />
                                        {loginForm.formState.errors.emailAddress?.type === 'required' && "Email address is required"}
                                    </div>
                                    <div className="form-group mb-3">
                                        <label>Contraseña</label>
                                        <input className="form-control" {...loginForm.register("password", { required: true })} type="password" placeholder="*********" />
                                        {loginForm.formState.errors.password?.type === 'required' && "Password is required"}
                                    </div>
                                    <div className="form-group" style={{ marginTop: "16px" }}>
                                        <button type="submit" className="form-control btn btn-success">Registrarme</button>
                                    </div>
                                    <div className="form-group" style={{ marginTop: "16px" }}>
                                        <a href="/lobby" className="form-control btn btn-info">Practicar</a>
                                    </div>
                                </form>
                            </Col>
                            <Col xs={12} md={6}>
                                <img className="img-fluid" style={{ padding: "10px" }} src={popup} alt=""></img>
                            </Col>
                        </Row>
                    </Container>
                </Modal.Body>
            </Modal>
        </section >
    );
}