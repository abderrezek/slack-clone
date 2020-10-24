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

const Register = (props) => {
  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    password: "",
    passwordConfirmation: "",
  });
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [usersRef, setUsersRef] = useState(firebase.database().ref("users"));

  const __isFormEmpty = ({ username, email, password, passwordConfirmation }) =>
    !username.length ||
    !email.length ||
    !password.length ||
    !passwordConfirmation.length;

  const __isPasswordValid = ({ password, passwordConfirmation }) => {
    if (password.length < 6 || passwordConfirmation.length < 6) {
      return false;
    } else if (password !== passwordConfirmation) {
      return false;
    } else {
      return true;
    }
  };

  const __isFormValid = (inputs) => {
    if (__isFormEmpty(inputs)) {
      setErrors(["Fill in all fields."]);
      return false;
    } else if (!__isPasswordValid(inputs)) {
      setErrors(["Password is invalid."]);
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
      firebase
        .auth()
        .createUserWithEmailAndPassword(inputs.email, inputs.password)
        .then((createUser) => {
          console.log(createUser);
          createUser.user
            .updateProfile({
              displayName: inputs.username,
              photoURL: `https://www.gravatar.com/avatar/${md5(
                createUser.user.email
              )}?d=identicon`,
            })
            .then(() => {
              __saveuser(createUser)
                .then(() => {
                  console.log("user save");
                  setLoading(false);
                })
                .catch();
            })
            .catch((err) => {
              console.log("updateProfile");
              console.log(err);
              setErrors([err.message]);
              setLoading(false);
            });
        })
        .catch((err) => {
          console.log("createUserWithEmailAndPassword");
          console.log(err);
          setErrors([err.message]);
          setLoading(false);
        });
    }
  };

  const __saveuser = (createdUser) => {
    return usersRef.child(createdUser.user.uid).set({
      name: createdUser.user.displayName,
      avatar: createdUser.user.photoURL,
    });
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
              error={__inputErrors("password")}
            />

            <Button color="orange" size="large" loading={loading} fluid>
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
          Already a user? <Link to="/login">Login</Link>
        </Message>
      </Grid.Column>
    </Grid>
  );
};

export default Register;
