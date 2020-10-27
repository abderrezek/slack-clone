import React, { useEffect, useState } from "react";
import { Comment, Segment } from "semantic-ui-react";

import firebase from "../../config/firebase";

import MessageForm from "./MessageForm";
import MessagesHeader from "./MessagesHeader";
import Message from "./Message";

const Messages = ({ channel, user }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [messagesRef, setMessagesRef] = useState(
    firebase.database().ref("messages")
  );

  useEffect(() => {
    if (channel && user) {
      __chargeMessages(channel.id);
    }
  }, [channel, user]);

  const __chargeMessages = (channelId) => {
    const loadedMessages = [];
    messagesRef
      .child(channelId)
      .once("value", (snap) => {
        snap.forEach((msgs) => {
          loadedMessages.push(msgs.val());
        });
      })
      .then(() => {
        setMessages(loadedMessages);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const _displayMessage = (messages, user) =>
    messages.length > 0 &&
    messages.map((message, i) => (
      <Message key={message.timestamp} message={message} user={user} />
    ));

  return (
    <>
      <MessagesHeader />

      <Segment>
        <Comment.Group className="messages">
          {_displayMessage(messages, user)}
        </Comment.Group>
      </Segment>

      <MessageForm messagesRef={messagesRef} channel={channel} user={user} />
    </>
  );
};

export default Messages;
