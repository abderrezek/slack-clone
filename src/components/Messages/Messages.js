import React from "react";
import { Comment, Grid, Segment } from "semantic-ui-react";

import MessageForm from "./MessageForm";
import MessagesHeader from "./MessagesHeader";

const Messages = () => {
  return (
    <>
      <MessagesHeader />

      <Segment>
        <Comment.Group className="messages">{/* Messages */}</Comment.Group>
      </Segment>

      <MessageForm />
    </>
  );
};

export default Messages;
