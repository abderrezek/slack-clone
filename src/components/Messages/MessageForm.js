import React, { useEffect, useState } from "react";
import { Button, Input, Segment } from "semantic-ui-react";
import uuidv4 from "uuid/dist/v4";

import firebase from "../../config/firebase";
import ProgressBar from "./ProgressBar";
import FileModal from "./FileModal";

const MessageForm = ({
  channel,
  user,
  isProgressBarVisible,
  privateChannel,
  getMessagesRef,
}) => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [modal, setModal] = useState(false);
  /* eslint-disable no-unused-vars */
  const [storageRef, setStorageRef] = useState(firebase.storage().ref());
  const [upload, setUpload] = useState({
    uploadState: "",
    uploadTask: null,
  });
  const [percentUploaded, setPercentUploaded] = useState(0);

  const _handleChange = (e) => setMessage(e.target.value);

  const _sendMessage = (e) => {
    if (message) {
      setLoading(true);
      getMessagesRef()
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

  const __createMessage = (fileUrl = null) => {
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

  const _toggleModal = (show) => setModal(show);

  const __getPath = () =>
    privateChannel ? `chat/private-${channel.id}` : "chat/public";

  const _uploadFile = (file, metadata) => {
    let filePath = `${__getPath()}/${uuidv4()}.jpg`;

    setUpload({
      uploadState: "uploading",
      uploadTask: storageRef.child(filePath).put(file, metadata),
    });
  };

  useEffect(() => {
    if (upload.uploadTask) {
      __addListenner(upload.uploadTask);
    }
  }, [upload.uploadTask]);

  const __addListenner = (uTask) => {
    uTask.on(
      "state_changed",
      (snap) => {
        let percentUploaded = Math.round(
          (snap.bytesTransferred / snap.totalBytes) * 100
        );
        isProgressBarVisible(percentUploaded);
        setPercentUploaded(percentUploaded);
      },
      (err) => {
        console.error(err);
        setErrors((state) => [...state, err]);
        setUpload({
          uploadState: "error",
          uploadTask: null,
        });
      },
      () => {
        uTask.snapshot.ref
          .getDownloadURL()
          .then((downloadUrl) => {
            // let id = channel && channel.id;
            let ref = getMessagesRef();
            __sendFileMessage(downloadUrl, ref, channel.id);
          })
          .catch((err) => {
            console.error(err);
            setErrors((state) => [...state, err]);
            setUpload({
              uploadState: "error",
              uploadTask: null,
            });
          });
      }
    );
  };

  const __sendFileMessage = (url, ref, id) => {
    ref
      .child(id)
      .push()
      .set(__createMessage(url))
      .then(() => {
        setUpload((state) => ({ ...state, uploadState: "done" }));
      })
      .catch((err) => {
        console.error(err);
        setErrors((state) => [...state, err]);
      });
  };

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
          disabled={upload.uploadState === "uploading"}
          content="Upload Media"
          labelPosition="right"
          icon="cloud upload"
          onClick={() => _toggleModal(true)}
        />
      </Button.Group>
      <FileModal
        modal={modal}
        closeModal={() => _toggleModal(false)}
        uploadFile={_uploadFile}
      />
      <ProgressBar
        uploadState={upload.uploadState}
        percentUploaded={percentUploaded}
      />
    </Segment>
  );
};

export default MessageForm;
