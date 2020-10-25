import React, { useEffect } from "react";
import { Switch, Route, withRouter } from "react-router-dom";
import { connect } from "react-redux";

import firebase from "../config/firebase";

import App from "./App/App";
import Login from "./Auth/Login";
import Register from "./Auth/Register";

import { setUser } from "../redux/actions/userActions";

const RouterApp = ({ history, setUser }) => {
  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        history.push("/");
      }
    });
  }, [history, setUser]);

  return (
    <Switch>
      <Route exact path="/" component={App} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
    </Switch>
  );
};

const RouterWithAuth = withRouter(connect(null, { setUser })(RouterApp));

export default RouterWithAuth;
