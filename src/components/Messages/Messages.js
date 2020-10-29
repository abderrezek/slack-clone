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
  const [progressBar, setProgressBar] = useState(false);
  const [numUniqueUsers, setNumUniqueUsers] = useState("");

  useEffect(() => {
    if (channel && user) {
      __chargeMessages(channel.id);
      __addListnner(channel.id);
    }

    return () => messagesRef.off();
  }, [channel, user]);

  const __addListnner = (channelId) => {
    messagesRef.child(channelId).on("child_added", (snap) => {
      setMessages((state) => state.concat(snap.val()));
    });
  };

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
        __countUniqueUsers(loadedMessages);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const __countUniqueUsers = (msgs) => {
    let uniqueUsers = msgs.reduce((acc, msg) => {
      if (!acc.includes(msg.user.name)) {
        acc.push(msg.user.name);
      }
      return acc;
    }, []);
    let user = uniqueUsers.length === 1 ? "User" : "Users";
    let numUniqueUsers = `${uniqueUsers.length} ${user}`;
    setNumUniqueUsers(numUniqueUsers);
  };

  const _displayMessage = (messages, user) =>
    messages.length > 0 &&
    messages.map((message, i) => (
      <Message key={message.timestamp} message={message} user={user} />
    ));

  const _isProgressBarVisible = (percent) => {
    if (percent > 0 && percent !== 100) {
      setProgressBar(true);
    } else {
      setProgressBar(false);
    }
  };

  const _displayChannelName = (channel) => (channel ? `#${channel.name}` : "");

  return (
    <>
      <MessagesHeader
        channelName={_displayChannelName(channel)}
        numUniqueUsers={numUniqueUsers}
      />

      <Segment>
        <Comment.Group
          className={progressBar ? "messages__progress" : "messages"}
        >
          {_displayMessage(messages, user)}
        </Comment.Group>
      </Segment>

      <MessageForm
        messagesRef={messagesRef}
        channel={channel}
        user={user}
        isProgressBarVisible={_isProgressBarVisible}
      />
    </>
  );
};

export default Messages;
