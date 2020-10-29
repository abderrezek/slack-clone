import React, { useState } from "react";
import { Button, Icon, Input, Modal } from "semantic-ui-react";
import mime from "mime-types";

const FileModal = ({ modal, closeModal, uploadFile }) => {
  const [file, setFile] = useState(null);
  const [authorized, setAuthorized] = useState(["image/jpeg", "image/png"]);

  const _addFile = (e) => {
    let file = e.target.files[0];
    if (file) {
      setFile(file);
    }
  };

  const _sendFile = () => {
    if (file) {
      if (__isAuthorized(file.name)) {
        let metadata = { contentType: mime.lookup(file.name) };
        uploadFile(file, metadata);
        closeModal();
        __clearFile();
      }
    }
  };

  const __clearFile = () => setFile(null);

  const __isAuthorized = (filename) =>
    authorized.includes(mime.lookup(filename));

  return (
    <Modal basic open={modal} onClose={closeModal}>
      <Modal.Header>Select an Image File</Modal.Header>

      <Modal.Content>
        <Input
          fluid
          label="File types: jpg, png"
          name="file"
          type="file"
          onChange={_addFile}
        />
      </Modal.Content>

      <Modal.Actions>
        <Button color="green" inverted onClick={_sendFile}>
          <Icon name="checkmark" />
          Send
        </Button>

        <Button color="red" inverted onClick={closeModal}>
          <Icon name="remove" />
          Cancel
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default FileModal;
