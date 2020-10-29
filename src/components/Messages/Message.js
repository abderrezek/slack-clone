import React, { memo } from "react";
import moment from "moment";
import { Comment, Image } from "semantic-ui-react";

const _isOwnMessage = (message, user) =>
  message.user.id === user.uid ? "message__self" : "";

const _timeFromNow = (timestamp) => moment(timestamp).fromNow();

const _isImage = (msg) =>
  msg.hasOwnProperty("image") && !msg.hasOwnProperty("content");

const Message = memo(({ message, user }) => (
  <Comment>
    <Comment.Avatar src={message.user.avatar} />

    <Comment.Content className={_isOwnMessage(message, user)}>
      <Comment.Author as="a">{message.user.name}</Comment.Author>
      <Comment.Metadata>{_timeFromNow(message.timestamp)}</Comment.Metadata>
      {_isImage(message) ? (
        <Image src={message.image} className="message__image" />
      ) : (
        <Comment.Text>{message.content}</Comment.Text>
      )}
    </Comment.Content>
  </Comment>
));

export default Message;
