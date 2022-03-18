import { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import firebase from "firebase";
import { ReactSwal } from "./utils/SwalUtils";
import { useRef } from "react";


export function Signup() {
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, formState, reset } = useForm();

    const formRef = useRef();

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const onSubmit = data => {
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
    };

    return (
        <>
            <Button className="btn btn-danger" onClick={handleShow}>
                Regístrate
      </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Crear cuenta</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleSubmit(onSubmit)} ref={formRef}>
                        <div className="form-group mb-3">
                            <label>Correo electrónico</label>
                            <input className="form-control" {...register("emailAddress", { required: true })} placeholder="ej. jhohn@example.com" />
                            {formState.errors.emailAddress?.type === 'required' && "Email address is required"}

                        </div>
                        <div className="form-group mb-3">
                            <label>Contraseña</label>
                            <input className="form-control" {...register("password", { required: true })} type="password" placeholder="*********" />
                            {formState.errors.password?.type === 'required' && "Password is required"}
                        </div>


                        <Button className="btn btn-danger" type="submit" disabled={loading}>
                            Crear cuenta
          </Button>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
          </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}