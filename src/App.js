import "./App.css";

import { useEffect } from "react";
import firebase from "firebase";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import { setAuthData } from "./redux/actions";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Inicio } from "./Inicio";
import { Videos } from "./Videos";
import { Movimientos } from "./Movimientos";
import { Piezas } from "./Piezas";
import { Blog } from "./Blog";
import { Comprar } from "./Comprar";
import { Lobby } from "./Lobby";
import { Game } from "./Game";
import { signInAnonymously } from "./redux/firebaseActions";
import { Login } from "./Login";

function App({ authState }) {
    const dispatch = useDispatch();

    useEffect(() => {

        firebase.auth().onAuthStateChanged((user) => {
            if (!user) {

                dispatch(signInAnonymously());
            }
        })

        dispatch(setAuthData({ ...authState }));
    }, [authState, dispatch]);

    return (
        <Router>
            <Route path="/" component={Inicio} exact></Route>
            <Route path="/videos" component={Videos} exact></Route>
            <Route path="/movimientos" component={Movimientos} exact></Route>
            <Route path="/piezas" component={Piezas} exact></Route>
            <Route path="/blog" component={Blog} exact></Route>
            <Route path="/login" component={Login} exact></Route>
            <Route path="/comprar" component={Comprar} exact></Route>
            <Route path="/lobby" component={Lobby} exact></Route>
            <Route path="/game/:lobbyItemId?" component={Game} exact></Route>
        </Router>
    );
}

App.propTypes = {
    authState: PropTypes.object.isRequired,
};

export default App;
