import { useOnlineState } from "./hooks/useOnlineState"
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Container, Row, Col } from "react-bootstrap";
import { MyNavbar } from "./Navbar";
import { MyFooter } from "./Footer";
import { Signup } from "./Signup";
import { ReactSwal } from "./utils/SwalUtils";
import firebase from 'firebase';
import { ForgotPassword } from "./ForgotPassword";



export function Login() {

    const isOnline = useOnlineState();
    const loginForm = useForm();
    const onLoginSubmit = data => {

        firebase.auth().signInWithEmailAndPassword(data.emailAddress, data.password).then((user) => {
            window.location = "/";
        }).catch((error) => {
            ReactSwal.fire({
                title: "Opps..",
                icon: "error",
                text: error.toString()
            });
        })
    }

    useEffect(() => {
        console.log(isOnline);
        if (isOnline) {
            window.location = "/";
        }
    }, [isOnline])

    return (
        <section className="fondo_principal">
            <MyNavbar />

            <section className="encabezado">
                <header className="masthead">
                    <Container>
                        <Row>
                            <Col xs={12} style={{ padding: 0 }}>
                                <div className="site-heading">
                                    <h1>Iniciar sesión</h1>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </header>
            </section>
            <Container className="p-2">
                <Row>
                    <Col xs={2} md={4} style={{ padding: 0 }}></Col>
                    <Col xs={8} md={4} style={{ padding: 0 }}>
                        <form align="center" onSubmit={loginForm.handleSubmit(onLoginSubmit)}>
                            <div className="form-group mb-3">
                                <label style={{ color: "white" }}>Correo electrónico</label>
                                <input className="form-control" {...loginForm.register("emailAddress", { required: true })} type="email" placeholder="ej. jhohn@example.com" />
                                {loginForm.formState.errors.emailAddress?.type === 'required' && "Email address is required"}
                            </div>
                            <div className="form-group mb-3">
                                <label style={{ color: "white" }}>Contraseña</label>
                                <input className="form-control" {...loginForm.register("password", { required: true })} type="password" placeholder="*********" />
                                {loginForm.formState.errors.password?.type === 'required' && "Password is required"}
                            </div>
                            <button type="submit" className="btn btn-danger">Submit</button>
                        </form>
                    </Col>
                </Row>
                <div
                    align="center"
                    className="p-3"
                >
                    <ForgotPassword />
                </div>

                <div
                    align="center"
                    className="p-3"
                >
                    <p style={{ marginTop: "10px", color: "white" }} >
                        ¿Aún no tienes cuenta?  <Signup />
                    </p>
                </div>
            </Container>
            <MyFooter/>
        </section>
    )
}