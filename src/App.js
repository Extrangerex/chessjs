import logo from "./logo.svg";
import "./App.css";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { types } from "./types";

const socket = io("/");

function App() {
  const [lobby, setLobby] = useState([]);
  useEffect(() => {
    socket.on(types.apiGetLobbyData, setLobby);

    console.log(lobby);
  }, [lobby]);

  const createGame = () => {
    socket.emit(types.boardCreate, socket.id);
    console.log('createGame');
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
              className="navbar-item button is-primary"
              onClick={createGame}
            >
              Crear Sala
            </button>
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

export default App;
