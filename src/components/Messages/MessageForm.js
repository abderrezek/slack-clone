import React from "react";
import { Button, Input, Segment } from "semantic-ui-react";
import uuidv4 from "uuid/dist/v4";

import firebase from "../../config/firebase";
import ProgressBar from "./ProgressBar";
import FileModal from "./FileModal";

class MessageForm extends React.Component {
  state = {
    message: "",
    loading: false,
    errors: [],
    modal: false,
    storageRef: firebase.storage().ref(),
    percentUploaded: 0,
    uploadState: "",
    uploadTask: null,
    channel: this.props.currentChannel,
    user: this.props.currentUser,
    messagesRef: this.props.messagesRef,
    typingRef: firebase.database().ref("typing"),
  };

  _handleChange = (e) => this.setState({ message: e.target.value });

  _sendMessage = (e) => {
    let { message, channel, typingRef, user } = this.state;
    let { getMessagesRef } = this.props;

    if (message) {
      this.setState({ loading: true });
      getMessagesRef()
        .child(channel.id)
        .push()
        .set(this.__createMessage())
        .then(() => {
          this.setState({ message: "", loading: false, errors: [] });
          typingRef.child(channel.id).child(user.uid).remove();
        })
        .catch((err) => {
          console.error(err);
          this.setState({
            loading: false,
            errors: this.state.errors.concat(err),
          });
        });
    } else {
      this.setState({
        errors: this.state.errors.concat({ message: "Add a message" }),
      });
    }
  };

  __createMessage = (fileUrl = null) => {
    let { user, message } = this.state;

    let messageNew = {
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      user: {
        id: user.uid,
        name: user.displayName,
        avatar: user.photoURL,
      },
    };
    if (fileUrl) {
      messageNew["image"] = fileUrl;
    } else {
      messageNew["content"] = message;
    }
    return messageNew;
  };

  _toggleModal = (show) => this.setState({ modal: show });

  __getPath = () => {
    if (this.props.isPrivateChannel) {
      return `chat/private-${this.state.channel.id}`;
    } else {
      return "chat/public";
    }
  };

  _uploadFile = (file, metadata) => {
    const pathToUpload = this.state.channel.id;
    const ref = this.props.getMessagesRef();
    const filePath = `${this.__getPath()}/${uuidv4()}.jpg`;

    this.setState(
      {
        uploadState: "uploading",
        uploadTask: this.state.storageRef.child(filePath).put(file, metadata),
      },
      () => {
        this.state.uploadTask.on(
          "state_changed",
          (snap) => {
            const percentUploaded = Math.round(
              (snap.bytesTransferred / snap.totalBytes) * 100
            );
            this.setState({ percentUploaded });
          },
          (err) => {
            console.error(err);
            this.setState({
              errors: this.state.errors.concat(err),
              uploadState: "error",
              uploadTask: null,
            });
          },
          () => {
            this.state.uploadTask.snapshot.ref
              .getDownloadURL()
              .then((downloadUrl) => {
                this.__sendFileMessage(downloadUrl, ref, pathToUpload);
              })
              .catch((err) => {
                console.error(err);
                this.setState({
                  errors: this.state.errors.concat(err),
                  uploadState: "error",
                  uploadTask: null,
                });
              });
          }
        );
      }
    );
  };

  __sendFileMessage = (fileUrl, ref, pathToUpload) => {
    ref
      .child(pathToUpload)
      .push()
      .set(this.__createMessage(fileUrl))
      .then(() => {
        this.setState({ uploadState: "done" });
      })
      .catch((err) => {
        console.error(err);
        this.setState({
          errors: this.state.errors.concat(err),
        });
      });
  };

  _handleKeyDown = () => {
    const { message, typingRef, channel, user } = this.state;

    if (message) {
      typingRef.child(channel.id).child(user.uid).set(user.displayName);
    } else {
      typingRef.child(channel.id).child(user.uid).remove();
    }
  };

  render() {
    const {
      message,
      errors,
      loading,
      uploadState,
      modal,
      percentUploaded,
    } = this.state;

    return (
      <Segment className="message__form">
        <Input
          fluid
          onChange={this._handleChange}
          onKeyDown={this._handleKeyDown}
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
            onClick={this._sendMessage}
            color="orange"
            content="Add Reply"
            labelPosition="left"
            icon="edit"
            disabled={loading}
          />
          <Button
            color="teal"
            disabled={uploadState === "uploading"}
            content="Upload Media"
            labelPosition="right"
            icon="cloud upload"
            onClick={() => this._toggleModal(true)}
          />
        </Button.Group>
        <FileModal
          modal={modal}
          closeModal={() => this._toggleModal(false)}
          uploadFile={this._uploadFile}
        />
        <ProgressBar
          uploadState={uploadState}
          percentUploaded={percentUploaded}
        />
      </Segment>
    );
  }
}

export default MessageForm;
