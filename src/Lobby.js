import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import firebase from "firebase";
import { Redirect, useHistory } from "react-router-dom";

export function Lobby() {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const history = useHistory();

  const [lobby, setLobby] = useState({});
  useEffect(() => {
    const lobbyRef = firebase.database().ref("lobby");

    lobbyRef.on("value", (snap) => {
      console.log(snap.val());
      setLobby(snap.val());
    });

    return () => {
      lobbyRef.off("value");
    };
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

      <table className="table is-fullwidth">
        <thead>
          <tr>
            <th>Creador:</th>
            <th>Estado:</th>
            <th>Acciones:</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(lobby).length > 1 ? (
            Object.keys(lobby)
              .filter((key) => lobby[key]?.player1 !== auth?.user?.uid)
              .map((key) => {
                const element = lobby[key];

                return (
                  <tr key={key}>
                    <td>{element.player1}</td>
                    <td>{element.status}</td>
                    <td>
                      {element?.status !== "playing" && (
                        <button
                          className="button is-danger"
                          onClick={() =>
                            history.push(`/game/${key}`)
                          }
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
