import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import firebase from "firebase";
import { Redirect, useHistory, useLocation } from "react-router-dom";

export function Lobby() {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const history = useHistory();

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

  const createGame = () => {
    window.location = "/game";
    return;
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
            {/* {(!auth?.isSignedIn || auth?.isAnonymously) && (
              <button
                className="navbar-item mx-2 button is-info"
                onClick={createGame}
              >
                Iniciar Sesión
              </button>
            )} */}
          </div>
        </div>
      </nav>

      <table className="table is-fullwidth">
        <thead>
          <tr>
            <th>Creador:</th>
            <th>Estado:</th>
            <th>Acciones:</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(lobby).length > 0 ? (
            Object.keys(lobby).map((key) => {
              const element = lobby[key];

              return (
                <tr key={key}>
                  <td>{element.player1}</td>
                  <td>{element.status}</td>
                  <td>
                    {element?.player1 === auth?.user?.uid ||
                    element?.player2 === auth?.user?.uid ? (
                      <button
                        className="button is-primary"
                        onClick={() => (window.location = `/game/${key}`)}
                      >
                        Volver a jugar
                      </button>
                    ) : (
                      <button
                        className="button is-danger"
                        onClick={() => (window.location = `/game/${key}`)}
                      >
                        Jugar
                      </button>
                    )}
                  </td>
                </tr>
              );
            })
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
