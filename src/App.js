import "./App.css";

import { useEffect, useState } from "react";
import firebase from "firebase";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import { setAuthData } from "./redux/actions";
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import { Lobby } from "./Lobby";
import { Game } from "./Game";

function App({ authState }) {
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(setAuthData({ ...authState }));

  }, [authState, dispatch]);

  return (
    <Router>
      <Route path="/lobby" component={Lobby} exact></Route>
      <Route path="/game" component={Game} exact></Route>
    </Router>
  );
}

App.propTypes = {
  authStateChanged: PropTypes.object.isRequired,
};

export default App;
