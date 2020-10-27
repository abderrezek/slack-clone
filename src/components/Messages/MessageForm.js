import React from "react";
import { Button, Input, Segment } from "semantic-ui-react";

const MessageForm = (props) => {
  return (
    <Segment className="message__form">
      <Input
        fluid
        name="message"
        style={{ marginBottom: ".7em" }}
        label={<Button icon="add" />}
        labelPosition="left"
        placeholder="Write your message"
      />

      <Button.Group icon widths="2">
        <Button
          color="orange"
          content="Add Reply"
          labelPosition="left"
          icon="edit"
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
