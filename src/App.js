import "./App.css";

import { useEffect, useState } from "react";
import firebase from "firebase";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import { setAuthData } from "./redux/actions";
import { BrowserRouter as Router, Redirect, Route } from "react-router-dom";
import { Lobby } from "./Lobby";
import { Game } from "./Game";
import { signInAnonymously } from "./redux/firebaseActions";

function App({ authState }) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(signInAnonymously());
    dispatch(setAuthData({ ...authState }));
  }, [authState, dispatch]);

  return (
    <Router>
      <Route path="/" component={Lobby} exact></Route>
      <Route path="/game/:lobbyItemId?" component={Game} exact></Route>
    </Router>
  );
}

App.propTypes = {
  authState: PropTypes.object.isRequired,
};

export default App;
