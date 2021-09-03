import { useOnlineState } from "./hooks/useOnlineState"
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Container, Row, Col } from "react-bootstrap";
import { MyNavbar } from "./Navbar";
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

    return (<>
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
            <form onSubmit={loginForm.handleSubmit(onLoginSubmit)}>
                <div className="form-group mb-3">
                    <label>Correo electrónico</label>
                    <input className="form-control" {...loginForm.register("emailAddress", { required: true })} type="email" placeholder="ej. jhohn@example.com" />
                    {loginForm.formState.errors.emailAddress?.type === 'required' && "Email address is required"}
                </div>
                <div className="form-group mb-3">
                    <label>Contraseña</label>
                    <input className="form-control" {...loginForm.register("password", { required: true })} type="password" placeholder="*********" />
                    {loginForm.formState.errors.password?.type === 'required' && "Password is required"}
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>

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
                <p style={{ marginTop: "10px" }}>
                    ¿Aún no tienes cuenta?  <Signup />
                </p>
            </div>
        </Container>
    </>
    )
}