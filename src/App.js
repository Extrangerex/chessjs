import "./App.css";

import { useEffect, useState } from "react";
import firebase from "firebase";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import { setAuthData } from "./redux/actions";

function App({ authState }) {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  const [lobby, setLobby] = useState([]);
  useEffect(() => {
    dispatch(setAuthData({ ...authState }));
  }, [authState, dispatch]);

  const createGame = () => {
    console.log("createGame");
  };

  return (
    <div className="container">
      <nav className="navbar my-3" role="navigation">
        <div className="navbar-brand">
          <button className="navbar-item button is-ghost">Chess</button>
        </div>

        <div className="navbar-menu">
          <div className="navbar-end">
            <button
              className="navbar-item mx-2 button is-primary"
              onClick={createGame}
            >
              Crear Sala
            </button>
            {!auth?.isAnonymously && (
              <button
                className="navbar-item mx-2 button is-info"
                onClick={createGame}
              >
                Iniciar Sesión
              </button>
            )}
          </div>
        </div>
      </nav>

      <h5 className="subtitle is-5 block">
        Juegos disponibles ({lobby.length})
      </h5>

      <table className="table is-fullwidth">
        <thead>
          <tr>
            <th>Creador:</th>
            <th>Creado en:</th>
            <th>Estado:</th>
          </tr>
        </thead>
        <tbody>
          {lobby.length > 1 ? (
            lobby.map((element) => (
              <tr>
                <td>{element.creator}</td>
                <td>{element.createdAt}</td>
                <td>{element.state}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="has-text-centered">
                Aun no hay juegos en espera, ¿por qué no creas uno?
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

App.propTypes = {
  authStateChanged: PropTypes.object.isRequired,
};

export default App;
