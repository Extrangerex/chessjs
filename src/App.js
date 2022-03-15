import "./App.css";

import { useEffect } from "react";
import firebase from "firebase";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import { setAuthData } from "./redux/actions";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Inicio } from "./Inicio";
import { Reglas } from "./Reglas";
import { Movimientos } from "./Movimientos";
import { Blog } from "./Blog";
import { Comprar } from "./Comprar";
import { Lobby } from "./Lobby";
import { Allgames } from "./Allgames";

import { Game } from "./Game";
import { Review } from "./Review";

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
            <Route path="/reglas" component={Reglas} exact></Route>
            <Route path="/movimientos" component={Movimientos} exact></Route>
            <Route path="/blog" component={Blog} exact></Route>
            <Route path="/login" component={Login} exact></Route>
            <Route path="/comprar" component={Comprar} exact></Route>
            <Route path="/lobby" component={Lobby} exact></Route>
            <Route path="/game/:lobbyItemId?" component={Game} exact></Route>
            <Route path="/review/:lobbyItemId?" component={Review} exact></Route>
            <Route path="/allgames" component={Allgames} exact></Route>
        </Router>
    );
}

App.propTypes = {
    authState: PropTypes.object.isRequired,
};

export default App;
