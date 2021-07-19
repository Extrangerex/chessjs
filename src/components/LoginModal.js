import PropTypes from "prop-types";
import { InputTextField } from "./InputField";

export function LoginModal({ isOpened }) {
  return (
    <div className={`modal ${isOpened && "is-active"}`}>
      <div className="modal-background"></div>
      <div className="modal-card">
        <header className="modal-card-head">
          <p class="modal-card-title">Iniciar Sesión</p>
          <button class="delete" aria-label="close"></button>
        </header>
        <section className="modal-card-body">
          <div className="block">
            <InputTextField
              label="Correo electrónico"
              placeHolder="ej. john@ejemplo.com"
              onChange={(text) => {}}
            />
          </div>
          <div className="block">
            <InputTextField
              label="Contraseña"
              placeHolder="**********"
              onChange={(pass) => {}}
            />
          </div>
        </section>
        <footer className="modal-card-foot">
          <button class="button is-success">Continuar</button>
          <button class="button">Cancel</button>
        </footer>
      </div>
      <button className="modal-close is-large" aria-label="close"></button>
    </div>
  );
}

LoginModal.propTypes = {
  isOpened: PropTypes.bool.isRequired,
};
