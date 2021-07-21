import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { joinGame, newGame, sendChatMsg } from "./redux/gameAction";
import { useHistory, useParams } from "react-router-dom";
import * as chess from "./lib/chess";
import "./Game.css";
import firebase from "firebase";

export function Game() {
  const { lobbyItemId } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const game = useSelector((state) => state.game);
  const { loading } = useSelector((state) => state.ui);
  const [chat, setChat] = useState({});

  useEffect(() => {
    if (!game?.lobbyRef) {
      if (lobbyItemId === undefined) {
        dispatch(newGame(auth?.user?.uid));
      } else {
        dispatch(joinGame(lobbyItemId, auth?.user?.uid));
      }
    }
    if (game?.lobbyRef != null) {
      chess.onLoad(game?.lobbyRef);
    }

    const chatRef = firebase.database().ref(`${game?.lobbyRef}/chat`);

    chatRef.on("value", (snapshot) => {
      if (!snapshot.exists()) {
        return;
      }
      setChat(snapshot.val());
    });

    return () => {
      chatRef.off("value");
    };
  }, [dispatch, auth, game, lobbyItemId, loading]);

  return (
    <section className="hero">
      <div className="hero-head">
        <nav class="navbar py-3">
          <div class="container">
            <div class="navbar-brand">
              <button class="navbar-item button is-ghost">Chess</button>
              <span class="navbar-burger" data-target="navbarMenuHeroA">
                <span></span>
                <span></span>
                <span></span>
              </span>
            </div>
            <div id="navbarMenuHeroA" class="navbar-menu">
              <div class="navbar-end">
                <button
                  class="navbar-item button is-primary"
                  onClick={() => {
                    history.push("/lobby");
                  }}
                >
                  Ir al lobby
                </button>
              </div>
            </div>
          </div>
        </nav>
      </div>

      <div className="hero-body is-fullheight">
        <div className="container has-text-centered">
          <div className="columns">
            <div className="column">
              <canvas
                id="chessCanvas"
                width="600"
                height="600"
                className="mx-3"
              ></canvas>
            </div>
            <section className="column box is-one-third">
              <div className="block" style={{ padding: 0, height: "100%" }}>
                <div
                  className="container"
                  style={{
                    position: "relative",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    height: "100%",
                  }}
                >
                  <div style={{ height: "500px", overflow: "auto" }}>
                    {Object.keys(chat).length > 0 ? (
                      Object.keys(chat).map((key, i) => {
                        const element = chat[key];
                        const msgClass =
                          element.uid !== auth?.user?.uid ? true : false;

                        console.log(
                          `${element.uid} === ${
                            firebase.auth().currentUser?.uid
                          }`
                        );

                        console.log(element);

                        return (
                          <p
                            style={{
                              padding: ".25em",
                              textAlign: msgClass ? "left" : "right",
                              overflowWrap: "normal",
                            }}
                          >
                            <span
                              key={key}
                              className={`tag is-medium ${
                                msgClass ? "is-success" : "is-info"
                              }`}
                            >
                              {element.msg}
                            </span>
                          </p>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="3" className="has-text-centered">
                          Todavía no envías tu primer mensaje, di hola!
                        </td>
                      </tr>
                    )}
                  </div>
                  <form
                    style={{
                      background: "white",
                    }}
                    className="p-3"
                    onSubmit={async (e) => {
                      e.preventDefault();
                      const value = e.target.elements.userInput.value;
                      await firebase
                        .database()
                        .ref(`${game?.lobbyRef}`)
                        .child("chat")
                        .push()
                        .set({
                          uid: firebase.auth().currentUser?.uid,
                          msg: value,
                          createdAt: Date.now(),
                        });
                      e.target.reset();
                    }}
                  >
                    <div className="field has-addons">
                      <div className="control is-expanded">
                        <input
                          className="input"
                          name="userInput"
                          type="text"
                          placeholder="Type your message"
                        />
                      </div>
                      <div className="control">
                        <button className="button is-info">Send</button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      <div className="hero-foot">
        <nav className="tabs">
          <div className="container"></div>
        </nav>
      </div>
    </section>
  );
}

const Messages = ({ chat }) => (
  <div style={{ heigth: "100%", width: "100%" }}>
    {chat.map((m, i) => {
      const msgClass = i === 0 || i % 2 === 0; // for demo purposes, format every other msg
      return (
        <p
          style={{
            padding: ".25em",
            textAlign: msgClass ? "left" : "right",
            overflowWrap: "normal",
          }}
        >
          <span
            key={i}
            className={`tag is-medium ${msgClass ? "is-success" : "is-info"}`}
          >
            {m}
          </span>
        </p>
      );
    })}
  </div>
);
