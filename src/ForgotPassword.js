import { Button, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useState } from "react";
import firebase from 'firebase';
import { ReactSwal } from "./utils/SwalUtils";

export function ForgotPassword() {

    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, formState } = useForm();

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const onSubmit = data => {
        firebase.auth().sendPasswordResetEmail(data.emailAddress).then(() => {
            ReactSwal.fire({
                title: "Atención!",
                icon: "success",
                text: "Hemos enviado un correo electrónico donde podras recuperar tu contraseña."
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
            <Button className="btn btn-danger" onClick={handleShow}>Recuperar contraseña</Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Recuperar contraseña</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="form-group mb-3">
                            <label>Correo electrónico</label>
                            <input className="form-control" {...register("emailAddress", { required: true })} placeholder="ej. jhohn@example.com" />
                            {formState.errors.emailAddress?.type === 'required' && "Email address is required"}

                        </div>

                        <Button className="btn btn-danger" type="submit" disabled={loading}>
                            Recuperar contraseña
                            </Button>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>Close</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}