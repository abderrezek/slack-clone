import React, { useEffect } from "react";
import { Switch, Route, withRouter } from "react-router-dom";

import firebase from "../config/firebase";

import App from "./App/App";
import Login from "./Auth/Login";
import Register from "./Auth/Register";

const RouterApp = ({ history }) => {
  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        history.push("/");
      }
    });
  }, [history]);

  return (
    <Switch>
      <Route exact path="/" component={App} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
    </Switch>
  );
};

const RouterWithAuth = withRouter(RouterApp);

export default RouterWithAuth;
