import React, { useState } from "react";
import { useOnlineState } from "./hooks/useOnlineState"
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { ReactSwal } from "./utils/SwalUtils";
import axios from 'axios';
import firebase from 'firebase';
import "bootstrap/dist/css/bootstrap.css";
import { Container, Row, Col, Navbar, NavDropdown, Nav, Modal } from 'react-bootstrap';

import "./css/Footer-Dark.css";

import "./fonts/fontawesome-all.min.css";
import "./fonts/ionicons.min.css";
import "./fonts/line-awesome.min.css";
import "./fonts/fontawesome5-overrides.min.css";
import "./css/Social-Icons.css";

import "./css/menu.css";
import "./css/footer.css";
import "./inicio.css";

import logo from "./images/logo-megachess.png";
import logo_footer from "./images/logo-megachess-bco.svg";

import popup from "./images/pop-up.jpg";


export function Inicio() {
    const [show, setShow] = useState(false);
    const [setLoading] = useState(false);
    const { reset } = useForm();
    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);

    window.addEventListener('load', handleShow);

    const isOnline = useOnlineState();
    const loginForm = useForm();

    const onLoginSubmit = data => {
        reset();
        setLoading(true);

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
            setLoading(false);
        })
    }
    useEffect(() => {
        console.log(isOnline);
        if (isOnline) {
            window.location = "/lobby";
        }
    }, [isOnline])


    const [publicaciones, setPublicaciones] = useState({});

    axios.get('apis/blog.php?opcion=1', {
        headers: {
            'Idusuario': 123456789,
            'Clientid': 1
        },
    })
        .then(res => {
            //console.log(JSON.stringify(res.data[0]['id']));
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
                                <NavDropdown.Item href="/piezas">Piezas</NavDropdown.Item>
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
                                    <h1>Elige una opción para comenzar a jugar</h1>
                                </div>
                            </Col>


                            <Col xs={12} md={3} style={{ padding: 0 }}>
                                <a href="#!">
                                    <div className="card-body">
                                        <i className="fas fa-chess-rook"></i>
                                        <h4 className="card-title">Desafío</h4>
                                        <p className="card-text">Nullam id dolor id nibh ultricies vehicula ut id elit.</p>
                                    </div>
                                </a>
                            </Col>

                            <Col xs={12} md={3} style={{ padding: 0 }}>
                                <a href="#!">
                                    <div className="card-body">
                                        <i className="fas fa-chess"></i>
                                        <h4 className="card-title">Jugar</h4>
                                        <p className="card-text">Nullam id dolor id nibh ultricies vehicula ut id elit.</p>
                                    </div>
                                </a>
                            </Col>

                            <Col xs={12} md={3} style={{ padding: 0 }}>
                                <a href="#!">
                                    <div className="card-body">
                                        <i className="fas fa-chess-board"></i>
                                        <h4 className="card-title">Torneo</h4>
                                        <p className="card-text">Nullam id dolor id nibh ultricies vehicula ut id elit.</p>
                                    </div>
                                </a>
                            </Col>

                            <Col xs={12} md={3} style={{ padding: 0 }}>
                                <a href="#!">
                                    <div className="card-body">
                                        <i className="fas fa-chess-knight"></i>
                                        <h4 className="card-title">Clasificación</h4>
                                        <p className="card-text">Nullam id dolor id nibh ultricies vehicula ut id elit.</p>
                                    </div>
                                </a>
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
                            <form className="form-inline justify-content-center align-items-center " method="post">
                                <div className="form-group">
                                    <input className="form-control" id="email" type="email" name="email" placeholder="Escribe tu correo electrónico"></input>
                                </div>
                                <div className="form-group">
                                    <button className="btn btn-newsletter" type="button" >SUSCRIBIRME</button>
                                </div>
                            </form>
                        </Col>



                    </Row>
                </Container>
            </section>
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