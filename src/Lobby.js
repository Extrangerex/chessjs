import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import firebase from "firebase";

export function Lobby() {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  const [lobby, setLobby] = useState([]);
  useEffect(() => {
    const lobbyRef = firebase.database().ref("lobby");

    lobbyRef.on("value", (snap) => {
      setLobby(snap.val());
    });
  }, [dispatch]);

  const createGame = () => {};

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
            {(!auth?.isSignedIn || auth?.isAnonymously) && (
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
