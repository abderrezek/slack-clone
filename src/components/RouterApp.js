import React, { useEffect } from "react";
import { Switch, Route, withRouter } from "react-router-dom";
import { connect } from "react-redux";

import firebase from "../config/firebase";

import App from "./App/App";
import Login from "./Auth/Login";
import Register from "./Auth/Register";
import Spinner from "./Spinner";

import { setUser, clearUser } from "../redux/actions/userActions";

const RouterApp = ({ history, setUser, isLoading, clearUser }) => {
  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        history.push("/");
      } else {
        clearUser();
        history.push("/login");
      }
    });
  }, [history, setUser, clearUser]);

  return isLoading ? (
    <Spinner />
  ) : (
    <Switch>
      <Route exact path="/" component={App} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
    </Switch>
  );
};

const mapStateFromProps = (state) => ({
  isLoading: state.user.isLoading,
});

const RouterWithAuth = withRouter(
  connect(mapStateFromProps, { setUser, clearUser })(RouterApp)
);

export default RouterWithAuth;
