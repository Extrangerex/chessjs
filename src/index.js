import React from "react";
import ReactDOM from "react-dom";
import "bulma/css/bulma.min.css";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import firebase from "firebase";
import { firebaseConfig } from "./config/firebaseConfig";
import {
  FirebaseAuthConsumer,
  FirebaseAuthProvider,
} from "@react-firebase/auth";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { library } from "@fortawesome/fontawesome-svg-core";

firebase.initializeApp(firebaseConfig);

/**
 * setup fontawesome icons
 */

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <FirebaseAuthProvider firebase={firebase}>
        <FirebaseAuthConsumer>
          {({ isSignedIn, user, providerId }) => {
            return <App authStateChanged={{ isSignedIn, user, providerId }} />;
          }}
        </FirebaseAuthConsumer>
      </FirebaseAuthProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
