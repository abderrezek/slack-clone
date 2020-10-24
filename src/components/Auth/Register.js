import React, { useState } from "react";
import { Link } from "react-router-dom";
import firebase from "../../config/firebase";
import {
  Button,
  Form,
  Grid,
  Header,
  Icon,
  Message,
  Segment,
} from "semantic-ui-react";

const Register = (props) => {
  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    password: "",
    passwordConfirmation: "",
  });

  const _handleChange = (e) => {
    setInputs((state) => ({ ...state, [e.target.name]: e.target.value }));
  };

  let __formEmpty = ({ username, email, password, passwordConfirmation }) => {
    return (
      !username.length ||
      !email.length ||
      !password.length ||
      !passwordConfirmation.length
    );
  };

  let __passwordValid = ({ password, passwordConfirmation }) => {
    if (password.length < 6 || passwordConfirmation.length < 6) {
      return false;
    } else if (password !== passwordConfirmation) {
      return false;
    } else {
      return true;
    }
  };

  let __formValidate = (inputs) => {
    if (__formEmpty(inputs)) {
      return false;
    } else if (!__passwordValid(inputs)) {
      return false;
    } else {
      return true;
    }
  };
  const _handleSubmit = (e) => {
    e.preventDefault();
    if (__formValidate(inputs)) {
      firebase
        .auth()
        .createUserWithEmailAndPassword(inputs.email, inputs.password)
        .then((createUser) => {
          console.log(createUser);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <Grid className="App" textAlign="center" verticalAlign="middle">
      <Grid.Column style={{ maxWidth: 450 }}>
        {/* Header Components */}
        <Header as="h2" icon color="orange" textAlign="center">
          <Icon name="puzzle piece" color="orange" />
          Register for DevChat
        </Header>

        {/* Form Compoenents */}
        <Form size="large" onSubmit={_handleSubmit}>
          <Segment stacked>
            {/* Username Input */}
            <Form.Input
              fluid
              name="username"
              icon="user"
              iconPosition="left"
              placeholder="Username"
              onChange={_handleChange}
              value={inputs.username}
            />
            {/* Email Input */}
            <Form.Input
              fluid
              name="email"
              icon="mail"
              iconPosition="left"
              placeholder="Email"
              onChange={_handleChange}
              value={inputs.email}
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
            />
            {/* Password Confirmation Input */}
            <Form.Input
              fluid
              name="passwordConfirmation"
              type="password"
              icon="repeat"
              iconPosition="left"
              placeholder="Password Confirmation"
              onChange={_handleChange}
              value={inputs.passwordConfirmation}
            />

            <Button color="orange" size="large" fluid>
              Submit
            </Button>
          </Segment>
        </Form>

        <Message>
          Already a user? <Link to="/login">Login</Link>
        </Message>
      </Grid.Column>
    </Grid>
  );
};

export default Register;
