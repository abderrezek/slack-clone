import React from "react";
import { Switch, Route } from "react-router-dom";

import App from "./App/App";
import Login from "./Auth/Login";
import Register from "./Auth/Register";

const RouterApp = (props) => {
  return (
    <Switch>
      <Route exact path="/" component={App} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
    </Switch>
  );
};

export default RouterApp;
