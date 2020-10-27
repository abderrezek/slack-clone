import React, { useState } from "react";
import { Button, Input, Segment } from "semantic-ui-react";

import firebase from "../../config/firebase";

const MessageForm = ({ messagesRef, channel, user }) => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);

  const _handleChange = (e) => setMessage(e.target.value);

  const _sendMessage = (e) => {
    if (message) {
      setLoading(true);
      messagesRef
        .child(channel.id)
        .push()
        .set(__createMessage())
        .then(() => {
          setMessage("");
          setLoading(false);
          setErrors([]);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
          setErrors((state) => [...state, err]);
        });
    } else {
      setErrors([{ message: "Add a message" }]);
    }
  };

  const __createMessage = () => ({
    timestamp: firebase.database.ServerValue.TIMESTAMP,
    user: {
      id: user.uid,
      name: user.displayName,
      avatar: user.photoURL,
    },
    content: message,
  });

  return (
    <Segment className="message__form">
      <Input
        fluid
        onChange={_handleChange}
        name="message"
        style={{ marginBottom: ".7em" }}
        label={<Button icon="add" />}
        labelPosition="left"
        value={message}
        placeholder="Write your message"
        className={
          errors.some((err) => err.message.includes("message")) ? "error" : ""
        }
      />

      <Button.Group icon widths="2">
        <Button
          onClick={_sendMessage}
          color="orange"
          content="Add Reply"
          labelPosition="left"
          icon="edit"
          disabled={loading}
        />
        <Button
          color="teal"
          content="Upload Media"
          labelPosition="right"
          icon="cloud upload"
        />
      </Button.Group>
    </Segment>
  );
};

export default MessageForm;
