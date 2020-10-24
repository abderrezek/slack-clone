import React, { useState } from "react";
import { Link } from "react-router-dom";
import md5 from "md5";
import {
  Button,
  Form,
  Grid,
  Header,
  Icon,
  Message,
  Segment,
} from "semantic-ui-react";

import firebase from "../../config/firebase";

const Login = (props) => {
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [usersRef, setUsersRef] = useState(firebase.database().ref("users"));

  const __isFormValid = ({ email, password }) => {
    if (!email.length || !password.length) {
      setErrors(["Fill in all fields."]);
      return false;
    } else {
      return true;
    }
  };

  const __inputErrors = (input) =>
    errors.some((err) => err.toLowerCase().includes(input));

  const _handleChange = (e) => {
    setInputs((state) => ({ ...state, [e.target.name]: e.target.value }));
  };

  const _handleSubmit = (e) => {
    e.preventDefault();
    if (__isFormValid(inputs)) {
      setLoading(true);
      setErrors([]);
    }
  };

  return (
    <Grid className="App" textAlign="center" verticalAlign="middle">
      <Grid.Column style={{ maxWidth: 450 }}>
        {/* Header Components */}
        <Header as="h2" icon color="violet" textAlign="center">
          <Icon name="code branch" color="violet" />
          Login to DevChat
        </Header>

        {/* Form Compoenents */}
        <Form size="large" onSubmit={_handleSubmit}>
          <Segment stacked>
            {/* Email Input */}
            <Form.Input
              fluid
              name="email"
              icon="mail"
              iconPosition="left"
              placeholder="Email"
              onChange={_handleChange}
              value={inputs.email}
              error={__inputErrors("email")}
            />
            {/* Password Input */}
            <Form.Input
              fluid
              name="password"
              type="password"
              icon="lock"
              iconPosition="left"
              placeholder="Password"
              onChange={_handleChange}
              value={inputs.password}
              error={__inputErrors("password")}
            />

            <Button color="violet" size="large" loading={loading} fluid>
              Submit
            </Button>
          </Segment>
        </Form>

        {/* Message Errors */}
        {errors.length > 0 && (
          <Message color="red">
            {errors.map((err, i) => (
              <p key={i}>{err}</p>
            ))}
          </Message>
        )}

        {/* Message Login */}
        <Message>
          Don't have an account? <Link to="/register">Register</Link>
        </Message>
      </Grid.Column>
    </Grid>
  );
};

export default Login;
